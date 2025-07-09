<template>
  <div ref="container" class="parallax">
    <div
      v-for="(section, idx) in sections"
      :key="idx"
      :style="{ backgroundImage: `url(${section.image})` }"
      class="section-item f-c-c"
    >
      <!-- <div class="br10" v-if="idx === 0">
        <div class="nav-top pl5 pr5 h40 br10 f-c-c">
          <div class="nav-item f-c-c w80 white h30 br8 active">1</div>
          <div class="nav-item f-c-c w80 white h30 br8">2</div>
          <div class="nav-item f-c-c w80 white h30 br8">3</div>
        </div>
      </div>  -->
      <div class="f-c-c white fs30 fw600">{{ section.text }}</div>
    </div>
  </div>
</template>

<script setup lang="ts" name="Parallax">
import { ref, onMounted, onUnmounted } from "vue";

const sections = ref<
  {
    text: string;
    image: string;
  }[]
>([
  {
    text: "THIS IS THE FIRST",
    image:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=2070&auto=format&fit=crop",
  },
  {
    text: "THIS IS THE SECOND",
    image: "https://picsum.photos/1600/800?random=2",
  },
  {
    text: "THIS IS THE THIRD",
    image: "https://picsum.photos/1600/800?random=3",
  },
  {
    text: "THIS IS THE FOURTH",
    image: "https://picsum.photos/1600/800?random=4",
  },
  {
    text: "THIS IS THE FIFTH",
    image: "https://picsum.photos/1600/800?random=5",
  },
  {
    text: "THIS IS THE SIXTH",
    image: "https://picsum.photos/1600/800?random=6",
  },
]);
</script>

<style lang="scss" scoped>
.parallax {
  height: 100%;
  overflow-x: hidden;

  .section-item {
    position: relative;
    height: 100%;
    width: 100vw;
    background: center center / cover no-repeat fixed;
    text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.8);
  }

  .nav-top {
    backdrop-filter: blur(6px);
    outline: 1px solid rgba(255, 255, 255, 0.2);
    background-color: rgba(0, 0, 0, 0.1);
    box-shadow: 0px 0px 1px rgba(255, 255, 255, 0.5);

    .nav-item.active {
      background-color: rgba(73, 132, 73, 0.9);
    }
  }

  .section-blur {
    position: relative;
    width: 200px;
    height: 200px;
    backdrop-filter: blur(6px);
    outline: 1px solid rgba(255, 255, 255, 0.2);
    background-color: rgba(0, 0, 0, 0.1);
    box-shadow: 0px 0px 1px rgba(255, 255, 255, 0.5);
  }
}
</style>
