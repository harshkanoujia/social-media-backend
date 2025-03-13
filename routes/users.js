const config = require("config");
const bcrypt = require('bcryptjs');
const express = require('express');
const jwt = require("jsonwebtoken");
const router = express.Router();

const { sendMail } = require('../services/nodeMailer');
const { sendNotification } = require("../services/fcmModule");
const { User, validateUserRegister, validateUserUpdate, validateUserLogin } = require('../models/User');
const { admin, getUserByEmail, createCustomToken, verifyIdToken, getUser } = require('../services/firebaseAuth');
const { USER_CONSTANTS, AUTH_CONSTANTS, MIDDLEWARE_AUTH_CONSTANTS, INVALID_REQUEST, INVALID_UID, TOKEN_ERROR, TOKEN_SUCCESS, TOKEN_EXPIRE } = require('../config/constant');



// User can signup 
router.post('/signup', async ( req , res ) => {                                                 
    
    const {error} = validateUserRegister( req.body )
    if (error) return res.status(400).json({ apiId: req.apiId, statusCode: 400, msg: 'Validation failed', err: error.details[0].message })
    
    // const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash( req.body.password.trim(), config.get("bcryptSalt") )                        //We add trim here because it does not store the password with trimming it. So we explicity add it
    
    // new user 
    const user = new User({
        username: req.body.username,
        email: req.body.email,
        phoneNo: req.body.phoneNo,
        password: hashedPassword,
    })
    const token = jwt.sign({ email: req.body.email.trim().toLowerCase() , _id: user._id }, config.get('jwtPrivateKey') , { expiresIn: '70d'});
            
    user.token = token;
    await user.save();
    
    // cookies 
    res.cookie('Token', token, { 
        maxAge: 70 * 24 * 60 * 60 * 1000,         // 70 days  same as token expiry
        httpOnly: true 
    }); 

    return res.header("Authorization", token).status(200).json({ apiId: req.apiId, statusCode: 200, message: 'Success', data: { msg: 'User Created Successfully', User: user } }); 
})

// User login
router.post('/login', async (req, res) => {                                                 
    
    const {error} = validateUserLogin(req.body)
    if (error) return res.status(400).json({ msg: 'Validation failed', err: error.details[0].message})
            
    const user = await User.findOne({ email: req.body.email.toLowerCase() });
    if (!user) return res.status(400).json({msg: "Email not found"})  
        
    console.log(user.password)
    
    const verifyPassword =  await bcrypt.compare( req.body.password.trim(), user.password );
    if (!verifyPassword) return res.status(400).json({ err: 'Password not match !'});
    
    const token = jwt.sign({ email: req.body.email.trim().toLowerCase(), _id: user._id }, config.get('jwtPrivateKey') , { expiresIn: '70d'});
            
    user.token = token;
    await user.save();

    // cookies 
    res.cookie('Token', token, { maxAge: 70 * 24 * 60 * 60 * 1000, httpOnly: true });

    return res.header('Authorization', token).status(200).json({ apiId: req.apiId, statusCode: 200, message: 'Success', data: { message: USER_CONSTANTS.LOGIN_SUCCESS, UserId: user.id } }); 
})

// User can logout with providing email and token in headers
router.post('/logout', async (req, res) => {                                   

    const user = await User.findOne({ email: req.body.email.trim().toLowerCase() })                                 
    if (!user) return res.status(400).json({ err: "Invalid email" })
    
    user.token = ""
    await user.save();

    // clear cookie
    res.clearCookie('Token');
    
    return res.status(200).json({ apiId: req.apiId, statusCode: 200, message: 'Success', data: { message: "Successfully Logout", User: user } }); 
})

// User can update own account
router.put('/:id', async (req, res) => {                                                   
    const {error} = validateUserUpdate(req.body)
    if (error) return res.status(400).json({msg: 'Validation failed', err: error.details[0].message})
        
    
    const hashedPassword = await bcrypt.hash(req.body.password, config.get("bcryptSalt"))
    
    const user = await User.findByIdAndUpdate(req.params.id, {      
      $set: { 
        username: req.body.username,
        email: req.body.email,
        password: hashedPassword
    }
    }, { new: true })
    if (!user) return res.status(400).json({msg: "ID not found"})

    const token = jwt.sign({ email: req.body.email.trim().toLowerCase(), _id: user._id }, config.get('jwtPrivateKey') , { expiresIn: '70d'});
            
    user.token = token
    await user.save();
        
    res.status(201).json({ msg: 'User Updated Successfully', User : user })
})

// User can delete there own account
router.delete('/:id', async (req, res) => {                                                 
    const user = await User.findByIdAndDelete(req.params.id)
    if (!user) return res.status(400).json({msg: "ID not found"})

    res.status(200).json({ msg: 'User Deleted Successfully', User : user })
})

//get user 
router.get('/', async ( req , res ) => {                                                       
    
    const users = await User.find();        
    if(users.length === 0)  return res.status(200).json({ msg: 'No User Found !' })
    
    res.status(200).json({ "Users": users })
})

// User found by its Id
router.get('/:id', async (req, res) => {     
    
    const token = req.cookies.Token;
    if(!token)  return res.status(400).json({ apiId: req.apiId, statusCode: 400, message: 'Success', data: { message: MIDDLEWARE_AUTH_CONSTANTS.INVALID_AUTH_TOKEN } }); 
    
    const decode = jwt.verify(token, config.get("jwtPrivateKey"));
    req = decode;
    console.log("REQ: ", req)  

    const user = await User.findById(req._id)
    console.log("DECODE: ", decode)  

    if (!user) return res.status(400).json({err: "ID not found"})
    
    res.status(200).json({'User': user })
})



// ------------ Cookie ------------------------ 

// set cookie
router.get("/set-cookie", async (req, res) => {
    
    res.cookie('username', 'harsh', {   // we set a cookie named and its value
        maxAge: 900000,                 // 15 min 
        // secure: true,                   // Cookie sirf HTTPS par hi kaam karegi.
        httpOnly: true                  // httpOnly option to true to make the cookie accessible only via HTTP requests
    })       

    res.status(200).send('cookie-set');
});
 
// get cookie
router.get('/get-cookie', async (req, res) => {
    const username = req.cookies.username;
    console.log(username);
    return res.status(200).json(`Username: ${username}`);
})



//----------- Firebase ---------------

// create user with firebase
router.post('/firebase/signup', async ( req, res ) => {
    /* In Firebase only this data can save if we give another data it wont save we have to use realtimeDb or firestore                                               
    uid (User ID), email, displayName, phoneNumber (if exist), photoURL (if exist), emailVerified (default: false), disabled (default: false) */
      
    // validate body
    const {error} = validateUserRegister( req.body );
    if (error) return res.status(400).json({ apiId: req.apiId, statusCode: 400, message:'Failure', err: error.details[0].message });
    
    const email = req.body.email?.trim().toLowerCase();

    // check user exist or not
    let user = await getUserByEmail(email);
    if (user) 
        return res.status(400).json({ apiId: req.apiId, statusCode: 400, message: 'Failure', error: { message: USER_CONSTANTS.EMAIL_ALREADY_EXISTS } });
    

    // if user not exist
    user = await admin.auth().createUser({
        displayName: req.body.username,
        email: email,
        password: req.body.password,
        // phoneNumber: req.body.phoneNo,
        // photoURL: req.body.photoURL
    });

    console.log("User Register ==> ", user);
    
    // generate the verification link through firebase
    const verificationLink = await admin.auth().generateEmailVerificationLink(email);
    console.log("Verification Link : ", verificationLink);
    
    // send the verification mail through nodemailer
    const sendMailer = await sendMail(email, verificationLink);
    console.log("NodeMailer sent mail : ", sendMailer);

    // custom token generate we have to convert this token to firebase IdToken 
    const token = await createCustomToken(user.uid)
    if (!token)   
        return res.status(400).json({ apiId: req.apiId, statusCode: 400, message: 'Failure', error: { message: INVALID_UID } });
    

    res.header('Authorization', token).status(200).json({ 
        apiId: req.apiId, 
        statusCode: 200, 
        message: 'Success', 
        data: { message: USER_CONSTANTS.ALL_CHECKS_VALID, UserId: user.uid, sendMailer: sendMailer.messageId } 
    }); 
});

// custom token generate via id or email
router.post('/firebase/token/:id?', async ( req, res ) => {
    /* In this we genreate custom token but in signup we also genreate token there is expiry limit of 1 hour also with the use of refresh token we can also 
    create token but if have not refresh token then use this. And when we convert to id_token then we generate refresh_token with that we can find id_token again.*/

    // if id in params
    if (req.params.id) {
        const uid = req.params.id;
        
        const user = await getUser(uid);    
        if (!user)   
            return res.status(400).json({ apiId: req.apiId, statusCode: 400, message: 'Failure', error: { message: AUTH_CONSTANTS.USER_NOT_FOUND } });
        
        // create token
        const token = await createCustomToken(uid);
        if (!token)   
            return res.status(400).json({ apiId: req.apiId, statusCode: 400, message: 'Failure', error: { message: TOKEN_ERROR } });
        

        return res.header('Authorization', token).status(200).json({ 
            apiId: req.apiId, 
            statusCode: 200, 
            message: 'Success', 
            data: { User: uid } 
        });
    
    // if email in body
    } else if (req.body.email) {
        
        const email = req.body.email?.trim().toLowerCase();

        let user = await getUserByEmail(email);
        if (!user) 
            return res.status(400).json({ apiId: req.apiId, statusCode: 400, message: 'Failure', error: { message: AUTH_CONSTANTS.INVALID_EMAIL } });
        
        console.log("User Details ==> ", user);

        // genreate token
        const token = await admin.auth().createCustomToken(user.uid);     
        if (!token)   
            return res.status(400).json({ apiId: req.apiId, statusCode: 400, message: 'Failure', error: { message: TOKEN_ERROR } });
        

        return res.header('Authorization', token ).status(200).json({ 
            apiId: req.apiId, 
            statusCode: 200, 
            message: 'Success', 
            data: { msg: TOKEN_SUCCESS, User: user.uid } 
        });

    } else {
        return res.status(400).json({ apiId: req.apiId, statusCode: 400, message: 'Failure', error: { message: INVALID_REQUEST } });
    }
});

// login user with firebase
router.post('/firebase/login', async ( req , res ) => {                                                 
    /* At backend we login via token at frontend we use signInWithEmailAndPassword() and then we verify it but if we only backend then we have to hit that api so that we can get token.
    we have to convert the token that we genreate in register (createCustomToken()) to IdToken and then there we have the Idtoken from which we can 
    login and also a refresh token with we can extend the expiry of token. */

    // token in header without bearer
    let token = req.header('Authorization');
    if (!token) 
        return res.status(400).json({ apiId: req.apiId, statusCode: 400, message: 'Failure', error: { message: MIDDLEWARE_AUTH_CONSTANTS.ACCESS_DENIED } });  
    
    // verify token that genreate by firebase 
    let user = await verifyIdToken(token);
    if (user === "token-expired") {
        return res.status(400).json({ apiId: req.apiId, statusCode: 400, message: 'Failure', error: { message: TOKEN_EXPIRE } });  
    } else if (!user) {
        return res.status(400).json({ apiId: req.apiId, statusCode: 400, message: 'Failure', error: { message: MIDDLEWARE_AUTH_CONSTANTS.INVALID_AUTH_TOKEN } });  
    }
    
    // is email verified then login code pending

    console.log("USER LOGIN  ==> ", user);

    res.status(200).json({ 
        apiId: req.apiId, 
        statusCode: 200, 
        message: 'Success', 
        data: { message: USER_CONSTANTS.LOGIN_SUCCESS , UserId: user.uid } 
    })
});

// login user with firebase
router.post('/firebase/signin', async ( req , res ) => {                                                 
    
    const email = req.body.email?.trim().toLowerCase();

    // check user exist or not
    let user = await getUserByEmail(email);
    if (user) 
        return res.status(400).json({ apiId: req.apiId, statusCode: 400, message: 'Failure', error: { message: USER_CONSTANTS.EMAIL_ALREADY_EXISTS } });



    res.status(200).json({ 
        apiId: req.apiId, 
        statusCode: 200, 
        message: 'Success', 
        data: { message: USER_CONSTANTS.LOGIN_SUCCESS, UserId: user.uid } 
    })
});

//get user with UId or email
router.get('/firebase/:id?', async ( req , res ) => {                                                       
    // Optional chaining (?.) is for accessing object properties safely. Its is JavaScript syntax for optional property access.
    //  ? in Express routes is for optional URL parameters. It is an Express feature for optional URL parameters
    
    // if id in params
    if (req.params.id) {
        const uid = req.params.id;
        
        const user = await getUser(uid);    
        if (!user)   
            return res.status(400).json({ apiId: req.apiId, statusCode: 400, message: 'Failure', error: { message: AUTH_CONSTANTS.USER_NOT_FOUND } });
        

        return res.status(200).json({ 
            apiId: req.apiId, 
            statusCode: 200, 
            message: 'Success', 
            data: { User: user } 
        });
    
    // if email in body
    } else if (req.query.email) {
        
        const email = req.query.email?.trim().toLowerCase();

        let user = await getUserByEmail(email);
        if (!user) 
            return res.status(400).json({ apiId: req.apiId, statusCode: 400, message: 'Failure', error: { message: AUTH_CONSTANTS.INVALID_EMAIL } });
        

        return res.status(200).json({ 
            apiId: req.apiId, 
            statusCode: 200, 
            message: 'Success', 
            data: { User: user } 
        });
        
    } else {
        return res.status(400).json({ apiId: req.apiId, statusCode: 400, message: 'Failure', error: { message: INVALID_REQUEST } });
    }
});


// ----------   FCM Notification ---------------------

// push notification
router.post('/firebase/notification', async (req, res) => {
    const response = await sendNotification();
    res.status(200).json({ apiId: req.apiId, statusCode: 200, message: "Success", data: { msg: "the notification is send on device" } });
})


// // update user
// router.put('/firebase', async ( req, res ) => {

//     // validate body
//     const {error} = validateUserUpdate( req.body );
//     if (error) return res.status(400).json({ apiId: req.apiId, statusCode: 400, message:'Failure', err: error.details[0].message });
    
//     const email = req.body.email?.trim().toLowerCase();
//     const username = req.body.username

//     // check user exist or not
//     let user = await getUserByEmail(email);
//     if (user) 
//         return res.status(400).json({ apiId: req.apiId, statusCode: 400, message: 'Failure', error: { message: AUTH_CONSTANTS.INVALID_EMAIL } });

//     console.log("User Register ==> ", user);
    

//     // // custom token generate we have to convert this token to firebase IdToken 
//     // const token = await createCustomToken(user.uid)
//     // if (!token)   
//     //     return res.status(400).json({ apiId: req.apiId, statusCode: 400, message: 'Failure', error: { message: INVALID_UID } });
    

//     res.header('Authorization', token).status(200).json({ 
//         apiId: req.apiId, 
//         statusCode: 200, 
//         message: 'Success', 
//         data: { UserId: user.uid } 
//     }); 
// })




// ----- traditional method ---------

/*// create user with firebase
router.post('/firebase/signup', async ( req , res ) => {  

    const {error} = validateUserRegister( req.body )
    if (error) return res.status(400).json({ apiId: req.apiId, statusCode: 400, msg: 'Validation failed', err: error.details[0].message })
    
    let user;
    const email = req.body.email.toLowercase();

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
*/


/*// createCustom token genreate if expired previous one
router.post('/firebase/token/:id?', async ( req, res ) => {
    // In this we genreate custom token but in signup we also genreate token there is expiry limit of 1 hour also with the use of refresh token we can also 
    // create token but if have not refresh token then use this. 

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
*/


/*// login user with firebase
router.post('/firebase/login', async ( req , res ) => {                                                 
    // At backend we login via token at frontend we use signInWithEmailAndPassword() and then we verify it but if we only backend then we have to hit that api so that we can get token.
    // we have to convert the token that we genreate in register (createCustomToken()) to IdToken and then there we have the Idtoken from which we can 
    // login and also a refresh token with we can extend the expiry of token.

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
*/


/*//get user with UId or email
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

        try {
            const user = await admin.auth().getUserByEmail(email);    
            return res.status(200).json({ 
                apiId: req.apiId, 
                statusCode: 200, 
                message: 'Failure', 
                data: { User: user } 
            });

        } catch (error) {
            if (error.code === 'auth/user-not-found') { 
                return res.status(400).json({ 
                    apiId: req.apiId, 
                    statusCode: 400, 
                    message: 'Failure', 
                    data: { msg: AUTH_CONSTANTS.INVALID_EMAIL } 
                });
            }
            next(error);
        }
    } else {
        return res.status(400).json({ apiId: req.apiId, statusCode: 400, message: 'Failure', data: { msg: INVALID_REQUEST } });
    }
})
*/


module.exports = router;