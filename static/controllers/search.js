angular.module('SDWSNApp').controller('SearchCtrl',function($rootScope,$scope,$http,$location){
  $scope.me = $rootScope.me;
  $scope.title = $rootScope._searchposts.title;
  $scope.posts = $rootScope.posts;
  $scope.getAllForSearch = $rootScope._searchposts.getAllForSearch;

  delete $rootScope._searchposts;

  var lastYear = 0;
  var post={};
  $scope.willShow = function(post){
    if(lastYear != post.time.year) {
      lastYear = post.time.year;
      return true;
    }else{
      return false;
    }
  };
});
