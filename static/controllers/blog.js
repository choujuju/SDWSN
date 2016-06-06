angular.module('SDWSNApp').controller('BlogCtrl',function($rootScope,$scope,$http,$location){
  $scope.me = $rootScope.me;
  $scope.blogdata = $rootScope.blog;
});
