function info(content) {
  message('info', content)
}

function success(content) {
  message('success', content)
}

function warning(content) {
  message('warning', content)
}

function error(content) {
  message('error', content)
}

/**
 * 信息
 * @param {String} type 类型
 * @param {String} content 内容
 */
function message(type, content) {
  if (!document.getElementById('fl-message')) {
    createMessageList()
    message(type, content)
  } else {
    addMessage(type, content)
  }
}

function createMessageList() {
  const div = document.createElement('div')

  div.setAttribute('id', 'fl-message')
  document.body.appendChild(div)
}

function addMessage(type, content) {
  const messageListDom = document.getElementById('fl-message')
  const newMessageDom = document.createElement('div')

  const svgArr = {
    success:
      '<svg width="14" height="14" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5"/></svg>',
    warning:
      '<svg width="14" height="14" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0zM12 9v4M12 17h.01"/></svg>',
    error:
      '<svg width="14" height="14" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 8v4m0 4h.01"/></svg>',
    info: '<svg width="14" height="14" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0"/></svg>',
  }

  newMessageDom.innerHTML = `${svgArr[type]}<div class="content">${content}</div>`
  newMessageDom.setAttribute('class', `message message-${type}`)
  messageListDom.append(newMessageDom)

  setTimeout(() => {
    newMessageDom.classList.toggle('message-insert')

    setTimeout(() => {
      newMessageDom.classList.toggle('message-leave')

      setTimeout(() => {
        if (newMessageDom) messageListDom?.removeChild(newMessageDom)
      }, 250)
    }, 3000)
  }, 10)
}

export default {
  name: 'LightTip',
  info,
  success,
  warning,
  error,
}
