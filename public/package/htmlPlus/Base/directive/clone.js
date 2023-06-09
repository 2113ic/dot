import { initDirective } from '../init/index.js'

export default function (node) {
  const [target, deep, dataKey] = getCloneParams(node)

  handleTemplate.call(this, node, target)
  node.__o__ = {
    tempKey: `${target}s`,
    parent: node.parentNode,
    clone: {
      target,
      dataKey,
      deep,
    },
  }
  node.cloneStart = cloneStart
}

/**
 * Retrieves the clone parameters from the dataset of a given DOM node.
 *
 * @param {Node} node - The DOM node from which to retrieve the clone parameters.
 * @returns {Array<string>} - An array of clone parameters.
 */
function getCloneParams(node) {
  return node.dataset.clone.replaceAll(' ', '').split(':')
}

/**
 * Add the template node to this.$option.templates.
 * 
 * @param {HTMLElement} node template node
 * @param {String} target template's target param
 */
function handleTemplate(node, target) {
  const parent = node.closest('[data-target]')
  const id = parent ? parent.__o__.id : null
  const curTempKey = id === null ? `${target}s` : `${target}s__${id}`
  const { lastCloneTarget, templates } = this.$option
  const newChild = getNewChild(node, curTempKey)

  if (lastCloneTarget) {
    const parentTarget = parent.dataset.target
    const item = breadthFirstSearch(templates, `${parentTarget}s`)

    item.children.push(newChild)
  } else {
    templates.push(newChild)
  }
}

/**
 * Initiates the cloning process by cloning the target node and initializing directives.
 * 
 * @param {Node} node - The node to be cloned.
 * @returns {DocumentFragment} - The document fragment containing the cloned nodes.
 */
function cloneStart(node) {
  const { target, dataKey, deep } = node.__o__.clone
  const child = node.content.children[0]
  const data = getCloneData.call(this, node, dataKey)
  const fragment = cloneNode.call(this, child, {
    isDeep: JSON.parse(deep),
    target,
    data,
  })

  this[target] = child
  this.$option.lastCloneTarget = target
  initDirective.call(this, fragment)
  return fragment
}

function getNewChild(node, tempKey) {
  return {
    [tempKey]: node,
    children: [],
  }
}

/**
 * Performs breadth-first search in the provided data structure to find an item based on the given key.
 * 
 * @param {Array} data - The data structure to be searched.
 * @param {string} key - The key to be searched for.
 * @returns {Object|null} - The found item if a match is found, otherwise null.
 */
function breadthFirstSearch(data, key) {
  const queue = []

  for (const item of data) {
    queue.push(item)
  }

  while (queue.length > 0) {
    const item = queue.shift()

    if (item.hasOwnProperty(key)) {
      return item
    }

    if (item.children && item.children.length > 0) {
      for (const child of item.children) {
        queue.push(child)
      }
    }
  }

  return null
}

/**
 * Retrieves the clone data associated with a given DOM node.
 * 
 * @param {Node} node - The DOM node for which to retrieve the clone data.
 * @param {string} cloneDataKey - The key associated with the clone data.
 * @returns {*} - The clone data associated with the node, or the global data if not found.
 */
function getCloneData(node, cloneDataKey) {
  const $data = this.$data
  const dataType = getType($data)
  let cloneData

  if (dataType === 'object') {
    const getDataValue = new Function('data', `return data.${cloneDataKey}`)
    const value = getDataValue($data)

    if (cloneDataKey && value) {
      cloneData = value
    } else {
      cloneData = getTargetData(node)[cloneDataKey]
    }
  } else if (dataType === 'array') {
    const targetData = getTargetData(node)

    if (targetData) {
      cloneData = targetData[cloneDataKey]
    }
  }

  return cloneData || $data
}

/**
 * Retrieves the target data associated with the closest ancestor of a given DOM node that has the 'data-target' attribute.
 * 
 * @param {Node} node - The DOM node for which to retrieve the target data.
 * @returns {*} - The target data associated with the node's ancestor, or undefined if not found.
 */
function getTargetData(node) {
  return node.closest('[data-target]')?.__o__.data
}

function getType(data) {
  return Object.prototype.toString.call(data).slice(8, -1).toLowerCase()
}

/**
 * Clones a DOM node multiple times with optional data and deep cloning.
 * 
 * @param {Node} node - The DOM node to be cloned.
 * @param {Object} option - The cloning options.
 * @param {Array} option.data - The data to be associated with each cloned node.
 * @param {boolean} [option.isDeep=false] - Specifies whether to perform deep cloning or not.
 * @returns {DocumentFragment} - The document fragment containing the cloned nodes.
 */
function cloneNode(node, option) {
  const fragment = document.createDocumentFragment()
  const { data, isDeep = false } = option

  for (let i = 0; i < data.length; i++) {
    const clonedNode = node.cloneNode(isDeep)

    clonedNode.__o__ = {
      id: i,
      data: data[i],
    }
    fragment.append(clonedNode)
  }

  return fragment
}
