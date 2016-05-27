angular.module('SDWSNApp').controller('BlogCtrl',function($rootScope,$scope,$http,$location){
  $http({
    url:'/api/blog',
    method:'GET'
  }).success(function(blogdata){
    $scope._blogdata = blogdata;
  });

  $scope.me = $rootScope.me;

  $scope.searchArtical = function(){
    if($scope.searchKey){
			$scope.blogdata.posts = $scope._blogdata.posts.filter(function(post){
				return post.indexOf($scope.searchKey) > -1;
			});
		}else{
			$scope.blogdata.posts = $scope._blogdata.posts;
		}
  };

  $scope.home()= function() {
    $http({
      url:'/api/blog',
      method:'GET'
    }).success(function(blogdata){
      $scope._blogdata = blogdata;
    });
  };

  $scope.archive()= function() {
    $http({
      url:'/api/blog',
      method:'GET'
    }).success(function(blogdata){
      $scope._blogdata = blogdata;
    });
  };

  $scope.tags()= function() {
    $http({
      url:'/api/blog',
      method:'GET'
    }).success(function(blogdata){
      $scope._blogdata = blogdata;
    });
  };

  $scope.links()= function() {
    $http({
      url:'/api/blog',
      method:'GET'
    }).success(function(blogdata){
      $scope._blogdata = blogdata;
    });
  };

  $scope.post()= function() {
    $http({
      url:'/api/blog',
      method:'GET'
    }).success(function(blogdata){
      $scope._blogdata = blogdata;
    });
  };

  $scope.upload()= function() {
    $http({
      url:'/api/blog',
      method:'GET'
    }).success(function(blogdata){
      $scope._blogdata = blogdata;
    });
  };
});
