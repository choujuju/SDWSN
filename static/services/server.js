angular.module('SDWSNApp').factory('server',[
	'$cacheFactory','$q','$http','socket',
	function($cacheFactory,$q,$http,socket){
	var cache = window.cache = $cacheFactory('chatRoom');
 	socket.on('getAllRooms',function(data){
 		if(data._roomId){
 			angular.extend(cache.get(data._roomId),data.data);
 		}else{
 			data.data.forEach(function(room){
 				cache.get('rooms').push(room);
 			});
 		}
 	});
 	socket.on('err',function(data){
 		console.log('>err',err);
 	});
 	return {
 		validate:function(){
 			var deferred = $q.defer();
 			$http({
 				url: '/api/validate',
 				method: 'GET'
 			}).success(function(user){
 				angular.extend(cache.get('user'),user);
 				deferred.resolve();
 			}).error(function(data){
 				deferred.reject();
 			});
 			return deferred.promise;
 		}
 	}
}]);