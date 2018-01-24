var crudApp = angular.module('crudApp',['angular-table'])
 .directive('loading', ['$http' ,function ($http)
 {
     return {
         restrict: 'A',
         template: '',
         link: function (scope, elm, attrs)
         {
             scope.isLoading = function () {
                 return $http.pendingRequests.length > 0;
             };

             scope.$watch(scope.isLoading, function (v)
             {
                 if(v){
                     elm.show();
                     Metronic.startPageLoading({animate: true});
                 }else{
                     elm.hide();
                     Metronic.stopPageLoading();
                 }
             });
         }
     };
 }]);
 
crudApp.controller("DbController",['$scope','$http','$filter', function($scope,$http,$filter){

  $scope.config = {
    itemsPerPage: 10,
	maxPages: 5,
    fillLastPage: false
  }


populatebankbalance();
function populatebankbalance(){
$http.post('../../Sacco/app/applib/databaseFiles/bank_balance_select.php').
success(function(data){
$scope.bank_balance_details = data;
$scope.filteredList = data;

});
}

$scope.updateFilteredList = function() {
    $scope.filteredList = $filter("filter")($scope.bank_balance_details, $scope.query);
};

$scope.add_bank_balance = function(){
	$('#addbankbalance').modal('show');
	$scope.responseErrorMsg="";
}


function clrCtrl() {

    var elements = document.getElementsByTagName("input");
	for (var ii=0; ii < elements.length; ii++) {
	  if (elements[ii].type == "text"||elements[ii].type == "number") {
		elements[ii].value = "";
	  }
	}

} 

$scope.insertbankbalance = function(info){
	var balancedate = document.getElementById("balancedate").value;
	var amount = document.getElementById("amount").value;
	
	if (balancedate == ""|| balancedate==null||amount == ""|| amount==null){
	
	$scope.responseErrorMsg = "Please fill all fields with *";
	
}else{
	
	$http.post('../../Sacco/app/applib/databaseFiles/bank_balance_insert.php',{"balancedate":info.balancedate,"amount":info.amount}).success(function(data){
	if (data == true) {
	clrCtrl();
	populatebankbalance();
	$scope.responseErrorMsg="";
	}
	});
}

}


$scope.currentUser = {};
$scope.editInfo = function(info){
$scope.currentUser = info;
}


$scope.Updatebankbalance = function(info){

	var balancedate = document.getElementById("updatebalancedate").value;
	var amount = document.getElementById("updateamount").value;
	
	if (balancedate == ""|| balancedate==null||amount == ""|| amount==null){
	
	$scope.responseErrorMsg = "Please fill all fields with *";
	
}else{
	
	
$http.post('../../Sacco/app/applib/databaseFiles/bank_balance_update.php',{"id":info.id,"balancedate":info.balancedate,"amount":info.amount}).success(function(data){

if (data == true) {
$('#updatebankbalance').modal('hide');
populatebankbalance();
$scope.responseErrorMsg="";
}
});
}

}

$scope.Deletebankbalance = function(info){	
var id = document.getElementById("bankbalanceid").value;
$http.post('../../Sacco/app/applib/databaseFiles/bank_balance_delete.php',{"id":id}).success(function(data){

if (data == true) {
$('#deletebankbalance').modal('hide');
populatebankbalance();
}
});
}


}]);
