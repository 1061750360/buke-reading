<template>
  <div class="bookmark-page" ref="bookmark">
    <div class="bookmark-text-wrapper">
      <div class="bookmark-down-wrapper" ref="iconDown">
        <span class="icon-down"></span>
      </div>
      <div class="bookmark-text">{{text}}</div>
    </div>
    <div class="bookmark-icon-wrapper" :style="isBookmarkFixed ? BookmarkFixedStyle : {}">
      <bookmark-icon :color="color"></bookmark-icon>
    </div>
  </div>
</template>

<script>
  import BookmarkIcon from './BookmarkIcon'
  import { px2rem, realPx } from '../../utils/utils'
  import { bookMixin } from '../../utils/mixin'
  import { saveBookmark } from '../../utils/localStorage'

  const BLUE = '#346cbc'
  const WHITE = '#fff'

  export default {
    name: "BookmarkPage",
    mixins: [bookMixin],
    data() {
      return {
        text: this.$t('book.pulldownAddMark'),
        color: WHITE,
        isBookmarkFixed: false,
        flag: false
      }
    },
    methods: {
      beforeEnter() {
        // 判断当前页是否书签页
        if (this.isBookmark) {
          this.text = this.$t('book.pulldownDeleteMark')
          this.color = BLUE
        } else {
          this.text = this.$t('book.pulldownAddMark')
          this.color = WHITE
        }
      },
      beforeThreshold() {
        this.$refs.bookmark.style.position = 'fixed'
        this.$refs.bookmark.style.top = 0
        const iconDown = this.$refs.iconDown
        if (iconDown.style.transform === 'rotate(180deg)') {
          iconDown.style.transform = ''
        }
      },
      afterThreshold() {
        const iconDown = this.$refs.iconDown
        // 判断当前页是否书签页,是则将 this.isBookmarkFixed = false，表示删除书签，否则代表添加书签
        if (this.isBookmark) {
          this.text = this.$t('book.releaseDeleteMark')
          this.color = WHITE
          this.isBookmarkFixed = false
        } else {
          this.text = this.$t('book.releaseAddMark')
          this.color = BLUE
          this.isBookmarkFixed = true
        }
        if (iconDown.style.transform === '') {
          iconDown.style.transform = 'rotate(180deg)'
        }
      },
      restore() {
        if (this.isBookmarkFixed) {
          this.setIsBookmark(true)
          this.addBookmark()
        } else {
          this.setIsBookmark(false)
          this.removeBookmark()
        }
      },
      addBookmark() {
        // 首先判断是否已有书签，没有则给个空列表
        // 获取到当前的位置cfi和文本内容
        const currentLocation = this.currentBook.rendition.currentLocation()
        const cfibase = currentLocation.start.cfi.replace(/!.*/, '')
        const cfistart = currentLocation.start.cfi.replace(/.*!/, '').replace(/\)$/, '')
        const cfiend = currentLocation.end.cfi.replace(/.*!/, '')
        const cfiRange = `${cfibase}!${cfistart},${cfiend}`
        this.currentBook.getRange(cfiRange).then((range) => {
          const text = range.commonAncestorContainer.wholeText.replace(/\s\s/g, '')
          // 创建一个bookmark的副本，因为在外面不能直接修改state中的值
          let bookmark2 = []
          if (this.bookmark && this.bookmark.length > 0) {
            bookmark2 = this.bookmark
          }
          // 将书签添加到书签列表中
          bookmark2.push({
            cfi: currentLocation.start.cfi,
            text: text
          })
          this.setBookmark(bookmark2)
          saveBookmark(this.fileName, this.bookmark)
        })
      },
      removeBookmark() {
        const currentLocation = this.currentBook.rendition.currentLocation()
        const cfi = currentLocation.start.cfi
        if (this.bookmark && this.bookmark.length > 0) {
          const bookmark = this.bookmark.filter(item => item.cfi !== cfi)
          this.setBookmark(bookmark)
          saveBookmark(this.fileName, bookmark)
          this.setIsBookmark(false)
        }
      }
    },
    computed: {
      height() {
        return realPx(45)
      },
      threshold() {
        return realPx(50)
      },
      BookmarkFixedStyle() {
        return {
          position: 'fixed',
          top: 0
        }
      }
    },
    watch: {
      offsetY(newVal) {
        if (newVal > 0 && newVal < this.height) {
          // 开始下拉
          this.beforeEnter()
        } else if (newVal >= this.height && newVal < this.threshold) {
          // 进入临界条件前
          this.beforeThreshold()
        } else if (newVal >= this.threshold) {
          // 进入临界条件后
          this.afterThreshold()
          this.flag = true
        } else if (newVal === 0) {
          if (this.flag) {
            this.flag = false
            this.restore()
          }
          // 恢复被修改的内容
          setTimeout(() => {
            this.$refs.bookmark.style.position = 'absolute'
            this.$refs.bookmark.style.top = `${px2rem(-45)}rem`
            this.$refs.iconDown.style.transform = ''
          }, 200)
        }
      },
      isBookmark(newVal) {
        this.isBookmarkFixed = newVal
        if (newVal) {
          this.color = BLUE
        } else {
          this.color = WHITE
        }
      }
    },
    components: {
      BookmarkIcon
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../assets/styles/global.scss";

  .bookmark-page {
    position: absolute;
    top: px2rem(-45);
    left: 0;
    width: 100%;
    height: px2rem(45);
    z-index: 100;
    .bookmark-text-wrapper {
      position: absolute;
      right: px2rem(60);
      bottom: 0;
      display: flex;
      .bookmark-down-wrapper {
        color: #fff;
        -webkit-transition: all .2s linear;
        -moz-transition: all .2s linear;
        -ms-transition: all .2s linear;
        -o-transition: all .2s linear;
        transition: all .2s linear;
      }
      .bookmark-text {
        font-size: px2rem(14);
        color: #fff;
        @include center;
      }
    }
    .bookmark-icon-wrapper {
      position: absolute;
      right: 0;
      bottom: 0;
      margin-right: px2rem(15);
    }
  }
</style>
