import { getHTMLElement, getHTMLInputElement } from './helper.js'

document.addEventListener('DOMContentLoaded', () => {
  const enabledWrapper = getHTMLElement('#enabled')
  const enabledSwitcherInput = getHTMLInputElement(enabledWrapper.querySelector('input[type="checkbox"]'))

  chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
    const tab = tabs[0]
    if (!tab.url.includes('grandangle')) {
      getHTMLElement('#enabled').classList.add('opacity-25')
    }
    chrome.storage.local.get('isEnabled', (data) => {
      const isEnabled = data.isEnabled
      if (isEnabled) {
        enabledSwitcherInput.checked = true
      }
    })
  })

  enabledSwitcherInput.addEventListener('change', async () => {
    chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
      const tab = tabs[0]
      const state = enabledSwitcherInput.checked ? true : false
      if (enabledSwitcherInput.checked) {
        chrome.storage.local.set({ isEnabled: true })
        chrome.storage.local.set({ linkCache: {} })
      } else chrome.storage.local.set({ isEnabled: false })
      chrome.tabs.reload(tab.id)
    })
  })
})
