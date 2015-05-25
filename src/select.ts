MaterialSelect.$inject = ['$timeout'];

function MaterialSelect($timeout: ng.ITimeoutService): ng.IDirective{
		var directive = {
			link: link,
			restrict: 'E',
			require: '?ngModel'
		};

		function link(scope, element: JQuery, attrs, ngModel) {
			$timeout(create);

			if (ngModel) {
				ngModel.$render = create;
			}

			function create() {
				element.material_select();
			}

			element.one('$destroy', function () {
				element.material_select('destroy');
			});
		}

		return directive;
}

ngMaterialize.directive('select', MaterialSelect);