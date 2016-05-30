angular.module('SDWSNApp').controller('PostCtrl',function($rootScope,$scope,$http,$location){
  $scope.me = $rootScope.me;
  $scope.post = function(){
    $http({
      url:'/api/blog/post',
      method:'POST',
      data:{
        title:$scope.title,
        name:$scope.me.name,
        avatarUrl:$scope.me.avatarUrl,
        tags:[$scope.tag1,$scope.tag2,$scope.tag3],
        post:$scope.post
      }
    }).success(function(){
      $location.path('/blog');
    });
  };
});
