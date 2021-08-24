<template>
  <h1>Simon The Game</h1>

  <ul>
    <li v-for="(button, index) in buttons" :key="index">
      <button
        class="game-button"
        :class="{ 'game-button--highlight': button.highlight }"
        @click="handleGameButtonClick(index)"
      />
    </li>
  </ul>

  <form @submit.prevent>
    <p>Round: {{ round }}</p>

    <button class="form-button" @click="handleStartClick">Start</button>

    <p v-if="gameState === GameState.lost">
      Вы проиграли на {{ lostRound }} раунде
    </p>

    <fieldset>
      <legend>Уровень сложности:</legend>

      <label
        v-for="level in difficultyLevels"
        :key="level.text"
        :for="level.text"
      >
        <input
          :id="level.text"
          type="radio"
          name="difficulty"
          :checked="level.text === difficulty.text"
          @click="difficulty = level"
        />
        {{ level.text }}
      </label>
    </fieldset>
  </form>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue'
import audio1 from '../src/assets/1.mp3'
import audio2 from '../src/assets/2.mp3'
import audio3 from '../src/assets/3.mp3'
import audio4 from '../src/assets/4.mp3'

export default defineComponent({
  name: 'App',
  components: {},
  setup() {
    enum GameState {
      initial,
      canPlay,
      lost,
      difficultyChanged,
    }

    const difficultyLevels = [
      { text: 'легкий', speed: 1500 },
      { text: 'нормальный', speed: 1000 },
      { text: 'сложный', speed: 400 },
    ]

    const audio = [
      () => new Audio(audio1),
      () => new Audio(audio2),
      () => new Audio(audio3),
      () => new Audio(audio4),
    ]

    const difficulty = ref(difficultyLevels[0])

    const buttons = ref([
      { highlight: false },
      { highlight: false },
      { highlight: false },
      { highlight: false },
    ])

    const round = ref(0)
    const lostRound = ref(0)
    const game = ref<number[]>([])
    const userResult = ref<number[]>([])

    const gameState = ref(GameState.initial)

    const hightlightButton = (index: number) => {
      buttons.value[index].highlight = true
      audio[index]().play()

      setTimeout(() => (buttons.value[index].highlight = false), 300)
    }

    const playGame = () => {
      userResult.value = []
      round.value++
      game.value.push(Math.round(Math.random() * 3))

      let i = 0

      const interval = setInterval(() => {
        if (gameState.value === GameState.difficultyChanged) {
          clearInterval(interval)
          reset()
          gameState.value = GameState.initial
        } else {
          hightlightButton(game.value[i])
          i++

          if (i === game.value.length) {
            gameState.value = GameState.canPlay
            clearInterval(interval)
          }
        }
      }, difficulty.value.speed)
    }

    const handleStartClick = () => {
      playGame()
    }

    const reset = () => {
      game.value = []
      userResult.value = []
      round.value = 0
    }

    const handleGameButtonClick = (index: number) => {
      if (gameState.value !== GameState.canPlay) {
        return
      }

      hightlightButton(index)
      userResult.value.push(index)

      if (!userResult.value.every((it, index) => it === game.value[index])) {
        gameState.value = GameState.lost
        reset()
      }

      if (
        userResult.value.length === game.value.length &&
        gameState.value !== GameState.lost
      ) {
        gameState.value = GameState.initial

        setTimeout(() => {
          playGame()
        }, 1000)
      }
    }

    watch(round, (_, prevVal) => (lostRound.value = prevVal))

    watch(difficulty, () => {
      if (gameState.value === GameState.initial) {
        return
      }

      gameState.value = GameState.difficultyChanged
    })

    return {
      buttons,
      difficultyLevels,
      difficulty,
      handleStartClick,
      handleGameButtonClick,
      round,
      gameState,
      lostRound,
      GameState,
    }
  },
})
</script>

<style lang="scss">
@use "sass:list";

$button-width: 120px;
$gap: 5px;
$colors: blue, red, yellow, green;
$border-radiuses: 100% 0 0 0, 0 100% 0 0, 0 0 0 100%, 0 0 100% 0;

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;

  display: flex;
  flex-wrap: wrap;
  gap: 50px;
  justify-content: center;
}

html,
body {
  padding: 0;
  margin: 0;
}

* {
  box-sizing: border-box;
}

h1 {
  width: 100%;
}

ul,
form {
  max-width: 50%;

  @media screen and (max-width: 950px) {
    & {
      max-width: 100%;
    }
  }
}

ul {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  width: $button-width * 2 + $gap;
  flex-wrap: wrap;
  gap: $gap;
}

li {
  overflow: hidden;
  width: $button-width;
  height: $button-width;

  &:hover {
    outline: $gap solid grey;
  }

  @for $i from 1 through 4 {
    &:nth-of-type(#{$i}) {
      border-radius: list.nth($border-radiuses, $i);

      .game-button {
        background: list.nth($colors, $i);
      }
    }
  }
}

.game-button {
  width: 100%;
  height: 100%;
  border: none;
  border-radius: 0;
  opacity: 0.3;

  &--highlight {
    opacity: 1;
  }
}

fieldset {
  margin: 0;
  padding: 0;
  border: none;
  display: flex;
  flex-direction: column;
  align-items: start;
}

.form-button {
  margin-bottom: 10px;
}

legend {
  margin-bottom: 20px;
}
</style>
