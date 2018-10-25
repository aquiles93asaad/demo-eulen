'use strict';

angular.module('EulenApp')

.controller('PetitionsController', ['$scope', '$rootScope', '$resource', '$mdDialog', '$mdToast', 'client', 'DocumentServices', 'SearchServices', 'ResourceServices', 'QUERY_FIELDS',
    function ($scope, $rootScope, $resource, $mdDialog, $mdToast, client, DocumentServices, SearchServices, ResourceServices, QUERY_FIELDS) {
        $scope.petitions = [];
        $scope.candidates = [];
        
        $scope.variables = {
            count: null,
            petitionNumber: null
        };

        $scope.query = {
            filter: '',
            limit: '5',
            order: 'nameToLower',
            page: 1
        };

        $scope.params = angular.copy($rootScope.searchParams);

        var petitionsResource = $resource($rootScope.serverEndpoint + 'jsonServices/searchDocuments');
        var self = $scope;

        $scope.acceptPetition = function(petitionNumber) {
            var params = {
                documentID: petitionNumber,
                fields: [
                    {
                        'key': 'D_ESTADO_SOLICITUD',
                        'value': 'Contratación',
                        'dataType': 'string'
                    }
                ]
            };

            DocumentServices.updateDocument(params)
            .then(function(result) {
                $scope.getPetitions();
            })
            .catch(function(error) {
                $mdToast.show(
                    $mdToast.simple()
                    .textContent('No se pudo completar la acción. Pruebe de vuelta en un momento.')
                    .position('top right')
                    .hideDelay(3000)
                );
                console.log(error);
            });
        };

        $scope.askForNote = function(event, petitionNumber) {
            var element = event.target;
            var confirm = $mdDialog.prompt()
            .title('Motivo de rechazo')
            .placeholder('Motivo de rechazo')
            .ariaLabel('Motivo de rechazo')
            .targetEvent(event)
            .required(true)
            .ok('Confirmar')
            .cancel('Cancelar')
            .openFrom(angular.element(element))
            .closeTo(angular.element(element));
            
            $mdDialog.show(confirm)
            .then(function(result) {
                var params = {
                    'documentID' : petitionNumber,
                    'action' : 'A',
                    'note' : {
                        'id' : null,
                        'title' : 'Motivo de rechazo',
                        'body' : result
                    }
                }
                return DocumentServices.noteAMD(params);
            })
            .then(function(result) {
                rejectPetition(petitionNumber);
            })
            .catch(function(error) {
                if(typeof error !== 'undefined') {
                    $mdToast.show(
                        $mdToast.simple()
                        .textContent('No se pudo completar la acción. Pruebe de vuelta en un momento.')
                        .position('top right')
                        .hideDelay(3000)
                    );
                    console.log(error);
                }
            });
        }
        
        $scope.getPetitions = function() {

            if($scope.query.page == 1) {
                $scope.params.from = 0;
                $scope.params.to = $scope.query.limit;
            } else {
                $scope.params.from = $scope.params.to;
                $scope.params.to = $scope.params.from + ($scope.query.page*$scope.query.limit);
            }

            $scope.params.documentClass = 'PETICION_MOD';
            $scope.params.queryFields = QUERY_FIELDS.peticion;
            $scope.params.maxResults = $scope.query.limit;
            $scope.params.searchCriterias = [
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

            var data = {
                'tokenAuthentication' : $rootScope.token,
                'documentClass' : $scope.params.documentClass,
                'orCriteria': $scope.params.orCriteria,
                'queryFields': $scope.params.queryFields,
                'searchCriterias': $scope.params.searchCriterias,
                'from': $scope.params.from,
                'to': $scope.params.to,
                'maxResults': $scope.params.maxResults,
                'sortField': $scope.params.sortField,
                'sortDirection': $scope.params.sortDirection
            }

            $scope.promise = petitionsResource.save(data, processPetitions).$promise;
        };

        $scope.getCandidates = function(event, petitionNumber) {
            $scope.variables.petitionNumber = petitionNumber;
            var element = event.target;

            var params = angular.copy($rootScope.searchParams);
            params.documentClass = 'LEGAJO_CANDIDATO';
            params.queryFields = QUERY_FIELDS.candidato;
            params.searchCriterias = [
                {
                    'fieldData': {
                        'key': 'N_PETICION',
                        'value': petitionNumber,
                        'dataType': 'string'
                    },
                    'criteria': 'equals'
                }
            ];

            return SearchServices.getDocumentsByCriterias(params)
            .then(function(result) {
                processCandidates(result);
                $mdDialog.show({
                    templateUrl: 'src/templates/candidates-modal.html',
                    parent: angular.element(document.body),
                    targetEvent: event,
                    clickOutsideToClose: true,
                    fullscreen: false,
                    openFrom: angular.element(element),
                    closeTo: angular.element(element),
                    controller: function () {
                        return self;
                    },
                    controllerAs: 'ctrl'
                });
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
        };

        $scope.cancel = function() {
            $mdDialog.cancel();
        };

        $scope.showCV = function(candidateNumber) {
            var params = {
                documentID: candidateNumber
            };

            ResourceServices.getResource(params)
            .then(function(result) {
                //window.open("data:application/pdf;base64," + result.stream , '_blank');
                var iframe = '<iframe width="100%" height="100%" src="data:application/pdf;base64,' + encodeURIComponent(result.stream) + '" allowfullscreen></iframe>';
                var x = window.open();
                x.document.open();
                x.document.write(iframe);
                x.document.close();
            })
            .catch(function(error){
                console.log(error);
                $mdToast.show(
                    $mdToast.simple()
                    .textContent('Error buscando CV del candidato! Comunicarse con el desarrollador.')
                    .position('top right')
                    .hideDelay(3000)
                );
            })
        };

        function rejectPetition(petitionNumber) {
            var params = {
                documentID: petitionNumber,
                fields: [
                    {
                        'key': 'D_ESTADO_SOLICITUD',
                        'value': 'Reclutamiento',
                        'dataType': 'string'
                    }
                ]
            };

            DocumentServices.updateDocument(params)
            .then(function(result) {
                $scope.getPetitions();
            })
            .catch(function(error) {
                $mdToast.show(
                    $mdToast.simple()
                    .textContent('No se pudo completar la acción. Pruebe de vuelta en un momento.')
                    .position('top right')
                    .hideDelay(3000)
                );
                console.log(error);
            });
        };

        function processPetitions(result) {
            if(result.documents) {
                $scope.variables.count = result.count;
                var petitionsToProcess = result.documents;
                $scope.petitions = [];       
                for (var i = 0; i < petitionsToProcess.length; i++) {
                    var petition = {} ;
    
                    for (var j = 0; j < petitionsToProcess[i].fields.length; j++) {
                        var value = null;
    
                        if(petitionsToProcess[i].fields[j].dataType == 'date') {
                            var date = petitionsToProcess[i].fields[j].value.split(' ')[0];
                            date = date.substring(0, 4) + '-' + date.substring(4, 6) + '-' + date.substring(6, 8);
                            value = new Date(moment(date));
                        } else {
                            value = petitionsToProcess[i].fields[j].value;
                        }
    
                        petition[petitionsToProcess[i].fields[j].key] = value;
                    }
    
                    $scope.petitions.push(petition);
                }
            }
        }

        function processCandidates(result) {
            if(result.documents) {
                var candidatesToProcess = result.documents;
                $scope.candidates = [];       
                for (var i = 0; i < candidatesToProcess.length; i++) {
                    var candidate = {} ;
    
                    for (var j = 0; j < candidatesToProcess[i].fields.length; j++) {
                        var value = null;
    
                        if(candidatesToProcess[i].fields[j].dataType == 'date') {
                            var date = candidatesToProcess[i].fields[j].value.split(' ')[0];
                            date = date.substring(0, 4) + '-' + date.substring(4, 6) + '-' + date.substring(6, 8);
                            value = new Date(moment(date));
                        } else {
                            value = candidatesToProcess[i].fields[j].value;
                        }
    
                        candidate[candidatesToProcess[i].fields[j].key] = value;
                    }
                    
                    candidate['id'] = candidatesToProcess[i].id;
                    $scope.candidates.push(candidate);
                }
            }
        }
    }
])