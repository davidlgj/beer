angular.module('beer').directive('fullHeight', function() {    
  
  return function(scope, element) {
    element.css('min-height',document.documentElement.clientHeight+'px');
  };

})