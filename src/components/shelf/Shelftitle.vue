<template>
  <transition name="fade">
    <div class="shelf-title" v-show="shelfTitleVisible">
      <div class="shelf-title-text-wrapper">
        <span class="shelf-title-text">{{$t('shelf.title')}}</span>
        <span class="shelf-title-sub-text" v-show="isEditMode">{{selectedText}}</span>
      </div>
      <div class="shelf-title-btn-wrapper shelf-title-left">
        <div class="shelf-title-btn-text" @click="back">{{$t('shelf.home')}}</div>
      </div>
      <div class="shelf-title-btn-wrapper shelf-title-right">
        <div class="shelf-title-btn-text" @click="onEdit">{{ isEditMode ? $t('shelf.cancel') : $t('shelf.edit')}}</div>
      </div>
    </div>
  </transition>
</template>

<script>
  import { storeShelfMixin } from '../../utils/mixin'

  export default {
    name: "Shelftitle",
    mixins: [storeShelfMixin],
    methods: {
      onEdit () {
        this.setIsEditMode(!this.isEditMode)
      },
      back () {
        this.$router.push("/store/home")
      }
    },
    computed: {
      selectedText() {
        const selectedNumber = this.shelfSelectedList.length
        return selectedNumber === 0 ? this.$t('shelf.selectBook') : selectedNumber === 1 ? this.$t('shelf.haveSelectedBook').replace('$1', selectedNumber) : this.$t('shelf.haveSelectedBooks').replace('$1', selectedNumber)
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../assets/styles/global.scss";

  .shelf-title {
    position: relative;
    width: 100%;
    height: px2rem(42);
    background: #fff;
    .shelf-title-text-wrapper {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: px2rem(42);
      @include columnCenter;
      .shelf-title-text {
        font-size: px2rem(16);
        line-height: px2rem(20);
        font-weight: bold;
        color: #333;
      }
      .shelf-title-sub-text {
        font-size: px2rem(10);
        color: #333;
      }
    }
    .shelf-title-btn-wrapper {
      position: absolute;
      top: 0;
      height: 100%;
      -webkit-box-sizing: border-box;
      -moz-box-sizing: border-box;
      box-sizing: border-box;
      @include center;
      .shelf-title-btn-text {
        font-size: px2rem(14);
        color: #666;
      }
      &.shelf-title-left {
        left: 0;
        padding-left: px2rem(15);
      }
      &.shelf-title-right {
        right: 0;
        padding-right: px2rem(15);

      }
    }
  }
</style>
