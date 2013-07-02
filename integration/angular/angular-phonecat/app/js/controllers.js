'use strict';

/* Controllers */

function PhoneListCtrl($scope, $http) {
  $http({url: 'phones/phones.json', method: 'get'}).success(function (data) {
    $scope.phones = data;
  });

  $scope.orderProp = 'age';
}

//PhoneListCtrl.$inject = ['$scope', '$http'];
