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

  fetchCacheExpiry = 24 * 60 * 60 * 1000

  async fetchCache(url) {
    const result = await chrome.storage.local.get(['fetchCache', 'fetchCacheTimestamp'])
    const fetchCache = result.fetchCache || {}
    const timestamp = result.fetchCacheTimestamp || 0

    // Check if the cache has expired
    const now = Date.now()
    if (now - timestamp > this.fetchCacheExpiry) {
      console.log('-- reset fetchCache')
      await chrome.storage.local.set({ fetchCache: {}, fetchCacheTimestamp: now })
      return null
    }

    return fetchCache[url]
  }

  updateFetchCache(url, status) {
    chrome.storage.local.get(['fetchCache'], (result) => {
      const fetchCache = result.fetchCache || {}
      fetchCache[url] = status
      chrome.storage.local.set({ fetchCache: fetchCache })
    })
  }

  showDeadLinks() {
    // Sélectionner tous les liens sur la page
    const links = document.querySelectorAll('a')

    links.forEach(async (link) => {
      let href = link.href
      if (!href) return
      if (href.includes('#comments')) return
      href = link.href.split('#')[0]
      if (!(href.includes('grandangle.fr') || href.includes('grandangle2023') || href.includes('grandangletours.com'))) return
      if (href.includes('facebook.com')) return
      if (href.includes('/webmaster/')) return
      if (href.includes('/user/')) return
      if (href.includes('/product/')) return
      if (href.includes('/token/')) return
      if (href.includes('/run-cron')) return
      if (href.includes('/media/')) return
      if (href.includes('/devel/')) return
      if (href.includes('/ajax/')) return
      if (href.includes('/admin')) return
      if (href.includes('/comment/reply/')) return
      if (href.includes('/node/add/')) return
      if (!href.startsWith('http')) return
      if (href.includes('/update.php')) return
      if (href.includes('/add')) return
      if (href.includes('/votes')) return
      if (href.includes('/edit')) return
      if (href.includes('/delete')) return
      if (href.includes('/revisions')) return
      if (href.includes('/translations')) return

      if (
        !document.URL.includes('/admin/structure/menu') &&
        ['activite=', 'saisons=', 'duree=', 'thematique=', 'niveau=', 'itinerance=', 'voyage='].some((keyword) => href.includes(keyword)) &&
        !(link.classList.contains('obf') || link.title === 'obf')
      ) {
        console.log('-- To Obfuscate', href, link)
        link.classList.add('to-obf-link')
        link.title = 'liens à obfusquer'
      }

      if (href.includes('destination_selected') || href.includes('activites%5B81%5D')) {
        console.log('-- Dead Link', href, link)
        link.classList.add('dead-link')
        link.title = "Les filtres datent de l'ancienne version et ne sont plus valide"
        return
      }

      const fetchCache = await this.fetchCache(href)
      if (fetchCache && fetchCache === true) {
        return // on ne check pas les URLs qui fonctionnaient il y a moins de 24h
      }

      fetch(href, {
        method: 'HEAD',
        redirect: link.getAttribute('data-entity-substitution') ? 'follow' : 'manual', // gère les liens dans l'admin qui sont remplacés par Drupal
        credentials: 'omit', // Empêche l'envoi des cookies, comme si on était déconnecté
      })
        .then((response) => {
          if (response.status !== 200) {
            console.log(response.status)
            this.setLinkDead(href, link)
          } else {
            console.log(href + ' ' + response.status)
            this.updateFetchCache(href, true)
          }
        })
        .catch((error) => {
          this.setLinkDead(href, link)
        })
    })
  }

  setLinkDead(href, link) {
    console.log('-- Dead Link', href, link)
    link.classList.add('dead-link')
    link.title = 'Le lien est mort'
    this.updateFetchCache(href, false)
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
