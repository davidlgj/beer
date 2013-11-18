angular.module('beer').directive('fullHeight', function() {    
  
  return function(scope, element) {
    var header = document.getElementById('header')
    element.css('min-height',(document.documentElement.clientHeight-header.clientHeight)+'px');
  };

})