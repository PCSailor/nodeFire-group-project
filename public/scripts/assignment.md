https://github.com/LukeSchlangen/nodeFire/tree/mongo-authorization
Super Secret Secrets - nodeFire Firebase and Mongo Auth
Start with the mongo-authorization of the nodeFire repository. Since this application is doing authentication and requires connection to a database, the setup time might take a while. When the app is running, you should be able to return a list of secrets from the application after you log in.

Base Mode - Authenticated Post
Allow an authenticated user to create a new secret.

If the user is logged in, they will see a form that allows them to add a new secret. The server should confirm (with the id token) that the user is authenticated, and then allow the secret to be added to the database.

Hard Mode - Authorized Post
The new secrets a user creates should only have a secrecy level at or below the clearance level of the current user. This will need to be done with an authenticated post that sends a token. Any logic to determine the clearance level of the user should be done on the backend (because if it is done on the front end, it is not actually secure. Examples:

If Huck has a clearance level of 5, he can create new secret with a secrecy level of 1, 2, 3, 4, or 5.
If Kris has a clearance level of 3, he can create new secret with a secrecy level of 1, 2, or 3.
If Luke has a clearance level of 3, he can create new secret with a secrecy level of 1, 2, or 3.

Pro Mode
Your site needs another view. Create a second route and view on the front end that is available only to users who are authenticated. Examples:

If a user logs in, they will see a link to a users view. Ideally, this route will be /#/users
If a user is not logged in and attempts to navigate to /#/admin, they should be redirected to the login page

Ultra-Pro Mode
Now that you have a second view, your http requests should be moved into factories. Ideally, your factories will look like:

Auth Factory - Where your currentUser/firebaseUser object or idToken is stored
Users Factory - Where your get request for users is made
Secrets Factory - Where your get and post requests for the secrets are made.
