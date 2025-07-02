<template>
  <div class="time-peroid-picker f-c-c">
    <div class="time-peroid-picker-inner">
      <div class="time-peroid-picker-week">
        <div class="time-peroid-picker-day"></div>
        <div v-for="day in week" class="time-peroid-picker-day" :key="day">
          {{ day }}
        </div>
        <div class="time-peroid-picker-day per mt40">per</div>
      </div>
      <div class="time-peroid-picker-column">
        <div class="time-peroid-picker-title">
          <div
            v-for="hour in hours"
            class="time-peroid-picker-hour fs10"
            :key="hour"
          >
            {{ hour }}
          </div>
        </div>

        <div
          class="time-peroid-picker-grid"
          @mousedown="handleMouseDown"
          @mouseover="handleMouseOver"
        >
          <div v-for="(d, y) in week" class="time-peroid-picker-row" :key="y">
            <div
              v-for="(h, x) in hours"
              class="time-peroid-picker-cell"
              :key="x"
              :class="{
                active: checkIsActive(y, x),
                selected: checkIsSelected(y, x),
                hover: hover == `${y}-${x}`,
              }"
              :data-position="`${y}-${x}`"
              :data-x="x"
              :data-y="y"
            ></div>
          </div>
          <div class="time-peroid-picker-row per mt40">
            <div
              v-for="(h, x) in hours"
              class="time-peroid-picker-cell"
              :key="x"
              :class="{
                active: isMouseDown ? perWithHour[parseInt(h)] == 7 : false,
                selected: perSelected[parseInt(h)] == 7,
              }"
              :data-position="`${7}-${h}`"
              :data-x="h"
              :data-y="7"
            ></div>
          </div>
        </div>
      </div>
    </div>
    <div class="time-peroid-picker-footer mt20">
      <div class="time-peroid-picker-btns mt20">
        <el-button @click="handleClear">清空</el-button>
      </div>
      <div class="time-peroid-picker-times" @mouseleave="hover = null">
        <div
          v-for="(t, idx) in group"
          class="time-peroid-picker-selected mt10"
          :key="idx"
        >
          <span class="date">{{ returnDay(t.y) }}</span>
          <div class="time-peroid-picker-selected-cell">
            <span
              v-for="x1 in t.x"
              class="time f-c-c"
              :key="x1"
              :data-position="`${t.y}-${x1}`"
              @mouseover="hover = `${t.y}-${x1}`"
            >
              {{ returnTime(x1) }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts" name="TimePeroidPicker">
import { reactive, ref } from "vue";

const week = ref<string[]>(["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]);
const hours = ref<string[]>([
  "00",
  "01",
  "02",
  "03",
  "04",
  "05",
  "06",
  "07",
  "08",
  "09",
  "10",
  "11",
  "12",
  "13",
  "14",
  "15",
  "16",
  "17",
  "18",
  "19",
  "20",
  "21",
  "22",
  "23",
]);
type Start = {
  x: number | null;
  y: number | null;
};
const start = reactive<Start>({
  x: null,
  y: null,
});
const perStart = reactive<Start>({
  x: null,
  y: null,
});
const isMouseDown = ref<boolean>(false);
type Group = { y: string; x: string[] };
const actives = ref<string[]>([]);
const selected = ref<string[]>([]);
const hover = ref<string | null>(null);
const group = ref<Group[]>([]);
const perWithHour = ref<{ [ke: string]: number }>({});
const perSelected = ref<{ [ke: string]: number }>({});

const handleMouseDown = (event: MouseEvent) => {
  // console.log('mouse down', event)
  let x = (event.target as HTMLElement).dataset.x as string;
  let y = (event.target as HTMLElement).dataset.y as string;
  start.x = parseInt(x);
  start.y = parseInt(y);
  if (y == "7") {
    perStart.x = parseInt(x);
    perStart.y = parseInt(y);
    start.y = parseInt(y) - 1;
  }
  isMouseDown.value = true;
};
const handleMouseOver = (event: MouseEvent) => {
  // console.log('mouse over', event)
  let x = (event.target as HTMLElement).dataset.x as string;
  let y = (event.target as HTMLElement).dataset.y as string;
  const end = {
    x: parseInt(x),
    y: y == "7" ? 0 : parseInt(y),
  };
  const rect = [];
  if (isMouseDown.value && start.x !== null && start.y !== null) {
    let startX = start.x,
      startY = start.y,
      endX = end.x,
      endY = end.y;

    if (start.x <= end.x && start.y <= end.y) {
      // 右下
      startX = start.x;
      endX = end.x;
      startY = start.y;
      endY = end.y;
    } else if (start.x <= end.x && start.y >= end.y) {
      // 右上
      startX = start.x;
      endX = end.x;
      startY = end.y;
      endY = start.y;
    } else if (start.x >= end.x && start.y >= end.y) {
      // 左上
      startX = end.x;
      endX = start.x;
      startY = end.y;
      endY = start.y;
    } else if (start.x >= end.x && start.y <= end.y) {
      // 左下
      startX = end.x;
      endX = start.x;
      startY = start.y;
      endY = end.y;
    }

    for (let i = startX; i <= endX; i++) {
      for (let j = startY; j <= endY; j++) {
        rect.push(`${j}-${i}`);
      }
    }
    group.value = createGroup(rect);
    perWithHour.value = computeIsPer(group.value);
  }
  actives.value = rect;
};
const checkIsActive = (y: number, x: number) => {
  const current = `${y}-${x}`;
  return isMouseDown.value ? actives.value.includes(current) : false;
};
const checkIsSelected = (y: number, x: number) => {
  const current = `${y}-${x}`;
  return selected.value.includes(current);
};

const computeIsPer = (groups: Group[]) => {
  if (groups.length === 7) {
    // 七天
    let per: { [key: string]: number } = {};
    groups.forEach((group) => {
      const { y, x } = group;
      x.forEach((x1) => {
        if (!per[x1]) {
          per[x1] = 1;
        } else {
          per[x1]++;
        }
      });
    });
    return per;
  }
  return {};
};

const returnDay = (position: string) => {
  switch (position) {
    case "0":
      return "周一";
    case "1":
      return "周二";
    case "2":
      return "周三";
    case "3":
      return "周四";
    case "4":
      return "周五";
    case "5":
      return "周六";
    case "6":
      return "周日";
  }
};
const returnTime = (position: string) => {
  switch (position) {
    case "0":
      return "00:00 - 01:00";
    case "1":
      return "01:00 - 02:00";
    case "2":
      return "02:00 - 03:00";
    case "3":
      return "03:00 - 04:00";
    case "4":
      return "04:00 - 05:00";
    case "5":
      return "05:00 - 06:00";
    case "6":
      return "06:00 - 07:00";
    case "7":
      return "07:00 - 08:00";
    case "8":
      return "08:00 - 09:00";
    case "9":
      return "09:00 - 10:00";
    case "10":
      return "10:00 - 11:00";
    case "11":
      return "11:00 - 12:00";
    case "12":
      return "12:00 - 13:00";
    case "13":
      return "13:00 - 14:00";
    case "14":
      return "14:00 - 15:00";
    case "15":
      return "15:00 - 16:00";
    case "16":
      return "16:00 - 17:00";
    case "17":
      return "17:00 - 18:00";
    case "18":
      return "18:00 - 19:00";
    case "19":
      return "19:00 - 20:00";
    case "20":
      return "20:00 - 21:00";
    case "21":
      return "21:00 - 22:00";
    case "22":
      return "22:00 - 23:00";
    case "23":
      return "23:00 - 00:00";
  }
};
const createGroup = (arry: string[]) => {
  let newArry = arry.map((f) => {
    return {
      x: f.split("-")[1],
      y: f.split("-")[0],
    };
  });
  let groups = Object.groupBy(newArry, (f: { [key: string]: string }) => f.y);
  let newGroups: Group[] = [];
  Object.keys(groups).forEach((v) => {
    newGroups.push({
      y: v,
      x: (groups[v] as { [key: string]: string }[]).map(
        (m: { [key: string]: string }) => m.x
      ),
    });
  });
  return newGroups;
};
const handleClear = () => {
  selected.value = [];
  group.value = [];
  perWithHour.value = {};
  perSelected.value = {};
};

window.addEventListener("mouseup", (event: MouseEvent) => {
  // console.log('mouse up', event)
  let x = (event.target as HTMLElement).dataset.x as string;
  let y = (event.target as HTMLElement).dataset.y as string;
  if (isMouseDown.value && start.x !== null && start.y !== null && !!x && !!y) {
    const end = {
      x: parseInt(x),
      y: parseInt(y),
    };
    // 原点
    if (y == "7") {
      for (let i = 0; i < end.y; i++) {
        if (!actives.value.includes(`${i}-${end.x}`)) {
          actives.value.push(`${i}-${end.x}`);
        }
      }
    } else {
      if (!actives.value.includes(`${end.y}-${end.x}`)) {
        actives.value.push(`${end.y}-${end.x}`);
      }
    }
    if (selected.value?.length > 0) {
      actives.value.forEach((f) => {
        const index = selected.value.indexOf(f);
        if (index > -1) {
          selected.value.splice(index, 1);
        } else {
          selected.value.push(f);
        }
      });
    } else {
      selected.value = actives.value;
    }
    group.value = createGroup(selected.value);
    perSelected.value = perWithHour.value = computeIsPer(group.value);
    // console.log(selected.value, '-----selected')
    // console.log(group.value, '-----group')
    // console.log(perWithHour.value, '-----perSelected')
    // console.log(perSelected.value, '-----perSelected')
  }
  start.x = null;
  start.y = null;
  isMouseDown.value = false;
  actives.value = [];
  perWithHour.value = {};
});
</script>

<style scoped lang="scss">
.time-peroid-picker {
  width: 100%;
  height: 100%;
  flex-direction: column;
}
.time-peroid-picker-inner {
  display: flex;
  flex-direction: row;
  width: fit-content;
}
.time-peroid-picker-week {
  width: 60px;
  height: 100%;
  margin-right: 10px;
}
.time-peroid-picker-day {
  text-align: center;
  height: 40px;
  line-height: 40px;
  text-align: center;
  border-bottom: 1px solid #ebe5e5;
}
.time-peroid-picker-column {
  height: 100%;
}
.time-peroid-picker-title {
  display: flex;
}
.time-peroid-picker-hour {
  width: 40px;
  height: 40px;
  line-height: 40px;
  text-align: center;
  border-bottom: 1px solid #ebe5e5;
}

.time-peroid-picker-grid {
  display: flex;
  flex-direction: column;
  width: fit-content;
}
.time-peroid-picker-row {
  height: 40px;
  width: fit-content;
  display: grid;
  grid-template-columns: repeat(24, 40px);
}
.time-peroid-picker-cell {
  height: 100%;
  outline: 1px solid #ebe5e5;
}
.time-peroid-picker-cell.selected {
  background-color: #5fe077;
}
.time-peroid-picker-cell.active {
  background-color: #dfc780;
}
.time-peroid-picker-cell.hover {
  background-color: #7c9ede;
}
.time-peroid-picker-footer {
  max-width: 100%;
}
.time-peroid-picker-times {
  height: 300px;
  width: 1030px;
  overflow: auto;
}
.time-peroid-picker-selected {
  display: flex;
}
.time-peroid-picker-selected-cell {
  display: grid;
  grid-template-columns: repeat(10, 90px);
  gap: 5px;
  width: calc(100% - 60px);
}
.time-peroid-picker-selected .date {
  width: 60px;
}
.time-peroid-picker-selected .time {
  font-size: 12px;
  cursor: pointer;
}
.time-peroid-picker-selected .time:hover {
  background-color: #7c9ede;
}
</style>
