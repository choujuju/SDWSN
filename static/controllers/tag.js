angular.module('SDWSNApp').controller('TagCtrl',function($rootScope,$scope,$http,$location){
  $scope.posts = $rootScope.tag.posts;
  $scope.title = $rootScope.tag.title;
  $scope.me = $rootScope.me;
  $scope.lastYear=0;
});
