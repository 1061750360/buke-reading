<template>
  <div class="book-footer">
    <span class="book-footer-text">{{this.progress + '%'}}</span>
  </div>
</template>

<script>
  import { bookMixin } from '../../utils/mixin'

  export default {
    name: "BookFooter",
    mixins: [bookMixin]
  }
</script>

<style lang="scss" scoped>
  @import "../../assets/styles/global.scss";

  .book-footer {
    position: absolute;
    bottom: 0;
    left: 0;
    z-index: 100;
    width: 100%;
    height: px2rem(40);
    padding: 0 px2rem(15);
    box-sizing: border-box;
    @include right;
    .book-footer-text {
      font-size: px2rem(12);
      color: #6d7178;
    }
  }
</style>
