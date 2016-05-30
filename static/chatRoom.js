angular.module('SDWSNApp',['ngRoute','angularMoment']);

angular.module('SDWSNApp').run(function($window,$rootScope,$http,$location){
	$window.moment.lang('zh-cn');
	$http({
		url: '/api/validate',
		method:'GET'
	}).success(function(user){
		$rootScope.me = user;
		$location.path('/front');
	}).error(function(data){
		$location.path('/login');
	});
	$rootScope.logout=function(){
		$http({
			url:　'/api/logout',
			method: 'GET'
		}).success(function(){
			$rootScope.me = null;
			$location.path('/login');
		});
	};
	$rootScope.$on('login',function(evt,me){
		$rootScope.me = me;
	});
	$rootScope.home = function(){
		$http({
			url: '/api/validate',
			method:'GET'
		}).success(function(user){
			$rootScope.me = user;
			$location.path('/front');
		}).error(function(data){
			$location.path('/login');
		});
	};
	$rootScope.blog = function(){
		$http({
	    url:'/api/blog',
	    method:'GET'
	  }).success(function(blog){
	    $rootScope.blog = blog;
			$location.path('/blog')
	  });
	};
	$rootScope.blogarchive = function(){
		$http({
	    url:'/api/blog/archive',
	    method:'GET'
	  }).success(function(posts){
	    $rootScope.posts = posts.posts;
	    $location.path = '/blog/archive';
	  }).error(function(data){
	    $location.path = '/blog';
	  });
	};
	$rootScope.blogarticle = function(){
		$http({
	    url:'/api/blog/u/:name/:day/:title',
	    method:'GET'
	  }).success(function(post){
			$rootScope.post = post.post;
	    $rootScope.post.title = $routeParams.title;
	    $location.path = '/blog/u/:name/:day/:title';
	  }).error(function(data){
	    $location.path = '/blog';
	  });
	};
	//999
	$rootScope.blogedit = function(){
		$http({
	    url:'/api/blog/edit/:name/:day/:title',
	    method:'GET'
	  }).success(function(editpost){
	    $rootScope.editpost=editpost.post;
	    $location.path('/blog/edit');
	  });
	};
	$rootScope.blogtags = function(){
		$http({
	    url:'/api/blog/tags',
	    method:'GET'
	  }).success(function(tags){
	    $rootScope.tags = tags;
	    $location.path = '/blog/tags';
	  }).error(function(data){
	    $location.path = '/blog';
	  });
	};
	$rootScope.blogtag = function(){
		$http({
	    url:'/api/blog/tags/:tag',
	    method:'GET'
	  }).success(function(tag){
	    $rootScope.tag = tag;
	    $location.path = '/blog/tags/:tag';
	  }).error(function(data){
	    $location.path = '/blog/tags';
	  });
	};
	$rootScope.bloglinks = function(){
		$http({
	    url:'/api/blog/links',
	    method:'GET'
	  }).success(function(links){
	    $rootScope.links = links;
	    $location.path = '/blog/links';
	  }).error(function(data){
	    $location.path = '/blog';
	  });
	};
	//必要性？
	$rootScope.blogpost= function(){
		$http({
	    url:'/api/blog/post',
	    method:'GET'
	  });
	};
	//必要性？
	$rootScope.blogupload = function(){
		$http({
	    url:'/api/blog/upload',
	    method:'GET'
	  });
	};
	$rootScope.bloguser = function(){
		$http({
	    url:'/api/blog/u/:name',
	    method:'GET'
	  }).success(function(user){
	    $rootScope.user = user;
	    $location.path = '/blog/user';
	  }).error(function(data){
	    $location.path = '/blog';
	  });
	};
});
