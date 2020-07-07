<template>
  <transition name="slide-up">
    <div class="setting-wrapper" v-show="showFlag">
      <div class="setting-progress">
        <div class="read-time-wrapper">
          <span class="read-time-text">{{readTimeText}}</span>
          <span class="icon-forward"></span>
        </div>
        <div class="progress-wrapper">
          <div class="progress-icon-wrapper" @click="prevSection">
            <span class="icon-back"></span>
          </div>
          <input class="progress" type="range"
                 max="100"
                 min="0"
                 step="1"
                 @change="onProgressChange($event.target.value)" @input="onProgressInput($event.target.value)"
                 :value="progress"
                 :disabled="!bookAvailable"
                 ref="progress">
          <div class="progress-icon-wrapper" @click="nextSection">
            <span class="icon-forward"></span>
          </div>
        </div>
        <div class="text-wrapper">
          <span class="progress-section-text">{{getSectionName}}</span>
          <span>({{bookAvailable ? progress + '%' : '加载中...'}})</span>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
  import { bookMixin } from '../../utils/mixin'

  export default {
    name: "BookSettingProgress",
    mixins: [bookMixin],
    data() {
      return {
        readTimeText: ''
      }
    },
    watch: {
      progress(newVal) {
        // 修改进度条圆点左侧的背景颜色
        this.$refs.progress.style.backgroundSize = `${newVal}% 100%`
      },
      showFlag(newVal) {
        if (newVal) {
          this.readTimeText = this.getReadTimeText()
        }
      }
    },
    methods: {
      onProgressChange(progress) {
        this.setProgress(progress).then(() => {
          this.displayProgress()
        })
      },
      onProgressInput(progress) {
        this.setProgress(progress)
      },
      displayProgress() {
        // 获得当前进度条的 cfi，并渲染当前 cfi 的内容
        const cfi = this.currentBook.locations.cfiFromPercentage(this.progress / 100)
        this.display(cfi)
      },
      prevSection() {
        // 上一章
        if (this.section > 0 && this.bookAvailable) {
          this.setSection(this.section - 1).then(() => {
            // 如果存在章节信息，则展示该章节
            this.displaySection()
          })
        }
      },
      nextSection() {
        // 下一章
        if (this.section < this.currentBook.spine.length - 1 && this.bookAvailable) {
          this.setSection(this.section + 1).then(() => {
            // 如果存在章节信息，则展示该章节
            this.displaySection()
          })
        }
      },
      displaySection() {
        // 如果存在章节信息，则展示该章节
        const sectionInfo = this.currentBook.section(this.section)
        if (sectionInfo && sectionInfo.href) {
          this.display(sectionInfo.href)
        }
      }
    },
    computed: {
      showFlag() {
        return Boolean(this.menuVisible && this.settingVisible === 2)
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../assets/styles/global.scss";

  .setting-wrapper {
    position: absolute;
    bottom: px2rem(48);
    left: 0;
    z-index: 101;
    width: 100%;
    height: px2rem(90);
    background: white;
    box-shadow: 0 px2rem(-8) px2rem(8) rgba(0, 0, 0, .15);
    .setting-progress {
      position: relative;
      width: 100%;
      height: 100%;
      .read-time-wrapper {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: px2rem(40);
        font-size: px2rem(12);
        @include center;
      }
      .progress-wrapper {
        width: 100%;
        height: 100%;
        @include center;
        padding: 0 px2rem(15);
        box-sizing: border-box;
        .progress-icon-wrapper {
          font-size: px2rem(20);
        }
        .progress {
          width: 100%;
          -webkit-appearance: none;
          height: px2rem(2);
          margin: 0 px2rem(10);
          &:focus {
            outline: none;
          }
          &::-webkit-slider-thumb {
            -webkit-appearance: none;
            height: px2rem(20);
            width: px2rem(20);
            border-radius: 50%;
            background: white;
            box-shadow: 0 4px 4px 0 rgba(0, 0, 0, .15);
            border: px2rem(1) solid #ddd;
          }
        }
      }
      .text-wrapper {
        position: absolute;
        left: 0;
        bottom: px2rem(10);
        width: 100%;
        color: #333;
        font-size: px2rem(12);
        padding: 0 px2rem(15);
        -webkit-box-sizing: border-box;
        -moz-box-sizing: border-box;
        box-sizing: border-box;
        @include center;
        .progress-section-text {
          @include ellipsis;
        }
      }
    }
  }
</style>
