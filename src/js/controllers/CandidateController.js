'use strict';

angular.module('EulenApp')

.controller('CandidateController', ['$scope', '$state',
    function ($scope,$state){
        $scope.variables = {
            step: 1
        };

        $scope.nationalities= [
            'ALEMAN',
            'ESPAÑOL',
            'FRANCES',
            'INGLES',
        ];

        $scope.civilStatus = [
            'SOLTERO',
            'CASADO',
            'CONVIVIENTE',
            'SEPARADO',
            'VIUDO',
            'DIVORCIADO'
        ];

        $scope.announcement = [
            {value:'AMIGOS', label:'Amigos'},
            {value:'PERIODICO', label:'Periodicos'},
            {value:'MUNICIPALIDAD', label:'Municipalidad'},
            {value:'VOLANTE', label:'Volante'},
            {value:'INTERNET', label:'Internet'},
            {value:'FERIA', label:'Feria'},
            {value:'PROGRAMA', label:'Programa'},
            {value:'REDES SOCIALES', label:'Redes sociales'},
            {value:'REFERIDOS', label:'Referidos'},
            {value:'EX-TRABAJADORES', label:'Ex-trabajadores'},
            {value:'OTROS', label:'Otros'}
        ];

        $scope.licenses=[
            {value:'', label:'No'},
            {value:'', label:'Motocicleta'},
            {value:'', label:'Automovil'},
            {value:'', label:'Camiones menores a 3.500kg'},
            {value:'', label:'Camiones mayores a 3.500kg'},
            {value:'', label:'Mercancias peligrosas'}
        ];

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
            N_HIJOS: null,
            B_SEXO:null,
            D_LICENCIA:null,
            B_VEHICULO_PROPIO:null,
            B_TRABAJO_ACTUAL:null,
            B_INSCRIPCION_DESEMPLEO:null,
            B_COBRO_PRESTACION:null,
            B_VISA_TRABAJO:null,
            F_FIN_VISA_TRABAJO:null,
            D_MEDIO_CONVOCATORIA:null

        }
    }
])