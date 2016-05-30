angular.module('SDWSNApp').controller('LinksCtrl',function($rootScope,$scope,$http,$location){
  $scope.links = $rootScope.links.links;
  $scope.title = $rootScope.links.title;
  $scope.me = $rootScope.me;
  delete $rootScope.links;
});
