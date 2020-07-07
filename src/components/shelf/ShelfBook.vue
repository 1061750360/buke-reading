<template>
  <div class="book-container">
    <scroll :data="shelfList" class="scroll-wrapper" ref="scroll">
      <transition-group class="content-box" name="fade" mode="out-in">
        <div class="book" v-for="item in shelfList" :key="item.id" @click="toggleChecked(item)">
            <div class="img-wrapper">
              <img :src="item.cover" class="img">
              <div class="checked-input" v-show="isEditMode">
                <i class="icon-check" v-show="item.selected"></i>
              </div>
            </div>
            <div class="content-wrapper">
              <div class="title title-medium">
                {{item.title}}
              </div>
            </div>
          </div>
      </transition-group>
    </scroll>
    <transition name="slide-up">
      <div class="bottom-option" v-show="isEditMode">
        <div class="opt-icon" @click="selectAll">
          <img src="../../assets/images/selectAll.svg" alt="">
          <p>{{$t("shelf.selectAll")}}</p>
        </div>
        <div class="opt-icon" @click="removeFromShelf">
          <img src="../../assets/images/delete.svg" alt="">
          <p>{{$t("shelf.remove")}}</p>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
  import { storeShelfMixin } from '../../utils/mixin'
  import { removeFromBookShelf } from '../../utils/book'
  import Scroll from '../common/Scroll'
  import { px2rem } from '../../utils/utils'
  import { getLocalForage } from '../../utils/localForage'

  export default {
    name: "ShelfBook",
    components: { Scroll },
    mixins: [storeShelfMixin],
    methods: {
      selectAll () {
        // 全选
        this.shelfList.forEach((item) => {
          item.selected = !item.selected
        })
        // 强制刷新DOM，解决vue修改对象属性不渲染DOM
        this.$forceUpdate()
        const res = this.shelfList.some((item) => {
          return item.selected === true
        })
        const list = res ? this.shelfList : []
        this.setShelfSelectedList(list)
      },
      removeFromShelf () {
        // 从localstorage中删除书本
        this.shelfSelectedList.forEach((item) => {
          removeFromBookShelf(item)
        })

        const list = this.shelfList.filter((item) => {
          return item.selected === false
        })
        this.setShelfList(list)
        this.setIsEditMode(false)
      },
      toggleChecked (book) {
        // 判断是否是编辑模式，否则直接打开图书开始阅读
        if (this.isEditMode) {
          this.shelfList.forEach((item) => {
            if (item.fileName === book.fileName) {
              item.selected = !item.selected
            }
          })
          // 强制刷新DOM，解决vue修改对象属性不渲染DOM
          this.$forceUpdate()
          const selectedList = this.shelfList.filter((item) => {
            return item.selected === true
          })
          this.setShelfSelectedList(selectedList)
        } else {
          getLocalForage(book.fileName, (err, value) => {
            if (!err && value instanceof Blob) {
              this.$router.push({
                path: `/book/${book.categoryText}|${book.fileName}`
              })
            } else {
              this.$router.push({
                path: `/book/${book.categoryText}|${book.fileName}`
              })
            }
          })
        }
      }
    },
    watch: {
      isEditMode (newVal) {
        // 每次离开编辑模式时，清空 shelfSelectedList 这个列表
        this.setShelfSelectedList([])
        this.shelfList.forEach((item) => {
          item.selected = false
        })
        // 解决底部菜单栏遮挡内容的问题
        if (newVal) {
          this.$refs.scroll.$el.style.bottom = px2rem(55) + "rem"
        } else {
          this.$refs.scroll.$el.style.bottom = 0
        }
        this.$refs.scroll.refresh()
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "./src/assets/styles/global";

  .book-container {
    .scroll-wrapper {
      position: absolute;
      top: px2rem(42);
      bottom: 0;
      width: 100%;
      .content-box {
        display: flex;
        flex-wrap: wrap;
        .book {
          width: 33.33%;
          height: px2rem(200);
          display: flex;
          flex-direction: column;
          align-items: center;
          .img-wrapper {
            position: relative;
            width: 80%;
            height: 80%;
            padding-bottom: px2rem(4);
            .img {
              width: 100%;
              height: 100%;
            }
            .checked-input {
              position: absolute;
              right: px2rem(5);
              bottom: px2rem(10);
              width: px2rem(20);
              height: px2rem(20);
              border-radius: 50%;
              background: rgba(0,0,0,0.5);
              .icon-check {
                &::before {
                  display: block;
                  font-size: px2rem(16);
                  padding: px2rem(2);
                  color: rgba(255,255,255,0.7);
                }
              }
            }
          }
          .content-wrapper {
            padding: px2rem(4);
            .title {
              font-size: px2rem(14);
              @include ellipsis2(2);
            }
          }
        }
      }
    }
    .bottom-option {
      position: fixed;
      left: 0;
      bottom: 0;
      width: 100%;
      height: px2rem(52);
      background: #fff;
      box-shadow: 0 0 px2rem(4) 0 rgba(0,0,0,0.3);
      display: flex;
      .opt-icon {
        flex: 1;
        @include center;
        img {
          width: px2rem(20);
          height: px2rem(20);
          padding-right: px2rem(8);
        }
        p {
          height: px2rem(20);
          font-size: px2rem(16);
          line-height: px2rem(20);
          color: #4aabff;
          font-weight: bold;
        }
      }
    }
  }
</style>
