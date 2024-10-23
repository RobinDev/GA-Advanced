/**
 *
 * @param {number} min in seconds
 * @param {number|null} max 1000 = in seconds, 1 = in ms
 * @returns {Promise}
 */
export function wait(min = 3, max = null, factor = 1000) {
  if (max === null) {
    max = min + 1
  }
  const waitingTime = Math.floor(Math.random() * (max - min) * factor + min * factor)
  if (factor === 1000) {
    const waitTingTimeinS = Math.floor(waitingTime / 1000)
    console.log('- waiting ' + (waitTingTimeinS < 120 ? waitTingTimeinS + 's' : Math.floor(waitTingTimeinS / 60) + 'm'))
  }
  return new Promise((resolve) => setTimeout(resolve, waitingTime))
}
/**
 *
 * @param {number} min in seconds
 * @param {number|null} max in seconds
 * @returns {Promise}
 */
export function waitInMs(min = 1, max = null) {
  if (max === null) {
    max = min + 1
  }
  const waitingTime = Math.floor(Math.random() * (max - min) + min)
  const waitTingTimeinS = Math.floor(waitingTime / 1000)
  console.log('- waiting ' + (waitTingTimeinS < 120 ? waitTingTimeinS + 's' : Math.floor(waitTingTimeinS / 60) + 'm'))
  return new Promise((resolve) => setTimeout(resolve, waitingTime))
}

/**
 * @param {string} selector
 * @param {?string} name
 * @param {null|Element|Document} parent
 */
export function clickIfExists(selector, name = null, parent = null) {
  parent = parent ?? document
  const element = parent.querySelector(selector)
  if (element instanceof HTMLElement) element.click()
  console.log((name ?? selector) + ' not found - click not possible')
}

/**
 * @param {string|Element} elementOrSelector
 * @returns {HTMLElement}
 */
export function getHTMLElement(elementOrSelector) {
  let element = typeof elementOrSelector === 'string' ? document.querySelector(elementOrSelector) : elementOrSelector
  if (element instanceof HTMLElement) return element
  throw new Error('element is not HTMLElement')
}

/**
 * @param {string|number} num
 * @returns {string}
 */
export function formatNumber(num) {
  if (typeof num !== 'number') return num

  if (num >= 1000000) {
    return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M'
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'k'
  } else {
    return num.toString()
  }
}

/**
 * @param {string|Element} elementOrSelector
 * @returns {HTMLInputElement}
 */
export function getHTMLInputElement(elementOrSelector) {
  let element = typeof elementOrSelector === 'string' ? document.querySelector(elementOrSelector) : elementOrSelector
  if (element instanceof HTMLInputElement) return element
  throw new Error('element is not HTMLInputElement')
}

/**
 * @param {string} selector CSSselector  or xpath
 * @param {number} maxTime in ms, default 5s
 * @returns {Promise<Element>}
 */
export function waitForElm(selector, maxTime = 5000) {
  return new Promise((resolve) => {
    const isXPath = selector.startsWith('/') || selector.startsWith('//')
    const findXPath = (xpath) => document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue
    const find = isXPath ? findXPath : (sel) => document.querySelector(sel)

    const element = find(selector)
    if (element) return resolve(element)

    const observer = new MutationObserver(() => {
      const found = find(selector)
      if (found) {
        resolve(found)
        observer.disconnect()
      }
    })

    observer.observe(document.body, { childList: true, subtree: true })

    setTimeout(() => {
      observer.disconnect()
      resolve(null)
    }, maxTime)
  })
}
