(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define('GOVUKFrontend.HideThisPage', factory) :
	(global.GOVUKFrontend = global.GOVUKFrontend || {}, global.GOVUKFrontend.HideThisPage = factory());
}(this, (function () { 'use strict';

/**
 * TODO: Ideally this would be a NodeList.prototype.forEach polyfill
 * This seems to fail in IE8, requires more investigation.
 * See: https://github.com/imagitama/nodelist-foreach-polyfill
 */
function nodeListForEach (nodes, callback) {
  if (window.NodeList.prototype.forEach) {
    return nodes.forEach(callback)
  }
  for (var i = 0; i < nodes.length; i++) {
    callback.call(window, nodes[i], i, nodes);
  }
}

function HideThisPage ($module) {
  this.$module = $module;
}

HideThisPage.prototype.openNewTab = function (e) {
  var isClickEvent = typeof e !== 'undefined';

  if (isClickEvent) {
    e.preventDefault();
  }

  var target = isClickEvent ? e.target : document.querySelector('.govuk-js-hide-this-page-button');

  window.open(target.getAttribute('data-new-tab-url'), '_newtab');

  // Check if the user's browser supports the history API
  // If so, we apply a history scrambling enhancement
  if (typeof window.history !== 'undefined' && typeof window.history === 'object') {
    document.title = target.getAttribute('data-fake-page-title');
    // Do not remove the empty value in the below function call. They are required to ensure we comply with the history API
    // https://developer.mozilla.org/en-US/docs/Web/API/History_API
    window.history.replaceState(target.getAttribute('data-fake-page-title'), '');
  }

  window.location.href = target.href;
};

HideThisPage.prototype.init = function () {
  // We put the loop here instead of in all.js because we want to have both listeners on the individual buttons for clicks
  // and a single listener for the keyboard shortcut
  nodeListForEach(this.$module, function ($button) {
    $button.querySelector('.govuk-js-hide-this-page-button').addEventListener('click', this.openNewTab);
  }.bind(this));

  window.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' || e.keyCode === 27 || e.which === 27) {
      this.openNewTab();
    }
  }.bind(this));
};

return HideThisPage;

})));
