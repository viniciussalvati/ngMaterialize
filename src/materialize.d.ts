interface JQuery {
	openModal(options?: any): JQuery
	closeModal(options?: any): JQuery

	material_select(destroy?: string): JQuery

	dropdown(options: materialize.IDropdownOptions): JQuery
}

declare module materialize {
	interface IDropdownOptions {
		inDuration?: number;
		outDuration?: number;
		constrain_width?: boolean;
		hover?: boolean;
		gutter?: number;
		bellowOrigin?: boolean;
	}
}