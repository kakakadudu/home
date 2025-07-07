<template>
  <div class="chrome">
    <div class="bar h45 pl30 pr30 f-c-b">
      <div class="left f-c-s">
        <Action @action="handleCloseTab(-1)" />
        <div class="new-tab-box f-c-s pl20 pr20">
          <div
            class="new-tab f-c-s pl10 pr10 mt5"
            v-for="(item, idx) in tabs"
            :key="idx"
            :class="{ active: idx === activeTab }"
            @click="handleClickTab(idx)"
          >
            <div class="tab-item br10 pt5 pb5 pl10 pr10 f-c-b">
              <div class="f-c-s">
                <el-icon><Component :is="item.icon" /></el-icon>
                <span class="fs12 white ml10 title ellipsis">
                  {{ item.title }}
                </span>
              </div>
              <div
                class="close-tab w15 h15 f-c-c"
                :class="{
                  ml100: true,
                }"
                @click="handleCloseTab(idx)"
                v-if="item.component"
              >
                <el-icon><Close /></el-icon>
              </div>
            </div>
          </div>
        </div>
        <div
          class="create-tab w28 h28 f-c-c mt5"
          @click="handleCreateTab"
          v-if="showAddTab"
        >
          <el-icon color="#fff"><Plus /></el-icon>
        </div>
      </div>
    </div>
    <div class="chrome-content">
      <div class="el-logo h168 mb38 f-e-c">
        <div class="logo w272 h92"></div>
      </div>

      <!-- 搜索框 -->
      <div class="input-box f-c-c">
        <div class="el-input-box">
          <el-icon class="el-icon-search" size="18px"><Search /></el-icon>
          <el-input
            :placeholder="placeholder"
            v-model="url"
            @focus="handleSearchFocus"
            @blur="handleSearchBlur"
            @change="handleSearch"
          />
          <div class="icon-right f-c-s gap15">
            <span class="icon-item pointer w24 h24 icon-mic"></span>
            <span class="icon-item pointer w24 h24 icon-pic"></span>
          </div>
        </div>
      </div>

      <!-- 常用地址 -->
      <div class="menu-box f-c-c">
        <div class="menu-list f-c-c">
          <div
            v-for="(item, idx) in menus.filter((f) => !f.hide)"
            :key="idx"
            class="item w112 h112 br4 f-c-c fs13"
            @click="handleShowTab(item)"
          >
            <div
              class="item-icon w48 h48 mb6 pointer f-c-c"
              :style="{ background: item.background }"
            >
              <el-icon v-if="item.icon" size="20px" color="#fff">
                <Component :is="item.icon" />
              </el-icon>
              <img
                v-if="!item.icon"
                :src="`https://picsum.photos/20/20?random=${idx}`"
                alt=""
              />
            </div>
            <div class="item-title ellipsis white fw600">{{ item.title }}</div>
          </div>
        </div>
      </div>

      <div class="component-content" v-if="tabs[activeTab]?.component">
        <Component :is="tabs[activeTab].component" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts" name="Chrome">
import { markRaw, ref } from "vue";
import router from "@/router";
import {
  ChromeFilled,
  Close,
  Search,
  List,
  Grid,
  Files,
  Setting,
  Plus,
} from "@element-plus/icons-vue";
import TimePeroidPicker from "@/views/TimePeroidPicker.vue";
import Cascader from "@/views/Cascader.vue";
import LoadMore from "@/views/LoadMore.vue";
import type { Component } from "vue";
import type { TabType, MenuType } from "@/types/Chrome";
import Action from "@/components/Action.vue";

const emit = defineEmits(["close"]);

const showAddTab = ref<boolean>(false);
const tabs = ref<TabType[]>([
  {
    title: "新标签页",
    icon: markRaw(ChromeFilled),
  },
]);
const activeTab = ref<number>(0);

const menus = ref<MenuType[]>([
  {
    title: "有趣的东西",
    icon: markRaw(Grid),
    component: markRaw(TimePeroidPicker),
    path: "TimePeroidPicker",
  },
  {
    title: "快乐的南北",
    icon: markRaw(List),
    component: markRaw(Cascader),
    path: "Cascader",
  },
  {
    title: "点开",
    icon: markRaw(Files),
    component: markRaw(LoadMore),
    path: "LoadMore",
  },
  {
    title: "添加快捷方式",
    icon: markRaw(Plus),
    background: "#535e4f",
    path: "",
    hide: !showAddTab.value,
  },
]);
const url = ref<string>("");
const placeholder = ref("在 Google 中搜索，或输入网址");
const handleSearch = (myUrl?: string) => {
  if (!myUrl) {
    return;
  }
  window.open(`https://www.google.com/search?q=${url.value}`, "_blank");
  url.value = "";
};

const handleSearchFocus = () => {
  placeholder.value = "";
};
const handleSearchBlur = () => {
  placeholder.value = "在 Google 中搜索，或输入网址";
};

const handleCloseTab = (idx: number) => {
  event?.stopPropagation();
  if (idx === -1) {
    emit("close");
    return;
  }
  if (tabs.value.length > 1) {
    tabs.value.splice(idx, 1);
    activeTab.value = Math.min(idx, tabs.value.length - 1);
    return;
  }
  emit("close");
};

const handleCreateTab = () => {
  tabs.value.push({
    title: "新标签页",
    icon: markRaw(ChromeFilled),
  });
  activeTab.value = tabs.value.length - 1;
};

const handleShowTab = (item: MenuType) => {
  if (tabs.value.some((s) => s.title === item.title)) {
    activeTab.value = tabs.value.findIndex((s) => s.title === item.title);
    return;
  }
  if (item.path) {
    tabs.value.push({
      title: item.title,
      icon: item.icon,
      component: item.component,
    });
    activeTab.value = tabs.value.length - 1;
  }
};

const handleClickTab = (idx: number) => {
  activeTab.value = idx;
};
</script>

<style scoped lang="scss">
.chrome {
  --bg: rgba(30, 33, 28, 1);
  --active-bg: rgba(42, 47, 40, 1);
  --content-width: 40vw;
  background: var(--active-bg);
  height: 100%;
  width: 100%;
  overflow: hidden;
  .chrome-content {
    position: relative;
    width: 100%;
    height: calc(100% - 45px);
    overflow: hidden;
  }
  .component-content {
    position: absolute;
    width: 100%;
    height: 100%;
    background: var(--active-bg);
    inset: 0;
    z-index: 999;
    overflow: auto;
  }
}
.bar {
  background: var(--bg);
  .left {
    height: 100%;
  }
  .new-tab-box {
    height: 100%;
    max-width: calc(100vw - 200px);
    overflow-x: auto;
    overflow-y: hidden;
    user-select: none;
  }
  .new-tab {
    flex: 1;
    max-width: 240px;
    height: calc(100% - 5px);
    background: var(--bg);
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
    .tab-item {
      width: 100%;
      &:hover {
        background: var(--active-bg);
      }
      .title {
        display: block;
        max-width: 100px;
      }
    }
    .close-tab {
      border-radius: 50%;
      transition: all 0.2s;
      &:hover {
        background-color: rgba(255, 255, 255, 0.2);
      }
    }
  }
  .new-tab.active {
    position: relative;
    background: var(--active-bg);
    &::after {
      content: "";
      position: absolute;
      top: 7px;
      right: -8px;
      height: 100%;
      width: 16px;
      background: inherit;
      clip-path: path("M 0,12 C 12,0 0,43 20,31 L 0, 46 Z");
    }
    &::before {
      overflow: visible;
      content: "";
      position: absolute;
      top: 7px;
      left: -10px;
      height: 100%;
      width: 16px;
      background: inherit;
      clip-path: path("M 0,33 C 17,37 12,0 20,0 L 20, 56 Z");
    }
  }
  .create-tab {
    border-radius: 50%;
    transition: all 0.2s;
    &:hover {
      background: var(--active-bg);
    }
  }
}
.el-logo {
  .logo {
    background: rgba(86, 98, 83, 1);
    mask-image: url("../assets/images/google_logo.svg");
    mask-repeat: no-repeat;
    mask-size: contain;
    mask-position: center;
  }
}
.input-box {
  --input-box-height: 48px;
  height: var(--input-box-height);
  margin-bottom: 16px;
}
.el-input-box {
  position: relative;
  height: var(--input-box-height);
  .el-input {
    width: var(--content-width);
    height: 100%;
    padding: 0 87px 0 52px;
    background-color: #ffffffff;
    border-radius: calc(0.5 * var(--input-box-height));
    overflow: hidden;
    box-shadow: 0 1px 6px 0 #20212447;
  }
  :deep(.el-input__wrapper) {
    box-shadow: none;
    padding: 0;
    .el-input__inner {
      font-size: 16px;
      &::placeholder {
        color: rgba(0, 0, 0, 0.87);
      }
    }
  }
  .el-icon-search,
  .icon-right {
    position: absolute;
    z-index: 1;
    top: 50%;
    transform: translateY(-50%);
  }
  .el-icon-search {
    left: 20px;
    color: rgba(0, 0, 0, 0.54);
  }
  .icon-right {
    right: 20px;
    .icon-item {
      display: inline-block;
    }
    .icon-mic {
      background: url("../assets/images/mic.svg") no-repeat center;
      background-size: contain;
    }
    .icon-pic {
      background: url("../assets/images/camera.svg") no-repeat center;
      background-size: contain;
    }
  }
}
.menu-list {
  width: var(--content-width);
  .item {
    flex-direction: column;
    overflow: hidden;
    &:hover {
      background-color: rgba(255, 255, 255, 0.1);
    }
  }
  .item-icon {
    border-radius: 50%;
    background-color: rgba(255, 255, 255, 0.1);
  }
  .item-title {
    display: block;
    max-width: 100%;
  }
}
</style>
