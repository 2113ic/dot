import DireOptions from '../directive/index.js'

export default function init() {
  initDirective.call(this)
}

/**
 * Initializes the directives for the specified fragment or the entire base element.
 *
 * @param {DocumentFragment} fragment - The fragment to initialize directives within (optional).
 */
export function initDirective(fragment) {
  const dires = ['bind', 'clone', 'ref', 'event']
  const nodeListSelector = fragment
    ? (temp) => fragment.querySelectorAll(temp)
    : this.getNodeAll.bind(this)

  dires.forEach((dire) => {
    const temp = `[data-${dire}]`
    const nodeList = nodeListSelector(temp)

    nodeList.forEach((node) => {
      node.__o__ ||= {}
      DireOptions[dire].call(this, node)
    })
  })
}
