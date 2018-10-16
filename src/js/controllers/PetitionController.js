'use strict';

angular.module('EulenApp')

.controller('PetitionController', ['$scope', '$rootScope', '$state', '$mdToast', 'data', 'DocumentServices',
    function ($scope, $rootScope, $state, $mdToast, data, DocumentServices){
        /* Scope variables */
        $scope.variables = {
            isSubmitting: false,
            D_PUESTO: null
        };
        
        $scope.genreOptions = [
            {value: 'Masculino', label: 'Masculino'},
            {value: 'Femenino', label: 'Femenino'},
            {value: 'Indistinto', label: 'Indistinto'}
        ]

        $scope.disponibilidadesHorarias = [
            { value: 'B_DISPO_MANANA', label: 'Mañana'},
            { value: 'B_DISPO_TARDE', label: 'Tarde'},
            { value: 'B_DISPO_NOCHE', label: 'Noche'},
            { value: 'B_DISPO_ROTATIVO_TURNO', label: 'Rotativo'}
        ];

        $scope.disponibilidadesDiarias = [
            { value: 'B_DISPO_LUNES', label: 'Lunes'},
            { value: 'B_DISPO_MARTES', label: 'Martes'},
            { value: 'B_DISPO_MIERCOLES', label: 'Miércoles'},
            { value: 'B_DISPO_JUEVES', label: 'Jueves'},
            { value: 'B_DISPO_VIERNES', label: 'Viernes'},
            { value: 'B_DISPO_SABADO', label: 'Sábado'},
            { value: 'B_DISPO_DOMINGO', label: 'Domingo'},
            { value: 'B_DISPO_ROTATIVO_DIAS', label: 'Rotativo'}
        ];

        $scope.tiposContrato = [
            { value: 'Un dia', label: 'Un día'},
            { value: 'Una semana', label: 'Una semana'},
            { value: '15 dias', label: '15 días'},
            { value: 'Un mes', label: 'Un mes'},
            { value: '3 meses', label: '3 meses'},
            { value: 'Permanente', label: 'Permanente'}
        ];

        $scope.locales = [];
        $scope.areas = [];

        var localesObject = {};
        var areasObject = {};

        processLocales(data.locales);
        processPuestos(data.puestos);

        $scope.petition = {
            N_CANTIDAD: null,
            F_PETICION: null,
            D_SOLICITANTE: $rootScope.userID,
            D_CLIENTE: data.client.D_CLIENTE,
            C_CLIENTE: data.client.C_CLIENTE,
            D_LOCAL: null,
            C_LOCAL: null,
            N_CIF: data.client.N_CIF,
            N_SUELDO_BASICO: null,
            D_EXPERIENCIA_ADIC: null,
            D_SEXO: null,
            D_ZONA: null,
            D_SUBZONA: null,
            D_DIRECCION_LOCAL: null,
            N_LATITUD: null,
            N_LONGITUD: null,
            D_AREA: null,
            C_AREA: null,
            D_PUESTO: null,
            C_PUESTO: null,
            F_ESTIMADA_INGRESO: null,
            D_OBSERVACIONES_CLIENTE: null,
            DISPONIBLIDAD_HORARIA: null,
            DISPONIBLIDAD_DIARIA: null,
            B_DISPO_MANANA: 'No',
            B_DISPO_TARDE: 'No',
            B_DISPO_NOCHE: 'No',
            B_DISPO_ROTATIVO_TURNO: 'No',
            B_DISPO_LUNES: 'No',
            B_DISPO_MARTES: 'No',
            B_DISPO_MIERCOLES: 'No',
            B_DISPO_JUEVES: 'No',
            B_DISPO_VIERNES: 'No',
            B_DISPO_SABADO: 'No',
            B_DISPO_DOMINGO: 'No',
            B_DISPO_ROTATIVO_DIAS: 'No',
            D_DURACION_CONTRATO: null,
            B_VALIDACION_MOD: 'No',
            D_ESTADO_SOLICITUD: 'Asignar TS'
        }
        /*****************/

        /* Scope functions */
        $scope.localChange = function() {
            $scope.petition.C_LOCAL = localesObject[$scope.petition.D_LOCAL].C_LOCAL;
            $scope.petition.D_ZONA = localesObject[$scope.petition.D_LOCAL].D_ZONA;
            $scope.petition.D_SUBZONA = localesObject[$scope.petition.D_LOCAL].D_SUBZONA;
            $scope.petition.D_DIRECCION_LOCAL = localesObject[$scope.petition.D_LOCAL].D_DIRECCION_LOCAL;
            $scope.petition.N_LATITUD = localesObject[$scope.petition.D_LOCAL].N_LATITUD;
            $scope.petition.N_LONGITUD = localesObject[$scope.petition.D_LOCAL].N_LONGITUD;
        };

        $scope.puestoChange = function() {
            var D_AREA = $scope.variables.D_PUESTO.substring($scope.variables.D_PUESTO.indexOf('_') + 1, $scope.variables.D_PUESTO.length);
            var D_PUESTO = $scope.variables.D_PUESTO.substring(0, $scope.variables.D_PUESTO.indexOf('_'));
            $scope.petition.D_PUESTO = D_PUESTO;
            $scope.petition.D_AREA = D_AREA;
            $scope.petition.C_AREA = areasObject[D_AREA].puestosObject[D_PUESTO].C_AREA;
            $scope.petition.C_PUESTO = areasObject[D_AREA].puestosObject[D_PUESTO].C_PUESTO;
        };

        $scope.createPetition = function(form) {
            if(form.$valid) {
                $scope.variables.isSubmitting = true;
                processMultipleSelect($scope.petition.DISPONIBLIDAD_HORARIA);
                processMultipleSelect($scope.petition.DISPONIBLIDAD_DIARIA);
                delete $scope.petition.DISPONIBLIDAD_HORARIA;
                delete $scope.petition.DISPONIBLIDAD_DIARIA;
                $scope.petition.F_PETICION = moment();
                var fields = processPetitionFields();

                var params = {
                    'documentClass': 'PETICION_MOD',
                    'fields': fields
                };

                DocumentServices.createDocument(params)
                .then(function(result) {
                    fields = [
                        {
                            'key': 'N_PETICION',
                            'value': result.documentID,
                            'dataType': 'string'
                        }
                    ];
                    params.fields = fields;
                    params['documentID'] = result.documentID;
                    return DocumentServices.updateDocument(params)
                })
                .then(function(result) {
                    $scope.variables.isSubmitting = false;
                    $scope.showSimpleToast = function() {
                        var pinTo = $scope.getToastPosition();
                    
                        $mdToast.show(
                            $mdToast.simple()
                            .textContent('La petición fue creada correctamente!')
                            .position('top right')
                            .hideDelay(3000)
                        );
                    };
                })
                .catch(function(error) {
                    $scope.variables.isSubmitting = false;
                    console.log(error);
                });
            }
        };
        /*******************/
        
        /* Private fucntions */
        function processLocales(locales) {
            for (var i = 0; i < locales.length; i++) {
                var local = {};
                for (var j = 0; j < locales[i].fields.length; j++) {
                    local[locales[i].fields[j].key] = locales[i].fields[j].value;
                }
                localesObject[local['D_LOCAL']] = local;
                $scope.locales.push(local);
            }
        }

        function processPuestos(puestos) {
            for (var i = 0; i < puestos.length; i++) {
                var area = {
                    D_AREA: null,
                    puestos: [],
                    puestosObject: {}
                };
                
                var puesto = {
                    D_PUESTO: null,
                    C_PUESTO: null,
                    D_AREA: null,
                    C_AREA: null
                };
    
                for (var j = 0; j < puestos[i].fields.length; j++) {
                    if(puestos[i].fields[j].key == 'D_AREA') {
                        area.D_AREA = puestos[i].fields[j].value;
                        puesto.D_AREA = puestos[i].fields[j].value;
                    } else if (puestos[i].fields[j].key == 'C_AREA') {
                        puesto.C_AREA = puestos[i].fields[j].value;
                    } else if (puestos[i].fields[j].key == 'D_PUESTO') {
                        puesto.D_PUESTO = puestos[i].fields[j].value;
                    } else if (puestos[i].fields[j].key == 'C_PUESTO') {
                        puesto.C_PUESTO = puestos[i].fields[j].value;
                    }
                    
                    if(typeof areasObject[area.D_AREA] === 'undefined') {
                        areasObject[area.D_AREA] = area;
                    }
                }
    
                areasObject[area.D_AREA].puestosObject[puesto.D_PUESTO] = puesto;
                areasObject[area.D_AREA].puestos.push(puesto);
            }
    
            angular.forEach(areasObject, function(area, d_area) {
                $scope.areas.push(area);
            });
        }

        function processMultipleSelect(selectedOptions) {
            if(selectedOptions) {
                for (var i = 0; i < selectedOptions.length; i++) {
                    $scope.petition[selectedOptions[i]] = 'Si';
                }
            }
        }

        function processPetitionFields() {
            var fields = [];
            angular.forEach($scope.petition, function(value, key) {
                var dataType = getDataType(key);
                var field = {
                    'key': key,
                    'value': (dataType == 'date') ? moment(value).format('YYYYMMDD HH:mm:ss') : value,
                    'dataType': dataType
                }
                fields.push(field);
            });

            return fields;
        }

        function getDataType(key) {
            var letter = key[0];
            var name = key.substring(key.indexOf('_') + 1, key.length);

            if(letter == 'D' || letter == 'B') {
                return 'string';
            } else if(letter == 'F') {
                return 'date';
            } else if(letter == 'C') {
                return 'integer';
            } else if(letter == 'N') {
                if(name == 'SUELDO_BASICO' || name == 'LATITUD' || name == 'LONGITUD') {
                    return 'decimal';
                } else if(name == 'CIF' || name == 'NIF') {
                    return 'string';
                }
                return 'integer';
            }
        }
        /*********************/
    }
])