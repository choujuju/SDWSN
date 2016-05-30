angular.module('SDWSNApp').controller('EditCtrl',function($rootScope,$scope,$http,$location){
  $scope.me = $rootScope.me;
  $scope.title=$rootScope.editpost.title;
  $scope.post=$rootScope.editpost.post;
  $scope.edit = function(){
    $http({
      url:'/api/blog/edit/:name/:day/:title',
      method:'POST',
      data:{
        title:$scope.title,
        name:$scope.me.name,
        avatarUrl:$scope.me.avatarUrl,
        tags:$scope.post.tags,
        post:$scope._post
      }
    }).success(function(){
      $location.path('/blog');
    });
  };
  delete $rootScope.editpost;
});
