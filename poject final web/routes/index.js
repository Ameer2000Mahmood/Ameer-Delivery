var express = require('express');
var mongoose = require('mongoose');
var db = mongoose.connection;
var router = express.Router();
var Chout = require('../models/Checkout');
var passport = require('passport');
var Product = require('../models/product');
var emailCheck = require('email-check');
const { render } = require('../app');
var session;
var mongo = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectId;


router.use(function(req,res,next)
{
  var session = req.session;
  if(session.userName){
    if(session.userName.match("Admin")){

      res.locals.admin=true;
    }
    else {
      res.locals.admin=false;
    }
    res.locals.login=true;
    
  }
  else{
  res.locals.login=false;
  res.locals.admin=false;
  }
  next();
});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.set({
    "Allow-acces-Allow-Origin" : '*'

  });
  res.render('index', { title: 'Delivery' });
});

router.get('/products/', function(req, res, next) {
   Product.find(function(err, docs){
    var productChunks=[];
    var chunkSize=3;
    for (var i=0; i<docs.length;i+=chunkSize){
      productChunks.push(docs.slice(i,i+chunkSize));
      
    } 
    res.render('shop/products', { title: 'Prouducts' , products: productChunks });
   }).lean();
});

router.get('/user/signup',function(req,res,next){
  session = req.session;
  if(session.userName)
  {
    return res.redirect('/');
  }
  res.render('user/signup');
});
router.get('/user/signin',function(req,res,next){
  session = req.session;
  if(session.userName)
  {
    return res.redirect('/');
  }
  res.render('user/signin');
});

router.post("/user/signin",function(req,res){
  session = req.session;
  if(session.userName)
  {
    return res.redirect('/');
  }
  var email = req.body.email;
  var password = req.body.password;
 
  db.collection('users').findOne({'email': email}, function(err,user){
    if (err){
      throw err;
    }
    if (user!=null){
      if(user.password.match(password)){
        if(user.name.match("Admin"))
        {
          res.locals.admin=true;
        }
        session.userName = user.name;
        session.password = password;
        res.locals.login=true;
        res.locals.admin=false;
        return res.render('user/profile', { title: user.name });
      }
      else{
        return res.render('user/signin', { title: 'wrong password!' });
      }
    }
    else {
      return res.render('user/signin', { title: 'You dont have an account! go and register' });
    }
  });
});




router.post("/user/signup",function(req,res,next){
  session = req.session;
  if(session.userName)
  {
    return res.redirect('/');
  }
  var email = req.body.email;
  var password = req.body.password;
  var name = req.body.name;
  var flag = false;
  
  if(email.toLowerCase()
  .match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)){
    flag = true;
  }

      if(flag)
    {
      db.collection('users').findOne({'email': email}, function(err,user){
        if (err){
          throw err;
        }
        if (user!=null){
          return res.render('user/signup', { title: 'This Email is in our System' });
        }
      });
    }
    else{
      return res.render('user/signup', { title: 'invaild email!' });
    }
      var data = {
          "name" : name,
          "email" : email,
          "password" : password
      };
      
      session.userName = name;
      session.password = password;
      res.locals.login=true;
      db.collection('users').insertOne(data,function(err,collection){
        if(err)
        {
          throw err;
        }
      });
      return res.render('user/profile', { title: name });
   
});



router.get('/user/profile', function(req,res,next){
  session = req.session;
  if(!session.userName)
  {
    return res.redirect('/');
  }
  res.render('user/profile' , { title: session.userName });

});

router.get('/user/logut', function(req,res,next){
  res.locals.login=false;
  req.session.destroy();
  res.redirect('/');
});
router.get('/add-to-cart/:id', function(req, res, next) {

  var prodId = req.params.id;
  var chout = new Chout(req.session.chout ? req.session.chout : {});
  Product.findById(prodId, function (err, product)
  {
    if (err){
      return res.redirect('/');
    }
    chout.add(product,product.id);
    req.session.chout = chout;
    res.redirect('/products/');
  });
});

router.get('/shop/cart', function(req,res,next){
  if(!req.session.chout){
    return res.render('cart',{products: null});
  }
  var cart = new Chout(req.session.chout);
  res.render('cart', {products: cart.generateArray(), totalPrice: cart.totalPrice}); 
});


router.get('/Finish', (req, res, next)=>{
  session = req.session;
  if(!session.userName)
  {
    return res.render('user/signin2');
  }
  //check to see if a shopping cart exists
  if(!req.session.chout){
      return res.redirect('/shop/cart');
  }
  const cart = new Chout(req.session.chout);
  const errMsg = req.flash('error')[0];
  return res.render('Finish',{total: cart.totalPrice, errMsg: errMsg, noErrors: !errMsg});
});


router.get('/Thanks', function(req, res, next) {
  //req.session.chout = null;
  res.render('Thanks');
});

router.post("/Thanks",function(req,res,next){
  var adress = req.body.adress;
  var phone = req.body.phone;
  var name = req.body.name;
  var postal = req.body.postal;
  var isChecked = Boolean(req.body.chbox);
  const cart = new Chout(req.session.chout);
  var total = cart.totalPrice;
  var arr = cart.generateArray()
  var data = {
      "name" : name,
      "adress" : adress,
      "phone" : phone,
      "postal" : postal,
      "isExpress" : isChecked,
      "total" : total,
      "Products" : arr
  };
      
  db.collection('orders').insertOne(data,function(err,collection){
    if(err)
    {
      throw err;
    }
  });
  req.session.chout = {};
  return res.render('Thanks');
   
});




router.get('/add/:id', function(req, res, next) {
  var prodId = req.params.id;
  var chout = new Chout(req.session.chout ? req.session.chout : {});
  Product.findById(prodId, function (err, product)
  {
    if (err){
      return res.redirect('/');
    }
    chout.addone(product,product.id);
    req.session.chout = chout;
    res.redirect('/shop/cart/');
  });  
});

router.get('/minus/:id', function(req, res, next) {
  var prodId = req.params.id;
  var chout = new Chout(req.session.chout ? req.session.chout : {});
  Product.findById(prodId, function (err, product)
  {
    if (err){
      return res.redirect('/');
    }
    chout.delone(product,product.id);
    req.session.chout = chout;
    res.redirect('/shop/cart/');
  });
  
});

router.get('/del/:id', function(req, res, next) {
  var prodId = req.params.id;
  var chout = new Chout(req.session.chout ? req.session.chout : {});
  Product.findById(prodId, function (err, product)
  {
    if (err){
      return res.redirect('/');
    }
    chout.del(product,product.id);
    req.session.chout = chout;
   // console.log(req.session.chout.totalQty);
    res.redirect('/shop/cart/');
  });
  
});

router.get('/shop/orders',function(req,res,next){
  var ad = res.locals.admin;
  console.log(ad);
  if(res.locals.admin == false) 
  {
    return res.redirect('/');
  }
  db.collection("orders").find({}).toArray(function(err, orders){
    if(err)
    {
      throw err;
    }
    else
    {
      res.render('shop/orders',{orders: orders});
    }

  });
  
});

router.get('/user/signin2',function(req,res,next){
  session = req.session;
  if(session.userName)
  {
    return res.redirect('/');
  }
  res.redirect('user/signin2');
});

router.post("/user/signin2",function(req,res){
  session = req.session;
  if(session.userName)
  {
    return res.redirect('/');
  }
  var email = req.body.email;
  var password = req.body.password;
 
  db.collection('users').findOne({'email': email}, function(err,user){
    if (err){
      throw err;
    }
    if (user!=null){
      if(user.password.match(password)){
        if(user.name.match("Admin"))
        {
          res.locals.admin=true;
        }
        session.userName = user.name;
        session.password = password;
        res.locals.login=true;
        res.locals.admin=false;
        const cart = new Chout(req.session.chout);
        const errMsg = req.flash('error')[0];
        return res.render('Finish',{total: cart.totalPrice, errMsg: errMsg, noErrors: !errMsg});
      }
      else{
        return res.render('user/signin2', { title: 'wrong password!' });
      }
    }
    else {
      return res.render('user/signin2', { title: 'You dont have an account! go and register' });
    }
  });
});

router.get('/delorder/:id', function(req, res, next) {
  var id = req.params.id;
  console.log(ObjectId(id));
  db.collection('orders').deleteOne({'_id': ObjectId(id)});
  db.collection("orders").find({}).toArray(function(err, orders){
    if(err)
    {
      throw err;
    }
    else
    {
      res.render('shop/orders',{orders: orders});
    }

  });
});

router.get('/shop/updateorder/:id', function(req, res, next) {
  var id = req.params.id;
  db.collection('orders').findOne({'_id': ObjectId(id)}, function(err,order){
    if (err){
      throw err;
    }
    if (order!=null){
      res.render('shop/cartupdate', {products: order.Products , totalPrice: order.total});
    }
  });
  
});
router.get('/addAdmin/:id', function(req, res, next) {
  var prodId = req.params.id;
  var chout = new Chout(req.session.chout ? req.session.chout : {});
  Product.findById(prodId, function (err, product)
  {
    if (err){
      return res.redirect('/');
    }
    chout.addone(product,product.id);
    req.session.chout = chout;
    res.redirect('/shop/cartupdate/');
  });  
});

module.exports = router;
