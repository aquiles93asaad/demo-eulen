'use strict';

angular.module('EulenApp')

.controller('CandidateController', ['$scope', '$state',
    function ($scope, $state){
        /* Scope variables */
        $scope.variables = {
            tab: 0,
            maxTabs: 4
        };

        $scope.nationalities = [
            { value: 'ALEMANIA', label: 'Alemania'},
            { value: 'ESPANIA', label: 'España'},
            { value: 'FRANCIA', label: 'Francia'},
            { value: 'INGLATERRA', label: 'Inglaterra'}
        ];

        $scope.civilStatus = [
            { value: 'SOLTERO', label: 'Soltero'},
            { value: 'CASADO', label: 'Casado'},
            { value: 'CONVIVIENTE', label: 'Conviviente'},
            { value: 'SEPARADO', label: 'Separado'},
            { value: 'VIUDO', label: 'Viudo'},
            { value: 'DIVORCIADO', label: 'Divorciado'}
        ];

        $scope.announcement = [
            { value: 'AMIGOS', label:'Amigos'},
            { value: 'PERIODICO', label:'Periodicos'},
            { value: 'MUNICIPALIDAD', label:'Municipalidad'},
            { value: 'VOLANTE', label:'Volante'},
            { value: 'INTERNET', label:'Internet'},
            { value: 'FERIA', label:'Feria'},
            { value: 'PROGRAMA', label:'Programa'},
            { value: 'REDES SOCIALES', label:'Redes sociales'},
            { value: 'REFERIDOS', label:'Referidos'},
            { value: 'EX-TRABAJADORES', label:'Ex-trabajadores'},
            { value: 'OTROS', label:'Otros'}
        ];

        $scope.licenses = [
            { value: 'No', label:'No'},
            { value:'Motocicleta', label:'Motocicleta'},
            { value:'Automovil', label:'Automovil'},
            { value:'Camiones menores a 3.500kg', label:'Camiones menores a 3.500kg'},
            { value:'Camiones mayores a 3.500kg', label:'Camiones mayores a 3.500kg'},
            { value:'', label:'Mercancias peligrosas'}
        ];

        $scope.computerLevels =[
            { value: 'Usuario', label:'Medio'},
            { value: 'Usuario Avanzado', label:'Avanzado'},
            { value: 'Experto', label:'Experto'}
        ];

        $scope.LanguageLevel =[
            { value: 'Basico', label:'Basico'},
            { value: 'Medio', label:'Medio'},
            { value: 'Avanzado', label:'Avanzado'},
            { value: 'Bilingue', label:'Bilingue'}
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
            B_SEXO: null,
            D_LICENCIA: null,
            B_VEHICULO_PROPIO: null,
            B_TRABAJO_ACTUAL: null,
            B_INSCRIPCION_DESEMPLEO: null,
            B_COBRO_PRESTACION: null,
            B_VISA_TRABAJO: null,
            F_FIN_VISA_TRABAJO: null,
            D_MEDIO_CONVOCATORIA: null,
            DISPONIBLIDAD_HORARIA: null,
            DISPONIBLIDAD_CONTRATO: null
        }
        /*****************/

        /* Scope functions */
        $scope.nextTab = function() {
            $scope.variables.tab++;
        }

        $scope.previousTab = function() {
            $scope.variables.tab--;
        }
        /*******************/
        
        /* Private fucntions */
        
        /*********************/
    }
])