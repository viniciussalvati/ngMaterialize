interface IModalService {
	open(options: IModalOptions): ng.IPromise<any>
}

interface IModalOptions {
	/**
	 * The title of the modal. If this option is present, a default header will be inserted into the template.
	 */
	title?: string
	/**
	 * The scope to derive from. If not passed, the $rootScope is used
	 */
	scope?: ng.IScope
	/**
	 * Objects to pass to the controller as $modalInstance.params
	 */
	params?: any
	/**
	 * The HTML of the view. Overriden by @templateUrl property
	 */
	template?: string|(() => string)
	/**
	 * The URL of the view. Overrides @template
	 */
	templateUrl?: string|(() => string)
	/**
	 * TRUE if the modal should have a fixed footer
	 */
	fixedFooter?: boolean
	/**
	 * A controller definition
	 */
	controller?: Function|string
	/**
	 * The controller alias for the controllerAs sintax. Requires @controller
	 */
	controllerAs: string
}

interface IModalInstance {
	params: any
	close(result?: any)
	dismiss(reason?: any)
}

interface IModalScope extends ng.IScope {
	params?: any
	$close?(result?: any)
	$dismiss?(reason?: any)
}

ModalService.$inject = ['$q', '$http', '$controller', 'timeout', '$rootScope', '$compile'];
function ModalService(q: ng.IQService, http: ng.IHttpService, controller: ng.IControllerService, timeout: ng.ITimeoutService, rootScope: ng.IRootScopeService, compile: ng.ICompileService): IModalService {
	var service: IModalService = {
		open: open
	};

	function open(options: IModalOptions) {
		var resultDeferred = q.defer();
		var openedDeferred = q.defer<void>();

		getTemplate(options).then(function(modalBaseHtml) {
			var modalBase = angular.element(modalBaseHtml);

			var scope: IModalScope = (options.scope || rootScope).$new(false),
				modalInstance = getModalInstance(options, resultDeferred, modalBase, scope);

			scope.$close = modalInstance.close;
			scope.$dismiss = modalInstance.dismiss;

			compile(modalBase)(scope);

			var openModalOptions = {
				//ready: function() { openedDeferred.resolve(); }, // Callback for Modal open
				complete: function() { modalInstance.dismiss(); } // Callback for Modal close
			};

			executeController(options, modalInstance, scope);

			modalBase.appendTo('body').openModal(openModalOptions);

		}, function(error) {
				resultDeferred.reject({ templateError: error });
			});

		return resultDeferred.promise;
	}

	function getModalInstance(options: IModalOptions, resultDeferred: ng.IDeferred<any>, modalBase: JQuery, scope: ng.IScope): IModalInstance {
		return {
			params: options.params || {},
			close: function(result) {
				resultDeferred.resolve(result);
				closeModal(modalBase, scope);
			},
			dismiss: function(reason) {
				resultDeferred.reject(reason);
				closeModal(modalBase, scope);
			}
		};
	}

	function executeController(options: IModalOptions, modalInstance: IModalInstance, scope: ng.IScope) {
		if (!options.controller) return;
		var controllerDefinitionOrName: any = options.controller;

		var ctrl = controller(controllerDefinitionOrName, {
			$scope: scope,
			$modalInstance: modalInstance
		});

		if (angular.isString(options.controllerAs)) {
			scope[options.controllerAs] = ctrl;
		}
	}

	function getTemplate(options: IModalOptions): ng.IPromise<string> {
		return new q((resolve, reject) => {
			if (options.templateUrl) {
				var url = resolveFunction<string>(options.templateUrl);
				http.get(url).success(function(data) {
					resolve(data);
				}).catch(function(error) {
					reject(error);
				});
			} else {
				resolve(resolveFunction<string>(options.template) || '');
			}
		}).then(function(template: string) {

			var cssClass = options.fixedFooter ? 'modal modal-fixed-footer' : 'modal';
			var html = [];
			html.push('<div class="' + cssClass + '">');
			if (options.title) {
				html.push('<div class="modal-header">');
				html.push(options.title);
				html.push('<a class="grey-text text-darken-2 right" data-ng-click="$dismiss()">');
				html.push('<i class="mdi-navigation-close" />');
				html.push('</a>');
				html.push('</div>');
			}
			html.push(template);
			html.push('</div>');

			return html.join('');
		});
	}

	function closeModal(modalBase: JQuery, scope: ng.IScope) {
		modalBase.closeModal();

		timeout(function() {
			scope.$destroy();
			modalBase.remove();
		}, 5000, true);
	}

	function resolveFunction<T>(fn, ...args: any[]): T {
		if (angular.isFunction(fn)) {
			return fn(args);
		}

		return fn;
	}

	return service;
}

ngMaterialize.factory('$modal', ModalService);