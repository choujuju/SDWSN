angular.module('SDWSNApp').controller('RoomsCtrl',function($rootScope,$scope,$location,socket){
	socket.emit('getAllRooms');
	socket.on('roomsData',function(rooms){
		$scope.rooms=$scope._rooms = rooms;
	});

	$scope.enterRoom = function(room){
		$('#rooms').modal('hide');
		socket.emit('joinRoom',{
			user: $scope.me,
			room: room
		});
	};
	
	socket.on('joinRoom.'+$scope.me._id,function(join){
		$rootScope._roomId=join.room._id;
		$('#room').modal('show');
	});

	socket.on('joinRoom',function(join){
		$scope.rooms.forEach(function(room){
			if(room._id == join.room._id){
				room.users.push(join.user);
			}
		});
	});
	$scope.searchRoom = function(){
		if($scope.searchKey){
			$scope.rooms = $scope._rooms.filter(function(room){
				return room.name.indexOf($scope.searchKey) > -1;
			});
		}else{
			$scope.rooms = $scope._rooms;
		}
	};
	$scope.createRoom = function(){
		socket.emit('createRoom',{
			name: $scope.searchKey
		});
	};
	socket.on('roomAdded',function(room){
		$scope._rooms.push(room);
		$scope.searchRoom();
	});
});
