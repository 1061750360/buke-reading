<template>
  <div>
    <div class="search-bar" :class="{'hide-title': !titleVisible, 'hide-shadow': shadowVisible}">
      <transition name="title-move">
        <div class="search-bar-title-wrapper" v-show="titleVisible">
          <div class="title-text-wrapper">
            <span class="title-text title">{{$t('home.title')}}</span>
          </div>
          <div class="title-icon-shake-wrapper" @click="showFlagCard">
            <span class="icon-shake icon"></span>
          </div>
        </div>
      </transition>
      <div class="title-icon-back-wrapper" :class="{'hide-title': !titleVisible}" @click="back">
        <span class="icon-back icon"></span>
      </div>
      <div class="search-bar-input-wrapper" :class="{'hide-title': !titleVisible}">
        <div class="search-bar-blank" :class="{'hide-title': !titleVisible}"></div>
        <div class="search-bar-input">
          <span class="icon-search icon"></span>
          <input type="text" class="input" :placeholder="$t('home.hint')" v-model="searchText" @click="showHotSearch" @keyup.enter.exact="search">
        </div>
        <div class="lanIcon icomoon" v-show="titleVisible" :class="lanIcon" @click="toggleLan"></div>
      </div>
    </div>
    <hot-search-list v-show="hotSearchVisible" ref="hotSearchList"></hot-search-list>
  </div>
</template>

<script>
  import { storeHomeMixin } from '../../utils/mixin'
  import HotSearchList from './HotSearchList'
  import { getLocale, getLocalStorage, saveLocale, setLocalStorage } from '../../utils/localStorage'

  export default {
    name: "SearchBar",
    mixins: [storeHomeMixin],
    data() {
      return {
        searchText: '',
        titleVisible: true,
        shadowVisible: false,
        hotSearchVisible: false,
        lanIcon: "icon-cn"
      }
    },
    methods: {
      toggleLan () {
        // 切换语言图标
        if (this.lanIcon === "icon-cn") {
          this.lanIcon = "icon-en"
          saveLocale('en')
          this.$i18n.locale = "en"
        } else {
          this.lanIcon = "icon-cn"
          saveLocale('cn')
          this.$i18n.locale = "cn"
        }
      },
      search() {
        // 进入搜索页面
        this.$router.push({
          path: '/store/list',
          query: {
            keyword: this.searchText
          }
        })
        // 保存搜索历史到localstorage，并清空搜索栏
        let searchHistory = getLocalStorage("_search")
        if (searchHistory) {
          const res = JSON.parse(searchHistory)
          const index = res.indexOf(this.searchText)
          if (index === -1) {
            res.push(this.searchText)
            setLocalStorage('_search', JSON.stringify(res))
          }
        } else {
          searchHistory = [this.searchText]
          setLocalStorage('_search', JSON.stringify(searchHistory))
        }
        this.searchText = ""
      },
      showFlagCard() {
        this.setFlapCardVisible(true)
      },
      back() {
        this.showTitle()
        if (this.hotSearchVisible) {
          this.hideHotSearch()
        } else {
          this.$router.push('/store/shelf')
        }
      },
      hideHotSearch() {
        this.hotSearchVisible = false
        if (this.offsetY < 0) {
          this.hideTitle()
          this.showShadow()
        } else {
          this.showTitle()
          this.hideShadow()
        }
      },
      showHotSearch() {
        if (this.hotSearchOffsetY < 0) {
          this.showShadow()
        } else {
          this.hideShadow()
        }
        this.$nextTick(() => {
          // 每次进入hotSearchList都将页面滚动到最顶部，也就是第一次进入时的样子
          // 如果不生效，可以放在 $nextTick 中
          this.$refs.hotSearchList.reset()
        })
        this.hideTitle()
        this.hotSearchVisible = true
      },
      hideTitle() {
        this.titleVisible = false
      },
      showTitle() {
        this.titleVisible = true
      },
      hideShadow() {
        this.shadowVisible = true
      },
      showShadow() {
        this.shadowVisible = false
      }
    },
    watch: {
      offsetY(newVal) {
        if (newVal < 0) {
          this.hideTitle()
          this.showShadow()
        } else {
          this.showTitle()
          this.hideShadow()
        }
      },
      hotSearchOffsetY(newVal) {
        if (newVal < 0) {
          this.showShadow()
        } else {
          this.hideShadow()
        }
      }
    },
    components: {
      HotSearchList
    },
    created () {
      const lan = getLocale()
      this.lanIcon = "icon-" + lan
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../assets/styles/global.scss";

  .search-bar {
    position: relative;
    width: 100%;
    height: px2rem(94);
    box-shadow: 0 px2rem(2) px2rem(2) 0 rgba(0, 0, 0, .1);
    z-index: 301;
    &.hide-title {
      height: px2rem(52);
    }
    &.hide-shadow {
      box-shadow: none;
    }
    .search-bar-title-wrapper {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: px2rem(42);
      .title-text-wrapper {
        width: 100%;
        height: px2rem(42);
        @include center;
      }
      .title-icon-shake-wrapper {
        position: absolute;
        right: px2rem(15);
        top: 0;
        height: px2rem(42);
        @include center;
      }
    }
    .title-icon-back-wrapper {
      position: absolute;
      left: px2rem(15);
      top: 0;
      height: px2rem(42);
      z-index: 160;
      @include center;
      -webkit-transition: all $animationTime $animationType;
      -moz-transition: all $animationTime $animationType;
      -ms-transition: all $animationTime $animationType;
      -o-transition: all $animationTime $animationType;
      transition: all $animationTime $animationType;
      &.hide-title {
        height: px2rem(52);
      }
    }
    .search-bar-input-wrapper {
      display: flex;
      position: absolute;
      top: px2rem(42);
      left: 0;
      width: 100%;
      height: px2rem(52);
      padding: px2rem(10);
      z-index: 150;
      background: #fff;
      -webkit-box-sizing: border-box;
      -moz-box-sizing: border-box;
      box-sizing: border-box;
      -webkit-transition: all $animationTime $animationType;
      -moz-transition: all $animationTime $animationType;
      -ms-transition: all $animationTime $animationType;
      -o-transition: all $animationTime $animationType;
      transition: all $animationTime $animationType;
      &.hide-title {
        top: 0;
      }
      .search-bar-blank {
        flex: 0 0 0;
        width: 0;
        -webkit-transition: all $animationTime $animationType;
        -moz-transition: all $animationTime $animationType;
        -ms-transition: all $animationTime $animationType;
        -o-transition: all $animationTime $animationType;
        transition: all $animationTime $animationType;
        &.hide-title {
          flex: 0 0 px2rem(31);
          width: px2rem(31);
        }
      }
      .search-bar-input {
        flex: 1;
        background: #f4f4f4;
        border-radius: px2rem(20);
        padding: px2rem(5) px2rem(15);
        border: px2rem(1) solid #eee;
        -webkit-box-sizing: border-box;
        -moz-box-sizing: border-box;
        box-sizing: border-box;
        @include left;
        .icon-search {
          color: #999;
        }
        .input {
          width: 100%;
          height: px2rem(22);
          border: none;
          background: transparent;
          margin-left: px2rem(10);
          font-size: px2rem(12);
          color: #666;
          &:focus {
            outline: none;
          }
          &::-webkit-input-placeholder {
            color: #ccc;
          }
        }
      }
      .lanIcon {
        width: px2rem(35);
        height: px2rem(35);
        padding-left: px2rem(10);
        &:before {
          width: 100%;
          height: 100%;
        }
      }
    }
  }
</style>
