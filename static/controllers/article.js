angular.module('SDWSNApp').controller('ArticleCtrl',function($rootScope,$scope,$http,$location,$routeParams){
  $scope.me = $rootScope.me;
  $scope.title = $rootScope.post.title;
  $scope.post = $rootScope.post;
  $scope.user = $scope.me.name;
  var flag = 1;
  $scope.name = function(flag){
    if (user && (user.name != post.name)) {
      if ((post.reprint_info.reprint_from != undefined) && (user.name == post.reprint_info.reprint_from.name)) {
        flag = 0;
      }
      if (post.reprint_info.reprint_from != undefined) {
        post.reprint_info.reprint_to.forEach(function(reprint_to,index) {
          if (user.name == reprint_to.name) {
            flag = 0;
          }
        });
      }
    }else{
      flag = 0;
    }
    if(flag){
      return true;
    }
  };
  delete $rootScope.post;
});
