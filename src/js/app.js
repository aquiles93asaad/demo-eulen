'use strict';

angular.module('EulenApp', [
    'ui.router',
    'ui.bootstrap',
    'ngMessages',
    'ngAnimate',
    'angularMoment',
    'ngMaterial',
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
    .constant('QUERY_FIELDS', {
        'cliente': ['D_CLIENTE', 'C_CLIENTE', 'N_CIF'],
        'cliente_local': ['D_LOCAL', 'C_LOCAL', 'D_ZONA', 'D_SUBZONA', 'D_DIRECCION_LOCAL', 'N_LATITUD', 'N_LONGITUD'],
        'puestos': ['D_AREA', 'C_AREA', 'D_PUESTO', 'C_PUESTO'],
        'peticion': ['N_PETICION', 'F_PETICION', 'D_LOCAL', 'F_INICIO', 'D_ESTADO_SOLICITUD']
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
                puestos: function($rootScope, SearchServices, QUERY_FIELDS) {
                    var params = $rootScope.searchParams;
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
                        console.error(error);
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
                petitions: function($rootScope, SearchServices, QUERY_FIELDS) {
                    var client = {
                        D_CLIENTE: null,
                        C_CLIENTE: null,
                    };

                    var params = $rootScope.searchParams;
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
                        var fields = result.documents[0].fields;

                        for (var i = 0; i < fields.length; i++) {
                            if(fields[i].key == 'D_CLIENTE') {
                                client.D_CLIENTE = fields[i].value;
                            } else if(fields[i].key == 'C_CLIENTE') {
                                client.C_CLIENTE = fields[i].value;
                            }
                        }

                        params.documentClass = 'PETICION_MOD';
                        params.queryFields = QUERY_FIELDS.peticion;
                        params.maxResults = 100;
                        params.searchCriterias = [
                            {
                                'fieldData': {
                                    'key': 'D_CLIENTE',
                                    'value': client.D_CLIENTE,
                                    'dataType': 'string'
                                },
                                'criteria': 'equals'
                            },
                            {
                                'fieldData': {
                                    'key': 'C_CLIENTE',
                                    'value': client.C_CLIENTE,
                                    'dataType': 'string'
                                },
                                'criteria': 'equals'
                            },
                        ];
                        
                        return SearchServices.getDocumentsByCriterias(params);
                    })
                    .then(function(result) {
                        var petitions = {
                            count: result.count,
                            documents: result.documents
                        };

                        return petitions;
                    })
                    .catch(function(error) {
                        console.error(error);
                    });
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
                data: function($rootScope, SearchServices, QUERY_FIELDS) {
                    var returnedData = {
                        client: {
                            D_CLIENTE: null,
                            C_CLIENTE: null,
                            N_CIF: null
                        },
                        locales: [],
                        puestos: []
                    };
                    
                    var params = $rootScope.searchParams;
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
                        returnedData.locales = result.documents;

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
                        returnedData.puestos = result.documents;
                        return returnedData;
                    })
                    .catch(function(error) {
                        console.error(error);
                    });
                }
            }
        })

        $urlRouterProvider.otherwise('/home');
    }])

/* -------
    RUN PHASE
/* ------------------------------- */

    .run(['$rootScope', '$transitions', '$location',
        function($rootScope, $transitions, $location){
            $rootScope.adminToken = 'xOir4xDkMmti9vEtlZqdZ64kJxs2xtvy1i0hIXfVcLk%3D';
            //$rootScope.adminToken = 'xOir4xDkMmv9lYBFMMpXgFQlOewvpaR3UavdR9uJL5XV34BXZkvxVg%3D%3D';
            $rootScope.token = $rootScope.adminToken;
            $rootScope.serverEndpoint = $location.protocol() + '://' + $location.host() + ':' + $location.port() + '/thuban-web/';
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
                to: 100,
                maxResults: 100,
                sortField: 'INDEX_ITEM_ID',
                sortDirection: 'ASC',
            };
        }
    ])
