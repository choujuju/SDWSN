angular.module('SDWSNApp').controller('MessageCreatorCtrl',function($scope,socket){
	$scope.newMessage = '';
	$scope.createMessage = function() {
		if($scope.newMessage == ''){
			return;
		}
		socket.emit('createMessage',{
			content: $scope.newMessage,
			creator: $scope.me,
			_roomId: $scope.room._id
		});
		$scope.newMessage = '';
	};
});
