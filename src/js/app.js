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
    .constant('WS_EXP_COD_RET', '98')
    .constant('WS_ACC_COD_RET', '97')
    .constant('WS_SUC_COD_RET', '00')
    .constant('VALUES_SEPARATOR', '|')
    .constant('VALUES_SEPARATOR_2', ',')

    /* --------------------------------------------
     * $mdDateLocaleProvider
     * ----------------------------------------- */

    .config(['$mdDateLocaleProvider' , function($mdDateLocaleProvider) {
        $mdDateLocaleProvider.months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
        $mdDateLocaleProvider.shortMonths = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sept', 'Oct', 'Nov', 'Dic'];
        $mdDateLocaleProvider.days = ['domingo', 'lunes', 'martes', 'mi\u00e9rcoles', 'jueves', 'viernes', 's\u00e1bado'];
        $mdDateLocaleProvider.shortDays = ['Dom', 'Lun', 'Mar', 'Mi\u00e9', 'Jue', 'Vie', 'S\u00e1b'];
        $mdDateLocaleProvider.formatDate = function(date) {
            return moment(date).format('DD/MM/YYYY');
        };
    }])
    /* --------------------------------------------
     *  $stateProvider / $urlRouterProvider
     * ----------------------------------------- */

    .config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {

        $stateProvider
        
        .state('root', {
            abstract: true,
            controller: 'AppController'
        })

        /* -------
            Homepage
         ---------------------- */
        .state('home', {
            url: '/home',
            views: {
                'application': {
                    templateUrl: 'src/templates/home.html',
                    controller: 'AppController'
                }
            }
        })

        /* -------
            Candidato
         ---------------------- */

        .state('candidate', {
            url: '/candidato',
            views: {
                'application': {
                    templateUrl: 'src/templates/candidate.html',
                    controller: 'CandidateController'
                }
            }
        })

        /* -------
            Cliente
         ---------------------- */

        .state('login', {
            url: '/login',
            views: {
                'application': {
                    templateUrl: 'src/templates/login.html',
                    controller: 'LoginController'
                }
            }
        })
        

        /* -------
            Cliente
         ---------------------- */

        .state('client', {
            url: '/cliente',
            views: {
                'application': {
                    templateUrl: 'src/templates/cliente.html',
                    controller: 'ClienteController'
                }
            },
            adminServices: 'AdminServices',
            resolve: {
                menuRights: function($rootScope, AdminServices) {

                    return AdminServices.getAccessRightForAction(params)
                    .then(function(createAccess) {
                        $rootScope.menuAccessRights.create = createAccess;
                        params.rightName = 'SEARCH';
                        return AdminServices.getAccessRightForAction(params);
                    })
                    .then(function(searchAccess) {
                        $rootScope.menuAccessRights.search = searchAccess;
                        params.rightName = 'TRAY';
                        return AdminServices.getAccessRightForAction(params);
                    })
                    .then(function(traysAccess) {
                        $rootScope.menuAccessRights.trays = traysAccess;
                        return $rootScope.menuAccessRights;
                    })
                    .catch(function(error) {
                        $cordovaToast.showShortBottom(error);
                    })
                }
            }
        })

        $urlRouterProvider.otherwise('/home');
    }])

/* -------
    RUN PHASE
/* ------------------------------- */

    .run(['$rootScope', '$transitions',
        function($rootScope, $transitions){
            $rootScope.adminToken = 'xOir4xDkMmtIVZ3zjmSql5%2FFsmjhSyLugwmCEX3P8g8%3D';
            $rootScope.serverEndpoint = 'http://localhost:8080/thuban-web/';
            $rootScope.showHeaderLogo = true;
            
            $transitions.onSuccess({}, function($transitions) {
                var newToState = $transitions.$to();
                
                if(newToState.name == 'login') {
                    $rootScope.showHeaderLogo = false;
                } else {
                    $rootScope.showHeaderLogo = true;
                }
            });
        }
    ])
