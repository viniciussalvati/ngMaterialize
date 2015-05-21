/// <reference path="typings/tsd.d.ts" />
declare var ngMaterialize: ng.IModule;
interface IModalService {
    open(options: IModalOptions): ng.IPromise<any>;
}
interface IModalOptions {
    /**
     * The title of the modal. If this option is present, a default header will be inserted into the template.
     */
    title?: string;
    /**
     * The scope to derive from. If not passed, the $rootScope is used
     */
    scope?: ng.IScope;
    /**
     * Objects to pass to the controller as $modalInstance.params
     */
    params?: any;
    /**
     * The HTML of the view. Overriden by @templateUrl property
     */
    template?: string | (() => string);
    /**
     * The URL of the view. Overrides @template
     */
    templateUrl?: string | (() => string);
    /**
     * TRUE if the modal should have a fixed footer
     */
    fixedFooter?: boolean;
    /**
     * A controller definition
     */
    controller?: Function | string;
    /**
     * The controller alias for the controllerAs sintax. Requires @controller
     */
    controllerAs: string;
}
interface IModalInstance {
    params: any;
    close(result?: any): any;
    dismiss(reason?: any): any;
}
interface IModalScope extends ng.IScope {
    params?: any;
    $close?(result?: any): any;
    $dismiss?(reason?: any): any;
}
declare function ModalService(q: ng.IQService, http: ng.IHttpService, controller: ng.IControllerService, timeout: ng.ITimeoutService, rootScope: ng.IRootScopeService, compile: ng.ICompileService): IModalService;
