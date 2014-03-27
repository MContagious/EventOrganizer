/**
 * Created by kishore.relangi on 3/21/14.
 */


EventOrganizer.controller('HomeCtrl', ['$scope', '$http',
    function ($scope, $http) {
        $scope.active_menu_item = 'home';
        $scope.main_events_list = {};
        $http.get('/main_event/get/0/100')
            .success(function (data, status, headers, config) {
                $scope.main_events_list = data;
            })
            .error(function (data, status, headers, config) {
                throw new Error(data.message);
            });
    }
]);

EventOrganizer.controller('NewEventCtrl', ['$scope', '$http', '$location',
    function ($scope, $http, $location) {
        $scope.active_menu_item = 'new';
        $scope.create_new_main_event = function (new_event) {
            console.dir(new_event);
            $http.post('/main_event/add', $scope.new_event, {
                'content-type': 'application/json'
            })
                .success(function (data, status, headers, config) {
                    $location.path('/home');
                })
                .error(function (data, status, headers, config) {
                    $scope.error = data;
                })
        }
    }]);

EventOrganizer.controller('ManageEventCtrl',
    ['$scope', '$http', '$routeParams', function ($scope, $http, $routeParams) {
        $scope.create_sub_event = 0;
        $scope.active_menu_item = 'manageevent';
        $scope.main_event_id = $routeParams.main_event_id;
        $scope.sub_events = [];
        $scope.nfe = {};
        $scope.waiting = 1;
        $scope.element_types = [
            "Email",
            "Text",
            "TextArea",
            "Select",
            "Select-Multi",
            "Select-Conditional",
            "Number",
            "Date"
        ];

        $scope.element_types_select = [
            "Select",
            "Select-Multi",
            "Select-Conditional"
        ];

        $scope.form_elements = [];
        $scope.form_element_names_list = [];
        $scope.forms = [];

        $http.get('/mainevent/' + $scope.main_event_id + '/subevents')
            .success(function (data, status, headers, config) {
                $scope.sub_events = data;
                $scope.waiting = 0;
            })
            .error(function (data, status, headers, config) {
                $scope.waiting = 0;
                throw new Error(data.message);
            });

        $http.get('/mainevent/' + $scope.main_event_id + '/form_element')
            .success(function (data, status, headers, config) {
                $scope.form_elements = data;
//                $scope.form_element_names_list = $scope.form_element_names($scope.form_elements);
                $scope.waiting = 0;
            })
            .error(function (data, status, headers, config) {
                $scope.waiting = 0;
                throw new Error(data.message);
            });

        $http.get('/mainevent/' + $scope.main_event_id + '/form')
            .success(function (data, status, headers, config) {
                $scope.form = data;
                $scope.waiting = 0;
            })
            .error(function (data, status, headers, config) {
                $scope.waiting = 0;
                throw new Error(data.message);
            });

        $scope.show_create_sub_event = function (val) {
            $scope.create_sub_event = val;
        };

        $scope.show_create_form_elements = function (val) {
            $scope.create_form_elements = val;
        };

        $scope.show_create_form = function (val) {
            $scope.create_form = val;
        };

        $scope.new_sub_event = function () {
            $scope.creating_sub_event = 1;
            $scope.nse.main_event_id = $scope.main_event_id;
            $scope.creating_sub_event_err_message = undefined;
            $scope.creating_sub_event_message = undefined;
            $http.post('/mainevent/' + $scope.main_event_id + '/subevents/new', $scope.nse)
                .success(function (data, status, headers, config) {
                    $scope.sub_events.push(data);
                    $scope.nse = {};
                    $scope.creating_sub_event = 0;
                    $scope.creating_sub_event_message = 'The task has been created...';
                })
                .error(function (data, status, headers, config) {
                    $scope.creating_sub_event = 0;
                    $scope.creating_sub_event_err_message = data.message;
                });
        };

        $scope.add_new_options = function (nfe) {
            nfe.options = nfe.options || [];
            nfe.options.push({'value': '', 'option': ''});
        };

        $scope.remove_new_options = function (nfe, $index) {
            nfe.options.splice($index, 1);
        };
        $scope.new_form_element = function () {
            $scope.creating_form_elements = 1;
            $scope.nfe.main_event_id = $scope.main_event_id;
            $scope.creating_form_elements_err_message = undefined;
            $scope.creating_form_elements_message = undefined;
            $http.post('/mainevent/' + $scope.main_event_id + '/form_element/new', $scope.nfe)
                .success(function (data, status, headers, config) {
                    $scope.creating_form_elements = 0;
                    $scope.form_elements.push(data);
                    $scope.nfe = {};
                    $scope.creating_form_elements_message = 'The form element has been created...';
                })
                .error(function (data, status, headers, config) {
                    $scope.creating_form_elements = 0;
                    $scope.creating_form_elements_err_message = data.message;
                });
        };

        $scope.new_form = function () {
            $scope.creating_form = 1;
            $scope.nfe.main_event_id = $scope.main_event_id;
            $scope.creating_form_err_message = undefined;
            $scope.creating_form_message = undefined;
            $http.post('/mainevent/' + $scope.main_event_id + '/form/new', $scope.nf)
                .success(function (data, status, headers, config) {
                    $scope.creating_form = 0;
                    $scope.forms.push(data);
                    $scope.nf = {};
                    $scope.creating_form_message = 'The form has been created...';
                })
                .error(function (data, status, headers, config) {
                    $scope.creating_form = 0;
                    $scope.creating_form_err_message = data.message;
                });
        };
        $scope.nf = $scope.nf || {};
        $scope.nf.form_elements = [];
        $scope.form_element_name = function (e) {
            debugger;
            if (e.main_event_id == 'Global') {
                return (e.main_event_id + '::' + e.name);
            } else {
                return ('MainEvent::' + e.name);
            }
        };
        $scope.form_element_names = function (elements) {
            return elements.map(function (e) {
                return $scope.form_element_name(e);
            });
        }
        $scope.$watch('form_elements.length', function (nw) {
            debugger;
            $scope.form_element_names_list = $scope.form_element_names($scope.form_elements);
        });
    }]);