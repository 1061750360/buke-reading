<template>
  <div ref="wrapper" class="scroll">
      <slot></slot>
  </div>
</template>

<script>
  import BScroll from 'better-scroll'

  export default {
    name: "Scroll",
    props: {
      probeType: {
        type: Number,
        default: 0
      },
      click: {
        type: Boolean,
        default: true
      },
      data: {
        type: Array,
        default: () => []
      },
      listenScroll: { // 这个要配合probeType=3使用
        type: Boolean,
        default: true
      },
      // 是否开启上拉刷新
      pullUp: {
        type: Boolean,
        default: false
      },
      beforeScroll: {
        type: Boolean,
        default: false
      },
      refreshDelay: {
        type: Number,
        default: 20
      }
    },
    mounted(){
      setTimeout(() => {
        this._initScroll()
      }, this.refreshDelay)
    },
    watch: {
      data(){
        setTimeout(() => {
          this.refresh()
        }, this.refreshDelay)
      }
    },
    methods: {
      _initScroll(){
        if (!this.$refs.wrapper) {
          return
        }
        this.scroll = new BScroll(this.$refs.wrapper, {
          probeType: this.probeType,
          click: this.click
        })
        if (this.listenScroll) {
          this.scroll.on('scroll', (pos) => {
            this.$emit('scroll', pos)
          })
        }
        if (this.pullUp) {
          this.scroll.on("scrollEnd", () => {
            if (this.scroll.y <= this.scroll.maxScrollY + 50) {
              this.$emit('scrollToEnd')
            }
          })
        }
        if (this.beforeScroll) {
          this.scroll.on('beforeScrollStart', () => {
            this.$emit('beforeScroll')
          })
        }
      },
      enable() {
        this.scroll && this.scroll.enable()
      },
      disable() {
        this.scroll && this.scroll.disable()
      },
      refresh() {
        this.scroll && this.scroll.refresh()
      },
      scrollTo() {
        this.scroll && this.scroll.scrollTo.apply(this.scroll, arguments)
      },
      scrollToElement() {
        this.scroll && this.scroll.scrollToElement.apply(this.scroll, arguments)
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../assets/styles/global.scss";

  .scroll {
    @include scroll;
  }
</style>
