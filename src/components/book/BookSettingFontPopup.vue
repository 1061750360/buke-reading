<template>
  <transition name="popup-slide-up">
    <div class="book-popup-list" v-show="fontFamilyVisible">
      <div class="book-popup-title">
        <div class="book-popup-title-icon" @click="hide">
          <span class="icon-down2"></span>
        </div>
        <span class="book-popup-title-text">{{$t('book.selectFont')}}</span>
      </div>
      <div class="book-popup-list-wrapper">
        <div class="book-popup-item" v-for="(item, index) in fontFamilyList" :key="index" @click="setFontFamily(item.font)">
          <div class="book-popup-item-text" :class="{'selected': isSelected(item)}">{{item.font}}</div>
          <div class="book-popup-item-check" v-if="isSelected(item)">
            <span class="icon-check"></span>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
  import { bookMixin } from '../../utils/mixin'
  import { FONT_FAMILY } from '../../utils/book'
  import { saveFontFamily } from '../../utils/localStorage'

  export default {
    name: "BookSettingFontPopup",
    mixins: [bookMixin],
    data() {
      return {
        fontFamilyList: FONT_FAMILY
      }
    },
    methods: {
      hide() {
        this.setFontFamilyVisible(false)
      },
      isSelected(item) {
        return this.defaultFontFamily === item.font
      },
      setFontFamily(font) {
        this.setDefaultFontFamily(font)
        saveFontFamily(this.fileName, font)
        if (font === "Default") {
          this.currentBook.rendition.themes.font("Times New Roman")
        } else {
          this.currentBook.rendition.themes.font(font)
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../assets/styles/global.scss";

  .book-popup-list{
    position: absolute;
    bottom: 0;
    left: 0;
    z-index: 300;
    width: 100%;
    -webkit-box-shadow: 0 px2rem(-4) px2rem(6) rgba(0, 0, 0, .1);
    -moz-box-shadow: 0 px2rem(-4) px2rem(6) rgba(0, 0, 0, .1);
    box-shadow: 0 px2rem(-4) px2rem(6) rgba(0, 0, 0, .1);
    background-color: white;
    .book-popup-title{
      position: relative;
      padding: px2rem(15);
      -webkit-box-sizing: border-box;
      -moz-box-sizing: border-box;
      box-sizing: border-box;
      border-bottom: px2rem(1) solid #b8b9bb;
      text-align: center;
      @include center;
      .book-popup-title-icon{
        position: absolute;
        left: px2rem(15);
        top: 0;
        height: 100%;
        font-size: px2rem(16);
        font-weight: bold;
        @include center;
      }
      .book-popup-title-text{
        font-size: px2rem(14);
        font-weight: bold;
      }
    }
    .book-popup-list-wrapper{
      .book-popup-item{
        display: flex;
        padding: px2rem(15);
        .book-popup-item-text{
          flex: 1;
          font-size: px2rem(14);
          text-align: left;
          &.selected {
            color: #346cb9;
            font-weight: bold;
          }
        }
        .book-popup-item-check{
          flex: 1;
          font-size: px2rem(14);
          text-align: right;
          font-weight: bold;
          color: #346cb9;
        }
      }
    }
  }
</style>
