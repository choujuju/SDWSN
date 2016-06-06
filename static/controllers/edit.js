angular.module('SDWSNApp').controller('EditCtrl',function($rootScope,$scope,$http,$location){
  $scope.me = $rootScope.me;
  $scope.post=$rootScope.editpost;
  $scope.edit = function(){
    $http({
      url:'/api/blog/edit/'+$scope.post.name+'/'+$scope.post.time.day+'/'+$scope.post.title,
      method:'POST',
      data:{
        title:$scope.title,
        name:$scope.me.name,
        avatarUrl:$scope.me.avatarUrl,
        tags:$scope.post.tags,
        post:$scope.post.post
      }
    }).success(function(url){
      $rootScope.post = $scope.post;
      $location.path(url.url);
    });
  };
  delete $rootScope.editpost;
});
