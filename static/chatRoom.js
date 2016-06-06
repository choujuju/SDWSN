angular.module('SDWSNApp',['ngRoute','angularMoment']);
angular.module('SDWSNApp').run(function($window,$rootScope,$http,$location,$routeParams){
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
			$location.path('/blog');
			/*
			$http({
		    url:'/api/blog/search',
		    method:'GET'
		  }).success(function(searchdata){
		    $rootScope._searchposts = searchdata;
				$rootScope._searchposts.getAllForSearch = true;
		  }).error(function(data){
				$rootScope._searchposts = {};
				$rootScope._searchposts.getAllForSearch = false;
		  });
			*/
	  });
	};
	$rootScope.searchArtical = function(){
		if($location.path() != "/blog/search"){
			$location.path('/blog/search');
		}
		if($rootScope.searchKey){
			$rootScope.posts = $rootScope._searchposts.posts.filter(function(post){
				return post.indexOf($rootScope.searchKey) > -1;
			});
		}else{
			$rootScope.posts = $rootScope._searchposts.posts;
		}
  };
	$rootScope.blogarchive = function(){
		$http({
	    url:'/api/blog/archive',
	    method:'GET'
	  }).success(function(posts){
	    $rootScope.posts = posts.posts;
	    $location.path = '/blog/archive';
	  }).error(function(data){
	    $location.path('/blog');
	  });
	};
	$rootScope.blogarticle = function(name,day,title){
		$http({
	    url:'/api/blog/u/'+name+'/'+day+'/'+title,
	    method:'GET'
	  }).success(function(post){
			$rootScope.post = post.post;
	    $rootScope.title = post.title;
	    $location.path ('/blog/u/'+post.post.name+'/'+post.post.time.day+'/'+post.post.title);
	  }).error(function(data){
	    $location.path('/blog');
	  });
	};

	$rootScope.blogtags = function(name){
		$http({
	    url:'/api/blog/tags'+name,
	    method:'GET'
	  }).success(function(tags){
	    $rootScope.tags = tags;
	    $location.path('/blog/tags/'+name);
	  }).error(function(data){
	    $location.path('/blog');
	  });
	};
	$rootScope.blogtag = function(tag,name){
		$http({
	    url:'/api/blog/tags/'+name+'/'+tag,
	    method:'GET'
	  }).success(function(tag){
	    $rootScope.tag = tag;
	    $location.path('/blog/tags/'+name+'/'+tag);
	  }).error(function(data){
	    $location.path('/blog/tags/'+name);
	  });
	};
	$rootScope.bloglinks = function(){
		$http({
	    url:'/api/blog/links',
	    method:'GET'
	  }).success(function(links){
	    $rootScope.links = links;
	    $location.path('/blog/links');
	  }).error(function(data){
	    $location.path('/blog');
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
	$rootScope.bloguser = function(name){
		$http({
	    url:'/api/blog/u/'+name,
	    method:'GET'
	  }).success(function(user){
	    $rootScope.user = user;
	    $location.path('/blog/u/'+name);
	  }).error(function(data){
	    $location.path('/blog');
	  });
	};
});
