angular.module('SDWSNApp').controller('ArchiveCtrl',function($rootScope,$scope,$http,$location){
  $scope.posts = $rootScope.posts.posts;
  $scope.title = $rootScope.posts.title;
  $scope.me = $rootScope.me;
  var lastYear = 0;
  $scope.year = function(lastYear){
    if(lastYear != $scope.post.time.year){
      lastYear = $scope.post.time.year;
      return true;
    }else{
      return false;
    }
  };
  delete $rootScope.posts;
});
