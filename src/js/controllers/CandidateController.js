'use strict';

angular.module('EulenApp')

.controller('CandidateController', ['$scope', '$state',
    function ($scope,$state){
        $scope.variables = {
            step: 1
        };

        $scope.countries= [
            'Alemania',
            'España',
            'Francia',
            'Inglaterra',
        ];

        $scope.civilStatus = [
            'SOLTERO',
            'CASADO',
            'CONVIVIENTE',
            'SEPARADO',
            'VIUDO',
            'DIVORCIADO'
        ]

        $scope.candidate = {
            D_APELLIDO: null,
            D_SEGUNDO_APELLIDO: null,
            D_NOMBRE: null,
            D_TIPO_DOCUMENTO: null,
            N_IDENTIDAD: null,
            N_SEGURIDAD_SOCIALD: null,
            D_PAIS: null,
            D_PROVINCIA: null,
            D_LOCALIDAD: null,
            D_DOMICILIO: null,
            N_CP: null,
            D_MAIL: null,
            N_TELEFONO: null,
            N_TELEFONO_ALT: null,
            F_NACIMIENTO: null,
            N_EDAD: null,
            D_ESTADO_CIVIL: null,
            N_HIJOS: null
        }
    }
])