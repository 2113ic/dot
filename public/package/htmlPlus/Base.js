export default Base

/**
 * HTML plus 的基础
 * @param selector 模块的选择器
 * @constructor
 */
function Base(selector, initData) {
  this.$el = document.querySelector(selector)
  this.$option = { selector }
  this.$templates = []
  this.$data = initData()
  init.call(this)

  console.log(this)
}

/**
 * 获取节点
 * @param selector 需要获取节点的选择器
 * @returns {HTMLElement} 第一节点
 */
Base.prototype.getNode = function (selector) {
  return this.$el.querySelector(selector)
}

/**
 * 获取所有符合的节点
 * @param selector 需要获取节点的选择器
 * @returns {NodeListOf<*> | NodeListOf<Element>} 返回所有节点列表
 */
Base.prototype.getNodeAll = function (selector) {
  return this.$el.querySelectorAll(selector)
}

Base.prototype.start = function () {
  traverseTree(this.$templates, (item) => {
    const tempKey = Object.keys(item).filter((key) => key !== 'children')[0]
    const template = item[tempKey]
    const parent = template.parentNode

    parent.append(template.cloneStart.call(this))
  })
}

function init() {
  initDirective.call(this)
}

/**
 * 初始化指令
 * @param {DocumentFragment | undefined} fragment 文档片段
 */
function initDirective(fragment) {
  const dires = ['bind', 'clone', 'ref', 'event']
  const nodeListSelector = fragment
    ? (temp) => fragment.querySelectorAll(temp)
    : this.getNodeAll.bind(this)

  dires.forEach((dire) => {
    const temp = `[data-${dire}]`
    const nodeList = nodeListSelector(temp)

    nodeList.forEach((node) => {
      getDirectiveFunc.call(this, dire)(node)
    })
  })
}

/**
 * 获取指令函数
 * @param {String} dire 指令
 * @returns {Function} 返回指令函数
 */
function getDirectiveFunc(dire) {
  /**
   * 获取指令的值
   * @param {HTMLElement} node 含有指令的节点
   * @returns {Array<String>}
   */
  const getDireValue = (node) => {
    return node.dataset[dire].replaceAll(' ', '').split(':')
  }
  const option = {
    clone: (node) => {
      const [cloneTarget, isDeep, cloneDataKey] = getDireValue(node)
      const parent = node.closest('[data-target]')
      const index = parent ? parent.__o__.id : ''
      const tempKey = `${cloneTarget}s${index}`
      const newChild = {
        [tempKey]: node,
        children: [],
      }

      if (index === '') {
        this.$templates.push(newChild)
      } else {
        const parentTarget = parent.dataset.target
        const parentItem = getParentItemByKey(
          this.$templates,
          `${parentTarget}s`
        )

        if (parentItem) {
          parentItem.children.push(newChild)
        } else {
          const { lastCloneTarget } = this.$option
          const i = this.$templates.findIndex(
            (item) => `${lastCloneTarget}s` in item
          )

          this.$templates[i].children.push(newChild)
        }
      }

      node.cloneStart = function () {
        const child = node.content.children[0]
        const data = getCloneData.call(this, cloneDataKey, node)
        const fragment = cloneNode.call(this, child, {
          cloneTarget,
          data,
          isDeep: Boolean(isDeep),
        })

        this[cloneTarget] = child
        this.$option.lastCloneTarget = cloneTarget
        initDirective.call(this, fragment)

        return fragment
      }
    },
    bind: (node) => {
      let [attrName, key] = getDireValue(node)
      const { lastCloneTarget } = this.$option
      let data

      // 如果是初次绑定数据，lastCloneTarget === undefined
      if (lastCloneTarget) {
        const temp = `[data-target="${this[lastCloneTarget].dataset.target}"]`
        data = node.closest(temp).__o__.data
      } else {
        data = this.$data
      }

      if (typeof data[key] === 'object') {
        data = JSON.stringify(data[key])
      } else {
        data = new Function(
          'data',
          'key',
          `
            if (key === '$item') {
              return typeof data === 'object' ? JSON.stringify(data) : data
            }
            return data.${key}
          `
        )(data, key)
      }

      node[attrName] += data
    },
    ref: (node) => {
      const key = getDireValue(node)[0]

      if (this.hasOwnProperty(key)) {
        const orignItem = this[key]

        if (!Array.isArray(orignItem)) {
          this[key] = [orignItem]
        }
        this[key].push(node)
      } else {
        this[key] = node
      }
    },
    event: (node) => {
      const [eventName, methodName] = getDireValue(node)

      try {
        node.addEventListener(eventName, this[methodName].bind(this))
      } catch (error) {
        console.error(
          `Failed to bind event listener for method '${methodName}'.\n`,
          error
        )
      }
    },
  }

  return option[dire]
}

function getParentItemByKey(arr, tempKey) {
  for (let i = 0; i < arr.length; i++) {
    const item = arr[i]

    if (item.children.length > 0) {
      const child = item[tempKey]

      if (child) {
        return {
          [tempKey]: child,
          children: item.children,
        }
      } else {
        const parent = getParentItemByKey(item.children, tempKey)

        if (parent) {
          return parent
        }
      }
    }
  }
  return null
}

function traverseTree(arr, callback) {
  for (const item of arr) {
    callback(item)
    if (item.children && item.children.length > 0) {
      traverseTree(item.children, callback)
    }
  }
}

function getCloneData(cloneDataKey, node) {
  const $data = this.$data
  const dataType = getType($data)
  let cloneData

  if (dataType === 'object') {
    const getDataValue = new Function('data', `return data.${cloneDataKey}`)
    const value = getDataValue($data)

    if (cloneDataKey && value) {
      cloneData = value
    } else {
      const targetDataAttr = node.closest('[data-target]')?.__o__.data

      cloneData = targetDataAttr[cloneDataKey]
    }
  } else if (dataType === 'array') {
    const targetDataAttr = node.closest('[data-target]')?.__o__.data

    if (targetDataAttr) {
      cloneData = targetDataAttr[cloneDataKey]
    }
  }

  return cloneData || $data
}

/**
 * 克隆节点
 * @param {Node} node 需要克隆的节点
 * @param {Object} option 克隆的配置
 * @param {Array} option.data 克隆节点的数据数组
 * @param {boolean} [option.isDeep=false] 是否进行深拷贝，默认为 false
 * @param {string} [option.cloneTarget] 克隆目标标识
 * @returns {DocumentFragment} 返回克隆后的文档片段
 */
function cloneNode(node, option) {
  const fragment = document.createDocumentFragment()
  const { data, cloneTarget, isDeep = false } = option

  for (let i = 0; i < data.length; i++) {
    const clonedNode = node.cloneNode(isDeep)

    clonedNode.__o__ = {
      id: i,
      data: data[i],
      cloneTarget,
    }
    fragment.append(clonedNode)
  }

  return fragment
}

function getType(data) {
  return Object.prototype.toString.call(data).slice(8, -1).toLowerCase()
}
