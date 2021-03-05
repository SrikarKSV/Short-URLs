const path = require('path');
const express = require('express');
const morgan = require('morgan');
const flash = require('connect-flash');
const session = require('express-session');
const MongoStore = require('connect-mongo').default;

const homeRouter = require('./routes/homeRouter');
const {
  globalErrorHandler,
  flashValidationErrors,
} = require('./handlers/errorHandlers');
const ErrorResponse = require('./utils/errorResponse');

const app = express();

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// Serving static files
app.use(express.static(path.join(__dirname, 'public')));

// Reading data from body into req.body
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: DB }),
  })
);

app.use(flash());

app.use((req, res, next) => {
  res.locals.flashes = req.flash();
  next();
});

// Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use('/', homeRouter);

app.all('*', (req, res, next) => {
  next(
    new ErrorResponse(
      `'${req.headers.host}${req.originalUrl}' does not exist!`,
      404
    )
  );
});

app.use(flashValidationErrors);

app.use(globalErrorHandler);

module.exports = app;
