import { getHTMLElement } from './helper.js'
import MenuManagerBeautifer from './menu-manager-beautifer.js'

export default class BetterAdminUi {
  constructor() {
    this.unobfuscate()
    if (document.querySelector('table#menu-overview tbody tr')) new MenuManagerBeautifer()
    this.showDeadLinks()
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

  showDeadLinks() {
    // Sélectionner tous les liens sur la page
    const links = document.querySelectorAll('a')

    links.forEach((link) => {
      const href = link.href
      if (!href) return
      if (!(href.includes('grandangle.fr') || href.includes('grandangle2023') || href.includes('grandangletours.com'))) return
      if (href.includes('facebook.com')) return
      if (href.includes('/product/')) return
      if (href.includes('/run-cron')) return
      if (href.includes('/media/')) return
      if (href.includes('/devel/')) return
      if (href.includes('/ajax/')) return
      if (href.includes('/admin')) return
      if (href.includes('/comment/reply/')) return
      if (href.includes('/node/add/')) return
      if (href.includes('#comments')) return
      if (!href.startsWith('http')) return
      if (href.endsWith('/update.php')) return
      if (href.endsWith('/add')) return
      if (href.endsWith('/edit')) return
      if (href.endsWith('/delete')) return
      if (href.endsWith('/translations')) return

      if (
        href.includes('activite=') ||
        href.includes('saisons=') ||
        href.includes('duree=') ||
        href.includes('thematique=') ||
        href.includes('niveau=') ||
        href.includes('itinerance=') ||
        href.includes('voyage=')
      ) {
        if (!(link.classList.contains('obf') || link.title === 'obf')) {
          console.log('-- To Obfuscate', href, link)
          link.classList.add('to-obf-link')
          link.title = 'liens à obfusquer'
        }
      }

      if (href.includes('destination_selected') || href.includes('activites%5B81%5D')) {
        console.log('-- Dead Link', href, link)
        link.classList.add('dead-link')
        link.title = "Les filtres datent de l'ancienne version et ne sont plus valide"
        return
      }

      fetch(href, {
        method: 'HEAD',
        credentials: 'omit', // Empêche l'envoi des cookies, comme si on était déconnecté
      })
        .then((response) => {
          if (response.status >= 300 && response.status < 600) {
            console.log('-- Dead Link', href, link)
            link.classList.add('dead-link')
            link.title = 'Le lien est mort'
          }
        })
        .catch((error) => {
          console.log('-- Dead Link', href, link)
          link.classList.add('dead-link')
          link.title = 'Le lien est mort'
        })
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
