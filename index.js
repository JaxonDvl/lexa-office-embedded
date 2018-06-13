var socket = require('socket.io-client')('http://localhost:8080');
// const access_data = require('./access_credentials.json');
// console.log(access_data["username"], access_data["password"]);
socket.token = null;
const deviceName = process.env.DEVICE_NAME;
const password = process.env.DEVICE_PASSWORD;
console.log(deviceName,password);

socket.on('connect', function(){
    console.log("connected on client");
    socket.emit('login', {deviceName, password});
});

socket.on('event', function(data){

});

socket.on('login.success', function(data) {
    socket.token = data.token;
    socket.emit('getDevice', {token:socket.token,deviceName}, {deviceName});
})

socket.on('user.success', function(data) {
    console.log("fetch data")
    console.log(data);
  
})
socket.on('client.error', function (data){
    console.log(data);
})
socket.on('error.messages', function(data){
    console.log(data);
    console.log(socket.token);
})
socket.on("message", function(data){
    console.log("got message", data)
})
socket.on('disconnect', function(){});

