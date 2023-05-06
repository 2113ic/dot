export default class Banner {
  /**
   * Banner constructor
   *
   * @param {object} options
   * - Banner option object
   *
   * @param {string | HTMLElement} options.el
   * - Selector or element for banner
   *
   * @param {number} [options.wait=5000]
   * - Time to wait for each banner, unit: ms
   *
   * @param {number} [options.duration=300]
   * - Change interval for each banner, unit: ms
   */
  constructor(options) {
    this.options = options
    this.init()
  }

  init() {
    /** @type {HTMLElement} */
    this.el = this.toElement(this.options.el)

    /** @type {HTMLElement} */
    this.list = this.el.querySelector('.banner-list')

    /** @type {HTMLElement} */
    this.dots = this.el.querySelector('.dots')

    /** @type {HTMLElement} */
    this.prevBtn = this.el.querySelector('.prev')

    /** @type {HTMLElement} */
    this.nextBtn = this.el.querySelector('.next')

    this.options = {
      ...this.options,
      bannerWidth: this.list.firstElementChild.clientWidth,
      duration: this.options.duration || 300,
      wait: this.options.wait || 5000,
      cur: 0,
    }

    this.cloneFirst()
    this.initCur()
    this.initEvent()
    this.increment()
  }

  initEvent() {
    const addEvt = (node, e, fn) => node.addEventListener(e, fn)
    const prev = () => this.cur--
    const next = () => this.cur++

    addEvt(this.prevBtn, 'click', prev)
    addEvt(this.nextBtn, 'click', next)
    addEvt(this.el, 'mouseleave', this.increment.bind(this))
    addEvt(this.el, 'mouseenter', this.stop.bind(this))
    addEvt(this.dots, 'click', this.dot.bind(this))
  }

  initCur() {
    const that = this
    /** @type {CSSStyleDeclaration} */
    const listStyle = this.list.style
    const len = this.list.children.length

    Object.defineProperty(this, 'cur', {
      get() {
        return that.options.cur
      },
      set(val) {
        that.stop()
        /** @type {number} - value is will jump banner num */
        const value = val >= len ? 0 : val <= -1 ? len - 1 : val
        const isPrev = this.cur > val
        const isNext = !isPrev

        listStyle.transitionDuration = that.options.duration + 'ms'
        if ((isNext && value === 0) || (isPrev && value === len - 1)) {
          // remove transition.
          listStyle.transitionDuration = '0s'
          if (isNext) that.increment(0)
          if (isPrev) that.decrease(0)
        }

        listStyle.left = -that.options.bannerWidth * value + 'px'
        that.options.cur = value
        that.increment()
        that.updateDot()
      },
    })
  }

  increment(wait) {
    const timeOut = wait !== 0 ? this.options.wait : wait
    this.timer = setTimeout(() => this.cur++, timeOut)
  }

  decrease(wait) {
    const timeOut = wait !== 0 ? this.options.wait : wait
    this.timer = setTimeout(() => this.cur--, timeOut)
  }

  stop() {
    clearInterval(this.timer)
  }

  dot(e) {
    /** @type {HTMLElement} */
    const target = e.target

    if (
      target.classList.contains('active') ||
      !target.classList.contains('dot')
    )
      return

    this.clearDot()
    target.classList.add('active')
    this.cur = target.dataset.index
  }

  updateDot() {
    const len = this.list.children.length
    const index = this.cur >= len - 1 ? 0 : this.cur <= -1 ? len - 1 : this.cur

    this.clearDot()
    this.dots
      .querySelector('[data-index="' + index + '"]')
      .classList.add('active')
  }

  clearDot() {
    this.dots.querySelector('.active').classList.remove('active')
  }

  cloneFirst() {
    const firstNode = this.list.firstElementChild
    this.list.append(firstNode.cloneNode(true))
  }

  /**
   * Selector switch to element node
   * @param {string|HTMLElement} el Selector or element for banner
   * @return {HTMLElement | null} Element for banner
   */
  toElement(el) {
    return typeof el === 'string' ? document.querySelector(el) : el
  }
}
