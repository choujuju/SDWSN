angular.module('SDWSNApp').config(function($routeProvider,$locationProvider){
	$locationProvider.html5Mode(true);
	$routeProvider.when('/rooms',{
		templateUrl: '/pages/rooms.html',
		controller: 'RoomsCtrl'
	}).when('/login',{
		templateUrl: '/pages/login.html',
		controller: 'LoginCtrl'
	}).otherwise({
		redirectTo: '/login'
	});
});

//when('/rooms/:_roomId',{
//		templateUrl: '/pages/room.html',
//		controller: 'RoomCtrl'
//	}).