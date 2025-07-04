<template>
  <div class="load-more mt50 mb50">
    <div class="card-box f-c-c flex-wrap">
      <el-card class="card-item" v-for="item in list" :key="item">
        <template #header>
          <span class="fs16 fw600 pl10">Pic {{ item + 1 }}</span>
        </template>
        <div class="f-c-c pb10">
          <img
            class="card-img"
            :src="`https://picsum.photos/100/100?random=${item}`"
            :alt="`Pic ${item + 1}`"
          />
        </div>
      </el-card>
    </div>
    <div ref="loadMoreRef" class="f-c-c pt20">
      <span v-if="finished">- 没有了 -</span>
      <span v-else-if="loading">加载中...</span>
      <span v-else>- 加载更多 -</span>
    </div>
  </div>
</template>

<script setup lang="ts" name="LoadMore">
import { onMounted, ref, nextTick, onUnmounted } from "vue";

const list = ref<number[]>([]);
const size = ref<number>(100);
const total = ref<number>(1000);
const page = ref<number>(1);
const loading = ref<boolean>(false);
const finished = ref<boolean>(false);
const loadMoreRef = ref<HTMLElement | null>(null);

const initData = () => {
  loading.value = true;
  const start = (page.value - 1) * size.value;
  const end = start + size.value;
  for (let i = start; i < end; i++) {
    list.value.push(i);
  }
  setTimeout(() => {
    loading.value = false;
  }, 500);
};

const loadMore = () => {
  if (finished.value) {
    return;
  }
  loading.value = true;
  const start = (page.value - 1) * size.value;
  const end = start + size.value;
  for (let i = start; i < end; i++) {
    list.value.push(i);
  }
  page.value++;
  if (list.value.length > total.value) {
    finished.value = true;
  }
  setTimeout(() => {
    loading.value = false;
  }, 500);
};

const ob = new IntersectionObserver((entries) => {
  if (entries[0].isIntersecting && !finished.value && !loading.value) {
    console.log("load more");
    loadMore();
  }
});

onMounted(() => {
  initData();
  nextTick(() => {
    loadMoreRef.value && ob.observe(loadMoreRef.value);
  });
});

onUnmounted(() => {
  ob.disconnect();
});
</script>

<style scoped lang="scss">
.load-more {
  height: calc(100% - 100px);
  overflow: auto;
}
.card-box {
  gap: 10px;
  max-width: 800px;
  margin: auto;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  .card-img {
    width: 100px;
    height: 100px;
  }
}

:deep(.el-card__header),
:deep(.el-card__body) {
  padding: 0;
}
</style>
