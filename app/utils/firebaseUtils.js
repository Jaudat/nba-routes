var React = require('react');
var Firebase = require('firebase');
var forge = "https://torrid-torch-4047.firebaseio.com"; /* Your Firebase URL Goes Here */
var ref = new Firebase(forge);
var cachedUser = null;

var formatEmailForFirebase =  function(email){
  var key = email.replace('@', '^');
  if(key.indexOf('.') !== -1){
    return key.split('.').join('*');
  }
  return key;
};

var addNewUserToFB = function(newUser){
  var key = formatEmailForFirebase(newUser.email);
  ref.child('user').child(key).set(newUser);
};

var firebaseUtils = {
    getRef: function() {
        return (ref);
    },
    
    createUser: function(user, cb) {
        ref.createUser(user, function(err) {
          if (err) {
            switch (err.code) {
              case "EMAIL_TAKEN":
                console.log("The new user account cannot be created because the email is already in use.");
                break;
              case "INVALID_EMAIL":
                console.log("The specified email is not a valid email.");
                break;
              default:
                console.log("Error creating user:", err);
            }
          } else {
              this.loginWithPW(user, function(authData){
                addNewUserToFB({
                  email: user.email,
                  uid: authData.uid,
                  token: authData.token
                });
              }, cb);
          }
        }.bind(this));
      },

    loginWithPW: function(userObj, cb, cbOnRegister){
        ref.authWithPassword(userObj, function(err, authData){
            if(err){
                console.log('Error on login:', err.message);
                cbOnRegister && cbOnRegister(false);
            } else {
                authData.email = userObj.email;
                cachedUser = authData;
                cb(authData);
                this.onChange(true);
                cbOnRegister && cbOnRegister(true);
            }
        }.bind(this));
    },

    isLoggedIn: function() {
        if (cachedUser || ref.getAuth()) {
            return true;
        } else {
            return false;
        }
    },

    logout: function() {
        ref.unauth();
        cachedUser = null;
        this.onChange(false);
    },

    toArray: function(obj) {
        Object.keys(obj).map(function(key) {
            return obj[key];
        }.bind(this));
    }
};

module.exports = firebaseUtils;
