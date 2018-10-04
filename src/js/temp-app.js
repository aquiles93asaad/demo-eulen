'use strict';

angular.module('EulenApp', [
    'ui.router',
    'ui.bootstrap',
    'ngMessages',
    'ngAnimate',
    'ngTouch',
    'angularMoment'
])

/* -------
    CONFIG PHASE
/* ------------------------------- */

    /* --------------------------------------------
     *  $stateProvider / $urlRouterProvider
     * ----------------------------------------- */

    .config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {

        $stateProvider.state('root', {
            abstract: true,
            views: {
                'application@': {
                    controller: 'AppController'
                }
            }
        })

        /* -------
            SignIn
         ---------------------- */

        $stateProvider.state('signin', {
            url: '/',
            views: {
                'application@': {
                    templateUrl: '/templates/home.tpl',
                    controller: 'AppController'
                }
            }
        })

        $urlRouterProvider.otherwise('/');
    }])

/* -------
    RUN PHASE
/* ------------------------------- */

    .run([

        '$rootScope',
        '$state',

        function(
            $rootScope,
            $state ){

            $rootScope.pageSize = 15;


    }])
