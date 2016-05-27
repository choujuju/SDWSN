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
});
