<template>
  <div class="echarts">
    <div ref="barRef" class="bar" style="width: 100vw; height: 300px"></div>
  </div>
</template>

<script setup lang="ts" name="Echarts">
import * as echarts from "echarts";
import { onMounted, ref } from "vue";

const barRef = ref(null);
let barChart: echarts.ECharts | null = null;

const initData = () => {
  const chartDom = barRef.value;
  if (!barChart) {
    barChart = echarts.init(chartDom);
  }

  const total = Math.floor(Math.random() * 10000);
  const data = [],
    series1 = [],
    series2 = [];
  for (let i = 0; i < total; i++) {
    data.push(`item${i + 1}`);
    series1.push(Math.floor(Math.random() * 100));
    series2.push(Math.floor(Math.random() * 100));
  }
  console.log(total, "------------------total");
  const option: echarts.EChartsOption = {
    grid: {
      bottom: 100,
    },
    xAxis: {
      type: "category",
      data,
      axisLabel: {
        rotate: 45,
      },
    },
    yAxis: {
      type: "value",
    },
    series: [
      {
        data: series1,
        type: "bar",
        stack: "stack",
      },
      {
        data: series2,
        type: "bar",
        stack: "stack",
      },
    ],
    dataZoom: [
      {
        type: "inside",
        start: 0,
        end: (25 / total) * 100,
      },
      {
        type: "slider",
        // moveHandleSize: 10,
        // height: 15,
      },
    ],
  };

  barChart.setOption(option);
};

onMounted(() => {
  initData();
});
</script>

<style lang="scss" scoped></style>
