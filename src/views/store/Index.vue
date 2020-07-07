<template>
  <div class="store">
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
  </div>
</template>

<script>
  export default {
    name: "Index"
  }
</script>

<style lang="scss" scoped>
  .store {
    width: 100%;
    height: 100%;
    background: #fff;
  }
</style>
