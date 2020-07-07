<template>
  <div>
    <transition name="slide-up">
      <div class="menu-wrapper" :class="{'hide-box-shadow': menuVisible || settingVisible >= 0}" v-show="menuVisible">
        <div class="icon-wrapper">
          <span class="icon-menu" @click="showSetting(3)"></span>
        </div>
        <div class="icon-wrapper">
          <span class="icon-progress" @click="showSetting(2)"></span>
        </div>
        <div class="icon-wrapper">
          <span class="icon-bright" @click="showSetting(1)"></span>
        </div>
        <div class="icon-wrapper">
          <span class="icon-A" @click="showSetting(0)"></span>
        </div>
      </div>
    </transition>
    <book-setting-font></book-setting-font>
    <book-setting-font-popup></book-setting-font-popup>
    <book-setting-theme></book-setting-theme>
    <book-setting-progress></book-setting-progress>
    <book-slide></book-slide>
  </div>
</template>

<script>
  import { bookMixin } from '../../utils/mixin'
  import BookSettingFont from './BookSettingFont.vue'
  import BookSettingFontPopup from './BookSettingFontPopup'
  import BookSettingTheme from './BookSettingTheme'
  import BookSettingProgress from './BookSettingProgress'
  import BookSlide from './BookSlide'

  export default {
    name: "BookMenu",
    mixins: [bookMixin],
    methods: {
      showSetting(key){
        this.setSettingVisible(key)
      }
    },
    components: {
      BookSettingFont,
      BookSettingFontPopup,
      BookSettingTheme,
      BookSettingProgress,
      BookSlide
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../assets/styles/global.scss";

  .menu-wrapper {
    position: absolute;
    bottom: 0;
    left: 0;
    z-index: 102;
    display: flex;
    width: 100%;
    height: px2rem(48);
    background: white;
    box-shadow: 0 px2rem(-8) px2rem(8) rgba(0, 0, 0, .15);
    font-size: px2rem(20);
    &.hide-box-shadow {
      box-shadow: none;
    }
    .icon-wrapper {
      flex: 1;
      @include center;
      .icon-progress {
        font-size: px2rem(28);
      }
      .icon-bright {
        font-size: px2rem(24);
      }
    }
  }
</style>
