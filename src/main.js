import BetterAdminUi from './better-admin-ui.js'

/** @returns {void} */
export function run() {
  /** @returns {void} */
  function init() {
    new BetterAdminUi()
  }

  chrome.storage.local.get('isEnabled', (data) => {
    const isEnabled = data.isEnabled
    if (isEnabled) {
      console.log('init')
      return window.addEventListener('load', init, false)
    }
    console.log('Do Nothing')
  })

  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.isEnabled) return init()
  })
}
