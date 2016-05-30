angular.module('SDWSNApp').controller('UserCtrl',function($rootScope,$scope,$http,$location){
  $scope.me = $rootScope.me;
  $scope.title = $rootScope.user.title;
  $scope.posts = $rootScope.user.posts;
  $scope.page = $rootScope.user.page;
  delete $rootScope.user;
});
