"use strict";

angular.module('PuenteApp', ['ngAnimate', 'ngTouch', 'ui.bootstrap'])

.controller('AppController', function ($scope, $uibModal) {
    $scope.dniInput = null;
    $scope.reciboInput = null;
    $scope.variables = {
        name: null,
        mail: null
    }

	$scope.changeDni = function(element) {
		$scope.dniInput = element;
		if(element.files && element.files[0]) {
			var reader = new FileReader();
			var preview = angular.element("#dni-image")[0];
			var file = element.files[0];

			reader.addEventListener("load", function () {
				preview.src = reader.result;
            }, false);
            reader.readAsDataURL(file);
		}
    }

    $scope.changeRecibo = function(element) {
		$scope.reciboInput = element;
		if(element.files && element.files[0]) {
			var reader = new FileReader();
			var preview = angular.element("#recibo-image")[0];
			var file = element.files[0];

			reader.addEventListener("load", function () {
				preview.src = reader.result;
            }, false);
            reader.readAsDataURL(file);
		}
    }

    $scope.openModal = function (image) {
        $uibModal.open({
            template: '<img src="images/' + image + '.png" style="max-width: 100%">',
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
    
    angular.element(document).ready(function () {
        angular.element('#rootwizard').bootstrapWizard({
            onTabShow: function (tab, navigation, index) {
                var $total = navigation.find('li').length;
                var $current = index + 1;
                var $percent = ($current / $total) * 100;
                angular.element('#rootwizard .progress-bar').css({ width: $percent + '%' });
                if($total == $current){
                    angular.element('#next-text').hide();
                } else if($current == 1) {
                    angular.element('#next-text').text('Validar datos y Continuar');
                } else if($current == 5){
                    angular.element('#next-text').text('Aceptar documentos y continuar');
                } else {
                    angular.element('#next-text').show();
                    angular.element('#next-text').text('Siguiente');
                }
            }
        });
    });
})
