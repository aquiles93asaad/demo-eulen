"use strict";

angular.module('EulenApp', ['ngAnimate', 'ngTouch', 'ui.bootstrap'])
.constant('WS_EXP_COD_RET', '98')
.constant('WS_ACC_COD_RET', '97')
.constant('WS_SUC_COD_RET', '00')
.constant('VALUES_SEPARATOR', '|')
.constant('VALUES_SEPARATOR_2', ',')

.controller('AppController', function($scope, $rootScope, $http, $timeout, $uibModal, uibDatepickerPopupConfig, ThubanServices) {
    /* Private Methods */
    function setSolicitud() {
        $scope.solicitud = {
            D_ESTADO: {
                dataType: 'string',
                data: null
            },
            N_DNI: {
                dataType: 'integer',
                data: null
            },
            D_NOMBRE: {
                dataType: 'string',
                data: null
            },
            D_APELLIDO: {
                dataType: 'string',
                data: null
            },
            N_DIAS_DISPONIBLES: {
                dataType: 'integer',
                data: null
            },
            F_DESDE: {
                dataType: 'date',
                data: null
            },
            F_HASTA: {
                dataType: 'date',
                data: null
            },
            F_SOLICITUD: {
                dataType: 'date',
                data: null
            }
        };
    }

    function setVariables() {
        solicitudesParams = {
            queryFields: [
                'D_ESTADO',
                'N_DNI',
                'D_NOMBRE',
                'D_APELLIDO',
                'N_DIAS_DISPONIBLES',
                'F_DESDE',
                'F_HASTA',
                'F_SOLICITUD'
            ],
            searchCriterias: [],
            from: null,
            to: null
        };

        $scope.variables = {
            userId: null,
            loggedUser: {
                name: null,
                surname: null,
                email: null,
                group: null,
                dias_disponibles: null
            }
        };

        $scope.loginForm = {
            username: null,
            password: null
        };

        $scope.solicitudes = [];

        setSolicitud();
    }

    function changeSolicitudes() {
        if(typeof $scope.solicitudes !== 'undefined' && $scope.solicitudes.length != 0)  {
            for (var i = 0; i < $scope.solicitudes.length; i++) {
                var fields = {};
                for (var j = 0; j < $scope.solicitudes[i].fields.length; j++) {
                    if($scope.solicitudes[i].fields[j].dataType == 'date') {
                        var date = $scope.solicitudes[i].fields[j].value.split(' ')[0];
                        date = date.substring(0, 4) + '-' + date.substring(4, 6) + '-' + date.substring(6, 8);
                        $scope.solicitudes[i].fields[j].value = new Date(moment(date));
                    }

                    fields[$scope.solicitudes[i].fields[j].key] = $scope.solicitudes[i].fields[j].value;
                }

                $scope.solicitudes[i].fields = fields;
            }
        }
    }

    function processUserDetails(userDetails){
        $scope.variables.loggedUser.name = userDetails.thUser.name;
        $scope.variables.loggedUser.surname = userDetails.thUser.surname;
        $scope.variables.loggedUser.email = userDetails.thUser.email;
        for (var i = 0; i < userDetails.lstGroups.length; i++) {
            if(userDetails.lstGroups[i] == 'GRP_SUPERVISOR' || userDetails.lstGroups[i] == 'GRP_RRHH') {
                $scope.variables.loggedUser.group = userDetails.lstGroups[i];
            }
        }

        if(!$scope.variables.loggedUser.group) {
            $scope.variables.loggedUser.group = 'GRP_EMPLEADO';
        }
    }

    function checkDiasDisponibles() {
        var dias_disponibles = null;
        var newEntry = false;
        dias_disponibles = window.localStorage.getItem('dias_disponibles');

        if(dias_disponibles) {
            dias_disponibles = JSON.parse(dias_disponibles);
            if(dias_disponibles[$scope.variables.userId]) {
                $scope.variables.loggedUser.dias_disponibles = dias_disponibles[$scope.variables.userId];
            } else {
                newEntry = true;
            }
        } else {
            dias_disponibles = {};
            newEntry = true;
        }

        if(newEntry) {
            $scope.variables.loggedUser.dias_disponibles = 30;
            dias_disponibles[$scope.variables.userId] = 30;
            window.localStorage.setItem('dias_disponibles', JSON.stringify(dias_disponibles));
        }
    }
    /**********************/

    /* Private Variables */
    var solicitudesParams = null;
    /*********************/

    /* Scope Variables */
    $scope.variables = null;

    $scope.loginForm = null;

    $scope.solicitudes = [];

    $scope.solicitud = {};

    setVariables();

    $scope.popup1 = {
        opened: false
    };

    $scope.popup2 = {
        opened: false
    };

    $scope.dateOptions1 = {
        minDate: moment().add(1, 'days').toDate(),
        showWeeks: false
    };

    $scope.dateOptions2 = {
        minDate: moment().add(2, 'days').toDate(),
        maxDate: moment().add(1 + $scope.variables.loggedUser.dias_disponibles, 'days').toDate(),
        showWeeks: false
    };

    uibDatepickerPopupConfig.currentText = 'Hoy';
    uibDatepickerPopupConfig.clearText = 'Eliminar';
    uibDatepickerPopupConfig.closeText = 'Cerrar';
    uibDatepickerPopupConfig.onOpenFocus = false;
    /*******************/

    /* Public Methods */
    $scope.login = function() {
        var params = {
            user: $scope.loginForm.username,
            password: $scope.loginForm.password
        };

        ThubanServices.getToken(params)
        .then(function(token) {
            $rootScope.variables.token = token;
            $scope.variables.userId = $scope.loginForm.username;

            $scope.loginForm = {
                username: null,
                password: null
            };

            params = {
                userId: $scope.variables.userId,
                fullDisclousure: true
            };

            return ThubanServices.getUserDetails(params);
        })
        .then(function(userDetails) {
            processUserDetails(userDetails);

            var searchField = {};
            solicitudesParams.from = 0;
            solicitudesParams.to = 15;

            if($scope.variables.loggedUser.group == 'GRP_EMPLEADO') {
                searchField = {
                    'fieldData': {
                        'key': 'D_NOMBRE',
                        'value': $scope.variables.loggedUser.name,
                        'dataType': 'string'
                    },
                    'criteria': 'equals'
                };
                solicitudesParams.searchCriterias.push(searchField);
                searchField = {
                    'fieldData': {
                        'key': 'D_APELLIDO',
                        'value': $scope.variables.loggedUser.surname,
                        'dataType': 'string'
                    },
                    'criteria': 'equals'
                };
                solicitudesParams.searchCriterias.push(searchField);
                checkDiasDisponibles();
                $scope.dateOptions2.maxDate = moment().add(1 + $scope.variables.loggedUser.dias_disponibles, 'days').toDate();
            } else if($scope.variables.loggedUser.group == 'GRP_SUPERVISOR') {
                searchField = {
                    'fieldData': {
                        'key': 'D_ESTADO',
                        'value': 'Solicitudes vacaciones',
                        'dataType': 'string'
                    },
                    'criteria': 'equals'
                };
                solicitudesParams.searchCriterias.push(searchField);
            } else if($scope.variables.loggedUser.group == 'GRP_RRHH') {
                searchField = {
                    'fieldData': {
                        'key': 'D_ESTADO',
                        'value': 'Aprobado supervisor',
                        'dataType': 'string'
                    },
                    'criteria': 'equals'
                };
                solicitudesParams.searchCriterias.push(searchField);
            }

            return ThubanServices.getDocumentsByCriterias(solicitudesParams);
        })
        .then(function(solicitudes) {
            $scope.solicitudes = solicitudes.documents;
            changeSolicitudes();
        })
        .catch(function (errorResponse) {
            console.log(errorResponse);
        });
    };

    $scope.logout = function() {
        setVariables();
    ;}

    $scope.openModal = function () {
        $uibModal.open({
            template: '<div class="modal-header">            <h3 class="modal-title" id="modal-title">Solicitar Vacaciones</h3>        </div>        <div class="modal-body" id="modal-body">            <form>         <div class="dias_disponibles"><span>D&#237;as de vacaciones disponibles: </span> {{variables.loggedUser.dias_disponibles}}</div>       <div class="input-container left">                    <label for="fecha_desde">Desde</label>                    <input type="text" name="fecha_desde" class="no-appearance border-box my-form-control" uib-datepicker-popup="dd/MM/yyyy" ng-model="solicitud.F_DESDE.data" is-open="popup1.opened"                        datepicker-options="dateOptions1" ng-required="true" close-text="Cerrar" ng-click="open1()" ng-change="updatePickerDesde()"/>                </div>                <div class="input-container right">                    <label for="fecha_hasta">Hasta</label>                    <input type="text" name="fecha_hasta" class="no-appearance border-box my-form-control" uib-datepicker-popup="dd/MM/yyyy" ng-model="solicitud.F_HASTA.data" is-open="popup2.opened"                        datepicker-options="dateOptions2" ng-required="true" close-text="Cerrar" ng-click="open2()" />                </div>            </form>        </div>        <div class="modal-footer">            <button class="my-button no-appearance border-box my-form-control" type="button" ng-click="solicitar()">Confirmar</button>            <button id="close_modal" class="my-button no-appearance border-box my-form-control " type="button" ng-click="cancelModal()">Cancelar</button>        </div>',
            scope: $scope,
            size: 'lg',
            backdrop: true,
            controller: function($scope, $uibModalInstance) {
                $scope.cancelModal = function() {
                    $uibModalInstance.dismiss('cancel');
                }
            }
        }).result.catch(function (resp) {
            if (['cancel', 'backdrop click', 'escape key press'].indexOf(resp) === -1) throw resp;
        });
    };

    $scope.open1 = function() {
        $scope.popup1.opened = true;
    };

    $scope.open2 = function() {
        $scope.popup2.opened = true;
    };

    $scope.updatePickerDesde = function() {
        $scope.dateOptions2.minDate = moment($scope.solicitud.F_DESDE.data).add(1, 'days').toDate();
        $scope.dateOptions2.maxDate = moment($scope.solicitud.F_DESDE.data).add($scope.variables.loggedUser.dias_disponibles, 'days').toDate();
    };

    $scope.solicitar = function() {
        if(!$scope.solicitud.F_DESDE.data || !$scope.solicitud.F_HASTA.data) {
            alert('Debe completar los dos campos de fecha.');
        } else {
            var fields = [];

            $scope.solicitud.D_ESTADO.data = 'Solicitudes vacaciones';
            $scope.solicitud.N_DNI.data = $scope.variables.userId;
            $scope.solicitud.D_NOMBRE.data = $scope.variables.loggedUser.name;
            $scope.solicitud.D_APELLIDO.data = $scope.variables.loggedUser.surname;
            $scope.solicitud.N_DIAS_DISPONIBLES.data = $scope.variables.loggedUser.dias_disponibles;
            $scope.solicitud.F_SOLICITUD.data = new Date();

            angular.forEach($scope.solicitud, function(value, key) {
                fields.push({
                    'key': key,
                    'value': (value.dataType == 'date') ? moment(value.data).format('YYYYMMDD HH:mm:ss') : value.data,
                    'dataType': value.dataType
                });
            });

            var params = {
                fields: fields
            }

            ThubanServices.createDocument(params)
            .then(function(response) {
                $timeout(function() {
                    angular.element('#close_modal').triggerHandler('click');
                }, 0);
                alert('La solicitud fue creada correctamente.');
                setSolicitud();
                return ThubanServices.getDocumentsByCriterias(solicitudesParams);
            })
            .then(function(solicitudes) {
                $scope.solicitudes = solicitudes.documents;
                changeSolicitudes();
            })
            .catch(function(error) {
                console.log(error);
            });
        }
    };

    $scope.cambiarEstadoSolicitud = function(solicitud, aprobada) {
        var fields = [];

        if($scope.variables.loggedUser.group == 'GRP_SUPERVISOR') {
            solicitud.fields.D_ESTADO = (aprobada) ? 'Aprobado supervisor' : 'Rechazado supervisor';
        } else if($scope.variables.loggedUser.group == 'GRP_RRHH') {
            solicitud.fields.D_ESTADO = (aprobada) ? 'Aprobado RRHH' : 'Rechazado RRHH';
        }

        angular.forEach($scope.solicitud, function(value, key) {
            if(typeof solicitud.fields[key] === 'undefined') {
                solicitud.fields[key] = null;
            }

            fields.push({
                'key': key,
                'value': (value.dataType == 'date') ? moment(solicitud.fields[key]).format('YYYYMMDD HH:mm:ss') : solicitud.fields[key],
                'dataType': value.dataType
            });
        });

        var params = {
            fields: fields,
            documentID: solicitud.id
        };

        ThubanServices.updateDocument(params)
        .then(function(response) {
            if(aprobada) {
                alert('La solicitud fue aprobada correctamente.');
            } else {
                alert('La solicitud fue rechazada correctamente.');
            }

            return ThubanServices.getDocumentsByCriterias(solicitudesParams);
        })
        .then(function(solicitudes) {
            $scope.solicitudes = solicitudes.documents;
            changeSolicitudes();
        })
        .catch(function(error) {
            console.log(error);
        });
    };
    /**********************/
})

.run(function($rootScope) {
    $rootScope.variables = {
        serverEndpoint: 'http://demos:105/thuban-web/',
        token: null
    }
})
