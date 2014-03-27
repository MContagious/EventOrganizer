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
        .when('/new', {
            templateUrl: '/partials/create_new_event',
            controller: 'NewEventCtrl'
        })
        .when('/main_event/manage/:main_event_id', {
            templateUrl: '/partials/manage_new_event',
            controller: 'ManageEventCtrl'
        })
        .otherwise({ redirectTo: '/' })
}]);