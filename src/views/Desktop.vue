<template name="DockerPage">
  <div class="desktop">
    <!-- 状态栏 -->
    <div class="bar f-c-b pl10 pr10 h30">
      <div class="bar-icon gap10 f-c-s">
        <el-icon><Component :is="bar[active].icon" /></el-icon>
        <span class="fs14 fw600 white">{{ bar[active].text }}</span>
        <!-- 天气 -->
        <img class="h30" :src="weatherData.icon" />
        <span>{{ weatherData.temp }}°C </span>
      </div>
      <div class="bar-icon gap10 f-c-s">
        <span class="fs14 fw600 white">
          {{ formatDateTime(now, { month: "short" }) }}
        </span>
      </div>
    </div>
    <!-- 桌面 -->
    <div class="desk gap20 f-d-c-e pr20 pl20 pt50 pb80">
      <div class="desk-icon" @dblclick.stop.prevent="handleClick(14)" v-once>
        <div
          class="desk-icon-item w60 h60"
          :style="{
            background: returnBg(14),
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          }"
        ></div>
        <div class="desk-icon-text f-c-c white fs12 fw500">测试</div>
      </div>
      <div
        class="window br8"
        :class="{ bg: active !== 2 }"
        v-if="bar[active]?.component"
      >
        <Component :is="bar[active].component" @close="handleCloseWindow" />
      </div>
    </div>

    <!-- 程序坞 -->
    <div class="docker" v-once>
      <div class="docker-box" @mouseleave="handleMouseLeave">
        <div class="doceker-list" ref="dockerRef">
          <div
            class="docker-item-outer"
            v-for="(item, idx) in 15"
            :key="item"
            @mouseover="(e) => handleMouseOver(e, idx)"
          >
            <div
              class="docker-item"
              :class="{
                open: bar.find((f) => f.id === item && f.status === 1),
              }"
              v-if="[13, 14, 15].includes(item)"
              :style="{
                background: `rgba(255, 255, 255, 0.1) ${returnBg(item)}`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
              }"
              @click="handleClick(item)"
            ></div>
            <div
              v-else
              class="docker-item"
              :style="{
                background: `hsl(${Math.floor(Math.random() * 361)}deg 
                ${Math.floor(Math.random() * 101)}% 
                ${Math.floor(Math.random() * 101)}% / 90%)`,
              }"
            ></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts" name="Desktop">
import { ref, onMounted, onUnmounted, shallowRef } from "vue";
import { ChromeFilled, Orange } from "@element-plus/icons-vue";
import { formatDateTime } from "@/utils/index";
import chorme from "@/assets/images/chorme.png";
import folder from "@/assets/images/folder.png";
import recycle from "@/assets/images/recycle.png";
import ChromePage from "@/views/Chrome.vue";
import FolderPage from "@/views/Folder.vue";

const dockerRef = shallowRef<HTMLDivElement>();
const now = ref(new Date());
var timer: ReturnType<typeof setInterval> | null = null;

const bar = shallowRef([
  {
    icon: Orange,
    text: "Orange",
    component: null,
  },
  {
    icon: ChromeFilled,
    text: "Chrome",
    component: ChromePage,
    id: 13,
    status: 1,
  },
  {
    icon: Orange,
    text: "Orange",
    component: FolderPage,
    id: 14,
    status: 1,
  },
]);
const active = ref(0);
const weatherData = ref<{ [key: string]: any }>({});

const setPropetyOfItem = (idx: number) => {
  for (let i = idx - 4; i <= idx + 4; i++) {
    let scale = 1,
      gapX = 45,
      gapY = 50;

    if (i === idx) {
      scale = 1.8;
    } else if (i === idx - 1 || i === idx + 1) {
      scale = 1.7;
    } else {
      scale = 1.8 - Math.abs(idx - i) * 0.2;
    }
    gapX = scale * 45;
    gapY = scale * 50;
    if (dockerRef.value?.children[i]) {
      const itemRef = dockerRef.value.children[i] as HTMLDivElement;
      itemRef.style.setProperty("--scale", `${scale}`);
      itemRef.style.setProperty("--gapX", `${gapX}px`);
      itemRef.style.setProperty("--gapY", `${gapY}px`);
    }
  }
};
const handleMouseOver = (event: MouseEvent, idx: number) => {
  if (event.target) {
    const itemRef = event.target as HTMLDivElement;
    if (itemRef.className?.includes("docker-item")) {
      if (
        itemRef.className === "docker-item" ||
        itemRef.className === "docker-item open"
      ) {
        setPropetyOfItem(idx);
      }
    }
  }
};

const handleMouseLeave = (event: MouseEvent) => {
  if (event.target) {
    const targetRef = event.target as HTMLDivElement;
    if (["docker-item-outer", "docker-box"].includes(targetRef.className)) {
      for (let i = 0; i < 15; i++) {
        if (dockerRef.value?.children[i]) {
          const itemRef = dockerRef.value.children[i] as HTMLDivElement;
          itemRef.style.setProperty("--scale", `1`);
          itemRef.style.setProperty("--gapX", `45px`);
          itemRef.style.setProperty("--gapY", `50px`);
        }
      }
    }
  }
};

const returnBg = (item: number) => {
  switch (item) {
    case 13:
      return `url(${chorme})`;
    case 14:
      return `url(${folder})`;
    case 15:
      return `url(${recycle})`;
    default:
  }
};

const handleClick = (item: number) => {
  console.log("handleClick", item);
  switch (item) {
    case 13:
      active.value = 1;
      break;
    case 14:
      active.value = 2;
      break;
    default:
  }
};

const handleCloseWindow = () => {
  active.value = 0;
};
const getWeatherByLocation = () => {
  // 首先获取用户位置
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        const apiKey = "dc2776d380f56121056b5a7d17624952";
        const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

        try {
          const response = await fetch(url);
          const data = await response.json();
          if (data.cod !== 200) {
            console.error("获取天气失败:", data.message);
            return;
          }

          console.log(`当前位置天气: ${data.weather[0].description}`);
          console.log(`温度: ${data.main.temp}°C`);
          weatherData.value = {
            temp: data.main.temp,
            icon: `https://openweathermap.org/img/wn/${data.weather[0].icon}.png`,
            counrty: data.sys.country,
          };
        } catch (error) {
          console.error("获取天气失败:", error);
        }
      },
      (error) => {
        console.error("获取位置失败:", error.message);
      }
    );
  } else {
    console.error("浏览器不支持地理位置功能");
  }
};

onMounted(() => {
  getWeatherByLocation();
  if (timer) {
    clearInterval(timer);
    timer = null;
  }
  timer = setInterval(() => {
    now.value = new Date();
  }, 1000);
});

onUnmounted(() => {
  if (timer) {
    clearInterval(timer);
    timer = null;
  }
});
</script>

<style scoped lang="scss">
.desktop {
  position: relative;
  width: 100vw;
  height: 100vh;
  background: url("../assets/images/dijia.png") no-repeat;
  background-size: cover;
  overflow: hidden;
}
.bar {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  margin: auto;
  width: 100vw;
  z-index: 999;
  background: rgba(4, 10, 14, 0.95);
  .bar-icon {
    .el-icon svg {
      color: #f7f7f7;
    }
  }
}

.desk {
  height: 100vh;
}

.docker {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
  z-index: 999;
  display: flex;
  justify-content: center;
  align-items: flex-end;
  padding-bottom: 10px;
  .docker-box {
    --scale: 1;
    --gapX: 45px;
    --gapY: 50px;
    position: relative;
    width: fit-content;
    height: 50px;
  }
  .doceker-list {
    height: 100%;
    backdrop-filter: blur(6px);
    outline: 1px solid rgba(255, 255, 255, 0.2);
    background-color: rgba(255, 255, 255, 0.1);
    box-shadow: 0px 0px 1px rgba(255, 255, 255, 0.5);
    width: fit-content;
    border-radius: 10px;
    display: flex;
    justify-content: center;
    align-items: flex-end;
    padding-left: 10px;
    padding-right: 10px;
  }
  .docker-item-outer {
    width: var(--gapX);
    height: var(--gapY);
    transition: all 0.15s;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .docker-item {
    box-shadow: 0px 0px 4px rgba(0, 0, 0, 0.1);
    transform: scale(var(--scale));
    transition: all 0.15s;
    border-radius: 8px;
    width: 35px;
    height: 35px;
  }
  .docker-item.open {
    position: relative;
    &::after {
      position: absolute;
      content: "";
      width: 4px;
      height: 3px;
      border-radius: 50%;
      bottom: -5px;
      left: 0;
      right: 0;
      margin: auto;
      background: gray;
    }
  }
}

.window {
  position: absolute;
  top: 30px;
  left: 0;
  right: 0;
  bottom: 70px;
  height: calc(100vh - 95px);
  width: 100vw;
  overflow: hidden;
}

.window.bg {
  outline: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0px 0px 1px rgba(255, 255, 255, 0.5);
}

@media screen and (max-width: 700px) {
  .docker {
    left: auto;
  }
}
</style>
