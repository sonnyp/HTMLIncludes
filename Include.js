;(function (global) {
  'use strict'

  var Event = global.Event
  var XMLHttpRequest = global.XMLHttpRequest

  var Include = function (el) {
    this.el = el
    var that = this
    ;['error', 'load'].forEach(function (e) {
      that['on' + e] = function () {}
    })
    this.src = this.el.getAttribute('src')
    this.base = this.getBase(this.src)
  }

  Include.prototype.get = function () {
    var req = new XMLHttpRequest()
    req.onerror = this.onErrored.bind(this)
    req.onload = this.onLoaded.bind(this)
    req.open('GET', this.src)
    req.send()
    this.req = req
  }

  Include.prototype.errors = function () {
    if (this.status) return
    var event = new Event('error')
    this.el.dispatchEvent(event)
    if (typeof this.el.onerror === 'function') {
      this.el.onerror(event)
    }

    this.status = 'error'
  }

  Include.prototype.loads = function () {
    if (this.status) return
    var event = new Event('load')
    this.el.dispatchEvent(event)
    if (typeof this.el.onload === 'function') {
      this.el.onload(event)
    }

    this.status = 'load'
  }

  Include.prototype.onErrored = function () {
    this.errors()
  }

  Include.prototype.onLoaded = function () {
    var dummy = document.createElement('dummy')
    dummy.innerHTML = this.req.response
    var frag = dummy.firstChild
    if (frag.tagName.toLowerCase() !== 'x-fragment') {
      return this.errors()
    }

    // http://www.w3.org/TR/2008/WD-html5-20080610/dom.html#innerhtml0
    // "script elements inserted using innerHTML do not execute when they are inserted."
    // so we recreate all scripts elements (cloning the script doesn't work with Firefox 36.0a2 (2014-12-11))
    var scripts = frag.querySelectorAll('script')
    for (var i = 0, l = scripts.length; i < l; i++) {
      var o = scripts[i]
      var n = document.createElement('script')
      n.textContent = o.textContent
      var attrs = o.attributes
      for (var j = 0; j < attrs.length; j++) {
        var attr = attrs[j]
        // resolves relative path
        // if (attr.name === 'src') {
        // n.setAttribute(attr.name, base + attr.value)
        // }
        // else {
        n.setAttribute(attr.name, attr.value)
      // }
      }
      o.parentNode.replaceChild(n, o)
    }

    var current = 0
    var toBeLoaded = []

    // ugly
    var thingsWithSrc = frag.querySelectorAll('[src]')
    for (var i = 0, l = thingsWithSrc.length; i < l; i++) {
      var el = thingsWithSrc[i]
      var ini = el.getAttribute('src')
      if (ini === null || ini[0] === '/')
        continue
      el.setAttribute('src', this.base + ini)
      toBeLoaded.push(el)
    }

    var thingsWithHref = frag.querySelectorAll('[href]')
    for (var i = 0, l = thingsWithHref.length; i < l; i++) {
      var el = thingsWithHref[i]
      var ini = el.getAttribute('href')
      if (ini === null || ini[0] === '/')
        continue
      el.setAttribute('href', this.base + ini)
      toBeLoaded.push(el)
    }

    var that = this

    toBeLoaded.forEach(function (el) {
      el.onload = function () {
        current++
        if (current === toBeLoaded.length) that.loads()
      }
      el.onerror = function () {
        current++
        if (current === toBeLoaded.length) that.loads()
      }
    })

    var documentFragment = document.createDocumentFragment()
    // doesnt work in chrome nor webkit
    // dummy.firstChild.setAttributeNS('xml', 'base', 'fragment/')
    while (frag.firstChild) {
      documentFragment.appendChild(frag.firstChild)
    }

    this.el.dispatchEvent(new Event('DOMContentLoaded'))
    this.el.appendChild(documentFragment)
  }

  Include.prototype.getBase = function (src) {
    return src.substr(0, src.lastIndexOf('/') + 1)
  }

  global.Include = Include
}(this))
