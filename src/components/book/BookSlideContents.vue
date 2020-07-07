<template>
  <div class="book-slide-contents">
    <div class="slide-contents-search-wrapper">
      <div class="slide-contents-search-input-wrapper">
        <div class="slide-contents-search-icon">
          <span class="icon-search"></span>
        </div>
        <input class="slide-contents-search-input" type="text" v-model="searchText" @keyup.enter.exact="search" :placeholder="$t('book.searchHint')" @click="showSearchPahe">
      </div>
      <div class="slide-contents-search-cancel" v-show="searchVisible" @click="hideSearchpage">{{$t('book.cancel')}}</div>
    </div>
    <div class="slide-contents-book-wrapper" v-show="!searchVisible">
      <div class="slide-contents-book-img-wrapper">
        <img :src="cover" class="slide-contents-book-img">
      </div>
      <div class="slide-contents-book-info-wrapper">
        <div class="slide-contents-title">{{metadata.title}}</div>
        <div class="slide-contents-author">{{metadata.creator}}</div>
      </div>
      <div class="slide-contents-book-progress-wrapper">
        <div class="slide-contents-book-progress">
          <span class="progress">{{progress + '%'}}</span>
          <span class="progress-text">{{$t('book.haveRead2')}}</span>
        </div>
        <div class="slide-contents-book-time">{{getReadTimeText()}}</div>
      </div>
    </div>
    <scroll class="slide-contents-list" ref="scroll" v-show="!searchVisible">
      <div class="scroll-wrapper">
        <div class="slide-contents-item" v-for="(item, index) in navigation" :key="index">
          <span class="slide-contents-item-label" :style="contentItemStyle(item)" :class="{'selected' : item.href.includes(href) && (item.level === 0 || item.level === 1) }" @click="displayTarget(item.href)">{{item.label}}</span>
        </div>
      </div>
    </scroll>
    <scroll class="slide-search-list" v-show="searchVisible">
      <div class="scroll-wrapper">
        <div class="slide-search-item" v-for="(item, index) in searchList" :key="index" v-html="item.excerpt" @click="displayTarget(item.cfi, true)"></div>
      </div>
    </scroll>
  </div>
</template>

<script>
  import { bookMixin } from '../../utils/mixin'
  import Scroll from '../common/Scroll'
  import { px2rem } from '../../utils/utils'

  export default {
    name: "BookSlideContents",
    mixins: [bookMixin],
    data() {
      return {
        searchVisible: false,
        searchText: '',
        searchList: []
      }
    },
    methods: {
      displaySearch(target) {
        this.display(target, () => {
          this.hideTitleAndMenu()
        })
      },
      search() {
        this.searchText = this.searchText.trim()
        if (this.searchText) {
          this.doSearch(this.searchText).then((list) => {
            if (list.length === 0) {
              this.searchList = [{ excerpt: "未搜索到相关信息" }]
            } else {
              this.searchList = list
              // 将关键词替换成一个自定义标签，好为其添加高亮样式
              this.searchList.map(item => {
                item.excerpt = item.excerpt.replace(this.searchText, `<span class="content-search-text">${this.searchText}</span>`)
                return item
              })
            }
          })
        }
      },
      doSearch(q) {
        // 官网提供的全文检索方法
        return Promise.all(this.currentBook.spine.spineItems.map(section => section.load(this.currentBook.load.bind(this.currentBook))
          .then(section.find.bind(section, q)) // 在每个section中搜索关键词
          .finally(section.unload.bind(section)))) // 释放section的内存空间
          .then(results => Promise.resolve([].concat.apply([], results)))
      },
      displayTarget(target, highlight = false) {
        // 选择某个章节时，跳转到该章节并隐藏标题栏和菜单栏
        this.display(target, () => {
          this.hideTitleAndMenu()
          if (highlight) {
            this.currentBook.rendition.annotations.highlight(target)
          }
        })
      },
      showSearchPahe() {
        this.searchVisible = true
      },
      hideSearchpage() {
        this.searchVisible = false
        this.searchText = ''
        this.searchList = []
      },
      contentItemStyle(item) {
        return {
          marginLeft: `${px2rem(item.level * 15)}rem`
        }
      }
    },
    components: {
      Scroll
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../assets/styles/global.scss";

  .book-slide-contents {
    position: relative;
    height: 100%;
    width: 100%;
    font-size: 0;
    display: flex;
    flex-direction: column;
    .slide-contents-search-wrapper {
      display: flex;
      width: 100%;
      height: px2rem(36);
      margin: px2rem(20) 0 px2rem(10) 0;
      padding: 0 px2rem(15);
      -webkit-box-sizing: border-box;
      -moz-box-sizing: border-box;
      box-sizing: border-box;
      .slide-contents-search-input-wrapper {
        flex: 1;
        @include center;
        .slide-contents-search-icon {
          flex: 0 0 px2rem(28);
          font-size: px2rem(12);
          @include center;
        }
        .slide-contents-search-input {
          flex: 1;
          width: 100%;
          height: px2rem(32);
          font-size: px2rem(14);
          background: transparent;
          border: none;
          &:focus {
            outline: none;
          }
        }
      }
      .slide-contents-search-cancel {
        flex: 0 0 px2rem(50);
        font-size: px2rem(14);
        @include right;
      }
    }
    .slide-contents-book-wrapper {
      display: flex;
      width: 100%;
      height: px2rem(90);
      padding: px2rem(10) px2rem(15) px2rem(20) px2rem(15);
      -webkit-box-sizing: border-box;
      -moz-box-sizing: border-box;
      box-sizing: border-box;
      .slide-contents-book-img-wrapper {
        flex: 0 0 px2rem(45);
        .slide-contents-book-img {
          width: px2rem(45);
          height: px2rem(60);
        }
      }
      .slide-contents-book-info-wrapper {
        flex: 1;
        padding: 0 px2rem(10);
        .slide-contents-title {
          font-size: px2rem(14);
          line-height: px2rem(16);
          display: -webkit-box;
          -webkit-box-orient: vertical;
          @include ellipsis2(2);
        }
        .slide-contents-author {
          margin-top: px2rem(5);
          font-size: px2rem(12);
          @include ellipsis;
        }
      }
      .slide-contents-book-progress-wrapper {
        flex: 0 0 px2rem(100);
        .slide-contents-book-progress {
          .progress {
            font-size: px2rem(14);
          }
          .progress-text {
            font-size: px2rem(12);
          }
        }
        .slide-contents-book-time {
          margin-top: px2rem(5);
          font-size: px2rem(12);
        }
      }
    }
    .slide-contents-list {
      flex: 1;
      padding: 0 px2rem(15);
      -webkit-box-sizing: border-box;
      -moz-box-sizing: border-box;
      box-sizing: border-box;
      .scroll-wrapper {
        .slide-contents-item {
          display: flex;
          padding: px2rem(20) 0;
          -webkit-box-sizing: border-box;
          -moz-box-sizing: border-box;
          box-sizing: border-box;
          .slide-contents-item-label {
            flex: 1;
            font-size: px2rem(14);
            line-height: px2rem(16);
            @include ellipsis;
          }
        }
      }
    }
    .slide-search-list {
      flex: 1;
      padding: 0 px2rem(15);
      -webkit-box-sizing: border-box;
      -moz-box-sizing: border-box;
      box-sizing: border-box;
      .scroll-wrapper{
        .slide-search-item{
          font-size: px2rem(14);
          line-height: px2rem(16);
          padding: px2rem(20) 0;
          -webkit-box-sizing: border-box;
          -moz-box-sizing: border-box;
          box-sizing: border-box;
        }
      }
    }
  }
</style>
