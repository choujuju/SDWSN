angular.module('SDWSNApp').controller('SearchCtrl',function($rootScope,$scope,$http,$location){
  $http({
    url:'/api/blog/search',
    method:'GET'
  }).success(function(blogdata){
    $scope._posts = blogdata.post;
  }).error(function(data){
    $location.path('/blog');
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
});
