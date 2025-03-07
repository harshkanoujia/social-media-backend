# SOCIAL MEDIA BACKEND PROJECT

### Get Started with twilio
https://www.twilio.com/docs/iam/api

### Twilio official site 
https://www.twilio.com/en-us  


**Download the helper library from**  
https://www.twilio.com/docs/node/install


**Your Account Sid and Auth Token get from twilio console**  
https://www.twilio.com/console


**Run with ngrok**   
ngrok http *your_server_port*

---

### Firebase 

**firebase Console**  
https://console.firebase.google.com/project/social-media-3eec4/overview

**firebase Docs**   
https://firebase.google.com/docs

**firebase Docs for NodeJs**   
https://firebase.google.com/docs/reference/admin/node

<br>

**Convert Custom Token to Firebase Id Token**  

*firebase docs:*  
https://firebase.google.com/docs/reference/rest/auth 

*google docs:*  
https://cloud.google.com/identity-platform/docs/reference/rest/v1/accounts/signInWithCustomToken

You can exchange a custom Auth token for an ID and refresh token by issuing an HTTP POST request to the Auth verifyCustomToken endpoint.

*Hit on this url then we can convert custom token to Id token*   
https://identitytoolkit.googleapis.com/v1/accounts:signInWithCustomToken?key= [ YOUR_FIREBASE_WEB_API_KEY ]   
(And in body we have to pass custom token)
