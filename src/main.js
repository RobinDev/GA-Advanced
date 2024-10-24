import AssignProduct from './assign-product.js'
import BetterUi from './better-ui.js'

/** @returns {void} */
export function run() {
  /** @returns {void} */
  function init() {
    new BetterUi()
    // if (document.URL === 'https://www.grandangle.fr/ski-randonnee-nordique') new AssignProduct()
  }

  chrome.storage.local.get('isEnabled', (data) => {
    const isEnabled = data.isEnabled
    if (isEnabled) {
      return init()
    }
  })

  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.isEnabled) return init()
  })
}
