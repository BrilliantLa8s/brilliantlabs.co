app.controller('AccountCtrl', function($mdDialog, $http, $window, $scope, $rootScope, Resource, Auth, Account, Identity, $timeout, $state, $localStorage) {
  $scope.state = $state.current.name.split('.')[1];
  $scope.accountmenu = Account.menu();
  $scope.updates = {}

  $scope.userAttributes = ['Name', 'Address']
  // Change Registration Details
  $scope.dialog = function(attr) {
    $scope.change = attr;
    $mdDialog.show({
      scope: $scope.$new(),
      templateUrl: 'account/dialog.html',
      clickOutsideToClose:true
    }).then(function(resp){
      resetToken(resp);
    }).catch(function(err){
      console.log(err)
    })
  }
  $scope.cancel = function() {
    $mdDialog.cancel('changes canceled');
  };

  $scope.update = function(updates){
    updates.type = $scope.change;
    Resource.save('users', 'update', updates)
    .then(function(resp){
      if(resp.status==200){
        if($scope.change==='attributes'){
          resetToken(resp);
        } else {$mdDialog.hide(resp.data);}
      } else {
        $scope.error = resp.data
      }
    });
  }
  function resetToken(resp){
    if(resp.token){
      $localStorage.token = resp.token;
      delete resp.token;
      $rootScope.currentUser = resp;
    }
  }

  // resize account page height based on current state's height
  $scope.$on('$stateChangeSuccess', function(){
    $timeout(function(){
      if(id($scope.state)) {
        return id($scope.state).offsetHeight;
      }
    }, 0).then(function(viewHeight){
      var windowHeight = $window.innerHeight - 150;
      if(viewHeight && viewHeight > windowHeight) {
        id('account').style.height = viewHeight;
      } else {
        id('account').style.height = windowHeight;
      }
    });
  });
});
