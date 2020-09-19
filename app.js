/*
** Call module dependencies
*/
var express=require('express');
var logger=require('morgan');


/*
** Instantiate new express() object
*/
var app=express();


/*
** Use middlewares
*/
app.use(express.json());
app.use(logger('dev'));
/*
** Call in router dependencies
*/
var postsRouter=require('./posts/postRoutes');



/*
** Setup routes from dependencies
*/
app.use('/posts',postsRouter);



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

