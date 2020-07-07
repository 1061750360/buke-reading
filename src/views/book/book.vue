<template>
  <div class="book" ref="book">
    <book-header></book-header>
    <bookmark></bookmark>
    <book-title></book-title>
    <book-reader></book-reader>
    <book-menu></book-menu>
    <book-footer></book-footer>
  </div>
</template>

<script>
  import BookReader from '../../components/book/BookReader.vue'
  import BookTitle from '../../components/book/BookTitle.vue'
  import BookMenu from '../../components/book/BookMenu.vue'
  import Bookmark from '../../components/book/BookmarkPage'
  import BookHeader from '../../components/book/BookHeader'
  import BookFooter from '../../components/book/BookFooter'

  import { getReadTime, saveReadTime } from '../../utils/localStorage'
  import { bookMixin } from '../../utils/mixin'

  export default {
    name: "book",
    mixins: [bookMixin],
    watch: {
      offsetY(newVal) {
        if (newVal > 0) {
          this.screenDown(newVal)
        } else if (newVal === 0) {
          this.screenRestore()
        }
      }
    },
    methods: {
      screenRestore() {
        this.$refs.book.style.top = 0
        this.$refs.book.style.transition = 'all .2s linear'
        setTimeout(() => {
          this.$refs.book.style.transition = ''
        }, 200)
      },
      screenDown(offsetY) {
        this.$refs.book.style.top = `${offsetY}px`
      },
      startLoopReadTime() {
        let readTime = getReadTime(this.fileName)
        if (!readTime) {
          readTime = 0
        }
        this.task = setInterval(() => {
          readTime++
          if (readTime % 30 === 0) {
            saveReadTime(this.fileName, readTime)
          }
        }, 1000)
      }
    },
    mounted() {
      this.startLoopReadTime()
    },
    beforeDestroy() {
      if (this.task) {
        clearInterval(this.task)
      }
    },
    components: {
      BookReader,
      BookTitle,
      BookMenu,
      Bookmark,
      BookHeader,
      BookFooter
    }
  }
</script>

<style lang="scss" scoped>
  .book {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
</style>
