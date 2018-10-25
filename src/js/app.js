'use strict';

angular.module('EulenApp', [
    'ui.router',
    'ui.bootstrap',
    'ngMessages',
    'ngAnimate',
    'angularMoment',
    'ngMaterial',
    'ngResource',
    'md.data.table'
])

/* -------
    CONFIG PHASE
/* ------------------------------- */
    .constant('WS_EXP_COD_RET', '98')
    .constant('WS_ACC_COD_RET', '97')
    .constant('WS_SUC_COD_RET', '00')
    .constant('VALUES_SEPARATOR', '|')
    .constant('VALUES_SEPARATOR_2', ',')
    .constant('CLIENT_GROUP', 'GRP_CLIENTES')
    .constant('QUERY_FIELDS', {
        'cliente': ['D_CLIENTE', 'C_CLIENTE', 'N_CIF'],
        'cliente_local': ['D_LOCAL', 'C_LOCAL', 'D_ZONA', 'D_SUBZONA', 'D_DIRECCION_LOCAL', 'N_LATITUD', 'N_LONGITUD'],
        'puestos': ['D_AREA', 'C_AREA', 'D_PUESTO', 'C_PUESTO'],
        'peticion': ['N_PETICION', 'F_PETICION', 'D_LOCAL', 'F_INICIO', 'F_ESTIMADA_INGRESO', 'D_ESTADO_SOLICITUD', 'B_VALIDACION_MOD'],
        'candidato': ['D_NOMBRE', 'D_APELLIDO', 'D_SEXO', 'N_EDAD']
    })

    /* --------------------------------------------
     * $mdDateLocaleProvider
     * ----------------------------------------- */

    .config(['$mdDateLocaleProvider' , function($mdDateLocaleProvider) {
        $mdDateLocaleProvider.months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
        $mdDateLocaleProvider.shortMonths = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sept', 'Oct', 'Nov', 'Dic'];
        $mdDateLocaleProvider.days = ['domingo', 'lunes', 'martes', 'mi\u00e9rcoles', 'jueves', 'viernes', 's\u00e1bado'];
        $mdDateLocaleProvider.shortDays = ['Dom', 'Lun', 'Mar', 'Mi\u00e9', 'Jue', 'Vie', 'S\u00e1b'];
        $mdDateLocaleProvider.formatDate = function(date) {
            return date ?  moment(date).format('DD/MM/YYYY'): '';
        };
        $mdDateLocaleProvider.parseDate = function (dateString) {
            var m = moment(dateString, 'DD/MM/YYYY', true);
            return m.isValid() ? m.toDate() : new Date(NaN);
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
            },
            searchServices: 'SearchServices',
            QUERY_FIELDS: 'QUERY_FIELDS',
            resolve: {
                puestos: function($rootScope, SearchServices, $mdToast, QUERY_FIELDS) {
                    $rootScope.token = $rootScope.adminToken;
                    var params = angular.copy($rootScope.searchParams);
                    params.documentClass = 'ABM_AREA_PUESTO';
                    params.queryFields = QUERY_FIELDS.puestos;
                    params.maxResults = 100;
                    params.searchCriterias = [
                        {
                            'fieldData': {
                                'key': 'D_PUESTO',
                                'value': '%',
                                'dataType': 'string'
                            },
                            'criteria': 'any'
                        }
                    ];

                    return SearchServices.getDocumentsByCriterias(params)
                    .then(function(result) {
                        return result.documents;
                    })
                    .catch(function(error) {
                        console.log(error);
                        $mdToast.show(
                            $mdToast.simple()
                            .textContent('Error buscando datos! Comunicarse con el desarrollador.')
                            .position('top right')
                            .hideDelay(3000)
                        );
                    });
                }
            }
        })

        /* -------
            Login
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
            Lista de peticiones
         ---------------------- */

        .state('petitions', {
            url: '/cliente/peticiones',
            views: {
                'application': {
                    templateUrl: 'src/templates/petitions.html',
                    controller: 'PetitionsController'
                }
            },
            searchServices: 'SearchServices',
            QUERY_FIELDS: 'QUERY_FIELDS',
            resolve: {
                client: function($rootScope, $state, SearchServices, QUERY_FIELDS) {
                    if($rootScope.userToken) {
                        $rootScope.token = $rootScope.userToken;
    
                        var client = {
                            D_CLIENTE: null,
                            C_CLIENTE: null
                        };
    
                        var params = angular.copy($rootScope.searchParams);
                        params.documentClass = 'ABM_CLIENTE';
                        params.maxResults = 1;
                        params.queryFields = QUERY_FIELDS.cliente;
                        params.searchCriterias = [{
                            'fieldData': {
                                'key': 'USERNAME',
                                'value': $rootScope.userID,
                                'dataType': 'string'
                            },
                            'criteria': 'equals'
                        }];
    
                        return SearchServices.getDocumentsByCriterias(params)
                        .then(function(result) {
                            if(result.documents && result.documents[0]) {
                                var fields = result.documents[0].fields;
    
                                for (var i = 0; i < fields.length; i++) {
                                    if(fields[i].key == 'D_CLIENTE') {
                                        client.D_CLIENTE = fields[i].value;
                                    } else if(fields[i].key == 'C_CLIENTE') {
                                        client.C_CLIENTE = fields[i].value;
                                    }
                                }
                            }
                            
                            return client;
                        })
                        .catch(function(error) {
                            console.log(error);
                            $mdToast.show(
                                $mdToast.simple()
                                .textContent('Error buscando datos! Comunicarse con el desarrollador.')
                                .position('top right')
                                .hideDelay(3000)
                            );
                        });
                    } else {
                        $state.go('home');
                    }
                }
            }

        })

        /* -------
            Formulario de petición
         ---------------------- */

        .state('petition', {
            url: '/cliente/nueva-petición',
            views: {
                'application': {
                    templateUrl: 'src/templates/petition.html',
                    controller: 'PetitionController'
                }
            },
            searchServices: 'SearchServices',
            QUERY_FIELDS: 'QUERY_FIELDS',
            resolve: {
                data: function($rootScope, $state, SearchServices, QUERY_FIELDS) {
                    if($rootScope.userToken) {
                        $rootScope.token = $rootScope.userToken;
                        var returnedData = {
                            client: {
                                D_CLIENTE: null,
                                C_CLIENTE: null,
                                N_CIF: null
                            },
                            locales: [],
                            puestos: []
                        };
                        
                        var params = angular.copy($rootScope.searchParams);
                        params.documentClass = 'ABM_CLIENTE';
                        params.maxResults = 1;
                        params.queryFields = QUERY_FIELDS.cliente;
                        params.searchCriterias.push({
                            'fieldData': {
                                'key': 'USERNAME',
                                'value': $rootScope.userID,
                                'dataType': 'string'
                            },
                            'criteria': 'equals'
                        });
    
                        return SearchServices.getDocumentsByCriterias(params)
                        .then(function(result) {
                            if(result.documents && result.documents[0]) {
                                var fields = result.documents[0].fields;
    
                                for (var i = 0; i < fields.length; i++) {
                                    if(fields[i].key == 'D_CLIENTE') {
                                        returnedData.client.D_CLIENTE = fields[i].value;
                                    } else if(fields[i].key == 'C_CLIENTE') {
                                        returnedData.client.C_CLIENTE = fields[i].value;
                                    } else if(fields[i].key == 'N_CIF') {
                                        returnedData.client.N_CIF = fields[i].value;
                                    }
                                }
                            }
    
                            params.documentClass = 'ABM_CLIENTE_LOCAL';
                            params.queryFields = QUERY_FIELDS.cliente_local;
                            params.maxResults = 100;
                            params.searchCriterias = [
                                {
                                    'fieldData': {
                                        'key': 'D_CLIENTE',
                                        'value': returnedData.client.D_CLIENTE,
                                        'dataType': 'string'
                                    },
                                    'criteria': 'equals'
                                },
                                {
                                    'fieldData': {
                                        'key': 'C_CLIENTE',
                                        'value': returnedData.client.C_CLIENTE,
                                        'dataType': 'string'
                                    },
                                    'criteria': 'equals'
                                },
                            ];
                            
                            return SearchServices.getDocumentsByCriterias(params);
                        })
                        .then(function(result) {
                            if(result.documents) {
                                returnedData.locales = result.documents;
                            }
    
                            params.documentClass = 'ABM_AREA_PUESTO';
                            params.queryFields = QUERY_FIELDS.puestos;
                            params.maxResults = 100;
                            params.searchCriterias = [
                                {
                                    'fieldData': {
                                        'key': 'D_PUESTO',
                                        'value': '%',
                                        'dataType': 'string'
                                    },
                                    'criteria': 'any'
                                }
                            ];
    
                            return SearchServices.getDocumentsByCriterias(params);
                            
                        })
                        .then(function(result) {
                            if(result.documents) {
                                returnedData.puestos = result.documents;
                            }
    
                            return returnedData;
                        })
                        .catch(function(error) {
                            console.log(error);
                            $mdToast.show(
                                $mdToast.simple()
                                .textContent('Error buscando datos! Comunicarse con el desarrollador.')
                                .position('top right')
                                .hideDelay(3000)
                            );
                        });
                    } else {
                        $state.go('home');
                    }
                }
            }
        })

        $urlRouterProvider.otherwise('/home');
    }])

/* -------
    RUN PHASE
/* ------------------------------- */

    .run(['$rootScope', '$transitions', '$location', '$state',
        function($rootScope, $transitions, $location, $state){
            $rootScope.adminToken = 'xOir4xDkMmv9lYBFMMpXgKSDVp6Vm6pCMIAqSxIU7lZpspC%2BzTT6kw%3D%3D';
            $rootScope.token = null;
            $rootScope.userToken = null;
            $rootScope.serverEndpoint = $location.protocol() + '://' + $location.host() + ':' + $location.port() + '/thuban-web/';
            $rootScope.showHeaderLogo = true;

            if($location.host() == 'localhost') {
                $rootScope.adminToken = 'xOir4xDkMmti9vEtlZqdZ1yb%2BJCDi6UHgwmCEX3P8g8%3D';
            }
            
            $transitions.onSuccess({}, function($transitions) {
                var newToState = $transitions.$to();
                var oldState = $transitions.$from();
                
                if(newToState.name == 'login') {
                    if($rootScope.userToken) {
                        if(oldState.name == 'petitions') {
                            $state.go('home');
                        } else {
                            $state.go('petitions');
                        }
                    } else {
                        $rootScope.token = null;
                        $rootScope.showHeaderLogo = false;
                    }
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
                to: 100,
                maxResults: 100,
                sortField: 'INDEX_ITEM_ID',
                sortDirection: 'ASC',
            };
        }
    ])
