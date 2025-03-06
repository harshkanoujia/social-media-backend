const express = require('express');
const { User, validateUserRegister } = require('../models/User');
const { admin } = require('../services/fcmModule');
const { USER_CONSTANTS, AUTH_CONSTANTS, MIDDLEWARE_AUTH_CONSTANTS, INVALID_REQUEST } = require('../config/constant');
const router = express.Router();

// create user
router.post('/', async ( req , res ) => {                                                 
    
    const {error} = validateUserRegister( req.body )
    if (error) return res.status(400).json({ apiId: req.apiId, statusCode: 400, msg: 'Validation failed', err: error.details[0].message })
    
    // new user 
    const user = new User({
        username: req.body.username,
        email: req.body.email,
        phoneNo: req.body.phoneNo,
        password: req.body.password,
    })
    await user.save();
    res.status(200).json({ apiId: req.apiId, statusCode: 200, message: 'Success', data: { msg: 'User Created Successfully', User: user } }); 
})

//get user 
router.get('/', async ( req , res ) => {                                                       
    
    const users = await User.find();        
    if(users.length === 0)  return res.status(200).json({ msg: 'No User Found !' })
    
    res.status(200).json({ "Users": users })
})


//----------- Firebase ---------------

// create user with firebase
router.post('/firebase/signup', async ( req , res ) => {  
    /* In Firebase only this data can save if we give another data it wont save we have to use realtimeDb or firestore                                               
    uid (User ID), email, displayName, phoneNumber (if exist), photoURL (if exist), emailVerified (default: false), disabled (default: false) */
    
    const {error} = validateUserRegister( req.body )
    if (error) return res.status(400).json({ apiId: req.apiId, statusCode: 400, msg: 'Validation failed', err: error.details[0].message })
    
    let user;
    const email = req.body.email;

    try {
        // check user exist or not
        user = await admin.auth().getUserByEmail(email)
        if (user) {
            return res.status(400).json({ 
                apiId: req.apiId, 
                statusCode: 400, 
                message: 'Failure', 
                data: { msg: USER_CONSTANTS.EMAIL_ALREADY_EXISTS } 
            })  
        }

    // if user not found then it can't pass to next it gives error so we can catch the error
    } catch (error) {
        
        // this error provide by getUserByEmail
        if (error.code === "auth/user-not-found" ) {
            try {
                user = await admin.auth().createUser({
                    displayName: req.body.username,
                    email: email,
                    password: req.body.password,
                    // phoneNumber: req.body.phoneNo,
                    // photoURL: req.body.photoURL
                });
                console.log("User Register ==> ", user);
                
                // custom token generate we have to convert this token to firebase IdToken 
                let token = await admin.auth().createCustomToken(user.uid) 

                res.status(200).json({ 
                    apiId: req.apiId, 
                    statusCode: 200, 
                    message: 'Success', 
                    data: { msg: 'User Created Successfully', UserId: user.uid , Token: token } 
                }); 
            
            } catch (creationError) {
                // if createUser fails to save user
                next(creationError);
            }
        } else {
            next(error);
        }
    }
})

// createCustom token genreate if expired previous one
router.post('/firebase/token/:id?', async ( req, res ) => {
    /* In this we genreate custom token but in signup we also genreate token there is expiry limit of 1 hour also with the use of refresh token we can also 
    create token but if have not refresh token then use this. */

    // if id in params
    if (req.params.id) {
        const uid = req.params.id;
        
        const token = await admin.auth().createCustomToken(uid);       
        if (!token) {  
            return res.status(400).json({ 
                apiId: req.apiId, 
                statusCode: 400, 
                message: 'Failure', 
                data: { msg: AUTH_CONSTANTS.USER_NOT_FOUND } 
            });
        }
        return res.status(200).json({ apiId: req.apiId, statusCode: 200, message: 'Success', data: { User: token } });
    
    // if email in body
    } else if (req.body.email) {
        
        const email = req.body.email;

        try {
            const user = await admin.auth().getUserByEmail(email);    
            let uid = user.uid;

            // genreate token
            const token = await admin.auth().createCustomToken(uid);       

            return res.status(200).json({ 
                apiId: req.apiId, 
                statusCode: 200, 
                message: 'Success', 
                data: { msg: "Token genreated you have to convert to Firebase Id Token" , customToken: token } 
            });
            
        } catch (error) {
            if (error.code === 'auth/user-not-found') { 
                return res.status(400).json({ 
                    apiId: req.apiId, 
                    statusCode: 400, 
                    message: 'Failure', 
                    data: { msg: INVALID_REQUEST } 
                });
            }

            next(error);
        }

    } else {
        return res.status(400).json({ apiId: req.apiId, statusCode: 400, message: 'Failure', data: { msg: INVALID_REQUEST } });
    }
})

// login user with firebase
router.post('/firebase/login', async ( req , res ) => {                                                 
    /* At backend we login via token at frontend we use signInWithEmailAndPassword() and then we verify it but if we only backend then we have to hit that api so that we can get token.
    we have to convert the token that we genreate in register (createCustomToken()) to IdToken and then there we have the Idtoken from which we can 
    login and also a refresh token with we can extend the expiry of token. */

    // token in header without bearer
    let token = req.header('Authorization');
    if (!token) {
        return res.status(400).json({ 
            apiId: req.apiId, 
            statusCode: 400, 
            message: 'Failure', 
            data: { msg: MIDDLEWARE_AUTH_CONSTANTS.ACCESS_DENIED } 
        });  
    }
    
    try {

        let user = await admin.auth().verifyIdToken(token);
        console.log("USER LOGIN  ==> ", user);
    
        res.status(200).json({ apiId: req.apiId, statusCode: 200, message: 'Success', data: { msg: USER_CONSTANTS.LOGIN_SUCCESS, UserId: user.uid } })
        
    } catch (error) {
        if (error.code === 'auth/argument-error') {
            return res.status(400).json({ 
                apiId: req.apiId, 
                statusCode: 400, 
                message: 'Failure', 
                data: { msg: MIDDLEWARE_AUTH_CONSTANTS.INVALID_AUTH_TOKEN } 
            }); 
        }
    }
})

//get user with UId or email
router.get('/firebase/:id?', async ( req , res ) => {                                                       
    // Optional chaining (?.) is for accessing object properties safely. Its is JavaScript syntax for optional property access.
    //  ? in Express routes is for optional URL parameters. It is an Express feature for optional URL parameters
    
    // if id in params
    if (req.params.id) {
        const uid = req.params.id;
        
        const user = await admin.auth().getUser(uid);       
        if (!user) {  
            return res.status(400).json({ 
                apiId: req.apiId, 
                statusCode: 400, 
                message: 'Failure', 
                data: { msg: AUTH_CONSTANTS.USER_NOT_FOUND } 
            });
        }
        return res.status(200).json({ apiId: req.apiId, statusCode: 200, message: 'Success', data: { User: user } });
    
    // if email in body
    } else if (req.body.email) {
        
        const email = req.body.email;

        const user = await admin.auth().getUserByEmail(email);    
        if (!user) { 
            return res.status(400).json({ 
                apiId: req.apiId, 
                statusCode: 400, 
                message: 'Failure', 
                data: { msg: AUTH_CONSTANTS.INVALID_EMAIL } 
            });
        }
        return res.status(200).json({ apiId: req.apiId, statusCode: 200, message: 'Success', data: { User: user } });

    } else {
        return res.status(400).json({ apiId: req.apiId, statusCode: 400, message: 'Failure', data: { msg: INVALID_REQUEST } });
    }
})


module.exports = router;