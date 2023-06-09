export default class TabSwitcher {
  /**
   * TabSwitcher constructor
   *
   * @param {object} options
   * - Option object
   *
   * @param {string | HTMLElement} options.el
   * - Selector or element for tabSwitcher
   *
   * @param {string} [options.flag='active']
   * - Class flag for element active status
   *
   * You can troungh `flag` control element active style
   */
  constructor(options) {
    this.options = options
    this.init()
  }

  init() {
    /** @type {HTMLElement} */
    this.el = this.toElement(this.options.el)
    this.options = {
      ...this.options,
      flag: this.options.flag || '.active',
    }
    this.initNode()
    this.el.addEventListener('click', this.toggle.bind(this))
  }

  initNode() {
    // Get reference to elements
    const tabForRefs = this.el.querySelectorAll('[data-tab-for]')
    const targetRefs = document.querySelectorAll('[data-tab-target]')

    // Extract attribute values from the element references
    this.tabForRefs = tabForRefs
    this.tabFors = this.getTabFors(tabForRefs)
    this.tabTargetRefs = this.getTabTargets(targetRefs)

    // Map tabFors and tabTargets to an object
    this.tabTargetMap = this.createTabTargetRefMap(
      this.tabFors,
      this.tabTargetRefs
    )
  }

  // Extract 'data-tab-for' attribute values from the element references
  getTabFors(tabForRefs) {
    return [...tabForRefs].map((el) => el.dataset.tabFor)
  }

  getTabTargets(targetRefs) {
    return [...targetRefs].filter((e) =>
      this.tabFors.includes(e.dataset.tabTarget)
    )
  }

  // Map 'data-tab-for' and 'data-tab-target' attribute values to an object
  createTabTargetRefMap(tabFors, tabTargets) {
    const map = new Map()

    // Use a for loop to ensure that the order of the elements is preserved
    for (let i = 0; i < tabFors.length; i++) {
      const tabFor = tabFors[i]
      const tabTarget = tabTargets[i]

      map.set(tabFor, tabTarget)
    }

    return map
  }

  toggle(e) {
    /** @type {HTMLElement} */
    const target = e.target
    const curTab = target.dataset.tabFor

    if (!this.tabFors.includes(curTab)) return
    const flag = this.options.flag
    const flagCarry = flag.slice(1)
    const targetPage = this.tabTargetMap.get(curTab)

    this.clearFlag(this.tabForRefs, flagCarry)
    this.clearFlag(this.tabTargetRefs, flagCarry)
    target.classList.add(flagCarry)
    targetPage.classList.add(flagCarry)
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

  /**
   * Selector switch to element node
   * @param {string | HTMLElement} el Selector or element for banner
   * @return {HTMLElement | null} Element for banner
   */
  toElement(el) {
    return typeof el === 'string'
      ? document.querySelector('[data-tab="' + el + '"]')
      : el
  }
}
