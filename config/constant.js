const SYSTEM_FAILURE = "Something failed.";
const INVALID_USER = "No user registered with given Id";
const INACTIVE_ACCOUNT = "Account is not active. Please get in touch with app admin.";
const INVALID_REQUEST = "Invalid request ! Please provide valid Id or email ";
const INVALID_UID = "Invalid request ! Please provide valid Id ";
const TOKEN_ERROR = "Something went wrong while generating the token."
const TOKEN_SUCCESS = "Token genreated successfully. you have to convert to this token to Firebase Id Token";
const TOKEN_EXPIRE = "Firebase ID token has expired. Get a fresh ID token ! generate token with CustomToken or generate from firebase id-token";


// middleware auth
const MIDDLEWARE_AUTH_CONSTANTS = {
  ACCESS_DENIED: "Access denied. No authorization token provided",
  RESOURCE_FORBIDDEN: "You don't have access to the request resource.",
  INVALID_AUTH_TOKEN: "Invalid token"
};

const POST_CONSTANTS = {
  ERROR_WHILE_CREATE: ' Error while creating Posting ',
};

// admins.js
const ADMIN_CONSTANTS = {
  INVALID_EMAIL: "Invalid username/password.",
  NOTIFICATION_SUCCESS: "Notificaiton submitted successfully"
};

// auth.js
const AUTH_CONSTANTS = {
  INVALID_USER: INVALID_USER,
  INVALID_CREDENTIALS: "Invalid email/userName or password",
  INVALID_PASSWORD: "You have entered incorrect old pin. Please try again with valid pin.",
  INACTIVE_ACCOUNT: INACTIVE_ACCOUNT,
  CONTACT_ADMIN: "Your account is in blocked state.Please Contact Admin ",
  CHANGE_PASSWORD_REQUEST_SUCCESS: "Password recovery link has been sent to your registered email.",
  CHANGE_PASSWORD_REQUEST_EMAIL_FAILURE: "Email sending failed due to some application issue.",
  INVALID_EMAIL: "The email provided is not registered. Please sign up to continue.",
  INVALID_RECOVERY_LINK: "Password link expired or not valid.",
  PASSWORD_CHANGE_SUCCESS: "Password changed succesfully",
  PASSWORD_VALID: "Password is correct.",
  INVALID_OTP: "Invalid OTP passed",
  INVALID_MOBILE: "No user found with given mobile number.",
  MOBILE_REQUIRED: '"mobile" is required',
  OTP_TOKEN_REQUIRED: '"otpToken" is required',
  DELETED_USER: "User deleted successfully",
  USER_NOT_FOUND: "User not found",
  SYSTEM_FAILURE: SYSTEM_FAILURE,
  ACCOUNT_DELETED_SUCCESSFULLY: "Your account has been deleted successfully.",
};

// users.js
const USER_CONSTANTS = {
  INACTIVE_ACCOUNT: INACTIVE_ACCOUNT,
  INVALID_USER: INVALID_USER,
  MOBILE_EMAIL_ALREADY_EXISTS: "Mobile and email are already registered",
  EMAIL_ALREADY_EXISTS: "Email already registered",
  MOBILE_ALREADY_EXISTS: "Mobile number already registered",
  USERNAME_ALREADY_EXISTS: "UserName already registered",
  ALL_CHECKS_VALID: "All check are valid. Verify your email",
  INVALID_OTP: "Invalid OTP passed",
  OTP_MISSING: "No OTP passed. OTP is required for registration.",
  LOGGED_OUT: "Logged Out successfully",
  VERIFICATION_SUCCESS: "Continue for OTP.",
  LOGIN_SUCCESS: "Login successfully",
};

const CALL_CONSTANTS = {
  ROOMSID_MANDATORY: "roomSid is mandatory query param",
  ROOMNAME_MANDATORY: "roomName is mandatory query param",
  OTHERUSERID_MANDATORY: "otherUserId is mandatory query param",
  INVALID_USER: "invalid user",
  USER_NOT_AVAILABLE: "User is not available to accept your call",
  USER_NOTIF_ISSUE: "Calls cannot be connected due to an issue on user end.",
  FCM_SUBMIT_SUCCESS: "FCM submitted successfully",
  NO_DEVICE_TOKEN_FOUND: "No device token found in system",
  CELBRITYID_MANDATORY: "celebrityId is mandatory param",
  USERID_MANDATORY: "userId is mandatory query param",
  ROOM_CREATION_FAILED: "Your video call cannot be connected due to a techincal issue.",
  CALL_END_SUCCESS: "Call ended successfully",
  CALL_STATUS: "Call status update successfully"
};


module.exports.INVALID_UID = INVALID_UID;
module.exports.TOKEN_ERROR = TOKEN_ERROR;
module.exports.TOKEN_EXPIRE = TOKEN_EXPIRE;
module.exports.TOKEN_SUCCESS = TOKEN_SUCCESS;
module.exports.SYSTEM_FAILURE = SYSTEM_FAILURE;
module.exports.AUTH_CONSTANTS = AUTH_CONSTANTS;
module.exports.USER_CONSTANTS = USER_CONSTANTS;
module.exports.CALL_CONSTANTS = CALL_CONSTANTS;
module.exports.POST_CONSTANTS = POST_CONSTANTS;
module.exports.INVALID_REQUEST = INVALID_REQUEST;
module.exports.ADMIN_CONSTANTS = ADMIN_CONSTANTS;
module.exports.MIDDLEWARE_AUTH_CONSTANTS = MIDDLEWARE_AUTH_CONSTANTS;