/**
 * Created by kishore.relangi on 3/21/14.
 */

var EventOrganizer = angular.module('EventOrganizer', ['ngRoute']);

EventOrganizer.config(['$routeProvider', function ($routeProvider) {
    $routeProvider
        .when('/', { redirectTo: '/home' })
        .when('/home', {
            templateUrl: '/partials/home',
            controller: 'HomeCtrl'
        })
        .otherwise({ redirectTo: '/' })
}]);