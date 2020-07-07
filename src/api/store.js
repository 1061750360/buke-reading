import axios from 'axios'

export function homeApi () {
  return axios({
    methods: 'get',
    url: `${process.env.VUE_APP_BASE_URL}/book/home`
  })
}

export function detailApi (bookItem) {
  console.log(bookItem, 'vvvvvvvvvvv')
  return axios({
    methods: 'post',
    url: `${process.env.VUE_APP_BASE_URL}/store/detail`,
    data: {
      book: bookItem
    }
  })
}

export function listApi () {
  return axios({
    methods: 'get',
    url: `${process.env.VUE_APP_BASE_URL}/book/list`
  })
}

export function flatList() {
  return axios({
    method: 'get',
    url: `${process.env.VUE_APP_BOOK_URL}/book/flat-list`
  })
}
