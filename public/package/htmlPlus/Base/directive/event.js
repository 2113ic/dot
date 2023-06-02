export default function (node) {
  const rawEvent = node.dataset.event.replaceAll(' ', '')
  const [eventName, methodName] = rawEvent.split(':')

  try {
    node.addEventListener(eventName, this[methodName].bind(this))
  } catch (error) {
    console.error(
      `Failed to bind event listener for method '${methodName}'.\n`,
      error
    )
  }

  node.__o__.event = {
    eventName,
    methodName,
  }
}
