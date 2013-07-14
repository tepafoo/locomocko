'use strict';

/* Controllers */

function PhoneListCtrl($scope, $http) {
  var promise = $http({
    url: 'phones/phones.json',
    method: 'get'
  });
  promise.success(function (data) {
    $scope.phones = data;
  });
  promise.then(function (response) {
    $scope.phones = response.data;
  }, function (response) {
    console.log('Then error! ', response);
  });
  promise.error(function (error) {
    console.log('Error! ', error);
  });

  $scope.orderProp = 'age';
}

//PhoneListCtrl.$inject = ['$scope', '$http'];
