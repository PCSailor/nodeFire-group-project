var app = angular.module("sampleApp", ["firebase", "ngRoute"]);
app.controller("SampleCtrl", function($firebaseAuth, $http) {
  var auth = $firebaseAuth();
  var self = this;

  // This code runs whenever the user logs in
  self.logIn = function(){
    auth.$signInWithPopup("google").then(function(firebaseUser) {
      console.log("Firebase Authenticated as: ", firebaseUser.user.displayName);
    }).catch(function(error) {
      console.log("Authentication failed: ", error);
    });
  };

// NOTE: Pro Mode Started
// app.config(['$routeProvider', function($routeProvider) {
// $routeProvider
// }]);


  // This code runs whenever the user changes authentication states
  // e.g. whevenever the user logs in or logs out
  // this is where we put most of our logic so that we don't duplicate
  // the same things in the login and the logout code
  auth.$onAuthStateChanged(function(firebaseUser){
    // firebaseUser will be null if not logged in
    if(firebaseUser) {
      // This is where we make our call to our server
      firebaseUser.getToken().then(function(idToken){ // NOTE: Promise with callback
        $http({
          method: 'GET',
          url: '/privateData',
          headers: {
            id_token: idToken
          }
        }).then(function(response){
          self.secretData = response.data;
        });
      });
    } else {
      console.log('Not logged in or not authorized.');
      self.secretData = [];
    }

  });

// this object is linked to the inputs
self.newSecret = {
  secretText: '',
  secrecyLevel: 0
};

// // NOTE: some trigger for click
self.addSecret = function() {
  console.log('add secret clicked');
  auth.$onAuthStateChanged(function(firebaseUser){
    console.log('log from line 51');
    // firebaseUser will be null if not logged in
    if(firebaseUser) {
      var secretObject = self.newSecret;
      // This is where we make our call to our server
      firebaseUser.getToken().then(function(idToken){ // NOTE: Promise with callback
        // console.log(idToken);
        $http({
          method: 'POST',
          url: '/privateData',
          data: secretObject,
          headers: {
            id_token: idToken
          }
        }).then(function(response){
          console.log('response from addSecret is:', response);
          self.newSecret = {
            secretText: '',
            secrecyLevel: 0
          };
        });
      });
    } else {
      console.log('Not logged in or not authorized.');
      self.secretData = [];
    }
  });
}




  // This code runs when the user logs out
  self.logOut = function(){
    auth.$signOut().then(function(){
      console.log('Logging the user out!');
    });
  };
});
