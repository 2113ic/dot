export default function (node) {
  if (!this.$data) return
  const params = getBindParams(node)

  if (Array.isArray(params)) {
    const [attrName, key] = params

    node[attrName] += getRightData.call(this, node, key)
  } else {
    Object.entries(params).forEach(([attrName, key]) => {
      node[attrName] += getRightData.call(this, node, key)
    })
  }

  node.__o__.bind = params
}

/**
 * Retrieves the data associated with the specified key from a given node.
 * @param {HTMLElement} node - The node containing the data.
 * @param {string} key - The key to retrieve the data from.
 * @returns {String} - The retrieved data.
 */
function getRightData(node, key) {
  const { lastCloneTarget } = this.$option
  let data

  // if first bind data then lastCloneTarget === undefined
  if (lastCloneTarget) {
    const target = this[lastCloneTarget].dataset.target
    const temp = `[data-target="${target}"]`

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

  return data
}

/**
 * Retrieves the bind parameter from a given node's dataset.
 * @param {HTMLElement} node - The node from which to retrieve the bind parameter.
 * @returns {Array<string> | object} The bind parameter value.
 */
function getBindParams(node) {
  /** @type {string} */
  let rawBind = node.dataset.bind.replaceAll(' ', '')
  let value

  if (!rawBind.indexOf('{')) {
    const temp = rawBind.slice(1, -1).split(',')
    value = {}

    temp.forEach((item) => {
      const [attrName, key] = item.split(':')

      value[attrName] = key
    })
  } else {
    value = rawBind.split(':')
  }

  return value
}
