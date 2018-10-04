'user strict';

angular.module('cogornoApp')

.provider('ThubanServices', function() {

    this.$get = ['$q', '$rootScope', '$http', 'WS_SUC_COD_RET', function($q, $rootScope, $http, WS_SUC_COD_RET) {
        /****************/
        /* PRIVATE METHODS
        /****************/
        function getToken(params) {
            var deferred = $q.defer();

            $http({
                method: 'POST',
                url: $rootScope.variables.serverEndpoint + 'jsonServices/thubanLogin',
                data: {
                    'user': params.user,
                    'password': window.btoa(params.password)
                }
            })
            .then(function(response) {
                if (response.data.codRet == WS_SUC_COD_RET) {
                    deferred.resolve(response.data.msg);
                } else {
                    deferred.reject(response.data.msg.indexOf('BadCredentials') != -1 ?
                    'El nombre de usuario y/o clave es incorrecta' :
                    response.data.msg);
                }
            })
            .catch(function(errorResponse) {
                deferred.reject('Error de conexión, intente nuevamente en unos minutos');
            });

            return deferred.promise;
        }

        function getUserDetails(params) {
            var deferred = $q.defer();

            $http({
                method: 'POST',
                url: $rootScope.variables.serverEndpoint + 'jsonServices/userQuery',
                data: {
                    'tokenAuthentication': $rootScope.variables.token,
                    "userId" : params.userId,
                    "fullDisclousure" : params.fullDisclousure
                }
            })
            .then(function(response) {
                if (response.data.codRet == WS_SUC_COD_RET) {
                    deferred.resolve(response.data);
                } else {
                    deferred.reject(response.data.msg);
                }
            })
            .catch(function(errorResponse) {
                deferred.reject(errorResponse);
            });

            return deferred.promise;
        }

        function getDocumentsByCriterias(params) {
            var deferred = $q.defer();

            $http({
                method: 'POST',
                url: $rootScope.variables.serverEndpoint + 'jsonServices/searchDocuments',
                contentType: "application/json; charset=utf-8",
                data: {
                    'tokenAuthentication' : $rootScope.variables.token,
                    'documentClass' : 'SOLICITUD_VACACIONES',
                    'orCriteria': false,
                    'queryFields': params.queryFields,
                    'searchCriterias': params.searchCriterias,
                    'from': params.from,
                    'to': params.to,
                    'maxResults': 20,
                    'sortField': 'F_SOLICITUD',
                    'sortDirection': 'ASC'
                }
            })
            .then(function(response) {
                if (response.data.codRet == WS_SUC_COD_RET || response.data.codRet == "10") {
                    deferred.resolve(response.data);
                } else {
                    deferred.reject(response.data.msg);
                }
            })
            .catch(function (errorResponse) {
                deferred.reject(errorResponse);
            });

            return deferred.promise;
        }

        function createDocument(params) {
            var deferred = $q.defer();

            $http({
                method: 'POST',
                url: $rootScope.variables.serverEndpoint + 'jsonServices/createDocument',
                data: {
                    'tokenAuthentication': $rootScope.variables.token,
                    'documentClass': 'SOLICITUD_VACACIONES',
                    'fields': params.fields,
                    'resource': (params.resource) ? params.resource : undefined
                }
            })
            .then(function(response) {
                if(response.data.codRet == WS_SUC_COD_RET) {
                    deferred.resolve(response.data);
                } else {
                    deferred.reject(response.data.msg);
                }
            })
            .catch(function(errorResponse) {
                deferred.reject(errorResponse);
            });

            return deferred.promise;
        }

        function updateDocument(params) {
            var deferred = $q.defer();

            $http({
                method: 'POST',
                url: $rootScope.variables.serverEndpoint + 'jsonServices/updateDocument',
                data: {
                    'tokenAuthentication': $rootScope.variables.token,
                    'documentID': params.documentID,
                    'fields': params.fields,
                    'resource': (params.resource) ? params.resource : undefined
                }
            })
            .then(function(response) {
                if(response.data.codRet == WS_SUC_COD_RET) {
                    deferred.resolve(response.data);
                } else {
                    deferred.reject(response.data.msg);
                }
            })
            .catch(function(errorResponse) {
                deferred.reject(errorResponse);
            });

            return deferred.promise;
        }
        /****************/
        /* PUBLIC METHODS
        /****************/
        return {
            getToken: getToken,
            getUserDetails: getUserDetails,
            getDocumentsByCriterias: getDocumentsByCriterias,
            createDocument: createDocument,
            updateDocument: updateDocument
        }
    }];
});
