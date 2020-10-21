/*
** Call module dependencies
*/
var createError = require('http-errors');
var express=require('express');
var logger=require('morgan');
var session= require('express-session');

/*
** Call in router dependencies
*/
var postsRouter=require('./posts/postRoutes');
var registrationRouter=require('./registration/registrationRoutes');


/*
** Instantiate new express() object
*/
var app=express();


/*
** Use middlewares
*/
app.use(express.json());
app.use(logger('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(session({
  secret: 'InAtypicalWebappIwilluseAlongerString,MaybeSomethingLike1234567890OkAmTiredNow.',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: true }
}));


/*
** Setup routes from dependencies
*/
app.use('/posts',postsRouter);
app.use('/account',registrationRouter);


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


module.exports=app

