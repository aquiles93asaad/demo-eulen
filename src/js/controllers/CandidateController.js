'use strict';

angular.module('EulenApp')

.controller('CandidateController', ['$scope', '$state',
    function ($scope,$state){
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

        $scope.genreOptions = [
            {value: 'HOMBRE', label: 'Hombre'},
            {value: 'MUJER', label: 'Mujer'}
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
            { value: 'B_TIEMPO_UNDIA', label: 'Un día'},
            { value: 'B_TIEMPO_SEMANA', label: 'Una semana'},
            { value: 'B_TIEMPO_DOS_SEMANA', label: 'Dos semanas'},
            { value: 'B_TIEMPO_MES', label: 'Un mes'},
            { value: 'B_TIEMPO_TRES_MES', label: 'Tres meses'},
            { value: 'B_TIEMPO_PERMANENTE', label: 'Permanente'}
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
            D_SEXO: null,
            D_LICENCIA: null,
            B_VEHICULO_PROPIO: 'No',
            B_TRABAJO_ACTUAL: 'No',
            B_INSCRIPCION_DESEMPLEO: 'No',
            B_COBRO_PRESTACION: 'No',
            B_VISA_TRABAJO: 'No',
            F_FIN_VISA_TRABAJO: null,
            D_MEDIO_CONVOCATORIA: null,
            DISPONIBLIDAD_HORARIA: null,
            DISPONIBLIDAD_CONTRATO: null,
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
            B_TIEMPO_UNDIA: 'No',
            B_TIEMPO_SEMANA: 'No',
            B_TIEMPO_DOS_SEMANA: 'No',
            B_TIEMPO_MES: 'No',
            B_TIEMPO_TRES_MES: 'No',
            B_TIEMPO_PERMANENTE: 'No',
            B_SIN_FORMACIÓN: 'No',
            B_FORM_PRIMARIA: 'No',
            B_CICLO_FORMATIVO: 'No',
            B_FORM_SECUNDARIA: 'No',
            B_FORM_UNIVERSITARIA: 'No',
            B_CERTIFICACION: 'No',
            B_COMPLEMENTARIA: 'No',
            F_FIN_PRIMARIA: null,
            D_CICLO_FORMATIVO: null,
            F_FIN_FORMATIVO: null,
            F_FIN_SECUNDARIA: null,
            D_FORM_UNIVERSITARIA: null,
            F_FIN_UNIVERSITARIO: null,
            D_CERTIFICACION: null,
            F_FIN_CERTIFICACION: null,
            D_COMPLEMENTARIA: null,
            F_FIN_COMPLEMENTARIA: null,
            B_ESPANOL: 'No',
            B_INGLES: 'No',
            B_PORTUGUES: 'No',
            B_CATALAN: 'No',
            B_EUSKERA: 'No',
            B_OTRO_IDIOMA: 'No',
            D_ESPANOL_ORAL: null,
            D_ESPANOL_ESCRITO: null,
            D_INGLES_ORAL: null,
            D_INGLES_ESCRITO: null,
            D_PORTUGUES_ORAL: null,
            D_PORTUGUES_ESCRITO: null,
            D_CATALAN_ORAL: null,
            D_CATALAN_ESCRITO: null,
            D_EUSKERA_ORAL: null,
            D_EUSKERA_ESCRITO: null,
            D_OTRO: null,
            D_OTRO_ORAL: null,
            D_OTRO_ESCRITO: null,
            B_OFFICE: 'No',
            B_WORD: 'No',
            B_EXCEL: 'No',
            B_OTROS: 'No',
            D_OFFICE_NIVEL: null,
            D_WORD_NIVEL: null,
            D_EXCEL_NIVEL: null,
            D_OTROS: null,
            D_OTROS_NIVEL: null,
            B_EXPERIENCIA_0: 'No',
            D_EXPERIENCIA_0: null,
            D_FUNCIONES_0: null,
            F_FECHA_COMIENZO_0: null,
            B_CERTIFICACION_DISCAPACIDAD: 'No'

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