(function () {
  'use strict'

  var currentTab = 'A'
  var buttons = document.querySelectorAll('button')
  for (var i = 0; i < buttons.length; i++) {
    var button = buttons[i]
    button.addEventListener('click', function () {
      document.querySelector('x-include.' + currentTab).hidden = true
      document.querySelector('x-include.' + this.getAttribute('class')).hidden = false
      currentTab = this.getAttribute('class')
    })
  }

  // var el = document.querySelector('x-include');
  // el.addEventListener('DOMContentLoaded', function() {
  //   console.log('x-include DOMContentLoaded');
  // });
  // el.addEventListener('load', function() {
  //   console.log('x-include load');
  // });
  // el.onload = function() {
  //   console.log('x-include onload');
  // };
  // el.onerror = function() {
  //   console.log('x-include onerrror');
  // };
  // el.addEventListener('error', function() {
  //   console.log('x-include error');
  // });
}())
