const express = require('express');
const mongoose = require('mongoose');
const routes = require('./routes');
const { ValidationError, NotFoundError } = require('./lib/errors');

const app = express();
const port = 3070;

app.use(express.json({ limit: '100kb' }));
let url = "mongodb://localhost:27017/pets";
mongoose.Promise = global.Promise;
mongoose.connect(url,  { useUnifiedTopology: true, useNewUrlParser: true }).then(() => {
    app.use(require("body-parser").json());
    routes(app);
    app.listen(port, () => {
        console.log("Now listening on ", port);
    });
    

}).catch((err) => {
    console.log(err);
});

app.get('/', (req,res) => {
  res.send('App Works !!!!');
});

app.use('/', (err, req, res, next) => {
  // default to 500 internal server error unless we've defined a specific error
  let code = 500;
  if (err instanceof ValidationError) {
    code = 400;
  }
  if (err instanceof NotFoundError) {
    code = 404;
  }
  return res.status(code).json({
    message: err.message,
  });
});

module.exports = app;