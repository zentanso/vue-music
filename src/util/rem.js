(function (doc, win) {
  const docEl = doc.documentElement
  // const resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize'
  const recalc = function () {
    var clientWidth = docEl.clientWidth
    var height = window.innerHeight
    var ratio = clientWidth / height
    if (!clientWidth) return
    if (parseInt(ratio) * 100 > 65) {
      // 控制宽高比例
      clientWidth = height * 0.65
      docEl.style.margin = '0 auto'
      docEl.style.width = clientWidth + 'px'
    }
    docEl.style.fontSize = 20 * (clientWidth / 320) + 'px'
  }
  if (!doc.addEventListener) return
  // win.addEventListener(resizeEvt, recalc, false)
  doc.addEventListener('DOMContentLoaded', recalc, false)
})(document, window)
