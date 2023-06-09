const mode = import.meta.env

function getURL(name) {
  return mode.DEV ? `./public/package/${name}/` : `./package/${name}/`
}

function getCover(name) {
  return mode.DEV ? `./public/cover/${name}` : `./cover/${name}`
}

export default [
  {
    title: 'Banner',
    cover: getCover('banner.png'),
    url: getURL('banner'),
  },
  {
    title: 'LightTip',
    cover: getCover('light-tip.png'),
    url: getURL('LightTip'),
  },
  {
    title: 'htmlPlus',
    cover: getCover('html-plus.webp'),
    url: getURL('htmlPlus'),
  },
  {
    title: 'TabSwitcher',
    cover: getCover('tab-switcher.png'),
    url: getURL('TabSwitcher'),
  },
]
