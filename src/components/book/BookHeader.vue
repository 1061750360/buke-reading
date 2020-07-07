<template>
  <div class="book-header">
    <span class="book-header-text">{{getSectionName}}</span>
  </div>
</template>

<script>
  import { bookMixin } from '../../utils/mixin'

  export default {
    name: "BookHeader",
    mixins: [bookMixin]
  }
</script>

<style lang="scss" scoped>
  @import "../../assets/styles/global.scss";

  .book-header {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 100;
    width: 100%;
    height: px2rem(40);
    padding: 0 px2rem(15);
    box-sizing: border-box;
    overflow: hidden;
    @include left;
    .book-header-text {
      font-size: px2rem(12);
      color: #6d7178;
    }
  }
</style>
