'use strict';

angular.module('EulenApp')

.controller('CandidateController', ['$scope', '$state', '$mdToast', 'puestos', 'DocumentServices',
    function ($scope, $state, $mdToast, puestos, DocumentServices){
        /* Scope variables */
        $scope.variables = {
            tab: 0,
            maxTabs: 5,
            isSubmitting: false,
            loadingFile: false,
            birthMaxDate: moment().subtract(18, 'years'),
            tab1: true,
            tab2: true,
            tab3: true,
            tab4: true,
            tab5: true,
            professions: 0,
            exp2: false,
            exp3: false,
            exp4: false,
            cv: null,
            fileName: null,
            DISPONIBLIDAD_HORARIA: null,
            DISPONIBLIDAD_DIARIA: null,
            TIPO_CONTRATO: null,
            PUESTOS: null
        };

        $scope.documentOptions = [
            { value: 'DNI', label: 'DNI'},
            { value: 'Pasaporte', label: 'Pasaporte'}
        ]

        $scope.nationalities = [
            { value: 'Alemana', label: 'Alemana'},
            { value: 'Austríaca', label: 'Austríaca'},
            { value: 'Belga', label: 'Belga'},
            { value: 'Búlgara', label: 'Búlgara'},
            { value: 'Española', label: 'Española'},
            { value: 'Francesa', label: 'Francesa'},
            { value: 'Griega', label: 'Griega'},
            { value: 'Irlandesa', label: 'Irlandesa'},
            { value: 'Italiana', label: 'Italiana'},
            { value: 'Polaca', label: 'Polaca'},
            { value: 'Portuguesa', label: 'Portuguesa'}
        ];

        $scope.countries = [
            { value: 'Alemania', label: 'Alemania'},
            { value: 'Austria', label: 'Austria'},
            { value: 'Bélgica', label: 'Bélgica'},
            { value: 'Bulgaria', label: 'Bulgaria'},
            { value: 'Chipre', label: 'Chipre'},
            { value: 'Croacia', label: 'Croacia'},
            { value: 'Dinamarca', label: 'Dinamarca'},
            { value: 'España', label: 'España'},
            { value: 'Francia', label: 'Francia'},
            { value: 'Grecia', label: 'Grecia'},
            { value: 'Irlanda', label: 'Irlanda'},
            { value: 'Italia', label: 'Italia'},
            { value: 'Polonia', label: 'Polonia'},
            { value: 'Portugal', label: 'Portugal'},
        ];

        $scope.states = [
            { value: 'Álava', label: 'Álava'},
            { value: 'Albacete', label: 'Albacete'},
            { value: 'Alicante', label: 'Alicante'},
            { value: 'Almería', label: 'Almería'},
            { value: 'Asturias', label: 'Asturias'},
            { value: 'Ávila', label: 'Ávila'},
            { value: 'Badajoz', label: 'Badajoz'},
            { value: 'Barcelona', label: 'Barcelona'},
            { value: 'Burgos', label: 'Burgos'},
            { value: 'Cáceres', label: 'Cáceres'},
            { value: 'Cádiz', label: 'Cádiz'},
            { value: 'Cantabria', label: 'Cantabria'},
            { value: 'Castellón', label: 'Castellón'},
            { value: 'Ciudad Real', label: 'Ciudad Real'},
            { value: 'Córdoba', label: 'Córdoba'},
            { value: 'Cuenca', label: 'Cuenca'},
            { value: 'Gerona', label: 'Gerona'},
            { value: 'Granada', label: 'Granada'},
            { value: 'Guadalajara', label: 'Guadalajara'},
            { value: 'Guipúzcoa', label: 'Guipúzcoa'},
            { value: 'Huelva', label: 'Huelva'},
            { value: 'Huesca', label: 'Huesca'},
            { value: 'Jaén', label: 'Jaén'},
            { value: 'La Coruña', label: 'La Coruña'},
            { value: 'La Rioja', label: 'La Rioja'},
            { value: 'Las Palmas', label: 'Las Palmas'},
            { value: 'León', label: 'León'},
            { value: 'Lérida', label: 'Lérida'},
            { value: 'Lugo', label: 'Lugo'},
            { value: 'Madrid', label: 'Madrid'},
            { value: 'Málaga', label: 'Málaga'},
            { value: 'Murcia', label: 'Murcia'},
            { value: 'Navarra', label: 'Navarra'},
            { value: 'Orense', label: 'Orense'},
            { value: 'Palencia', label: 'Palencia'},
            { value: 'Pontevedra', label: 'Pontevedra'},
            { value: 'Salamanca', label: 'Salamanca'},
            { value: 'Santa Cruz de Tenerife', label: 'Santa Cruz de Tenerife'},
            { value: 'Segovia', label: 'Segovia'},
            { value: 'Sevilla', label: 'Sevilla'},
            { value: 'Soria', label: 'Soria'},
            { value: 'Tarragona', label: 'Tarragona'},
            { value: 'Teruel', label: 'Teruel'},
            { value: 'Toledo', label: 'Toledo'},
            { value: 'Valencia', label: 'Valencia'},
            { value: 'Valladolid', label: 'Valladolid'},
            { value: 'Vizcaya', label: 'Vizcaya'},
            { value: 'Zamora', label: 'Zamora'},
            { value: 'Zaragoza', label: 'Zaragoza'}
        ];

        $scope.civilStatus = [
            { value: 'Soltero', label: 'Soltero'},
            { value: 'Casado', label: 'Casado'},
            { value: 'Conviviente', label: 'Conviviente'},
            { value: 'Separado', label: 'Separado'},
            { value: 'Viudo', label: 'Viudo'},
            { value: 'Divorciado', label: 'Divorciado'}
        ];

        $scope.announcement = [
            { value: 'Amigos', label:'Amigos'},
            { value: 'Periódico', label:'Periódico'},
            { value: 'Municipalidad', label:'Municipalidad'},
            { value: 'Volante', label:'Volante'},
            { value: 'Internet', label:'Internet'},
            { value: 'Feria', label:'Feria'},
            { value: 'Programa de radio', label:'Programa de radio'},
            { value: 'Redes sociales', label:'Redes sociales'},
            { value: 'Referidos', label:'Referidos'},
            { value: 'Ex-trabajadores', label:'Ex-trabajadores'},
            { value: 'Otros', label:'Otros'}
        ];

        $scope.licenses = [
            { value: 'No', label:'No'},
            { value: 'Motocicleta', label: 'Motocicleta'},
            { value: 'Automovil', label: 'Automovil'},
            { value: 'Camión < 3.500kg', label: 'Camión < 3.500kg'},
            { value: 'Camión > 3.500kg', label: 'Camión > 3.500kg'},
            { value: 'Autobús', label: 'Autobús'},
            { value: 'Mercancías Peligrosas', label: 'Mercancías Peligrosas'}
        ];

        $scope.computerLevels =[
            { value: 'Usuario', label:'Básico'},
            { value: 'Usuario Avanzado', label:'Avanzado'},
            { value: 'Experto', label:'Experto'}
        ];

        $scope.languageLevels =[
            { value: 'Básico', label:'Básico'},
            { value: 'Intermedio', label:'Intermedio'},
            { value: 'Avanzado', label:'Avanzado'},
            { value: 'Bilingüe', label:'Bilingüe'}
        ];

        $scope.genreOptions = [
            {value: 'Masculino', label: 'Masculino'},
            {value: 'Femenino', label: 'Femenino'}
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

        $scope.areas = [];
        var areasObject = {};
        processPuestos(puestos);

        $scope.candidate = {
            D_APELLIDO: null,
            D_SEGUNDO_APELLIDO: null,
            D_NOMBRE: null,
            D_TIPO_DOCUMENTO: null,
            N_IDENTIDAD: null,
            N_SEGURIDAD_SOCIALD: null,
            D_PAIS: 'España',
            D_ZONA: null,
            D_SUBZONA: null,
            D_DOMICILIO: null,
            N_CP: null,
            D_MAIL: null,
            N_TELEFONO: null,
            N_TELEFONO_ALT: null,
            F_NACIMIENTO: null,
            N_EDAD: null,
            D_ESTADO_CIVIL: null,
            D_NACIONALIDAD: 'Española',
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
            N_BRUTO_ANUAL: null,
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
            B_SIN_FORMACION: 'No',
            D_FORM_PRIMARIA: 'No',
            F_FIN_PRIMARIA: null,
            B_CICLO_FORMATIVO: 'No',
            D_CICLO_FORMATIVO: null,
            F_FIN_FORMATIVO: null,
            B_FORM_SECUNDARIA: 'No',
            F_FIN_SECUNDARIA: null,
            B_FORM_UNIVERSITARIA: 'No',
            D_FORM_UNIVERSITARIA: null,
            F_FIN_UNIVERSITARIO: null,
            B_CERTIFICACION: 'No',
            D_CERTIFICACION: null,
            F_FIN_CERTIFICACION: null,
            B_COMPLEMENTARIA: 'No',
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
            D_OFFICE_NIVEL: null,
            B_WORD: 'No',
            D_WORD_NIVEL: null,
            B_EXCEL: 'No',
            D_EXCEL_NIVEL: null,
            B_OTROS: 'No',
            D_OTROS_NIVEL: null,
            D_OFFICE_NIVEL: null,
            D_WORD_NIVEL: null,
            D_EXCEL_NIVEL: null,
            D_OTROS: null,
            D_OTROS_NIVEL: null,
            B_EXPERIENCIA_0: 'No',
            D_EXPERIENCIA_0: null,
            D_FUNCIONES_0: null,
            F_FECHA_COMIENZO_0: null,
            F_FECHA_FIN_0: null,
            B_EXPERIENCIA_1: 'No',
            D_EXPERIENCIA_1: null,
            D_FUNCIONES_1: null,
            F_FECHA_COMIENZO_1: null,
            F_FECHA_FIN_1: null,
            B_EXPERIENCIA_2: 'No',
            D_EXPERIENCIA_2: null,
            D_FUNCIONES_2: null,
            F_FECHA_COMIENZO_2: null,
            F_FECHA_FIN_2: null,
            B_EXPERIENCIA_3: 'No',
            D_EXPERIENCIA_3: null,
            D_FUNCIONES_3: null,
            F_FECHA_COMIENZO_3: null,
            F_FECHA_FIN_3: null,
            B_CERTIFICACION_DISCAPACIDAD: 'No',
            D_PUESTO1: null,
            D_PUESTO2: null,
            D_PUESTO3: null,
            D_SITUACION_ACTUAL: 'CV recibido',
            F_POSTULACION: null
        };
        /*****************/

        /* Scope functions */
        $scope.nextTab = function(formEnable) {
            $scope.variables.tab++;
            $scope.variables[formEnable] = false;
        };

        $scope.previousTab = function() {
            $scope.variables.tab--;
        };

        $scope.calculateAge = function() {
            $scope.candidate.N_EDAD = moment().diff($scope.candidate.F_NACIMIENTO, 'years');
        };

        $scope.$watch('candidate.PUESTOS', function(newValue, oldValue) {
            if (newValue && newValue.length > 3) {
                $scope.variables.PUESTOS = oldValue;
            }
        });

        $scope.setBoolean = function(name) {
            if(name == 'OTRO') {
                if($scope.candidate['D_OTRO']) {
                    $scope.candidate['B_OTRO_IDIOMA'] = 'Si';
                } else {
                    $scope.candidate['B_OTRO_IDIOMA'] = 'No';
                    $scope.candidate['D_OTRO_ORAL'] = null;
                    $scope.candidate['D_OTRO_ESCRITO'] = null;
                }
            } else {
                var realName = name.substring(name.indexOf('_') + 1, name.length);
                if($scope.candidate[name]) {
                    $scope.candidate['B_' + realName] = 'Si';
                } else {
                    $scope.candidate['B_' + realName] = 'No';
                }
            }
        };

        $scope.skillBoolean = function(name, isLanguage) {
            if($scope.candidate['B_' + name] == 'No') {
                if(isLanguage) {
                    $scope.candidate['D_' + name + '_ORAL'] = null;
                    $scope.candidate['D_' + name + '_ESCRITO'] = null;
                } else {
                    $scope.candidate['D_' + name + '_NIVEL'] = null;
                }
            }
        };
        
        $scope.addProfession = function() {
            $scope.variables.professions++;
            $scope.variables['exp' + $scope.variables.professions] = true;
        };

        $scope.deleteProfession = function(n) {
            $scope.variables.professions--;
            $scope.variables['exp' + n] = false;
            $scope.candidate['B_EXPERIENCIA_' + n] = 'No';
            $scope.candidate['D_EXPERIENCIA_' + n] = null;
            $scope.candidate['D_FUNCIONES_' + n] = null;
            $scope.candidate['F_FECHA_COMIENZO_' + n] = null;
            $scope.candidate['F_FECHA_FIN_' + n] = null;
        };

        $scope.changeCV = function(element) {
            $scope.variables.loadingFile = true;
            $scope.variables.cv = element;
            if(element.files && element.files[0]) {
                var reader = new FileReader();
                var file = element.files[0];
                $scope.$apply(function () {
                    $scope.fileName = file.name;
                });
    
                reader.addEventListener("load", function () {
                    var isPdf = reader.result.substring(5, reader.result.indexOf(';base64'));
                    if(isPdf == 'application/pdf'){
                        var stream = reader.result.substring(reader.result.indexOf(';base64,') + 8, reader.result.length);
                        $scope.variables.cv = stream;
                        $scope.variables.fileName = $scope.fileName;
                    } else {
                        $scope.variables.cv = null;
                        $scope.variables.fileName = null;
                        $mdToast.show(
                            $mdToast.simple()
                            .textContent('El archivo adjunto debe ser de formato PDF!')
                            .position('top right')
                            .hideDelay(3000)
                        );
                    }
                }, false);

                reader.onloadend = function() {
                    if(reader.readyState == 2) {
                        $scope.$apply(function () {
                            $scope.variables.loadingFile = false;
                        });
                    }
                };
                reader.readAsDataURL(file);
            }
        };

        $scope.createCandidate = function() {
            $scope.variables.isSubmitting = true;
            processMultipleSelect($scope.variables.DISPONIBLIDAD_DIARIA);
            processMultipleSelect($scope.variables.DISPONIBLIDAD_HORARIA);
            processMultipleSelect($scope.variables.TIPO_CONTRATO);
            for (var i = 0; i < $scope.variables.PUESTOS.length; i++) {
                $scope.candidate['D_PUESTO' + (i+1)] = $scope.variables.PUESTOS[i];
            }
            $scope.candidate.F_POSTULACION = moment();
            var fields = processCandidateFields();

            var params = {
                'documentClass': 'LEGAJO_CANDIDATO',
                'fields': fields,
                'resource': {
                    'extension': 'pdf',
                    'stream': $scope.variables.cv
                }
            };

            DocumentServices.createDocument(params)
            .then(function(result) {
                $scope.variables.isSubmitting = false;

                $mdToast.show(
                    $mdToast.simple()
                    .textContent('Gracias por postularse')
                    .position('top right')
                    .hideDelay(3000)
                );

                $state.go('home');
            })
            .catch(function(error) {
                $scope.variables.isSubmitting = false;
                $mdToast.show(
                    $mdToast.simple()
                    .textContent('No se pudo crear la postulación. Pruebe de vuelta en un momento.')
                    .position('top right')
                    .hideDelay(3000)
                );
                console.log(error);
            });
        };
        /*******************/
        
        /* Private fucntions */
        function processPuestos(puestos) {
            for (var i = 0; i < puestos.length; i++) {
                var area = {
                    D_AREA: null,
                    puestos: []
                };
                
                var puesto = null;
    
                for (var j = 0; j < puestos[i].fields.length; j++) {
                    if(puestos[i].fields[j].key == 'D_AREA') {
                        area.D_AREA = puestos[i].fields[j].value;
                    } else if (puestos[i].fields[j].key == 'D_PUESTO') {
                        puesto = puestos[i].fields[j].value;
                    }
                    
                    if(typeof areasObject[area.D_AREA] === 'undefined') {
                        areasObject[area.D_AREA] = area;
                    }
                }

                areasObject[area.D_AREA].puestos.push(puesto);
            }
    
            angular.forEach(areasObject, function(area, d_area) {
                $scope.areas.push(area);
            });
        }

        function processMultipleSelect(selectedOptions) {
            if(selectedOptions) {
                for (var i = 0; i < selectedOptions.length; i++) {
                    $scope.candidate[selectedOptions[i]] = 'Si';
                }
            }
        }

        function processCandidateFields() {
            var fields = [];
            angular.forEach($scope.candidate, function(value, key) {
                var dataType = getDataType(key);
                var field = {
                    'key':  key,
                    'value': (dataType == 'date') ? moment(value).format('YYYYMMDD HH:mm:ss') : value,
                    'dataType': (value != null ) ? dataType : 'null'
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
                if(name == 'BRUTO_ANUAL') {
                    return 'decimal';
                } else if(name == 'TELEFONO' || name == 'TELEFONO_ALT' || name == 'CP' || name == 'IDENTIDAD') {
                    return 'string';
                }
                return 'integer';
            }
        }
        /*********************/
    }
])