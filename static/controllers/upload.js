angular.module('SDWSNApp').controller('UploadCtrl',function($rootScope,$scope,$http,$location){
  $scope.me = $rootScope.me;
  $scope.upload = function(){
    $http({
      url:'/api/blog/upload',
      method:'POST',
      data:{
        file1:$scope.file1,
        file2:$scope.file2,
        file3:$scope.file3,
        file4:$scope.file4,
        file5:$scope.file5,
      }
    }).success(function(){
      $scope.blogdata = blogdata;
      $location.path = '/blog/upload';
    });
  };
});
