var express = require('express');
var app = express();
var cluster = require('cluster');
var https = require('https');
var http = require('http');
var fs = require('fs');

var numCPUs = 2;

var options = {
  //key: fs.readFileSync('/root/ssl/bukeala_com.key'),
  //cert: fs.readFileSync('/root/ssl/STAR_bukeala_com.crt')
  // key: fs.readFileSync('./root/ssl/bukeala_com.key'),
  // cert: fs.readFileSync('./root/ssl/STAR_bukeala_com.crt')
};


if(cluster.isMaster) {    

    console.log('Master cluster setting up ' + numCPUs + ' workers...');

    for(var i = 0; i < numCPUs; i++) {
        cluster.fork();
    }

    cluster.on('online', function(worker) {
        console.log('Worker ' + worker.process.pid + ' is online');
    });

    cluster.on('exit', function(worker, code, signal) {
        console.log('Worker ' + worker.process.pid + ' died with code: ' + code + ', and signal: ' + signal);
        console.log('Starting a new worker');
        cluster.fork();
    });
} else {


  app.use(express.static('public'));

  //var server = https.createServer(options, app);
  var server = http.createServer(options, app);
  var io = require('socket.io')(server);


  io.on('connection', function(socket) {

    /*Recibe un prebooking e informa cuál es a todos los clientes conectados*/

    socket.on('pendingBookingInfo', function(data) {
      console.log(data)
      io.sockets.emit('resPendingBooking', data);

    });

    /*Recibe un prebooking cancelado e informa cuál es a todos los clientes conectados*/

    socket.on('canceledBookingInfo', function(data) {
      console.log(data)
      io.sockets.emit('resCanceledBooking', data);

    });

  });

  server.listen(3000, function() {
    console.log("Servidor corriendo en https://localhost:3000");
  });
}

// root@HealthTest:/var/www/nodejs/server -> test 