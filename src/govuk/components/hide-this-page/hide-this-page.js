import { nodeListForEach } from '../../common'

function HideThisPage ($module) {
  this.$module = $module
}

HideThisPage.prototype.openNewTab = function (e) {
  var isClickEvent = typeof e !== 'undefined'

  if (isClickEvent) {
    e.preventDefault()
  }

  var target = isClickEvent ? e.target : document.querySelector('.govuk-js-hide-this-page-button')

  window.open(target.getAttribute('data-new-tab-url'), '_newtab')

  // Check if the user's browser supports the history API
  // If so, we apply a history scrambling enhancement
  if (typeof window.history !== 'undefined' && typeof window.history === 'object') {
    document.title = target.getAttribute('data-fake-page-title')
    // Do not remove the empty value in the below function call. They are required to ensure we comply with the history API
    // https://developer.mozilla.org/en-US/docs/Web/API/History_API
    window.history.replaceState(target.getAttribute('data-fake-page-title'), '')
  }

  window.location.href = target.href
}

HideThisPage.prototype.init = function () {
  // We put the loop here instead of in all.js because we want to have both listeners on the individual buttons for clicks
  // and a single listener for the keyboard shortcut
  nodeListForEach(this.$module, function ($button) {
    $button.querySelector('.govuk-js-hide-this-page-button').addEventListener('click', this.openNewTab)
  }.bind(this))

  window.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' || e.keyCode === 27 || e.which === 27) {
      this.openNewTab()
    }
  }.bind(this))
}

export default HideThisPage
