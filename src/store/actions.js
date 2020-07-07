const actions = {
  setFileName: ({ commit }, fileName) => {
    return commit('SET_FILENAME', fileName)
  },
  setMenuVisible: ({ commit }, menuVisible) => {
    return commit('SET_MENU_VISIBLE', menuVisible)
  },
  setSettingVisible: ({ commit }, setSettingVisible) => {
    return commit('SET_SETTING_VISIBLE', setSettingVisible)
  },
  setDefaultFontSize: ({ commit }, defaultFontSize) => {
    return commit('SET_DEFAULT_FONT_SIZE', defaultFontSize)
  },
  setCurrentBook: ({ commit }, currentBook) => {
    return commit('SET_CURRENT_BOOK', currentBook)
  },
  setFontFamilyVisible: ({ commit }, visible) => {
    return commit('SET_FONT_FAMILY_VISIBLE', visible)
  },
  setDefaultFontFamily: ({ commit }, font) => {
    return commit('SET_DEFAULT_FONT_FAMILY', font)
  },
  setDefaultTheme: ({ commit }, theme) => {
    return commit('SET_DEFAULT_THEME', theme)
  },
  setBookAvailable: ({ commit }, bookAvailable) => {
    return commit('SET_BOOK_AVAILABLE', bookAvailable)
  },
  setProgress: ({ commit }, progress) => {
    return commit('SET_PROGRESS', progress)
  },
  setSection: ({ commit }, section) => {
    return commit('SET_SECTION', section)
  },
  setIsPaginating: ({ commit }, isPaginating) => {
    return commit('SET_IS_PAGINATING', isPaginating)
  },
  setNavigation: ({ commit }, navigation) => {
    return commit('SET_NAVIGATION', navigation)
  },
  setCover: ({ commit }, cover) => {
    return commit('SET_COVER', cover)
  },
  setMetadata: ({ commit }, metadata) => {
    return commit('SET_METADATA', metadata)
  },
  setPaginate: ({ commit }, paginate) => {
    return commit('SET_PAGINATE', paginate)
  },
  setPagelist: ({ commit }, pagelist) => {
    return commit('SET_PAGELIST', pagelist)
  },
  setIsBookmark({ commit }, isBookmark) {
    return commit('SET_IS_BOOKMARK', isBookmark)
  },
  setOffsetY({ commit }, offsetY) {
    return commit('SET_OFFSETY', offsetY)
  },
  setSpeakingIconBottom({ commit }, speakingIconBottom) {
    commit('SET_SPEAKING_ICON_BOTTOM', speakingIconBottom)
  },
  setHref({ commit }, href) {
    commit('SET_HREF', href)
  },
  setBookmark({ commit }, bookmark) {
    commit('SET_BOOKMARK', bookmark)
  },
  setHotSearchOffsetY({ commit }, hotSearchOffsetY) {
    commit('SET_HOT_SEARCH_OFFSETY', hotSearchOffsetY)
  },
  setFlapCardVisible({ commit }, flapCardVisible) {
    commit('SET_FLAP_CARD_VISIBLE', flapCardVisible)
  },
  setIsEditMode({ commit }, isEditMode) {
    commit('SET_IS_EDIT_MODE', isEditMode)
  },
  setShelfList({ commit }, shelfList) {
    commit('SET_SHELF_LIST', shelfList)
  },
  setShelfSelectedList({ commit }, shelfSelectedList) {
    commit('SET_SHELF_SELECTED_LIST', shelfSelectedList)
  },
  setShelfTitleVisible({ commit }, shelfTitleVisible) {
    commit('SET_SHELF_TITLE_VISIBLE', shelfTitleVisible)
  },
  setScrollY({ commit }, scrollY) {
    commit('SET_SCROLLY', scrollY)
  },
  setHistorySearch({ commit }, historySearch) {
    commit('SET_HISTORY_SEARCH', historySearch)
  }
}

export default actions
