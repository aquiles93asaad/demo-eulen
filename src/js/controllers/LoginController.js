'use strict';

angular.module('EulenApp')

.controller('LoginController', ['$scope', '$rootScope', '$state', '$mdToast', 'AdminServices', 'UserServices', 'CLIENT_GROUP',
    function ($scope, $rootScope, $state, $mdToast, AdminServices, UserServices, CLIENT_GROUP) {
        $rootScope.showHeaderLogo = false;

        $scope.loginForm = {
            user: null,
            password: ''
        };

        $scope.login = function() {
            AdminServices.getToken($scope.loginForm)
            .then(function(token) {
                $rootScope.userID = $scope.loginForm.user; 
                $rootScope.userToken = token;
                $rootScope.token = token;

                var params = {
                    'userId' : $rootScope.userID,
                    'fullDisclousure' : true
                };

                return UserServices.getUserQuery(params)
            })
            .then(function(result) {
                var isClient = false;

                for (var i = 0; i < result.lstGroups.length; i++) {
                    if(result.lstGroups[i] == CLIENT_GROUP) {
                        isClient = true;
                        break;
                    }
                }
                
                if(isClient) {
                    $state.go('petitions');
                } else {
                    $rootScope.userID = null;
                    $rootScope.userToken = null;
                    $rootScope.token = null;
                    $mdToast.show(
                        $mdToast.simple()
                        .textContent('El usuario no pertenece al grupo de Clientes.')
                        .position('top right')
                        .hideDelay(3000)
                    );
                }
            })
            .catch(function(error) {
                console.log(error);
                var message = (error == 'Password Incorrecta.') ? error : 'Error al intentar de ingresar.';
                $mdToast.show(
                    $mdToast.simple()
                    .textContent(message)
                    .position('top right')
                    .hideDelay(3000)
                );
            });
        }
    }
])