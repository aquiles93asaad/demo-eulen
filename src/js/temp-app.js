'use strict';

angular.module('EulenApp', [
    'ui.router',
    'ui.bootstrap',
    'ngMessages',
    'ngAnimate',
    'angularMoment',
    'ngMaterial'
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
            Homepage
         ---------------------- */

        $stateProvider.state('home', {
            url: '/home',
            views: {
                'application@': {
                    templateUrl: 'src/templates/home.html',
                    controller: 'AppController'
                }
            }
        })
        /* -------
            Candidato
         ---------------------- */

         $stateProvider.state('candidate', {
            url: '/candidato',
            views: {
                'application@': {
                    templateUrl: 'src/templates/candidate.html',
                    controller: 'CandidateController'
                }
            }
        })

        $urlRouterProvider.otherwise('/home');
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
