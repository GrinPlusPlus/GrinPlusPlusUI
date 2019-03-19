import express from 'express';

exports.start = function() {
  var app = express();
  var port = process.env.PORT || 13415;

  var routes = require('./ServerRoutes');
  routes(app);

  app.listen(port);

  console.log('Foreign API server started on: ' + port);
}
