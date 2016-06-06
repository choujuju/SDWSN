angular.module('SDWSNApp').controller('TagsCtrl',function($rootScope,$scope,$http,$location){
  $scope.tags = $rootScope.tags.posts;
  $scope.title = $rootScope.tags.title;
  $scope.me = $rootScope.me;
});
