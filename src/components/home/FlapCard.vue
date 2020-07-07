<template>
  <div class="flap-card-wrapper" v-show="flapCardVisible">
    <div class="flap-card-bg" :class="{'animation': runFlapCardAnimation}" v-show="runFlapCardAnimation">
      <div class="flap-card" v-for="(item, index) in flapCardList" :key="index" :style="{zIndex: item.zIndex}">
        <div class="flap-card-circle">
          <div class="flap-card-semi-circle flap-card-semi-circle-left" :style="semiCircleStyle(item, 'left')" ref="left"></div>
          <div class="flap-card-semi-circle flap-card-semi-circle-right" :style="semiCircleStyle(item, 'right')" ref="right"></div>
        </div>
      </div>
      <div class="point-wrapper">
        <div class="point" :class="{'animation': runPointAnimation}" v-for="(item, index) in pointList" :key="index"></div>
      </div>
    </div>
    <div class="book-card" :class="{'animation': runBookCardAnimation}" v-if="runBookCardAnimation">
      <div class="book-card-wrapper">
        <div class="img-wrapper">
          <img class="img" v-lazy="data.cover">
        </div>
        <div class="content-wrapper">
          <div class="title">{{data.title}}</div>
          <div class="author sub-title-medium">{{data.author}}</div>
          <div class="category">{{categoryText()}}</div>
        </div>
        <div class="read-btn" @click.stop="showBook()">{{$t('home.readNow')}}</div>
      </div>
    </div>
    <div class="close-btn-wrapper">
      <span class="icon-close" @click="close"></span>
    </div>
  </div>
</template>

<script>
  import { storeHomeMixin } from '../../utils/mixin'
  import { flapCardList, categoryText } from '../../utils/store'

  export default {
    name: "FlapCard",
    mixins: [storeHomeMixin],
    props: {
      randomBookList: {
        type: Array,
        default: null
      }
    },
    data() {
      return {
        data: null,
        flapCardList: flapCardList,
        front: 0,
        back: 1,
        rotateIntervalTime: 10, // 动画旋转的定时器的事件
        runFlapCardAnimation: false,
        pointList: [], // 装彩色小球的列表
        runPointAnimation: false,
        runBookCardAnimation: false,
        ifShowBookCard: false
      }
    },
    methods: {
      setBook () {
        if (this.randomBookList) {
          const randomIndex = Math.floor(Math.random() * this.randomBookList.length)
          console.log(this.randomBookList, randomIndex, 'ccc')
          this.data = this.randomBookList[randomIndex]
        }
      },
      showBook() {
        // 还原卡片动画状态，设置隐藏
        this.runBookCardAnimation = false
        this.setFlapCardVisible(false)
        this.showBookDetail(this.data)
      },
      categoryText() {
        if (this.data) {
          return categoryText(this.data.category, this)
        } else {
          return ''
        }
      },
      close() {
        this.setFlapCardVisible(false)
        this.stopAnimation()
      },
      semiCircleStyle(item, direction) {
        return {
          backgroundColor: `rgb(${item.r}, ${item.g}, ${item.b})`,
          backgroundSize: item.backgroundSize,
          backgroundImage: direction === 'left' ? item.imgLeft : item.imgRight
        }
      },
      rotate(index, type) {
        const item = this.flapCardList[index]
        let dom
        if (type === 'front') {
          dom = this.$refs.right[index]
        } else {
          dom = this.$refs.left[index]
        }
        dom.style.transform = `rotateY(${item.rotateDegree}deg)`
        dom.style.backgroundColor = `rgb(${item.r}, ${item._g}, ${item.b})`
      },
      flapCardRotate() {
        const frontFlapCard = this.flapCardList[this.front]
        const backFlapCard = this.flapCardList[this.back]
        frontFlapCard.rotateDegree += 10
        frontFlapCard._g -= 5
        backFlapCard.rotateDegree -= 10
        if (backFlapCard.rotateDegree < 90) {
          backFlapCard._g += 5
        }
        if (frontFlapCard.rotateDegree === 90 && backFlapCard.rotateDegree === 90) {
          backFlapCard.zIndex += 2
        }
        this.rotate(this.front, 'front')
        this.rotate(this.back, 'back')
        if (frontFlapCard.rotateDegree === 180 && backFlapCard.rotateDegree === 0) {
          this.next()
        }
      },
      next() {
        // 还原卡片的各个属性
        const frontFlapCard = this.flapCardList[this.front]
        const backFlapCard = this.flapCardList[this.back]
        frontFlapCard.rotateDegree = 0
        backFlapCard.rotateDegree = 0
        frontFlapCard._g = frontFlapCard.g
        backFlapCard._g = backFlapCard.g
        this.rotate(this.front, 'front')
        this.rotate(this.back, 'back')
        this.front++
        this.back++
        const len = this.flapCardList.length
        if (this.front >= len) {
          this.front = 0
        }
        if (this.back >= len) {
          this.back = 0
        }
        // 修改zIndex
        this.flapCardList.forEach((item, index) => {
          item.zIndex = 100 - ((index - this.front + len) % len)
        })
        this.prepare()
      },
      prepare() {
        // 让背面的半圆与前面的半圆重叠，就像翻书一样
        const backFlapCard = this.flapCardList[this.back]
        backFlapCard.rotateDegree = 180
        backFlapCard._g -= 5 * 9
        this.rotate(this.back, 'back')
      },
      startFlapCardAnimation() {
        this.prepare()
        this.task = setInterval(() => {
          this.flapCardRotate()
        }, this.rotateIntervalTime)
        this.runPointAnimation = true
        this.timeout1 = setTimeout(() => {
          // 卡片离开动画
          this.stopAnimation()
          // 弹出随机推荐的图书动画
          this.runBookCardAnimation = true
        }, 1500)
      },
      stopAnimation() {
        // 清除定时器，并将各个数据重置至原始状态
        if (this.task) {
          clearInterval(this.task)
        }
        if (this.timeout1) {
          clearTimeout(this.timeout1)
        }
        if (this.timeout2) {
          clearTimeout(this.timeout2)
        }
        this.reset()
      },
      reset() {
        // 将卡片的属性恢复至第一次的样子
        this.front = 0
        this.back = 1
        this.flapCardList.forEach((item, index) => {
          item.zIndex = 100 - index
          item._g = item.g
          item.rotateDegree = 0
          this.rotate(index, 'back')
          this.rotate(index, 'front')
        })
        this.runBookCardAnimation = false
        this.runFlapCardAnimation = false
        this.runPointAnimation = false
      }
    },
    created() {
      // 设置随机的book
      this.setBook()
      // 创建圆点
      this.pointList = []
      for (let i = 0; i < 18; i++) {
        this.pointList.push(`point${i}`)
      }
    },
    watch: {
      randomBookList (newVal) {
        // 设置随机的book
        this.setBook()
      },
      flapCardVisible(newVal) {
        // 设置随机的book
        this.setBook()
        if (newVal) {
          // 卡片弹出动画
          this.runFlapCardAnimation = true
          // 开始翻转卡片
          this.timeout2 = setTimeout(() => {
            this.startFlapCardAnimation()
          }, 300)
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../assets/styles/global.scss";
  @import "../../assets/styles/flapCard.scss";

  .flap-card-wrapper {
    z-index: 999;
    background: rgba(0, 0, 0, .6);
    @include center;
    @include absCenter;
    .flap-card-bg {
      position: relative;
      width: px2rem(64);
      height: px2rem(64);
      border-radius: px2rem(5);
      background: #fff;
      opacity: 0;
      -webkit-transform: scale(0);
      -moz-transform: scale(0);
      -ms-transform: scale(0);
      -o-transform: scale(0);
      transform: scale(0);
      &.animation {
        -webkit-animation: flap-card-move .3s ease-in both;
        -o-animation: flap-card-move .3s ease-in both;
        animation: flap-card-move .3s ease-in both;
      }
      @keyframes flap-card-move {
        0% {
          opacity: 0;
          -webkit-transform: scale(0);
          -moz-transform: scale(0);
          -ms-transform: scale(0);
          -o-transform: scale(0);
          transform: scale(0);
        }
        50% {
          opacity: 1;
          -webkit-transform: scale(1.2);
          -moz-transform: scale(1.2);
          -ms-transform: scale(1.2);
          -o-transform: scale(1.2);
          transform: scale(1.2);
        }
        75% {
          opacity: 1;
          -webkit-transform: scale(.9);
          -moz-transform: scale(.9);
          -ms-transform: scale(.9);
          -o-transform: scale(.9);
          transform: scale(.9);
        }
        100% {
          opacity: 1;
          -webkit-transform: scale(1);
          -moz-transform: scale(1);
          -ms-transform: scale(1);
          -o-transform: scale(1);
          transform: scale(1);
        }
      }
      .flap-card {
        width: px2rem(48);
        height: px2rem(48);
        @include absCenter;
        .flap-card-circle {
          display: flex;
          width: 100%;
          height: 100%;
          .flap-card-semi-circle {
            flex: 0 0 50%;
            width: 50%;
            height: 100%;
            background-repeat: no-repeat;
            -webkit-backface-visibility: hidden;
            -moz-backface-visibility: hidden;
            -ms-backface-visibility: hidden;
            backface-visibility: hidden;
          }
          .flap-card-semi-circle-left {
            border-radius: px2rem(24) 0 0 px2rem(24);
            background-position: center right;
            transform-origin: right;
          }
          .flap-card-semi-circle-right {
            border-radius: 0 px2rem(24) px2rem(24) 0;
            background-position: center left;
            transform-origin: left;
          }
        }
      }
      .point-wrapper {
        @include absCenter;
        .point {
          border-radius: 50%;
          @include absCenter;
          &.animation {
            @for $i from 1 to length($moves) {
              &:nth-child(#{$i}) {
                @include move($i)
              }
            }
          }
        }
      }
    }
    .book-card {
      position: relative;
      width: 65%;
      // height: 70%;
      box-sizing: border-box;
      border-radius: px2rem(15);
      background: white;
      &.animation {
        animation: scale .3s ease-in both;
        @keyframes scale {
          0% {
            transform: scale(0);
            opacity: 0;
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }
      }
      .book-card-wrapper {
        width: 100%;
        height: 100%;
        margin-bottom: px2rem(30);
        @include columnTop;
        .img-wrapper {
          width: 100%;
          margin-top: px2rem(20);
          @include center;
          .img {
            width: px2rem(90);
            height: px2rem(130);
          }
        }
        .content-wrapper {
          padding: 0 px2rem(20);
          margin-top: px2rem(20);
          .title {
            color: #333;
            font-weight: bold;
            font-size: px2rem(18);
            line-height: px2rem(20);
            max-height: px2rem(40);
            text-align: center;
            @include ellipsis2(2)
          }
          .author {
            margin-top: px2rem(10);
            text-align: center;
          }
          .category {
            color: #999;
            font-size: px2rem(14);
            margin-top: px2rem(10);
            text-align: center;
          }
        }
        .read-btn {
          position: absolute;
          bottom: 0;
          left: 0;
          z-index: 1100;
          width: 100%;
          border-radius: 0 0 px2rem(15) px2rem(15);
          padding: px2rem(15) 0;
          text-align: center;
          color: white;
          font-size: px2rem(14);
          background: $color-blue;
        }
      }
    }
    .close-btn-wrapper {
      position: absolute;
      left: 0;
      bottom: px2rem(30);
      width: 100%;
      @include center;
      .icon-close {
        width: px2rem(45);
        height: px2rem(45);
        border-radius: 50%;
        background: #333;
        font-size: px2rem(25);
        color: #fff;
        @include center;
      }
    }
  }
</style>
