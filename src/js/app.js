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
                    templateUrl: 'src/templates/client.html',
                    controller: 'ClientController'
                }
            },
            searchServices: 'SearchServices',
            resolve: {
                data: function($rootScope, SearchServices) {
                    var returnedData = {
                        client: {
                            D_CLIENT: null,
                            C_CLIENT: null,
                            N_CIF: null
                        },
                        locales: []
                    };
                    
                    var params = $rootScope.searchParams;
                    params.documentClass = 'ABM_CLIENTE';
                    params.maxResults = 1;
                    params.queryFields = ['D_CLIENTE', 'C_CLIENTE', 'N_CIF'];
                    params.searchCriterias.push({
                        'fieldData': {
                            'key': 'USER_ID',
                            'value': $rootScope.userID,
                            'dataType': 'string'
                        },
                        'criteria': 'equals'
                    });

                    return SearchServices.getDocumentsByCriterias(params)
                    .then(function(result) {
                        var fields = result.documents[0].fields;
                        for (var i = 0; i < fields.length; i++) {
                            if(fields[i].key == 'D_CLIENTE') {
                                returnedData.client.D_CLIENT = fields[i].value;
                            } else if(fields[i].key == 'C_CLIENTE') {
                                returnedData.client.C_CLIENT = fields[i].value;
                            }
                        }
                        
                        params.documentClass = 'ABM_CLIENTE_LOCAL';
                        params.queryFields = ['D_CLIENTE', 'C_CLIENTE'];
                        params.maxResults = 20;
                        
                    })
                    .catch(function(error) {
                        console.error(error);
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
            $rootScope.token = $rootScope.adminToken;
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

            // search params model, useful to not create it more than once
            $rootScope.searchParams = {
                documentClass: null,
                orCriteria: false,
                queryFields: [],
                searchCriterias: [],
                from: 0,
                to: 20,
                maxResults: 15,
                sortField: 'INDEX_ITEM_ID',
                sortDirection: 'ASC',
            };
        }
    ])
