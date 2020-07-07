<template>
  <transition name="hot-search-move">
    <scroll class="hot-search-wrapper" :probe-type="probeType" :listen-scroll="listenScroll" @scroll="scroll" ref="scroll">
      <div class="scroll-wrapper">
        <hot-search :label="$t('home.hotSearch')" :btn="''" :hot-search="searchList.hotSearch" @titleClick="titleClick('change')"></hot-search>
        <div class="line"></div>
        <hot-search :label="$t('home.historySearch')" :btn="$t('home.clear')" :hot-search="list" @titleClick="titleClick('clear')"></hot-search>
      </div>
    </scroll>
  </transition>
</template>

<script>
  import Scroll from '../common/Scroll.vue'
  import HotSearch from './HotSearch.vue'
  import { storeHomeMixin } from '../../utils/mixin'
  import { getLocalStorage, removeLocalStorage } from '../../utils/localStorage'

  export default {
    name: "HotSearchList",
    mixins: [storeHomeMixin],
    data() {
      return {
        probeType: 3,
        listenScroll: true,
        list: [],
        searchList: {
          hotSearch: [
            {
              type: 1,
              text: 'science',
              num: '2.1万'
            },
            {
              type: 1,
              text: 'engineer',
              num: '1.9万'
            },
            {
              type: 1,
              text: 'life',
              num: '1.7万'
            }
          ]
        }
      }
    },
    methods: {
      titleClick (opt) {
        if (opt === "change") {
          // 换一批热门搜索
        } else {
          // 清空历史搜索
          removeLocalStorage("_search")
          this.list = []
        }
      },
      scroll(pos) {
        this.setHotSearchOffsetY(pos.y)
      },
      reset() {
        this.$refs.scroll.scrollTo(0, 0)
      },
      setList () {
        this.setHistorySearch(JSON.parse(getLocalStorage("_search")))
        if (this.historySearch) {
          this.list = this.historySearch
          const list = []
          this.list.forEach((item) => {
            list.push({
              type: 2,
              text: item
            })
          })
          this.list = list
        }
      }
    },
    mouted() {
      this.$refs.scroll.refresh()
    },
    activated () {
        this.setList()
    },
    created () {
      this.setList()
    },
    components: {
      HotSearch,
      Scroll
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../assets/styles/global";

  .hot-search-wrapper {
    position: absolute;
    top: px2rem(52);
    left: 0;
    bottom: 0;
    right: 0;
    z-index: 300;
    background: #fff;
  }
</style>
