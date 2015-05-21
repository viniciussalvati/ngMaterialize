# ngMaterialize
AngularJS wrapper for http://materializecss.com/

Documentation pending. I'll do it. Eventually

### How to install
Run the command `bower install --save ngMaterialize` and add a script reference to `bower_components/ngMaterialize/dist/ngMaterialize.js` 

### Usage
How to use the modal: (I only have the modal for now, but more will be added) 

``` Javascript
// add the ngMaterialize as a dependency in your module
var app = angular.module('app', ['ngMaterialize']);

app.controller('controller', ['$modal', function($modal){
    var modalOptions = {
        controller: 'modalController',
        templateUrl: 'view.html',
        params: { sample: 'anything' }
       };
       
    $modal.open(modalOptions); // returns an angular promise
}]);

app.controller('modalController', ['$modalInstance', '$scope', function($modalInstance, $scope){
    var params = $modalInstance.params; // get from the params in the options
    
    $modalInstance.close('result') // resolve the promise
    $modalInstance.dismiss('reason') // rejects the promise
}]);
```