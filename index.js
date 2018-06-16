var socket = require('socket.io-client')('http://192.168.1.102:8080');
const access_data = require('./access_credentials.json');
console.log(access_data["username"], access_data["password"]);
socket.token = null;
const deviceName =access_data["username"];
const password = access_data["password"];
const sensor = require('node-dht-sensor');



socket.on('connect', function(){
    console.log("connected on client");
    socket.emit('login', {deviceName, password});
});

socket.on('event', function(data){

});

socket.on('login.success', function(data) {
    socket.token = data.token;
    // socket.emit('getDevice', {token:socket.token,deviceName}, {deviceName});
    // socket.emit("message",{token:socket.token,deviceName,message:"test"})
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

socket.on("cloud-message-temperature", function(data, ack){
    console.log("REQUEST CM Temperature", data)
    sensor.read(11, 4, function(err, temperature, humidity) {
        if (!err) {
            ack({temperature: temperature.toFixed(1)});
            console.log('temp: ' + temperature.toFixed(1) + '°C, ' +
                'humidity: ' + humidity.toFixed(1) + '%'
            );
        }
        else {
            console.log(err);
        }
    });
   
})

socket.on("cloud-message-humidity", function(data, ack){
    sensor.read(11, 4, function(err, temperature, humidity) {
        if (!err) {
            ack({humidity: humidity.toFixed(1)});
            console.log('temp: ' + temperature.toFixed(1) + '°C, ' +
                'humidity: ' + humidity.toFixed(1) + '%'
            );
        }
        else {
            console.log(err);
        }
    });
})
socket.on('disconnect', function(){});

