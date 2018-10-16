'use strict';

angular.module('EulenApp')

.controller('PetitionsController', ['$scope', '$rootScope', 'petitions',
    function ($scope, $rootScope, petitions) {
        $scope.petitions = petitions;
    }
])