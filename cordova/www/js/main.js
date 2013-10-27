angular.module('beer',['ui.bootstrap','ngRoute','ngTouch'])
       .config(function($routeProvider){
          $routeProvider.when('/user', {
            templateUrl: 'templates/user.html',
            controller:  'UserCtrl'
          });

          $routeProvider.when('/add', {
            templateUrl: 'templates/add.html',
            controller:  'AddBeerCtrl'
          });

          $routeProvider.when('/beers', {
            templateUrl: 'templates/beers.html',
            controller:  'BeersCtrl'
          });

          $routeProvider.when('/tonight', {
            templateUrl: 'templates/tonight.html',
            controller:  'TonightCtrl'
          });
       });

