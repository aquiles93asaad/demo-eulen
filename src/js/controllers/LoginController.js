'use strict';

angular.module('EulenApp')

.controller('LoginController', ['$scope', '$rootScope', '$state', 'AdminServices', '$mdToast',
    function ($scope, $rootScope, $state, AdminServices, $mdToast) {
        $rootScope.showHeaderLogo = false;

        $scope.loginForm = {
            user: null,
            password: ''
        };

        $scope.login = function() {
            AdminServices.getToken($scope.loginForm)
            .then(function(token) {
                $rootScope.userID = $scope.loginForm.user; 
                $rootScope.token = token;
                $state.go('petitions');
            })
        }
    }
])