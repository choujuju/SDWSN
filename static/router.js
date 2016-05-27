angular.module('SDWSNApp').config(function($routeProvider,$locationProvider){
	$locationProvider.html5Mode(true);
	$routeProvider.when('/front',{
		templateUrl: '/pages/front.html',
		controller: 'FrontCtrl'
	}).when('/login',{
		templateUrl: '/pages/login.html',
		controller: 'LoginCtrl'
	}).when('/blog',{
		templateUrl: '/pages/blog.html',
		controller: 'BlogCtrl'
	}).when('/blog/post',{
		templateUrl: '/pages/blog/post.html',
		controller: 'PostCtrl'
	}).when('/blog/upload',{
		templateUrl: '/pages/blog/upload.html',
		controller: 'UploadCtrl'
	}).when('/blog/archive',{
		templateUrl: '/pages/blog/archive.html',
		controller: 'ArchiveCtrl'
	}).when('/blog/u/:name',{
		templateUrl: '/pages/blog/user.html',
		controller: 'UserCtrl'
	}).when('/blog/links',{
		templateUrl: '/pages/blog/links.html',
		controller: 'LinksCtrl'
	}).when('/blog/search',{
		templateUrl: '/pages/blog/search.html',
		controller: 'SearchCtrl'
	}).when('/blog/u/:name/:day/:title',{
		templateUrl: '/pages/blog/article.html',
		controller: 'ArticleCtrl'
	}).when('/blog/edit/:name/:day/:title',{
		templateUrl: '/pages/blog/edit.html',
		controller: 'EditCtrl'
	}).when('/blog/tags',{
		templateUrl: '/pages/blog/tags.html',
		controller: 'TagsCtrl'
	}).when('/blog/tags/:tag',{
		templateUrl: '/pages/blog/tags.html',
		controller: 'TagCtrl'
	}).otherwise({
		templateUrl: '/pages/404.html'
	});
});

//when('/rooms/:_roomId',{
//		templateUrl: '/pages/room.html',
//		controller: 'RoomCtrl'
//	}).
