# SOCIAL MEDIA BACKEND PROJECT

### Get Started with twilio
https://www.twilio.com/docs/iam/api

### Twilio official site 
https://www.twilio.com/en-us  


### Download the helper library from
https://www.twilio.com/docs/node/install


### Your Account Sid and Auth Token get from twilio console 
https://www.twilio.com/console

<br>

**Run with ngrok**   
ngrok http *your_server_port*

<br>
<br>

## Firebase 

**firebase Console**  
https://console.firebase.google.com/project/social-media-3eec4/overview

**firebase Docs**   
https://firebase.google.com/docs

**firebase Docs for NodeJs**   
https://firebase.google.com/docs/reference/admin/node

---
<br>

### REST API's Firebase
<br>

**firebase Rest Api Docs:**  
https://firebase.google.com/docs/reference/rest/auth 
<br>

---
<br>

**Convert Custom Token to Firebase Id Token Docs:**  
https://firebase.google.com/docs/reference/rest/auth?hl=en#section-verify-custom-token

*Endpoint:*   (*Hit on this url then we can convert custom token to Id token*)   
https://identitytoolkit.googleapis.com/v1/accounts:signInWithCustomToken?key= [YOUR_FIREBASE_WEB_API_KEY]  
(And in body we have to pass custom token)

<br>

**Exchange a refresh token for an ID token Docs:**   
https://firebase.google.com/docs/reference/rest/auth#section-refresh-token

*Endpoint:*   (*Hit on this url then we can convert refresh token to Id token*)   
https://securetoken.googleapis.com/v1/token?key= [YOUR_FIREBASE_WEB_API_KEY] 
  
<br>

**Sign up with email / password Docs:**  
https://firebase.google.com/docs/reference/rest/auth#section-create-email-password

*Endpoint:*  
https://identitytoolkit.googleapis.com/v1/accounts:signUp?key= [YOUR_FIREBASE_WEB_API_KEY]
  
<br>

**Sign in with email / password Docs:**  
https://firebase.google.com/docs/reference/rest/auth?hl=en#section-sign-in-email-password

*Endpoint:*  
https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key= [YOUR_FIREBASE_WEB_API_KEY]
  
<br>

**Sign in anonymously Docs:**  
https://firebase.google.com/docs/reference/rest/auth?hl=en#section-sign-in-anonymously
  
*Endpoint:*  
https://identitytoolkit.googleapis.com/v1/accounts:signUp?key= [YOUR_FIREBASE_WEB_API_KEY]
  
<br>

**Sign in with OAuth credential Docs:**  
https://firebase.google.com/docs/reference/rest/auth?hl=en#section-sign-in-with-oauth-credential   

*Endpoint:*  
https://identitytoolkit.googleapis.com/v1/accounts:signInWithIdp?key= [YOUR_FIREBASE_WEB_API_KEY]
  
<br>

**Fetch providers for email Docs:**  
https://firebase.google.com/docs/reference/rest/auth?hl=en#section-fetch-providers-for-email  

*Endpoint:*  
https://identitytoolkit.googleapis.com/v1/accounts:createAuthUri?key= [YOUR_FIREBASE_WEB_API_KEY]
  
<br>

**Send password reset email Docs:**  
https://firebase.google.com/docs/reference/rest/auth?hl=en#section-send-password-reset-email  

*Endpoint:*  
https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key= [YOUR_FIREBASE_WEB_API_KEY]
  
<br>

**Verify password reset code Docs:**  
https://firebase.google.com/docs/reference/rest/auth?hl=en#section-verify-password-reset-code  

*Endpoint:*  
https://identitytoolkit.googleapis.com/v1/accounts:resetPassword?key= [YOUR_FIREBASE_WEB_API_KEY]
  
<br>

**Change email, password or Update profile Docs:**  
https://firebase.google.com/docs/reference/rest/auth?hl=en#section-change-email    
https://firebase.google.com/docs/reference/rest/auth?hl=en#section-change-password  
https://firebase.google.com/docs/reference/rest/auth?hl=en#section-update-profile  

*same Endpoint:*  
https://identitytoolkit.googleapis.com/v1/accounts:update?key= [YOUR_FIREBASE_WEB_API_KEY]  
  
<br>

**Get user data Docs:**  
https://firebase.google.com/docs/reference/rest/auth?hl=en#section-change-email   

*Endpoint:*  
https://identitytoolkit.googleapis.com/v1/accounts:lookup?key= [YOUR_FIREBASE_WEB_API_KEY]  
  
<br>

**Send email verification Docs:**  
https://firebase.google.com/docs/reference/rest/auth?hl=en#section-send-email-verification    

*Endpoint:*  
https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key= [YOUR_FIREBASE_WEB_API_KEY]  
  
<br> 

**Link with email/password, Confirm email verification Docs:**  
https://firebase.google.com/docs/reference/rest/auth?hl=en#section-link-with-email-password   
https://firebase.google.com/docs/reference/rest/auth?hl=en#section-confirm-email-verification   

*Endpoint:*  
https://identitytoolkit.googleapis.com/v1/accounts:update?key= [YOUR_FIREBASE_WEB_API_KEY]  
 
<br>

**Delete account Docs:**  
https://firebase.google.com/docs/reference/rest/auth?hl=en#section-link-with-email-password   
https://firebase.google.com/docs/reference/rest/auth?hl=en#section-confirm-email-verification   

*Endpoint:*  
https://identitytoolkit.googleapis.com/v1/accounts:delete?key= [YOUR_FIREBASE_WEB_API_KEY]  

---