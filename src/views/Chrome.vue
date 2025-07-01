<template>
  <div class="chrome">
    <div class="bar pl30 pr30 f-c-b">
      <div class="left f-c-s">
        <div class="action f-c-s pr20">
          <span class="red"></span>
          <span class="orange"></span>
          <span class="green"></span>
        </div>
        <div class="new-tab f-c-s pl10 pr10 mt10">
          <div class="tab-item f-c-b">
            <div class="f-c-s">
              <el-icon><ChromeFilled /></el-icon>
              <span class="fs12 white ml10">新标签页</span>
            </div>
            <div class="close-tab f-c-c">
              <el-icon><Close /></el-icon>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="el-logo">
      <div class="logo"></div>
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
        <div class="icon-right">
          <span class="icon-item icon-mic"></span>
          <span class="icon-item icon-pic"></span>
        </div>
      </div>
    </div>

    <!-- 常用地址 -->
    <div class="menu-box f-c-c">
      <div class="menu-list f-c-c">
        <div
          v-for="(m, idx) in menus"
          :key="m.path"
          class="item f-c-c fs13"
          @click="m.enable ? handleSearch(m.path) : null"
        >
          <div class="item-icon f-c-c" :style="{ background: m.background }">
            <el-icon v-if="m.icon" size="20px" color="#fff">
              <Component :is="m.icon" />
            </el-icon>
            <img
              v-if="!m.icon"
              :src="`https://picsum.photos/20/20?random=${idx}`"
              alt=""
            />
          </div>
          <div class="item-url white fw600">{{ m.title }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts" name="Chrome">
import { ref } from "vue";
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

const menus = ref<{ [key: string]: string | any }[]>([
  {
    title: "添加快捷方式",
    icon: Plus,
    background: "#535e4f",
    path: "",
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
</script>

<style scoped lang="scss">
.chrome {
  --content-width: 40vw;
  background: rgba(42, 47, 40, 1);
  height: 100%;
  width: 100%;
  overflow: auto;
}
.bar {
  height: 45px;
  background: rgba(30, 33, 28, 1);
  .left {
    height: 100%;
  }
  .action {
    gap: 10px;
    span {
      width: 12px;
      height: 12px;
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
  .new-tab {
    position: relative;
    min-width: 220px;
    background: rgba(42, 47, 40, 1);
    height: calc(100% - 10px);
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
    &::after {
      content: "";
      position: absolute;
      top: 2px;
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
      top: 2px;
      left: -10px;
      height: 100%;
      width: 16px;
      background: inherit;
      clip-path: path("M 0,33 C 17,37 12,0 20,0 L 20, 56 Z");
    }
    .tab-item {
      width: 100%;
      border-radius: 10px;
    }
    .close-tab {
      width: 15px;
      height: 15px;
      border-radius: 50%;
      transition: all 0.2s;
      &:hover {
        background-color: rgba(255, 255, 255, 0.2);
      }
    }
  }
}
.el-logo {
  height: 168px;
  margin-bottom: 38px;
  display: flex;
  justify-content: center;
  align-items: flex-end;
  .logo {
    background: rgba(86, 98, 83, 1);
    width: 272px;
    height: 92px;
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
    display: flex;
    align-items: center;
    gap: 15px;
    .icon-item {
      cursor: pointer;
      display: inline-block;
      width: 24px;
      height: 24px;
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
    width: 112px;
    height: 112px;
    flex-direction: column;
    border-radius: 4px;
    overflow: hidden;
    &:hover {
      background-color: rgba(255, 255, 255, 0.1);
    }
  }
  .item-icon {
    cursor: pointer;
    width: 48px;
    height: 48px;
    border-radius: 50%;
    background-color: rgba(228, 226, 223, 1);
    margin-bottom: 6px;
  }
}
</style>
