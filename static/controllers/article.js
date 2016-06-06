angular.module('SDWSNApp').controller('ArticleCtrl',function($rootScope,$scope,$http,$location,$routeParams){
  $scope.me = $rootScope.me;
  $scope.title = $rootScope.title;
  $scope.post = $rootScope.post;
  $scope.user = $scope.me;
  var flag = 1;
  var post = {
    name:"",
    reprint_info:{
      reprint_from:[],
      reprint_to:[]
    }
  };
  $scope.name = function(){
    if ($scope.me && ($scope.me.name != post.name)) {
      if ((post.reprint_info.reprint_from != undefined) && ($scope.me.name == post.reprint_info.reprint_from.name)) {
        flag = 0;
      }
      if (post.reprint_info.reprint_from != undefined) {
        post.reprint_info.reprint_to.forEach(function(reprint_to,index) {
          if ($scope.me.name == reprint_to.name) {
            flag = 0;
          }
        });
      }
    }else{
      flag = 0;
    }
    if(flag){
      return true;
    }else{
      return false;
    }
  };
  $scope.blogreprint=function(){
    $http({
	    url:'/api/blog/reprint/'+$scope.post.name+'/'+$scope.post.time.day+'/'+$scope.post.title,
	    method:'GET'
	  }).success(function(reprintpost){
      $rootScope.post=reprintpost.post;
      $location.path(reprintpost.url);
    }).error(function(data){
      alert('error',data);
    });
  };
	$rootScope.blogedit = function(){
		$http({
	    url:'/api/blog/edit/'+$scope.post.name+'/'+$scope.post.time.day+'/'+$scope.post.title,
	    method:'GET'
	  }).success(function(editpost){
	    $rootScope.editpost=editpost.post;
	    $location.path('/blog/edit/'+$scope.post.name+'/'+$scope.post.time.day+'/'+$scope.post.title);
	  });
	};
  //文章同名同日同标题的话，会删除多个条目的问题
  $scope.blogremove=function(){
    $http({
	    url:'/api/blog/remove/'+$scope.post.name+'/'+$scope.post.time.day+'/'+$scope.post.title,
	    method:'GET'
	  }).success(function(){
      console.log($rootScope.blog);
      var ps = $rootScope.blog.posts;
      var index = ps.indexOf($scope.post);
      ps.splice(index,1);
      $location.path('/blog');
    }).error(function(data){
      alert('error',data);
    });
  };
});
