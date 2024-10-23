/**
 *  [BackEnd] In Menu Management, add parent element under the name of each row (previously GA Menu Helper Bookmarklet)
 */
export default class MenuManagerBeautifer {
  getIndentationLevel(row) {
    const indentationDiv = row.querySelectorAll('.js-indentation')
    return indentationDiv.length
  }

  getParentRow(row) {
    const currentIndentLevel = this.getIndentationLevel(row)
    let previousRow = row.previousElementSibling
    while (previousRow) {
      const previousIndentLevel = this.getIndentationLevel(previousRow)
      if (previousIndentLevel < currentIndentLevel) {
        return previousRow
      }
      previousRow = previousRow.previousElementSibling
    }
    return null
  }

  injectParents() {
    const rows = document.querySelectorAll('table#menu-overview tbody tr')
    rows.forEach((row) => {
      const parentRow = this.getParentRow(row)
      if (parentRow) {
        const parentLink = parentRow.querySelector('.tabledrag-cell-content__item').textContent.trim()
        const currentLink = row.querySelector('.tabledrag-cell-content__item span') || row.querySelector('.tabledrag-cell-content__item a')
        if (currentLink)
          currentLink.innerHTML =
            `${currentLink.innerHTML.trim()}` + (currentLink.querySelectorAll('br').length !== 0 ? '' : '<br>') + ` <small style="color:rgb(34, 35, 48)">\\ ${parentLink}</small>`
      }
    })
  }

  removeDisabledItems() {
    var elements = document.querySelectorAll('tr.menu-disabled')
    elements.forEach(function (element) {
      element.parentNode.removeChild(element)
    })
  }

  constructor() {
    this.removeDisabledItems()
    this.injectParents()
  }
}
