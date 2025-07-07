<template>
  <div class="action gap10 f-c-s pr20">
    <span class="red w12 h12" @click="handleAction"></span>
    <span class="orange w12 h12"></span>
    <span class="green w12 h12" @click="handleScreen"></span>
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
  span {
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
