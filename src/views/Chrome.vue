<template>
  <div class="chrome">
    <div class="bar h45 pl30 pr30 f-c-b">
      <div class="left f-c-s">
        <Action @exit="handleCloseTab(-1)" />
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
                  ml60: true,
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
      <div class="nav-top p10 f-c-e">
        <a href="https://github.com/kakakadudu" target="_blank">
          <svg
            height="24"
            width="24"
            aria-hidden="true"
            viewBox="0 0 24 24"
            version="1.1"
            data-view-component="true"
            class="github"
          >
            <path
              d="M12 1C5.923 1 1 5.923 1 12c0 4.867 3.149 8.979 7.521 10.436.55.096.756-.233.756-.522 0-.262-.013-1.128-.013-2.049-2.764.509-3.479-.674-3.699-1.292-.124-.317-.66-1.293-1.127-1.554-.385-.207-.936-.715-.014-.729.866-.014 1.485.797 1.691 1.128.99 1.663 2.571 1.196 3.204.907.096-.715.385-1.196.701-1.471-2.448-.275-5.005-1.224-5.005-5.432 0-1.196.426-2.186 1.128-2.956-.111-.275-.496-1.402.11-2.915 0 0 .921-.288 3.024 1.128a10.193 10.193 0 0 1 2.75-.371c.936 0 1.871.123 2.75.371 2.104-1.43 3.025-1.128 3.025-1.128.605 1.513.221 2.64.111 2.915.701.77 1.127 1.747 1.127 2.956 0 4.222-2.571 5.157-5.019 5.432.399.344.743 1.004.743 2.035 0 1.471-.014 2.654-.014 3.025 0 .289.206.632.756.522C19.851 20.979 23 16.854 23 12c0-6.077-4.922-11-11-11Z"
            ></path>
          </svg>
        </a>
      </div>
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
        <div class="menu-list f-c-c flex-wrap">
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
  Brush,
} from "@element-plus/icons-vue";
import TimePeroidPicker from "@/views/TimePeroidPicker.vue";
import Cascader from "@/views/Cascader.vue";
import LoadMore from "@/views/LoadMore.vue";
import Parallax from "@/views/Parallax.vue";
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
    title: "click me",
    icon: markRaw(Files),
    component: markRaw(LoadMore),
    path: "LoadMore",
  },
  {
    title: "Parallax",
    icon: markRaw(Brush),
    component: markRaw(Parallax),
    path: "Parallax",
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

    .nav-top {
      position: absolute;
      top: 0;
      right: 0;
      width: 100%;
      .github {
        fill: #fff;
      }
    }
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
    max-width: calc(100vw - 160px);
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

@media screen and (max-width: 768px) {
  .chrome {
    --content-width: 90vw;
  }
}
</style>
