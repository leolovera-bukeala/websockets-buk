var express = require('express');
var app = express();

var https = require('https');
var http = require('http');
var fs = require('fs');

var numCPUs = 2;

var options = {
  //key: fs.readFileSync('/root/ssl/bukeala_com.key'),
  //cert: fs.readFileSync('/root/ssl/STAR_bukeala_com.crt')
};

app.use(express.static('public'));

//var server = https.createServer(options, app);
var server = http.createServer(options, app);
var io = require('socket.io')(server, {
    cors: {
    origin: "*",
    methods: ["GET", "POST"],
    transports: ['websocket', 'polling'],
    credentials: true
    },
    allowEIO3: true
});


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

  /* Recibe un paciente de la lista de espera e informa cual es a todos los cliente conectados - Leo  */

  socket.on('patientInfoQueueManager', function(data) {
    console.log(data)
    io.sockets.emit('resPatientInfoQueueManager', data);
  });

});

server.listen(3000, function() {
  console.log("Servidor corriendo en http://localhost:3000");
});


// root@HealthTest:/var/www/nodejs/server -> test 