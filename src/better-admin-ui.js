import { getHTMLElement } from './helper.js'
import MenuManagerBeautifer from './menu-manager-beautifer.js'

export default class BetterAdminUi {
  constructor() {
    this.unobfuscate()
    if (document.querySelector('table#menu-overview tbody tr')) new MenuManagerBeautifer()
  }

  /**
   * [FrontEnd] unobfuscate link to permit to use ctrl+click or open in a new tab (not managing obfuscated link on img), add a title on unobfuscate link "obf"
   */
  unobfuscate() {
    const attribute = 'data-obf'
    document.querySelectorAll('span[data-obf]').forEach((element) => {
      let link = document.createElement('a')
      let href = element.getAttribute(attribute)
      element.removeAttribute(attribute)
      for (var i = 0, n = element.attributes.length; i < n; i++) {
        link.setAttribute(element.attributes[i].nodeName, element.attributes[i].nodeValue)
      }
      link.innerHTML = element.innerHTML
      link.setAttribute('title', 'obf')
      link.setAttribute('href', atob(href))
      element.replaceWith(link)
    })
  }

  switcher() {
    var location = window.location
    var hostname = location.hostname
    if (hostname === 'www.grandangle.fr') {
      var newUrl = location.href.replace('www.grandangle.fr', 'grandangle2023.votre-projet.com')
      window.location.href = newUrl
    } else if (hostname === 'grandangle2023.votre-projet.com') {
      var newUrl = location.href.replace('grandangle2023.votre-projet.com', 'www.grandangle.fr')
      window.location.href = newUrl
    }
  }
}
