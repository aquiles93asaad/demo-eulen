'use strict';

angular.module('EulenApp')

.controller('AppController', ['$scope', '$rootScope', '$state',
    function ($scope, $rootScope, $state) {
        $rootScope.logout = function() {
            $rootScope.userToken = null;
            $rootScope.userID = null;
            $state.go('home');
        }
    }
])