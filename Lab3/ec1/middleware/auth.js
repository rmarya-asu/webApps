var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var redis = require('./redis');

var user = function(name,password,cart){
  this.name = name;
  this.password = password;
  this.cart = cart
}

var auth = function(req,res,next){
  console.log(req.session.user);
  if(req.session.user){
    debugger;
    console.log('User is authenticated already');
    //req.session.loginCount+=1;
    console.log(req.session.user);
    next();
  }else{
    //check the request method here?

    if(req.body.username === req.body.password && req.body.username!=undefined){
      //set the session variable.
      var userCart = {};
      req.session.user = new user(req.body.username,req.body.password);
      redis.set("req.body.username",req.session.user,function(err,result){
        console.log('setting redis key ');
      });
      console.log('setting express session ',req.session.user);
      next();
    }
    else{
      res.redirect('/landing');
    }
  }

};


var adminAcc = function(name,pwd){
  this.name = name;
  this.pwd =pwd;
}

var unauth = function(req,res,next){
if(req.session.user){
  req.session.destroy(function(err){
     if(err){
        console.log(err);
     }else{
         console.log(session.user);
         //req.end();
         res.redirect('/landing');
     }
  });
}
}

var admin = function(req,res,next){
  if(req.session.admin){
    console.log('Admin is authenticated already');
    next();
  }else{
    if(req.body.username ==='admin' && req.body.username === req.body.password && req.body.username!=undefined){
      req.session.admin =new adminAcc(req.body.username,req.body.password);
      console.log('setting admin session ',req.session.user);
      next();
    }else{
      res.redirect('/landing');
    }
  }
}

var unadmin = function(req,res,next){
  if(req.session.admin){
    req.session.destroy(function(err){
       if(err){
          console.log(err);
       }else{
           console.log(session.admin);
           //req.end();
           res.redirect('/landing');
       }
    });
  }
}


var fauth = function(req,res,next){
  if(req.session.user){
    res.render('loggedin', {
      user: req.session.user
    });
  }else{
    next();
  }
}
module.exports = {auth,unauth,admin,unadmin,fauth}
