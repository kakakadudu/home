<template>
  <div class="folder f-c-s">
    <div class="left-bar pt20 pb20 pl10 pr10">
      <Action @action="handleCloseFolder" />
      <div class="pt10">
        <span class="fs10">个人收藏</span>
        <div class="title-list pt10">
          <div class="list-item f-c-s active pl10 pr10 lh30">
            <el-icon><Monitor /></el-icon>
            <span class="fs13 white ml10">桌面</span>
          </div>
        </div>
      </div>
    </div>
    <div class="right-folder flex flex-column flex-1">
      <div class="folder-bar-top h50"></div>
      <div class="folder-list f-c-s flex-1">
        <div class="list-item flex-1" v-for="(item, idx) in 3" :key="idx"></div>
      </div>
      <div class="folder-bar-bottom h30"></div>
    </div>
  </div>
</template>

<script setup lang="ts" name="Folder">
import Action from "@/components/Action.vue";
import { Monitor } from "@element-plus/icons-vue";

const handleCloseFolder = () => {
  console.log("handleCloseFolder");
};
</script>

<style lang="scss" scoped>
.folder {
  position: absolute;
  inset: 0;
  width: 60%;
  height: 80%;
  border-radius: 10px;
  margin: auto;
  overflow: hidden;
  outline: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0px 0px 1px rgba(255, 255, 255, 0.5);

  .left-bar {
    height: 100%;
    width: 16%;
    min-width: 100px;
    backdrop-filter: blur(6px);
    background-color: rgba(255, 255, 255, 0.1);
    border-right: 1px solid #000;

    .list-item {
      border-radius: 5px;
      &.active {
        background-color: rgba(255, 255, 255, 0.1);
      }
    }
  }

  .right-folder {
    height: 100%;
    background: rgba(23, 25, 28, 1);
    .list-item {
      position: relative;
      height: 100%;
      border-right: 12px solid rgba(255, 255, 255, 0.1);
      &::after {
        position: absolute;
        content: "";
        width: 1px;
        height: 100%;
        background: rgba(255, 255, 255, 0.2);
        right: 0;
        top: 0;
        z-index: 1;
      }
    }
    .folder-bar-top {
      background-color: rgba(255, 255, 255, 0.1);
      border-bottom: 1px solid #000;
    }
    .folder-bar-bottom {
      border-top: 1px solid rgba(255, 255, 255, 0.1);
    }
  }
}
</style>
