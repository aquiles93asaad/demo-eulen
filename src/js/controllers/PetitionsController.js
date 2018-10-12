'use strict';

angular.module('EulenApp')

.controller('PetitionsController', ['$rootScope', 'petitions',
    function ($rootScope, petitions) {
        console.log(petitions);
    }
])