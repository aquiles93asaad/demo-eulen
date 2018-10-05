'use strict';

angular.module('EulenApp')

.controller('CandidateController', ['$scope', '$state',
    function ($scope,$state){
        $scope.countries= [
            "Alemania",
            "España",
            "Francia",
            "Inglaterra",
        ]

        $scope.candidate = {
            D_APELLIDO: null,

        }
    }
])