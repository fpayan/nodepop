var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var uniqueValidator = require('mongoose-unique-validator');

// env
require('dotenv').config()
console.log(process.env.DB_HOST, process.env.DB_USER, process.env.DB_PASS);

// Import the mongoose module and set url connection
const mongoose = require('mongoose'),
      Schema = mongoose.Schema,
      URL_DB_CONNECT = `mongodb://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`;
      console.log(URL_DB_CONNECT);
      //
      let db_nodepop_promise = mongoose.connect(URL_DB_CONNECT, { 
        useMongoClient: true, 
        //server: { poolSize: 4 },
        promiseLibrary: require('bluebird') 
      });
      
      //Data Schema
      let user_schema = new Schema({
        name: { type: String, required: true },
        email: { type: String, unique: true },
        password: { type: String, required: true }
      });
      let User = mongoose.model('User', user_schema);
      user_schema.plugin(uniqueValidator);// .index({ unique: true });
      user_schema.pre('save', (next)=>{
        console.log('Save user from pre....');
        next();
      });
      // Load into db.nodepop-pruebas
      let user1 = new User({
        name: 'Francisco',
        email: 'francisco@email.com',
        password: '12345'
      });
      user1.save((err)=>{
        if(err){ return console.log('Error to save user1', err.message)}
        //
        return console.log('User salved success !!');
      });
      User.find({},function(err, user){
        if(err){console.log('Error al buscar user', err.message);};
        console.log(user);
        return;
      });

      //Bind connection to error event (to get notification of connection errors)
      //db_nodepop_promise.on('error', ()=>{console.error.bind(console, 'MongoDB connection error:');});
      //db_nodepop_promise.on('connect', ()=>{console.error.bind(console, 'MongoDB connection success !!');});
      //console.log(db_nodepop_promise);
var index = require('./routes/index');
var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
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
