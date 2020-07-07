import { mapGetters, mapActions } from 'vuex'
import { addCss, getReadTimeToMinute, removeAllCss, themeList } from './book'
import { getBookmark, saveLocation } from './localStorage'
import { getCategoryName } from './store'

export const bookMixin = {
  computed: {
    ...mapGetters([
      'fileName',
      'menuVisible',
      'settingVisible',
      'defaultFontSize',
      'currentBook',
      'defaultFontFamily',
      'fontFamilyVisible',
      'defaultTheme',
      'bookAvailable',
      'progress',
      'section',
      'isPaginating',
      'navigation',
      'cover',
      'metadata',
      'paginate',
      'pagelist',
      'offsetY',
      'isBookmark',
      'speakingIconBottom',
      'href',
      'bookmark'
    ]),
    themeList() {
      return themeList(this)
    },
    getSectionName() {
      // 获得当前章节的标题，只支持一级、二级目录，跟电子书的所给的数据信息有关
      if (this.navigation) {
        const result = this.navigation.find(item => item.href.includes(this.href))
        return result ? result.label : ''
      } else {
        return ''
      }
    }
  },
  methods: {
    ...mapActions([
      'setFileName',
      'setMenuVisible',
      'setSettingVisible',
      'setDefaultFontSize',
      'setDefaultFontFamily',
      'setFontFamilyVisible',
      'setDefaultTheme',
      'setBookAvailable',
      'setProgress',
      'setSection',
      'setIsPaginating',
      'setCurrentBook',
      'setNavigation',
      'setCover',
      'setMetadata',
      'setPaginate',
      'setPagelist',
      'setOffsetY',
      'setIsBookmark',
      'setHref',
      'setBookmark'
    ]),
    initGlobalStyle() {
      // 在添加样式文件前，先去除掉之前加上的link标签，免得影响渲染效果
      removeAllCss()
      // 选择对应的主题，并添加对应的主题样式文件到 head 标签中
      switch (this.defaultTheme) {
        case 'Default':
          addCss(`${process.env.VUE_APP_RESOURCE_URL}/book/res/theme/theme_default.css`)
          break
        case 'Eye':
          addCss(`${process.env.VUE_APP_RESOURCE_URL}/book/res/theme/theme_eye.css`)
          break
        case 'Gold':
          addCss(`${process.env.VUE_APP_RESOURCE_URL}/book/res/theme/theme_gold.css`)
          break
        case 'Night':
          addCss(`${process.env.VUE_APP_RESOURCE_URL}/book/res/theme/theme_night.css`)
          break
        default:
          addCss(`${process.env.VUE_APP_RESOURCE_URL}/book/res/theme/theme_default.css`)
      }
    },
    refreshProgressLocation() {
      // 保存进度条的位置到 vuex 和 localstorage
      const currentLocation = this.currentBook.rendition.currentLocation()
      if (currentLocation && currentLocation.start) {
        const startCfi = currentLocation.start.cfi
        const progress = this.currentBook.locations.percentageFromCfi(startCfi)
        this.setProgress(Math.floor(progress * 100))
        this.setSection(currentLocation.start.index)
        this.setHref(currentLocation.start.href)
        saveLocation(this.fileName, startCfi)
        const bookmark = getBookmark(this.fileName)
        if (bookmark) {
          if (bookmark.some(item => item.cfi === startCfi)){
            this.setIsBookmark(true)
          } else {
            this.setIsBookmark(false)
          }
        } else {
          this.setIsBookmark(false)
        }
      }
    },
    display(target, cb) {
      if (target) {
        this.currentBook.rendition.display(target).then(() => {
          this.refreshProgressLocation()
        })
      } else {
        this.currentBook.rendition.display().then(() => {
          this.refreshProgressLocation()
        })
      }
      if (cb) cb()
    },
    hideTitleAndMenu(){
      // 隐藏菜单栏和标题栏
      this.setMenuVisible(false)
      this.setSettingVisible(-1)
      this.setFontFamilyVisible(false)
    },
    getReadTimeText() {
      // 获取已读时间
      return this.$t('book.haveRead').replace('$1', getReadTimeToMinute(this.fileName))
    }
  }

}

export const storeHomeMixin = {
  computed: {
    ...mapGetters([
      'offsetY',
      'hotSearchOffsetY',
      'flapCardVisible',
      'historySearch'
    ])
  },
  methods: {
    ...mapActions([
      'setOffsetY',
      'setHotSearchOffsetY',
      'setFlapCardVisible',
      'setHistorySearch'
    ]),
    showBookDetail(book) {
      this.$router.push({
        name: 'detail',
        path: '/store/detail',
        query: {
          fileName: book.fileName,
          categoryText: book.categoryText || getCategoryName(book.category)
        },
        params: {
          bookItem: book
        }
      })
    }
  }
}

export const storeShelfMixin = {
  computed: {
    ...mapGetters([
      'isEditMode',
      'shelfList',
      'shelfSelectedList',
      'shelfTitleVisible'
    ])
  },
  methods: {
    ...mapActions([
      'setIsEditMode',
      'setShelfList',
      'setShelfSelectedList',
      'setShelfTitleVisible'
    ])
  }
}
