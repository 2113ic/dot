const mode = import.meta.env

function getURL(name) {
  return mode.DEV ? `./public/package/${name}/` : `./packge/${name}/`
}

export default [
  {
    title: 'Banner',
    cover: 'banner.png',
    url: getURL('banner'),
  },
  {
    title: 'LightTip',
    cover: 'lightTip.png',
    url: getURL('LightTip'),
  },
]
