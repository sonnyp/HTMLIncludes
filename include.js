(function (global) {
  'use strict'

  function go () {
    var includes = document.querySelectorAll('x-include')
    for (var i = 0; i < includes.length; i++) {
      var include = new global.Include(includes[i])
      include.get()
    }
  }

  if (document.readyState === 'complete') {
    go
  } else {
    document.addEventListener('DOMContentLoaded', go)
  }
}(this))
