export default (() => {
  const getCookieObj = () => {
    const arr = document.cookie.split('; ')
    let cookieObj = {}

    arr.forEach(item => {
      const tmp = item.split('=')
      const key = tmp[0]
      const val = tmp[1]
      cookieObj[key] = val
    })
    return cookieObj
  }
  const get = (name) => {
    const cookieObj = getCookieObj()
    return cookieObj[name]
  }
  return {
    get
  }
})()
