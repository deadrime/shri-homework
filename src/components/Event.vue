<template>
  <div :class="data.type === 'critical' ? 'event event--critical' : 'event'">
    <header class ="event__header">
      <div class="event__headline">
        <img 
          :src="eventIconSrc(data.icon, data.type)" 
          class="event__icon">
        <h1 class="event__title">{{ data.title }}</h1>
      </div>
      <div class="event__subheading">
        <span class="event__source">{{ data.source }}</span>
        <span class="event__time">{{ data.time }}</span>
      </div>
    </header>
    <div
      v-if="data.size !=='s'" 
      class="event__body">
      <p class="event__description">{{ data.description }}</p>
      <div 
        v-if="data.data && (data.data.temperature || data.data.humidity)" 
        class="event__info">
        <span 
          v-if="data.data.temperature" 
          class="event__info-temperature">
          Температура: <span class="event__info__value">{{ data.data.temperature }}C</span>
        </span>
        <span 
          v-if="data.data.humidity" 
          class="event__info-humidity">
          Влажность: <span class="event__info__value">{{ data.data.humidity }}%</span>
        </span>
      </div>
      <div 
        v-if="data.data && data.data.buttons" 
        class="event__buttons">
        <button 
          v-for="item in data.data.buttons" 
          :key="item" 
          class="button">{{ item }}</button>
      </div>
      <img 
        v-if="data.data && data.data.image" 
        :src="data.data.image" 
        class="event__image" 
        alt="">
      <EventChart
        v-if="data.data && data.data.type==='graph'" 
        :data="data.data.values"
        class="event__chart"/>
      <Player
        v-if="data.data && data.data.track"
        :song = "data.data"
        class="event__player"
      />
    </div>
    <CloseIcon
      class="icon-close"
      tabindex="0"/>
    <NextIcon
      class="icon-next"
      tabindex="1"/>
  </div>
</template>

<script lang="ts">
// import EventChart from "./chart.js";
import Player from "./Player.vue";
import Vue from "vue";
// import NextIcon from '@/assets/icons/next.svg?inline'
// import CloseIcon from '@/assets/icons/cross.svg?inline'
const NextIcon = require("@/assets/icons/next.svg?inline");
const CloseIcon = require("@/assets/icons/cross.svg?inline");
const EventChart = require("./chart.js");

interface StateInterface {
  icons: {
    normal: {
      [a: string]: string;
    };
    critical: {
      [a: string]: string;
    };
  }
}

interface TemperatureData {
  temperature: number,
  humidity: number,
}

interface GraphData {
  type: string,
  values: {
    [type: string]: (string | number)[]
  }[],
}

interface PlayerData {
  albumcover: string,
  artist: string,
  track: {
    name: string,
    length: string
  },
  volume: number,
}

interface Event {
  type: 'info' | 'critical',
  size: 'm' | 's' | 'l',
  title: string,
  source: string,
  time: string,
  description: string | null,
  icon: string,
  data?: TemperatureData | GraphData | PlayerData
}

const initState: StateInterface = {
  icons: {
    normal: {
      stats: require("@/assets/icons/stats.svg"),
      key: require("@/assets/icons/key.svg"),
      "robot-cleaner": require("@/assets/icons/robot-cleaner.svg"),
      router: require("@/assets/icons/router.svg"),
      music: require("@/assets/icons/music.svg"),
      cross: require("@/assets/icons/cross.svg"),
      thermal: require("@/assets/icons/thermal.svg"),
      fridge: require("@/assets/icons/fridge.svg"),
      battery: require("@/assets/icons/battery.svg"),
      kettle: require("@/assets/icons/kettle.svg")
    },
    critical: {
      cam: require("@/assets/icons/cam-white.svg"),
      ac: require("@/assets/icons/ac-white.svg")
    }
  }
};

export default Vue.extend({
  components: {
    EventChart,
    NextIcon,
    CloseIcon,
    Player
  },
  props: {
    data: Event
  },
  data() {
    return initState
  },
  methods: {
    eventIconSrc(icon: string, type: 'critical' | 'normal' | undefined) {
      return type === "critical"
        ? this.icons.critical[icon]
        : this.icons.normal[icon];
    }
  }
});
</script>


<style lang="stylus" scoped>
.button {
  cursor: pointer;
  padding: 0.6875rem 0;
  width: 8.25rem;
  border: none;
  border-radius: 8px;
  font-size: 1.25rem;
  font-weight: bold;
  background: #E5E5E5;
  transition: background 0.2s;

  &:hover {
    background: #FFD93E;
  }
}

.icon-next, .icon-close {
  transition: opacity 0.2s;
  opacity: 0;
  visibility: hidden;
  cursor: pointer;
  position: absolute;
  right: 1.5rem;
}

.icon-close {
  top: 1.5rem;
  stroke: #666666;
  fill: #666666;
}

.icon-next {
  bottom: 1.5rem;
}

.event {
  text-align: left;
  border-radius: 1.25rem;
  background: #FAFAFA;
  color: #333333;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  position: relative;
  transition: all 0.2s;

  &:hover {
    background: #F3F3F3;
    box-shadow: 0 2px 6px 0 rgba(197, 186, 186, 0.5);

    &__body {
      background: #F3F3F3;
    }

    .icon-next, .icon-close {
      visibility: visible;
      opacity: 1;
    }
  }

  &__title {
    padding-left: 1rem;
    font-weight: bold;
    font-size: 0.875rem;
    margin: 0;
  }

  &__icon {
    width: 2.25rem;
    height: 2.25rem;
  }

  &__description {
    margin: 0;
    font-size: 1.125rem;
  }

  &__info {
    font-size: 0.875rem;
    padding-top: 1.625rem;
    display: flex;
    justify-content: space-between;

    &__value {
      font-weight: bold;
    }
  }

  &__body {
    padding: 0 1rem 1rem 1rem;
    flex: 1 0;
    border-top-left-radius: 1.25rem;
    border-top-right-radius: 1.25rem;
  }

  &__header {
    padding: 1rem;
  }

  &__headline {
    align-items: center;
    display: flex;
  }

  &__subheading {
    display: flex;
    justify-content: space-between;
    padding-top: 0.875rem;
    font-size: 0.75rem;
  }

  &__image {
    margin-top: 1rem;
    width: 100%;
  }

  &__buttons {
    display: flex;
    justify-content: space-between;
    padding-top: 1.5rem;

    .button:not(:first-child) {
      margin-left: 1.125rem;
    }
  }

  &__player {
    padding-top: 1rem;
  }

  &__chart {
    padding: 2rem 0 1rem;
  }
}

.event--small {
  padding-bottom: 4px;

  .event__subheading {
    display: flex;
    flex-direction: row;
    padding-bottom: 0;
  }
}

.event--critical {
  background: #DB5341;

  &:hover {
    background: #DB5341;
  }

  .event__header {
    color: #fff;
  }

  .event__body {
    padding-top: 1rem;
    background: #F3F3F3;
  }

  .icon-close {
    stroke: #fff;
    fill: #fff;
  }
}

@media screen and (min-width: 750px) {
  .event {
    &__body, &__header {
      padding: 1.25rem;
    }

    &__icon {
      width: 3.25rem;
      height: 3.25rem;
    }

    &__title {
      font-size: 1.5rem;
    }

    &__subheading {
      font-size: 1.125rem;
    }

    &__description {
      font-size: 1.25rem;
    }

    &__buttons {
      justify-content: flex-start;
    }

    &__info {
      font-size: 1.125rem;
      justify-content: flex-start;

      &-humidity {
        padding-left: 3.25rem;
      }
    }
  }

  .event--small {
    .event__subheading {
      flex-direction: column;
    }

    .event__source {
      padding-bottom: 20px;
    }
  }
}
</style>
