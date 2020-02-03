export function throttle(fn, time = 50) {
  let eventCount = 0

  let timer = null
  const throttle = (e) => {
    eventCount++

    if (timer) {
      clearTimeout(timer)
      timer = null
    }

    if (eventCount > 40 && eventCount % 20 === 0) {
      fn(e)
      return
    }

    timer = setTimeout(() => {
      eventCount = 0
      fn(e)
    }, time)
  }

  return throttle
}

export function normalize(str) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '')
}

export function getColumnNumber(element) {
  const children = Array.from(element.children)
  let i = 0
  let previousChild = children[i]
  let nextChild = children[i + 1]

  while(nextChild && previousChild.offsetTop === nextChild.offsetTop) {
    previousChild = children[++i]
    nextChild = children[i + 1]
  }

  return i + 1
}
