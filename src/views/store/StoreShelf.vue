<template>
  <div class="store-shelf">
    <shelf-title></shelf-title>
    <div class="shelf-list">
      <shelf-book></shelf-book>
    </div>
  </div>
</template>

<script>
  import ShelfTitle from '../../components/shelf/Shelftitle'
  import ShelfBook from '../../components/shelf/ShelfBook'
  import { storeShelfMixin } from '../../utils/mixin'
  import { getLocalStorage } from '../../utils/localStorage'

  export default {
    name: "StoreShelf",
    mixins: [storeShelfMixin],
    methods: {
      setList () {
        // 设置bookShelfList
        const list = getLocalStorage('bookShelf')
        list.pop()
        this.setShelfList(list)
      }
    },
    activated () {
      // 每次进入书架都会重新读取localstorage
      this.setList()
    },
    created () {
      this.setList()
    },
    components: {
      ShelfTitle,
      ShelfBook
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../assets/styles/global.scss";

  .store-shelf {
    width: 100%;
    height: 100%;
    background: #fff;
  }
</style>
