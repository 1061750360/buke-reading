import { getReadTime, getLocalStorage, setLocalStorage } from './localStorage'
import { realPx } from './utils'

// 字体大小 fontsize
export const FONT_SIZE_LIST = [
  { fontSize: 12 },
  { fontSize: 14 },
  { fontSize: 16 },
  { fontSize: 18 },
  { fontSize: 20 },
  { fontSize: 22 },
  { fontSize: 24 }
]

// 字体 font-family
export const FONT_FAMILY = [
  { font: 'Default' },
  { font: 'Cabin' },
  { font: 'Days One' },
  { font: 'Montserrat' },
  { font: 'Tangerine' }
]

// 主题
export function themeList(vue) {
  return [
    {
      alias: vue.$t('book.themeDefault'),
      name: 'Default',
      style: {
        body: {
          'color': '#4c5059',
          'background': '#cecece',
          'padding-top': `${realPx(40)}px!important`,
          'padding-bottom': `${realPx(40)}px!important`
        },
        img: {
          'width': '100%'
        },
        '.epubjs-hl': {
          'fill': 'red', 'fill-opacity': '0.3', 'mix-blend-mode': 'multiply'
        }
      }
    },
    {
      alias: vue.$t('book.themeGold'),
      name: 'Gold',
      style: {
        body: {
          'color': '#5c5b56',
          'background': '#c6c2b6',
          'padding-top': `${realPx(40)}px!important`,
          'padding-bottom': `${realPx(40)}px!important`
        },
        img: {
          'width': '100%'
        },
        '.epubjs-hl': {
          'fill': 'red', 'fill-opacity': '0.3', 'mix-blend-mode': 'multiply'
        }
      }
    },
    {
      alias: vue.$t('book.themeEye'),
      name: 'Eye',
      style: {
        body: {
          'color': '#404c42',
          'background': '#a9c1a9',
          'padding-top': `${realPx(40)}px!important`,
          'padding-bottom': `${realPx(40)}px!important`
        },
        img: {
          'width': '100%'
        },
        '.epubjs-hl': {
          'fill': 'red', 'fill-opacity': '0.3', 'mix-blend-mode': 'multiply'
        }
      }
    },
    {
      alias: vue.$t('book.themeNight'),
      name: 'Night',
      style: {
        body: {
          'color': '#cecece',
          'background': '#000000',
          'padding-top': `${realPx(40)}px!important`,
          'padding-bottom': `${realPx(40)}px!important`
        },
        img: {
          'width': '100%'
        },
        '.epubjs-hl': {
          'fill': 'red', 'fill-opacity': '0.3', 'mix-blend-mode': 'multiply'
        }
      }
    }
  ]
}

// 为全局添加主题样式
export function addCss (href) {
  const link = document.createElement('link')
  link.setAttribute('rel', 'stylesheet')
  link.setAttribute('type', 'text/css')
  link.setAttribute('href', href)
  document.getElementsByTagName('head')[0].appendChild(link)
}

// 去除指定的 link 标签
export function removeCss (href) {
  const links = document.getElementsByTagName('link')
  for (let i = links.length; i >= 0; i--) {
    const link = links[i]
    if (link && link.getAttribute('href') && link.getAttribute('href') === href) {
      link.parentNode.removeChild(link)
    }
  }
}

// 删除所有指定的 link 标签
export function removeAllCss () {
  removeCss(`${process.env.VUE_APP_RESOURCE_URL}/theme/theme_default.css`)
  removeCss(`${process.env.VUE_APP_RESOURCE_URL}/theme/theme_eye.css`)
  removeCss(`${process.env.VUE_APP_RESOURCE_URL}/theme/theme_gold.css`)
  removeCss(`${process.env.VUE_APP_RESOURCE_URL}/theme/theme_gold.css`)
}

// 将时间转化为分钟为单位
export function getReadTimeToMinute(fileName) {
  const readTime = getReadTime(fileName)
  if (!readTime) {
    return 0
  } else {
    return Math.ceil(readTime / 60)
  }
}

// 将树状结构数组一维化
export function flatten (array) {
  return [].concat(...array.map(item => [].concat(item, ...flatten(item.subitems))))
}

const BOOK_SHELF_KEY = 'bookShelf'

export function appendAddToBookList(bookList) {
  bookList.push({
    cover: '',
    title: '',
    type: 3,
    id: Number.MAX_SAFE_INTEGER
  })
}

export function clearAddFromBookList(bookList) {
  if (!bookList) {
    bookList = []
  }
  return bookList.filter(item => {
    return item.type !== 3
  })
}

// 添加图书到书架
export function addToShelf(book) {
  let bookList = getLocalStorage(BOOK_SHELF_KEY)
  bookList = clearAddFromBookList(bookList)
  book.type = 1
  bookList.push(book)
  bookList.forEach((item, index) => {
    item.id = index + 1
  })
  appendAddToBookList(bookList)
  setLocalStorage(BOOK_SHELF_KEY, bookList)
}

// 从书架中删除一本图书
export function removeFromBookShelf(bookItem) {
  let bookList = getLocalStorage(BOOK_SHELF_KEY)
  console.log(bookList, 'ddd')
  bookList = bookList.filter(item => {
    if (item.itemList) {
      item.itemList = item.itemList.filter(subItem => subItem.fileName !== bookItem.fileName)
    }
    return item.fileName !== bookItem.fileName
  })
  setLocalStorage(BOOK_SHELF_KEY, bookList)
}
