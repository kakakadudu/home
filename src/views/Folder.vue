<template>
  <div class="folder f-c-s br10">
    <div class="left-bar pt20 pb20 pl10 pr10">
      <Action @action="handleCloseFolder" />
      <div class="pt10">
        <span class="fs10">个人收藏</span>
        <div class="title-list pt10">
          <div class="list-item br5 f-c-s active pl10 pr10 lh30">
            <el-icon><Monitor /></el-icon>
            <span class="fs13 white ml10">桌面</span>
          </div>
        </div>
      </div>
    </div>
    <div class="right-folder flex flex-column flex-1">
      <div class="folder-bar-top h50"></div>
      <div class="folder-list f-c-s flex-1">
        <div class="list-item pt5 pb5 pl10 pr10 flex-1">
          <div class="item-folder f-c-s pt2 pb2 pl5 pr5 br5 hover">
            <img class="w18 h18" src="@/assets/images/folder.png" alt="" />
            <span class="fs12 white fw600 ml5">测试</span>
          </div>
        </div>
        <div class="list-item pt5 pb5 pl10 pr10 flex-1">
          <div class="item-folder f-c-s pt2 pb2 pl5 pr5 br5 active">
            <img class="w18 h18" src="@/assets/images/pdf.png" alt="" />
            <span class="fs12 white fw600 ml5">测试</span>
          </div>
        </div>
        <div class="hide list-item pt5 pb5 pl10 pr10 flex-1">
          <div class="file-preview br10 mt10 mb10">
            <span class="f-c-s pl20 pr20 pt10">---</span>
          </div>
          <div class="fs14 white fw500">测试.pdf</div>
          <div class="fs12">Adobe PDF (.pdf) - 1234.KB</div>
        </div>
      </div>
      <div class="folder-bar-bottom h30"></div>
    </div>
  </div>
</template>

<script setup lang="ts" name="Folder">
import { ref, onMounted } from "vue";
import Action from "@/components/Action.vue";
import { Monitor } from "@element-plus/icons-vue";

const emit = defineEmits(["close"]);
const handleCloseFolder = () => {
  emit("close");
};

onMounted(() => {
  console.log("onMounted");
});
</script>

<style lang="scss" scoped>
.folder {
  position: absolute;
  inset: 0;
  width: 60%;
  height: 80%;
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
    border-top-left-radius: 10px;
    border-bottom-left-radius: 10px;

    .list-item {
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
      .item-folder {
        &.hover {
          background-color: rgba(255, 255, 255, 0.1);
        }
        &.active {
          background-color: rgba(55, 132, 32, 1);
        }
      }
      .file-preview {
        background: #fff;
        width: 80%;
        height: 40%;
        margin: auto;
        color: gray;
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

@media screen and (max-width: 768px) {
  .folder {
    width: 100%;
    height: 100%;
  }
}
</style>
