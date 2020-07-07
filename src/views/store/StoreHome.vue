<template>
  <keep-alive>
    <div class="home">
      <search-bar></search-bar>
      <flap-card :randomBookList="randomBookList"></flap-card>
      <scroll class="scroll-wrapper" :probe-type="probeType" :listen-scroll="listenScroll" @scroll="scroll" ref="scroll">
        <div class="scroll-content" ref="scrollCotent">
          <div class="banner-wrapper">
            <img :src="banner" alt="">
          </div>
          <guess-you-like :data="guessYouLike"></guess-you-like>
          <recommend :data="recommend" class="recommend"></recommend>
          <featured :data="featuredList" :title-text="$t('home.featured')" :btn-text="$t('home.change')" class="featured" @change="change"></featured>
          <div class="category-list-wrapper" v-for="(item, index) in categoryList" :key="index">
            <category-book :data="item"></category-book>
          </div>
          <category class="category" :data="categories"></category>
        </div>
      </scroll>
    </div>
  </keep-alive>
</template>

<script>
  import SearchBar from '../../components/home/SearchBar'
  import Scroll from '../../components/common/Scroll'
  import FlapCard from '../../components/home/FlapCard'
  import { storeHomeMixin } from '../../utils/mixin'
  import { px2rem } from '../../utils/utils'
  import { homeApi } from '../../api/store'
  import GuessYouLike from '../../components/home/GuessYouLike'
  import Recommend from '../../components/home/Recommend'
  import Featured from '../../components/home/Featured'
  import CategoryBook from '../../components/home/CategoryBook'
  import Category from '../../components/home/Category'
  import { mapGetters, mapActions } from 'vuex'

  export default {
    name: "StoreHome",
    mixins: [storeHomeMixin],
    data() {
      return {
        listenScroll: true,
        probeType: 3,
        randomBookList: null,
        banner: '',
        guessYouLike: null,
        recommend: null,
        featured: null,
        featuredList: [],
        featuredFlag: false,
        categoryList: [],
        categories: null
      }
    },
    methods: {
      ...mapActions(['setScrollY']),
      scroll(pos) {
        this.setOffsetY(pos.y)
      },
      change() {
        this.featuredList = this.featuredFlag ? this.featured.slice(0, 4) : this.featured.slice(4, 8)
       this.featuredFlag = !this.featuredFlag
      }
    },
    computed: {
      ...mapGetters(['scrollY'])
    },
    watch: {
      offsetY(newVal) {
        if (newVal < 0) {
          this.$refs.scroll.$el.style.top = `${px2rem(52)}rem`
        } else {
          this.$refs.scroll.$el.style.top = `${px2rem(94)}rem`
        }
        setTimeout(() => {
          this.$refs.scroll.refresh()
        }, 20)
      }
    },
    created() {
      homeApi().then((res) => {
        if (res && res.status === 200) {
          const data = res.data
          this.randomBookList = data.random
          this.banner = data.banner
          this.guessYouLike = data.guessYouLike
          this.recommend = data.recommend
          this.featured = data.featured
          this.featuredList = this.featured.slice(0, 4)
          this.categoryList = data.categoryList
          this.categories = data.categories
        }
      })
    },
    activated() {
      // 每次进入该页面时刷新scroll，避免出现无法滚动的情况
      this.$refs.scroll.refresh()
      // 恢复到之前的滚动位置
      this.$refs.scroll.scrollTo(0, this.scrollY)
    },
    beforeRouteLeave(to, from, next) {
      this.setScrollY(this.offsetY) // 离开路由时把位置存起来
      next()
    },
    components: {
      Category,
      CategoryBook,
      Featured,
      Recommend,
      GuessYouLike,
      SearchBar,
      Scroll,
      FlapCard
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../assets/styles/global.scss";

  .home {
    position: relative;
    width: 100%;
    height: 100%;
    .scroll-wrapper {
      position: absolute;
      top: px2rem(94);
      left: 0;
      bottom: 0;
      right: 0;
      z-index: 100;
      -webkit-transition: all $animationTime $animationType;
      -moz-transition: all $animationTime $animationType;
      -ms-transition: all $animationTime $animationType;
      -o-transition: all $animationTime $animationType;
      transition: all $animationTime $animationType;
      .scroll-content {
        .banner-wrapper {
          width: 100%;
          padding: px2rem(10);
          -webkit-box-sizing: border-box;
          -moz-box-sizing: border-box;
          box-sizing: border-box;
          img {
            width: 100%;
            height: px2rem(140);
          }
        }
        .recommend {
          margin-top: px2rem(20);
        }
        .featured {
          margin-top: px2rem(20);
        }
        .category-list-wrapper {
          margin-top: px2rem(20);
        }
      }
    }
  }
</style>
