<template>
  <div class="bookmark-icon" :style="style" ref="bookmarkIcon"></div>
</template>

<script>
  import { px2rem } from '../../utils/utils'

  export default {
    name: "BookmarkIcon",
    props: {
      width: {
        type: Number,
        default: 15
      },
      height: {
        type: Number,
        default: 30
      },
      color: {
        type: String,
        default: '#fff'
      }
    },
    methods: {
      setSize() {
        // 设置书签图标的大小
        this.$refs.bookmarkIcon.style.borderTopWidth = `${px2rem(this.height)}rem`
        this.$refs.bookmarkIcon.style.borderRightWidth = `${px2rem(this.width)}rem`
        this.$refs.bookmarkIcon.style.borderBottomWidth = `${px2rem(this.width)}rem`
        this.$refs.bookmarkIcon.style.borderLeftWidth = `${px2rem(this.width)}rem`
      }
    },
    mounted() {
      this.setSize()
    },
    computed: {
      style() {
        // 设置书签图标的背景颜色
        return `borderColor: ${this.color} ${this.color} transparent ${this.color};`
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../assets/styles/global.scss";

  .bookmark-icon {
    width: 0;
    height: 0;
    border-style: solid;
    /*border-width: px2rem(30) px2rem(15) px2rem(15) px2rem(15);*/
    /*border-color: white white transparent white;*/
  }
</style>
