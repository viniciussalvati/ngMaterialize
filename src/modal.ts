interface IModalService {
	(options: IModalOptions)
	hide()
}

interface IModalOptions { }

function ModalService(): IModalService {
	var service: any = function(options: IModalOptions) {

	};

	service.hide();

	return service;
}

ngMaterialize.factory('$modal', ModalService);