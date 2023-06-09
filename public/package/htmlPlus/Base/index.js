import init from './init/index.js'
import DireOptions from './directive/index.js'
export default Base

/**
 * Constructs a new instance of the Base class.
 *
 * @param {string} selector - The selector used to query the element.
 * @param {function} initData - The function used to initialize the data for the instance (optional).
 * @constructor
 */
function Base(selector, initData = () => {}) {
  this.$el = document.querySelector(selector)
  this.$option = { selector, templates: [] }
  this.$data = initData() || null

  init.call(this)
  console.log(this)
}

/**
 * Returns the first matching element within the context of the base element.
 *
 * @param {string} selector - The selector to query.
 * @returns {Element} - The first matching element within the context of the base element.
 */
Base.prototype.getNode = function (selector) {
  return this.$el.querySelector(selector)
}

/**
 * Returns a static (non-live) NodeList of all matching elements within the context of the base element.
 *
 * @param {string} selector - The selector to query.
 * @returns {NodeList} - A static NodeList of all matching elements within the context of the base element.
 */
Base.prototype.getNodeAll = function (selector) {
  return this.$el.querySelectorAll(selector)
}

/**
 * Start cloning templates and binding data.
 */
Base.prototype.cloneStart = function () {
  traverseTree(this.$option.templates, (item) => {
    const tempKey = Object.keys(item).filter((key) => key !== 'children')[0]
    const template = item[tempKey]
    const parent = template.__o__.parent

    parent.append(template.cloneStart.call(this, template))
  })
}

Base.prototype.bindStart = function () {
  const nodeList = this.getNodeAll('[data-bind]')

  nodeList.forEach((item) => {
    nodeList.__o__ ||= {}
    DireOptions.bind.call(this, item)
  })
}

/**
 * Traverses a tree-like structure represented by an array and applies a callback function to each item.
 * @param {Array} arr - The array representing the tree.
 * @param {function} callback - The callback function to apply to each item.
 */
function traverseTree(arr, callback) {
  for (const item of arr) {
    callback(item)

    if (item.children && item.children.length > 0) {
      traverseTree(item.children, callback)
    }
  }
}
