export default class Pagination {
  constructor(option) {
    const selector = `[data-pagination=${option.el}]`

    this.el = document.querySelector(selector)
    this.option = option
    this.info = {}
    this.init()
  }

  init() {
    if (!this.option.total) return

    this.initConfig()

    const { lastPage, singlePageHide } = this.option

    if (lastPage <= 1 && singlePageHide) {
      this.el.style.display = 'none'
    }

    this.initNode()
    this.initEvent()
    this.cur = 1
  }

  initConfig() {
    const { total, limit, pageCount } = this.option
    const pages = Math.ceil(total / (limit || 10))
    const halfPagerCount = Math.ceil(pageCount / 2)
    const lastPage = pages

    this.option = {
      limit: 10,
      pageCount: 7,
      lastPage,
      halfPagerCount,
      cloneCount: lastPage <= pageCount ? lastPage : pageCount + 2,
      middlePageIndex: Math.floor((pageCount - 2) / 2),
      jump: () => {},
      ...this.option,
    }

    this.proxyCur()
  }

  proxyCur() {
    const that = this

    Object.defineProperty(this, 'cur', {
      get() {
        return that.info.cur
      },
      set(cur) {
        that.info.cur = cur
        that.updateInfo(cur)
        that.updatePages()
        that.updateDisableState()
        that.option.jump.call(that, that.info)
        that.clearFlag(that.pages.children, 'active')
        that.filterByInnerHTML(this.pages.children, cur).classList.add('active')
      },
    })
  }

  filterByInnerHTML(nodes, cur) {
    return Array.from(nodes).find((node) => node.innerHTML == cur)
  }

  updateInfo(cur) {
    const { total, limit, pageCount } = this.option
    const pages = Math.ceil(total / (limit || 10))
    const halfPagerCount = Math.ceil(pageCount / 2)
    const lastPage = pages

    this.info = {
      cur,
      showBeforeMore: cur > halfPagerCount,
      showAfterMore: cur + halfPagerCount <= lastPage,
      isFirstPage: cur === 1,
      isLastPage: cur === lastPage,
    }
  }

  updatePages() {
    const { lastPage, cloneCount, pageCount } = this.option
    const { showBeforeMore, showAfterMore } = this.info
    const lists = this.getLists(this.cur)
    const nodes = this.pages.children
    const len = nodes.length
    const firstElement = nodes[0]
    const lastElement = nodes[cloneCount - 1]
    
    if (cloneCount > this.option.pageCount) {
      const beforeMoreElement = nodes[1]
      const afterMoreElement = nodes[cloneCount - 2]

      beforeMoreElement.hidden = !showBeforeMore
      afterMoreElement.hidden = !showAfterMore
    }

    firstElement.innerHTML = 1
    lastElement.innerHTML = lastPage

    if (cloneCount <= pageCount) {
      for (let i = 1; i < pageCount && lists.length > 0; i++) {
        nodes[i].innerHTML = lists.shift()
      }
    } else {      
      for (let i = 2; i < len - 2 && lists.length > 0; i++) {
        nodes[i].innerHTML = lists.shift()
      }
    }
  }

  initNode() {
    const { cloneCount } = this.option
    const liNode = this.createElement('li', { className: 'page' })
    const fragment = this.cloneNode(liNode, cloneCount, true)
    
    if (cloneCount > this.option.pageCount) {
      const beforeMore = fragment.children[1]
      const afterMore = fragment.children[cloneCount - 2]

      beforeMore.hidden = true
      afterMore.hidden = true
      beforeMore.className = 'more'
      afterMore.className = 'more'
    }
    ;[this.prevBtn, this.pages, this.nextBtn] = [...this.el.children]
    this.pages.append(fragment)
  }

  initEvent() {
    const bindEvent = (el, evt, func) => el.addEventListener(evt, func)

    bindEvent(this.prevBtn, 'click', this.prev.bind(this))
    bindEvent(this.nextBtn, 'click', this.next.bind(this))
    bindEvent(this.pages, 'click', this.pageList.bind(this))
  }

  prev() {
    this.cur -= 1
  }

  next() {
    this.cur += 1
  }

  pageList(e) {
    const el = e.target
    if (!el.classList.contains('page') || el.classList.contains('active')) {
      return
    }

    this.cur = +el.innerHTML
  }

  /**
   * Get an array of page numbers to display pagination links.
   *
   * @example
   * 1. lastPage = 5, pagerCount = 7
   * cur = 1,2,3,4,5
   * [1, 2, 3, 4, 5]
   *
   * 2. lastPage = 8, pagerCount = 7
   * cur = 1,2,3,4
   * [1, 2, 3, 4, 5, 6, '...',8]
   *
   * cur = 5,6,7,8
   * [1, '...', 3, 4, 5, 6, 7, 8]
   *
   * 3. lastPage = 12, pagerCount = 7
   * cur = 1,2,3,4
   * [1, 2, 3, 4, 5, 6, '...', 12]
   *
   * cur = 5
   * [1, '...', 3, 4, 5, 6, 7, '...', 12]
   *
   * cur = 8
   * [1, '...', 6, 7, 8, 9, 10, '...', 12]
   *
   * cur = 9
   * [1, '...', 7, 8, 9, 10, 11, 12]
   * @param {number} cur - Current page number.
   * @returns {number[]} - An array of page numbers.
   */
  getLists(cur) {
    const { halfPagerCount, middlePageIndex, lastPage } = this.option
    const result = []

    if (cur > halfPagerCount) {
      while (cur + middlePageIndex + 1 > lastPage) {
        cur--
      }

      const min = cur - middlePageIndex
      const max = cur + middlePageIndex

      for (let i = min; i <= max; i++) {
        result.push(i)
      }
    } else {
      for (let i = 2; i < 2 * halfPagerCount - 1; i++) {
        result.push(i)
      }
    }

    return result.filter((item) => 1 < item && item < lastPage)
  }

  updateDisableState() {
    const pages = this.option.pages
    const { isFirstPage, isLastPage, cur } = this.info

    if (cur !== 1 || cur !== pages) {
      this.prevBtn.disabled = false
      this.nextBtn.disabled = false
    }
    if (isFirstPage) {
      this.prevBtn.disabled = true
    }
    if (isLastPage) {
      this.nextBtn.disabled = true
    }
  }

  cloneNode(node, num, deep) {
    const fragment = document.createDocumentFragment()
    deep = deep || false

    for (let i = 0; i < num; i++) {
      fragment.append(node.cloneNode(deep))
    }

    return fragment
  }

  /**
   * 创建元素
   * @param {String} ele 元素
   * @param {Object} options element属性
   * @returns element
   */
  createElement(ele, options) {
    const el = document.createElement(ele)

    if (!options) return el

    for (const [key, value] of Object.entries(options)) {
      if (key === 'style') {
        Object.assign(el.style, value)
        continue
      }
      el[key] = value
    }
    return el
  }

  /**
   * Removes a specific class from all elements in a given list of elements.
   * @param {NodeList} lists - NodeList consisting of elements to clear the class from.
   * @param {string} flag - Name of the class to remove from all elements.
   * @returns {void} - Nothing is returned.
   */
  clearFlag(lists, flag) {
    ;[...lists].forEach((e) => {
      e.classList.remove(flag)
    })
  }

  getNode(selector) {
    return this.el.querySelector(selector)
  }

  getNodeAll(selector) {
    return this.el.querySelectorAll(selector)
  }
}
