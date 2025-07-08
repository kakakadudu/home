<template>
  <div class="action gap10 f-c-s pr20">
    <span class="red w12 h12" @click="handleExit"></span>
    <span class="orange w12 h12"></span>
    <span class="green w12 h12" @click="handleToggleFullscreen"></span>
  </div>
</template>

<script setup lang="ts">
const emit = defineEmits(["exit"]);
const handleExit = () => {
  emit("exit");
};
// 在组件中
const enterFullscreen = () => {
  const element = document.querySelector(".window > div") as HTMLElement;

  if (element.requestFullscreen) {
    element.requestFullscreen();
  } else if ((element as any).webkitRequestFullscreen) {
    /* Safari */
    (element as any).webkitRequestFullscreen();
  } else if ((element as any).msRequestFullscreen) {
    /* IE11 */
    (element as any).msRequestFullscreen();
  }
};

const exitFullscreen = () => {
  if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if ((document as any).webkitExitFullscreen) {
    /* Safari */
    (document as any).webkitExitFullscreen();
  } else if ((document as any).msExitFullscreen) {
    /* IE11 */
    (document as any).msExitFullscreen();
  }
};

// 切换全屏
const handleToggleFullscreen = () => {
  if (!document.fullscreenElement) {
    enterFullscreen();
  } else {
    exitFullscreen();
  }
};
</script>

<style lang="scss" scoped>
.action {
  span {
    border-radius: 50%;
    &.red {
      background: red;
    }
    &.orange {
      background: orange;
    }
    &.green {
      background: green;
    }
  }
}
</style>
