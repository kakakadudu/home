<template>
  <div ref="loadMoreScrollRef" class="load-more mt50 mb50">
    <div
      class="card-box gap10 flex-wrap"
      :style="{
        height: `${(total / cloumns) * (cardItemHeight + 10)}px`,
      }"
    >
      <el-card
        class="card-item f-c-c"
        v-for="item in visibleItems"
        :key="item.key"
        :style="item.style"
      >
        <!-- <span class="fs18 white">{{ item.address }}</span> -->
        <img :src="`https://picsum.photos/100/100?r=${item.key}`" alt="" />
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
import { onMounted, ref, nextTick, onUnmounted, watch } from "vue";

const loadMoreScrollRef = ref<HTMLElement | null>(null);
const loadMoreRef = ref<HTMLElement | null>(null);

const allItems = ref<{ [key: string]: any }[]>([]);
const visibleItems = ref<{ [key: string]: any }[]>([]);
const size = ref<number>(100);
const total = ref<number>(0);
const page = ref<number>(1);
const loading = ref<boolean>(false);
const finished = ref<boolean>(false);
const cardItemHeight = ref<number>(100);
const cloumns = ref<number>(1); // 列数
const lastX = ref<number>(0);
const isScrolling = ref<boolean>(false);
const loadMore = () => {
  if (finished.value || loading.value) {
    return;
  }
  const itemW = cardItemHeight.value + 10;
  if (loadMoreScrollRef.value) {
    cloumns.value = Math.floor(loadMoreScrollRef.value.clientWidth / itemW);
  }
  loading.value = true;
  const start = (page.value - 1) * size.value;
  const end = start + size.value;
  let x = lastX.value,
    y = Math.floor(start / cloumns.value);
  for (let i = start; i < end; i++) {
    if (i % cloumns.value === 0) {
      // 换行
      if (i > start) {
        y++;
      }
      x = 0;
    }
    const key = i + 1;
    allItems.value.push({
      offsetTop: y * itemW,
      key,
      address: `No. ${key}`,
      style: {
        transform: `translateX(${x * itemW}px) translateY(${y * itemW}px)`,
      },
    });
    x++;
  }
  setTimeout(() => {
    updateVisivleItems();

    loading.value = false;
    total.value = end;
    lastX.value = x;
    page.value++;
  }, 500);
};
const updateVisivleItems = () => {
  if (!loadMoreScrollRef.value) return;
  const scrollTop = loadMoreScrollRef.value?.scrollTop || 0;
  const list: { [key: string]: any }[] = [];
  const buffer = cloumns.value * 2 * cardItemHeight.value;
  const top = scrollTop,
    bottom = scrollTop + buffer;
  allItems.value.forEach((item) => {
    const show =
      top - buffer > item.offsetTop || bottom + buffer < item.offsetTop
        ? false
        : true;
    if (show) {
      list.push({
        ...item,
      });
    }
  });
  visibleItems.value = list;
};
const ob = new IntersectionObserver((entries) => {
  if (entries[0].isIntersecting && !finished.value && !loading.value) {
    console.log("load more");
    loadMore();
  }
});

const listen = (e: Event) => {
  if (!isScrolling.value) {
    isScrolling.value = true;
    requestAnimationFrame(() => {
      updateVisivleItems();
      isScrolling.value = false;
    });
  }
};

onMounted(() => {
  loadMore();
  nextTick(() => {
    loadMoreRef.value && ob.observe(loadMoreRef.value);
  });
  loadMoreScrollRef.value &&
    loadMoreScrollRef.value.addEventListener("scroll", listen);
});

onUnmounted(() => {
  ob.disconnect();
  loadMoreScrollRef.value?.removeEventListener("scroll", listen);
});
</script>

<style scoped lang="scss">
.load-more {
  --card-item-height: 100px;
  height: calc(100% - 100px);
  overflow: auto;
}
.card-box {
  position: relative;
  display: grid;
  grid-template-columns: repeat(
    auto-fill,
    minmax(var(--card-item-height), 1fr)
  );
  .card-item {
    position: absolute;
    width: var(--card-item-height);
    height: var(--card-item-height);
    outline: 1px solid gray;
    background: transparent;
  }
}

:deep(.el-card__header),
:deep(.el-card__body) {
  padding: 0;
}
</style>
