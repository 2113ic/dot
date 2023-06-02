export default function (node) {
  const key = node.dataset.ref

  if (this.hasOwnProperty(key)) {
    const orignItem = this[key]

    if (!Array.isArray(orignItem)) {
      this[key] = [orignItem]
    }
    this[key].push(node)
  } else {
    this[key] = node
  }

  node.__o__.ref = key
}
