"user strict";

angular.module('EulenApp')

.directive('contentHeight', ['$rootScope', function($rootScope) {
    var directive = {
        link: link,
        scope: true,
        restrict: 'A'
    };

    return directive;

    function link (scope, element, attrs) {
        changeContentHeight(element);

        $rootScope.$on('$stateChangeSuccess', function() {
            changeContentHeight(element);
        });
    }

    function changeContentHeight(element) {
        angular.element(element).css({
            'min-height': angular.element('body').height() - angular.element('#footer').outerHeight(true) - angular.element('#header').height()
        });  
    }
}]);
