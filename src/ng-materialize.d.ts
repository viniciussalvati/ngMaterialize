/// <reference path="typings/angularjs/angular.d.ts" />
declare module materialize {
	interface IDropdownAttributes extends ng.IAttributes {
		inDuration?: string;
		outDuration?: string;
		constrainWidth?: string;
		hover?: string;
		gutter?: string;
		bellowOrigin?: string;
	}
}