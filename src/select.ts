MaterialSelect.$inject = ['$timeout'];

function MaterialSelect($timeout: ng.ITimeoutService): ng.IDirective {
	var directive = {
		link: link,
		restrict: 'E',
		require: '?ngModel'
	};

	function link(scope, element: JQuery, attrs, ngModel) {
		let created = false;

		const create = () => {
			created && destroy();
			element.material_select();
			created = true;
		};

		const destroy = () => {
			element.material_select('destroy');
			element.siblings('span.caret').remove();
		};

		$timeout(create);

		if (ngModel) {
			ngModel.$render = create;
		}

		element.one('$destroy', destroy);
	}

	return directive;
}

ngMaterialize.directive('select', MaterialSelect);