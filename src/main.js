import AssignProduct from './assign-product.js'
import BetterAdminUi from './better-admin-ui.js'

/** @returns {void} */
export function run() {
  /** @returns {void} */
  function init() {
    new BetterAdminUi()
    // if (document.URL === 'https://www.grandangle.fr/ski-randonnee-nordique') {
    //   console.log('AssignProduct')
    //   new AssignProduct()
    // }
  }

  chrome.storage.local.get('isEnabled', (data) => {
    const isEnabled = data.isEnabled
    if (isEnabled) {
      console.log('init ' + isEnabled)
      return window.addEventListener('load', init, false)
    }
    console.log('Do Nothing')
  })

  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.isEnabled) return init()
  })
}
