chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.set({ isEnabled: true })
})

chrome.action.onClicked.addListener(() => {
  chrome.storage.local.get('isEnabled', (data) => {
    const newState = !data.isEnabled

    chrome.storage.local.set({ isEnabled: newState })

    // Notify the content script of the change
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]) {
        chrome.tabs.sendMessage(tabs[0].id, { isEnabled: newState })
      }
    })

    if (!newState) {
      chrome.action.setIcon({ path: 'icons/disabled.png' })
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs.length > 0) {
          chrome.tabs.reload(tabs[0].id)
        }
      })
    } else {
      chrome.action.setIcon({ path: 'icons/active.png' })
    }
  })
})
