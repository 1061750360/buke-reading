<template>
  <div class="book-reader">
    <div id="read"></div>
    <div class="read-mask" @click="maskClick" @mousedown.left="onMouseEnter" @mousemove.left="onMouseMove" @mouseup.left="onMouseEnd" ref="mask"></div>
  </div>
</template>

<script>
  import { bookMixin } from '../../utils/mixin'
  import Epub from 'epubjs'
  import {
    getFontFamily,
    getFontSize,
    getLocation,
    getTheme,
    saveFontFamily,
    saveFontSize,
    saveTheme
  } from '../../utils/localStorage'
  import { flatten } from '../../utils/book'
  import { isPC } from '../../utils/utils'

  global.ePub = Epub

  export default {
    name: 'BookReader',
    mixins: [bookMixin],
    data() {
      return {
        firstOffsetY: 0,
        mouseState: 0
      }
    },
    methods: {
      onMouseEnter(e) {
        this.mouseState = 1
        this.mouseStartTime = e.timeStamp
        e.preventDefault()
        e.stopPropagation()
      },
      onMouseMove(e) {
        // 只有在非标题栏和book已加载完毕才可以进行下拉操作
        if (!this.menuVisible && this.bookAvailable) {
          if (this.mouseState === 1) {
            this.mouseState = 2
          } else if (this.mouseState === 2) {
            let offsetY = 0
            if (this.firstOffsetY) {
              offsetY = e.clientY - this.firstOffsetY
              this.setOffsetY(offsetY)
            } else {
              this.firstOffsetY = e.clientY
            }
          }
        }
        e.preventDefault()
        e.stopPropagation()
      },
      onMouseEnd(e) {
        if (this.mouseState === 2) {
          this.setOffsetY(0)
          this.firstOffsetY = 0
          this.mouseState = 3
        } else {
          this.mouseState = 0
        }
        const time = e.timeStamp - this.mouseStartTime
        if (time < 100) {
          this.mouseState = 0
        }
        e.preventDefault()
        e.stopPropagation()
      },
      maskClick(e) {
        if (this.mouseState === 0) {
          if (!this.menuVisible && this.bookAvailable) {
            const offsetX = e.clientX
            if (offsetX >= 0 && offsetX <= window.innerWidth * 0.3) {
              this.prevPage()
            } else if (offsetX >= window.innerWidth * 0.7 && offsetX <= window.innerWidth) {
              this.nextPage()
            } else {
              this.toggleTitleAndMenu()
            }
          } else {
            this.toggleTitleAndMenu()
          }
        }
        e.preventDefault()
        e.stopPropagation()
      },
      initFontSize() {
        const fontSize = getFontSize(this.fileName)
        if (!fontSize) {
          saveFontSize(this.fileName, this.defaultFontSize)
        } else {
          this.rendition.themes.fontSize(fontSize)
          this.setDefaultFontSize(fontSize)
        }
      },
      initFontFamily() {
        const font = getFontFamily(this.fileName)
        if (!font) {
          saveFontFamily(this.fileName, this.defaultFontFamily)
        } else {
          this.rendition.themes.font(font)
          this.setDefaultFontFamily(font)
        }
      },
      initTheme() {
        let defaultTheme = getTheme(this.fileName)
        if (!defaultTheme) {
          defaultTheme = this.themeList[0].name
          saveTheme(this.fileName, defaultTheme)
        }
        this.setDefaultTheme(defaultTheme)
        // 遍历并注册主题
        this.themeList.forEach(theme => {
          this.rendition.themes.register(theme.name, theme.style)
        })
        this.rendition.themes.select(defaultTheme)
      },
      initRendition() {
        this.rendition.display().then(() => {
          const location = getLocation(this.fileName)
          this.display(location, () => {
            // 初始化字体大小
            this.initFontSize()
            // 初始化字体
            this.initFontFamily()
            // 初始化主题
            this.initTheme()
            // 初始化全局主题样式
            this.initGlobalStyle()
          })

          // 为 this.rendition 添加hook，修改阅读器的字体
          this.rendition.hooks.content.register(contents => {
            Promise.all([
              contents.addStylesheet(`${process.env.VUE_APP_RESOURCE_URL}/book/res/fonts/cabin.css`),
              contents.addStylesheet(`${process.env.VUE_APP_RESOURCE_URL}/book/res/fonts/daysOne.css`),
              contents.addStylesheet(`${process.env.VUE_APP_RESOURCE_URL}/book/res/fonts/montserrat.css`),
              contents.addStylesheet(`${process.env.VUE_APP_RESOURCE_URL}/book/res/fonts/tangerine.css`)
            ]).then(() => {
              console.log("字体加载完毕。。。")
            })
          })
        })
      },
      initGesture() {
        // 可以使用this.rendition 上的 on 方法监听左滑右滑手势
        this.rendition.on('touchstart', event => {
          this.touchStartX = event.changedTouches[0].clientX
          this.touchStartTime = event.timeStamp
        })

        this.rendition.on('touchend', event => {
          // 还原下拉操作的数据
          this.setOffsetY(0)
          this.firstOffsetY = 0
          // 处理左滑、右滑操作
          this.offsetX = event.changedTouches[0].clientX - this.touchStartX
          const time = event.timeStamp - this.touchStartTime
          // 根据滑动的正负判断是左滑还是右滑
          if (time < 500 && this.offsetX > 40) {
            this.prevPage()
          } else if (time < 500 && this.offsetX < -40) {
            this.nextPage()
          }
          // 禁用事件的默认事件和传播
          // event.preventDefault()  使用* {touch-action: none;}
          event.stopPropagation()
        })
        // 处理点击事件：显示菜单栏和标题栏
        this.rendition.on('click', event => {
          this.toggleTitleAndMenu()
          // 禁用事件的默认事件和传播
          // event.preventDefault()  使用* {touch-action: none;}
          event.stopPropagation()
        })
        // 处理下拉操作
        this.rendition.on('touchmove', event => {
          let offsetY = 0
          // 只有在非标题栏和book已加载完毕才可以进行下拉操作
          if (!this.menuVisible && this.bookAvailable) {
            if (this.firstOffsetY) {
              offsetY = event.changedTouches[0].clientY - this.firstOffsetY
              this.setOffsetY(offsetY)
            } else {
              this.firstOffsetY = event.changedTouches[0].clientY
            }
            // 禁用事件的默认事件和传播
            // event.preventDefault()  使用* {touch-action: none;}
            event.stopPropagation()
          }
        })
      },
      parseBook() {
        //  获取图书封面图片
        this.book.loaded.cover.then(cover => {
          this.setCover(cover)
        })
        // 获取图书
        this.book.loaded.metadata.then(metadata => {
          this.setMetadata(metadata)
        })
        // 获取图书目录信息
        this.book.loaded.navigation.then(nav => {
          const navItem = flatten(nav.toc)
          function find (item, level = 0) {
            return !item.parent ? level : find(navItem.filter(parentItem => parentItem.id === item.parent)[0], ++level)
          }
          navItem.forEach(item => {
            item.level = find(item)
          })
          this.setNavigation(navItem)
        })
      },
      initEpub () {
        const url = `${process.env.VUE_APP_RESOURCE_URL}/opf/${this.fileName}/`
        this.book = new Epub(url)
        this.setCurrentBook(this.book)

        // 将book渲染到 read 区域
        this.rendition = this.book.renderTo('read', {
          width: window.innerWidth,
          height: window.innerHeight,
          methods: 'default'
        })
        const nav = this.$route.query.navigation
        if (nav) {
          // 选择某个章节时，跳转到该章节
          this.display(nav, () => {
            this.hideTitleAndMenu()
          })
        }
        // 进行初始化操作，字体、主题等
        this.initRendition()
        // 根据不同手势进行不同的操作
        this.initGesture()
        // 解析图书的基本信息
        this.parseBook()
        this.book.ready.then(() => {
          return this.book.locations.generate(300 * (window.innerWidth / 600) * (getFontSize(this.fileName) / 16))
        }).then((locations) => {
          this.setBookAvailable(true)
          this.refreshProgressLocation()
        })
      },
      prevPage(){
        // 判断是否存在this.rendition，存在则调用上一页(prev)方法
        if (this.rendition) {
          this.hideTitleAndMenu()
          this.rendition.prev().then(() => {
            this.refreshProgressLocation()
          })
        }
      },
      nextPage(){
        // 判断是否存在this.rendition，存在则调用上一页(next)方法
        if (this.rendition) {
          this.hideTitleAndMenu()
          this.rendition.next().then(() => {
            this.refreshProgressLocation()
          })
        }
      },
      toggleTitleAndMenu(){
        if (this.menuVisible){
          this.setSettingVisible(-1)
          this.setFontFamilyVisible(false)
        }
        this.setMenuVisible(!this.menuVisible)
      }
    },
    mounted(){
      // 判断当前是pc还是移动端，然后确定是否使用mask支持pc端的手势操作
      if (!isPC()) {
        this.$refs.mask.style.zIndex = '-111'
      }
      // 如果menuVisible为真，则设置为假，进入阅读器不显示菜单栏
      if (this.menuVisible) {
        this.setMenuVisible(!this.menuVisible)
      }
      // 根据传入的参数，初始化电子书
      const fileName = this.$route.params.fileName.split('|').join('/')
      this.setFileName(fileName).then(() => {
        this.initEpub()
      })
    }
  }
</script>

<style lang="scss" scoped>
  .book-reader {
    position: relative;
    width: 100%;
    height: 100%;
    .read-mask {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
    }
  }
</style>
