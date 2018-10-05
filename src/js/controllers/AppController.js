'use strict';

angular.module('EulenApp')

.controller('AppController', ['$scope', '$state',
    function ($scope,$state){
        angular.element('#container').css({
            'min-height': angular.element('body').height() - angular.element('#footer').outerHeight(true) - angular.element('#header').height()
        })
    }
])