var admin = require("firebase-admin");

admin.initializeApp({
  credential: admin.credential.cert("./server/firebase-service-account.json"),
  databaseURL: "https://phi-firebase-demo-50a0f.firebaseio.com" // replace this line with your URL
});

/* This is where the magic happens. We pull the id_token off of the request,
verify it against our firebase service account private_key.
Then we add the decodedToken */
var tokenDecoder = function(req, res, next){ // NOTE: from app.js-token/decoder.js-moduel.exports-token
  // NOTE: Middleware because it has next function.
  if (req.headers.id_token) { // NOTE: comes from Ajax request & checks for ID Token coming back.  This is Authentication part. From client.js/'auth.$onAuthStateChanged'
    admin.auth().verifyIdToken(req.headers.id_token).then(function(decodedToken) { // NOTE: callback function with a decoded token
      // Adding the decodedToken to the request so that downstream processes can use it
      // NOTE: admin written by Firebase
      req.decodedToken = decodedToken;
      next(); // next func is Express and keeps code loading past this line
    })

    .catch(function(error) {   // NOTE: Method-chaining .then and .catch is similar to if/else
      // If the id_token isn't right, you end up in this callback function
      // Here we are returning a forbidden error
      console.log('User token could not be verified');
      res.sendStatus(403);
    });
  } else {
    // Seems to be hit when chrome makes request for map files
    // Will also be hit when user does not send back an idToken in the header
    res.sendStatus(403);
  }
}

module.exports = { token: tokenDecoder };
