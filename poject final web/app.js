var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var expressHbs = require('express-handlebars');
var bodyParser = require('body-parser');
var indexRouter = require('./routes/index');
var mongoose = require('mongoose');
var session = require('express-session');
var passport = require('passport');
var flash = require('connect-flash');
var MongoStore = require('connect-mongo');//(session); 
var { check, validationResult } = require('express-validator');

mongoose.Promise = global.Promise;





var app = express();
//app.use(validator());
app.use(bodyParser.json());
app.use(express.static('public'));
app.use(bodyParser.urlencoded({
    extended:true
}));
mongoose.connect('mongodb://localhost:27017/Ameer',{
  useNewUrlParser: true,
  useUnifiedTopology: true});
require('./config/passport');


// view engine setup
app.engine('.hbs', expressHbs.engine({defaultLayout: 'layout', extname: '.hbs'}));
app.set('view engine', '.hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());



app.use(session({
  secret: 'mysupersecret', 
  resave: false, 
  saveUninitialized: false,
  //store: new MongoStore({mongooseConnection: mongoose.connection}),
  store :MongoStore.create({ mongoUrl: 'mongodb://localhost:27017/Ameer' }),
  cookie:{ maxAge: 180 * 60 * 1000}
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));

app.use(function(req,res,next){
  res.locals.session=req.session;
  next();
})



app.use('/', indexRouter);
// app.use('/user', indexRouter);

// app.use(function(req,res,next)
// {
//   console.log(1);
//   var session = req.session;
//   if(session.userName){
//     console.log(2);
//     res.locals.login=true;
//   }
//   else{
//     console.log(1);
//   res.locals.login=false;
//   }
//   next();
// });

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
