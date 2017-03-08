dropdown.$inject = ['$timeout'];
function dropdown(timeout: ng.ITimeoutService): ng.IDirective {
	return {
		restrict: 'E',
		link: link
	}

	function getOptions(scope: ng.IScope, attrs: materialize.IDropdownAttributes): Object {
		var options: materialize.IDropdownOptions = {};

		if ('inDuration' in attrs) {
			options.inDuration = scope.$eval(attrs.inDuration);
		}

		if ('outDuration' in attrs) {
			options.outDuration = scope.$eval(attrs.outDuration);
		}

		if ('constrainWidth' in attrs) {
			options.constrain_width = scope.$eval(attrs.constrainWidth);
		}

		if ('hover' in attrs) {
			options.hover = scope.$eval(attrs.hover);
		}

		if ('gutter' in attrs) {
			options.gutter = scope.$eval(attrs.gutter);
		}

		if ('bellowOrigin' in attrs) {
			options.bellowOrigin = scope.$eval(attrs.bellowOrigin);
		}

		return options;
	}

	function link(scope: ng.IScope, element: JQuery, attrs: materialize.IDropdownAttributes) {
		var button = element.find('.dropdown-button').first();
		var content = element.find('.dropdown-content').first();
		if (button.length > 0 || content.length > 0) {
			timeout(() => {
				var id = util.guid();

				var options = getOptions(scope, attrs);

				button.attr('data-activates', id);
				content.attr('id', id);
				button.dropdown(options);
			}, 0, false);
		}
	}
}

ngMaterialize.directive('dropdown', dropdown);