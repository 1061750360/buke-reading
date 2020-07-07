const store = {
  state: {
    scrollY: 0, // 首页scroll组件下滑距离
    hotSearchOffsetY: 0,
    flapCardVisible: false,
    isEditMode: false, // 是否进入编辑模式
    shelfList: [], // 书架图书列表
    shelfSelectedList: [], // 书架图书选中状态
    shelfTitleVisible: true, // 书架标题的显示状态
    historySearch: [] // 搜索历史
  },
  mutations: {
    'SET_SCROLLY': (state, scrollY) => {
      state.scrollY = scrollY
    },
    'SET_HOT_SEARCH_OFFSETY': (state, hotSearchOffsetY) => {
      state.hotSearchOffsetY = hotSearchOffsetY
    },
    'SET_FLAP_CARD_VISIBLE': (state, flapCardVisible) => {
      state.flapCardVisible = flapCardVisible
    },
    'SET_IS_EDIT_MODE': (state, isEditMode) => {
      state.isEditMode = isEditMode
    },
    'SET_SHELF_LIST': (state, shelfList) => {
      state.shelfList = shelfList
    },
    'SET_SHELF_SELECTED_LIST': (state, shelfSelectedList) => {
      state.shelfSelectedList = shelfSelectedList
    },
    'SET_SHELF_TITLE_VISIBLE': (state, shelfTitleVisible) => {
      state.shelfTitleVisible = shelfTitleVisible
    },
    'SET_HISTORY_SEARCH': (state, historySearch) => {
      state.historySearch = historySearch
    }
  }
}

export default store
