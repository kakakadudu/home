<template>
  <div class="action f-c-s pr20">
    <span class="red" @click="handleAction"></span>
    <span class="orange"></span>
    <span class="green" @click="handleScreen"></span>
  </div>
</template>

<script setup lang="ts">
const emit = defineEmits(["action"]);
const handleAction = () => {
  emit("action");
};

const handleScreen = () => {
  console.log("handleScreen");
};
</script>

<style lang="scss" scoped>
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
</style>
