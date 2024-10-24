import { getHTMLElement, getHTMLInputElement, wait } from './helper.js'
import htmx from './../dist/htmx.js' //import htmx from './../node_modules/htmx.org/dist/htmx.js'

export default class AssignProduct {
  constructor() {
    this.run()
  }

  async run() {
    await this.loadMore()
    this.loadHtmx()
    const productList = this.retrieveProductList()
    console.log(productList)
    for (let link of productList) {
      console.log('-- assign ' + link.href)
      console.log(link)
      document.body.innerHTML = ''
      document.body.appendChild(link)
      this.loadHtmx()
      await wait(3)
      await this.updateProduct(link)
    }
  }

  loadHtmx() {
    console.log('--- load htmx')
    globalThis.htmx = htmx
    document.body.setAttribute('hx-boost', 'true')
    htmx.process(document.body)
  }

  async loadMore() {
    console.log('-- load more')
    const pager = document.querySelector('input[name="pager"]')
    if (!pager || pager.getAttribute('type') === 'hidden') return
    getHTMLInputElement(pager).click()
    await wait(2)
    await this.loadMore()
  }

  retrieveProductList() {
    const productList = []
    document.querySelectorAll('.node-voyage h3 a').forEach((e) => {
      productList.push(e)
    })
    return productList
  }

  async updateProduct(link) {
    this.loadHtmx()
    await wait(3)
    console.log(document.querySelector('a'))
    getHTMLElement(document.querySelector('a')).click()
    await wait(3)
    this.loadHtmx()
    await wait(1)
    getHTMLElement(document.querySelector('nav[aria-label="Onglets"] a[href*="/edit"]')).click()
    await wait(5)
    getHTMLElement(document.querySelector('select#edit-field-activites option[value="684"]')).setAttribute('selected', 'selected')

    this.loadHtmx()
    await wait(1)
    getHTMLElement(document.querySelector('#edit-actions-submit')).click()
    await wait(3)
  }
}
