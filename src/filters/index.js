export function getPlayerTime (seconds) {
  seconds = Math.floor(seconds)
  let sec = seconds % 60 + ''
  sec = sec.replace(/^(\d)$/, '0$1')
  const min = Math.floor(seconds / 60)
  return `${min}:${sec}`
}

export function getListenNum (number) {
  const base = 10000
  number = Number(number)
  return number >= base ? Math.ceil(number / base) + '万' : number
}
