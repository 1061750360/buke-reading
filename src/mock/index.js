import Mock from 'mockjs'
import home from './bookHome'
import shelf from './bookShelf'
import bookList from './bookList'
import faltList from './bookFlatList'
import { getCategoryName } from '../utils/store'

// Mock.setup({
//   timeout: '350-600'
// })

Mock.mock(/\/book\/home/, 'get', home)
Mock.mock(/\/book\/shelf/, 'get', shelf)
Mock.mock(/\/book\/list/, 'get', bookList)
Mock.mock(/\/book\/flat-list/, 'get', faltList)

// 获取图书详情opf
Mock.mock(/\/store\/detail/, 'get', (options) => {
  const data = JSON.parse(options.body)
  const url = options.url
  const fileName = data.book.fileName
  const categoryText = data.book.categoryText || getCategoryName(data.book.category)
  return {
    status: 200,
    error_code: 0,
    data: {
      cover: `${process.env.VUE_APP_BOOK_URL}/book/res/img/${categoryText}/${fileName}.jpeg`,
      rootFile: `${process.env.VUE_APP_BOOK_URL}/opf/${categoryText}/${fileName}/META-INF/container.xml`,
      bookItem: data.book
    }
  }
})

export default Mock
