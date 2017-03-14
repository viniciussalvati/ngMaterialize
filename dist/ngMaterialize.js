(function (angular) {

"use strict";
var ngMaterialize = angular.module('ngMaterialize', ['ng']);
dropdown.$inject = ['$timeout'];
function dropdown(timeout) {
    return {
        restrict: 'E',
        link: link
    };
    function getOptions(scope, attrs) {
        var options = {};
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
    function link(scope, element, attrs) {
        var button = element.find('.dropdown-button').first();
        var content = element.find('.dropdown-content').first();
        if (button.length > 0 || content.length > 0) {
            timeout(function () {
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
ModalService.$inject = ['$q', '$http', '$controller', '$timeout', '$rootScope', '$compile'];
function ModalService(q, http, controller, timeout, rootScope, compile) {
    var service = {
        open: open
    };
    function open(options) {
        var resultDeferred = q.defer();
        var canceled = false;
        var close = function (result) {
            canceled = true;
            resultDeferred.resolve(result);
        }, dismiss = function (reason) {
            canceled = true;
            resultDeferred.reject(reason);
        };
        getTemplate(options).then(function (modalBaseHtml) {
            if (canceled) {
                return;
            }
            var modalBase = angular.element(modalBaseHtml);
            var scope = (options.scope || rootScope).$new(false), modalInstance = getModalInstance(options, resultDeferred, modalBase, scope);
            close = modalInstance.close;
            dismiss = modalInstance.dismiss;
            scope.$close = modalInstance.close;
            scope.$dismiss = modalInstance.dismiss;
            compile(modalBase)(scope);
            var openModalOptions = {
                //ready: function() { openedDeferred.resolve(); }, // Callback for Modal open
                complete: function () { modalInstance.dismiss(); } // Callback for Modal close
            };
            executeController(options, modalInstance, scope);
            modalBase.appendTo('body').openModal(openModalOptions);
        }, function (error) {
            resultDeferred.reject({ templateError: error });
        });
        var promise = resultDeferred.promise;
        promise.close = function (result) { return close(result); };
        promise.dismiss = function (reason) { return dismiss(reason); };
        return promise;
    }
    function getModalInstance(options, resultDeferred, modalBase, scope) {
        return {
            params: options.params || {},
            close: function (result) {
                resultDeferred.resolve(result);
                closeModal(modalBase, scope);
            },
            dismiss: function (reason) {
                resultDeferred.reject(reason);
                closeModal(modalBase, scope);
            }
        };
    }
    function executeController(options, modalInstance, scope) {
        if (!options.controller)
            return;
        var controllerDefinitionOrName = options.controller;
        var ctrl = controller(controllerDefinitionOrName, {
            $scope: scope,
            $modalInstance: modalInstance
        });
        if (angular.isString(options.controllerAs)) {
            scope[options.controllerAs] = ctrl;
        }
    }
    function getTemplate(options) {
        return new q(function (resolve, reject) {
            if (options.templateUrl) {
                var url = resolveFunction(options.templateUrl);
                http.get(url).then(function (response) {
                    resolve(response.data);
                }).catch(function (error) {
                    reject(error);
                });
            }
            else {
                resolve(resolveFunction(options.template) || '');
            }
        }).then(function (template) {
            var cssClass = ['modal'];
            if (options.fixedFooter) {
                cssClass.push('modal-fixed-footer');
            }
            if (options.cssClass) {
                cssClass.push(options.cssClass);
            }
            var html = [];
            html.push("<div class=\"" + cssClass.join(' ') + "\">");
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
    function closeModal(modalBase, scope) {
        modalBase.closeModal();
        timeout(function () {
            scope.$destroy();
            modalBase.remove();
        }, 5000, true);
    }
    function resolveFunction(fn) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        if (angular.isFunction(fn)) {
            return fn(args);
        }
        return fn;
    }
    return service;
}
ngMaterialize.factory('$modal', ModalService);
MaterialSelect.$inject = ['$timeout'];
function MaterialSelect($timeout) {
    var directive = {
        link: link,
        restrict: 'E',
        require: '?ngModel'
    };
    function link(scope, element, attrs, ngModel) {
        var created = false;
        var create = function () {
            created && destroy();
            element.material_select();
            created = true;
        };
        var destroy = function () {
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
var util = {
    guid: (function () {
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        }
        return function () {
            return "" + s4() + s4() + "-" + s4() + "-" + s4() + "-" + s4() + "-" + s4() + s4() + s4();
        };
    }())
};

})(window.angular);