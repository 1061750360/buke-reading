<template>
  <div class="book-slide-bookmark">
    <div class="slide-book-bookmark-title">{{$t('book.bookmark')}} · {{bookmark ? bookmark.length : 0}}</div>
    <scroll :data="bookmark" class="scroll">
      <div class="items-wrapper">
        <div class="slide-bookmark-item" v-for="(item, index) in bookmark" :key="index" @click="displayBookmark(item.cfi)">
          <div class="slide-bookmark-icon">
            <div class="icon-bookmark"></div>
          </div>
          <div class="slide-bookmark-item-text" v-html="item.text"></div>
        </div>
      </div>
    </scroll>
  </div>
</template>

<script>
  import { bookMixin } from '../../utils/mixin'
  import Scroll from '../common/Scroll'
  import { getBookmark } from '../../utils/localStorage'

  export default {
    name: "BookSlideBookmark",
    mixins: [bookMixin],
    methods: {
      displayBookmark(target) {
        this.display(target, () => {
          this.hideTitleAndMenu()
        })
      }
    },
    created() {
      this.setBookmark(getBookmark(this.fileName))
    },
    components: {
      Scroll
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../assets/styles/global.scss";

  .book-slide-bookmark {
    height: 100%;
    padding: px2rem(15);
    .slide-book-bookmark-title {
      font-size: px2rem(24);
      font-weight: bold;
      padding: px2rem(20) 0;
    }
    .scroll {
      .items-wrapper {
        .slide-bookmark-item {
          display: flex;
          padding: px2rem(20) 0;
          height: px2rem(80);
          .slide-bookmark-icon {
            flex: 2;
            font-size: px2rem(24);
            @include center;
          }
          .slide-bookmark-item-text {
            flex: 8;
            font-size: px2rem(14);
            line-height: px2rem(20);
            @include ellipsis2(4);
            padding: px2rem(2);
          }
        }
      }
    }
  }
</style>
