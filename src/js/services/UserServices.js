'user strict';

angular.module('EulenApp')

.provider('UserServices', function() {

    this.$get = ['$q', '$rootScope', '$http', 'WS_EXP_COD_RET', 'WS_SUC_COD_RET', function($q, $rootScope, $http, WS_EXP_COD_RET, WS_SUC_COD_RET) {
        /****************/
        /* PRIVATE METHODS
        /****************/

        /**
        * Gets a temporary token to be used for all interactions with server
        * @param params: type Object. Contains:
        *                               userId : string,
        *                               fullDisclousure" : boolean                                       
        * @returns response object. Contains: data object. Token is data.msg
        */
        function getUserQuery(params) {
            var deferred = $q.defer();

            $http({
                method: 'POST',
                url: $rootScope.serverEndpoint + 'jsonServices/userQuery',
                data: {
                    'tokenAuthentication' : $rootScope.token,
                    'userId' : params.userId,
                    'fullDisclousure' : (params.fullDisclousure) ? params.fullDisclousure : undefined
                }
            })
            .then(function(response) {
                if (response.data.codRet == WS_SUC_COD_RET) {
                    deferred.resolve(response.data);
                } else if (response.data.codRet == WS_EXP_COD_RET) {
                    deferred.reject(response.data.msg);
                } else {
                    deferred.reject(response.data.msg);
                }
            })
            .catch(function(errorResponse) {
                deferred.reject('Error de conexión, intente nuevamente en unos minutos');
            });

            return deferred.promise;
        }

        /****************/
        /* PUBLIC METHODS
        /****************/
        return {
            getUserQuery: getUserQuery
        }
    }];
});
