const serverConfig = require('./constants');

var socket = require('socket.io-client')(serverConfig.serverUrl);
const access_data = require('./access_credentials.json');
console.log(access_data["username"], access_data["password"]);
socket.token = null;
const deviceName = access_data["username"];
const password = access_data["password"];

socket.on('connect', function(){
    console.log("connected on client");
    socket.emit('login', {deviceName, password});
});

socket.on('event', function(data){

});

socket.on('login.success', function(data) {
    socket.token = data.token;
    console.log(data);
    socket.clocking = data.profile.clocking;
})

socket.on('change-clocking', function(data,ack) {
    if(data.state === true) {
        socket.clocking = true;
        console.log("REQUEST Change clock state")
        ack({message: "Clock state is set to logging mode",
            clocking:true});
    } else {
        socket.clocking = false;
        console.log("REQUEST Change clock state to false")
        ack({message: "Clock state is set to register mode",
        clocking:false});
    }
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
    //here is the sensor dht
    ack({temperature: "40"});
})

socket.on("cloud-message-humidity", function(data, ack){
    console.log("REQUEST CM Humidity", data)
     //here is the sensor dht
    ack({humidity: "20"});
})
//this is information comming from the serial
function intervalFunc() {
    const tagId = "7675";
    if(socket.clocking) {
        //clocking
        socket.emit("data-log", {tagId});
    } else {
        //registration
        socket.emit("data-tag", {tagId});
    }
    console.log("Hello!!!!");
     }

setInterval(intervalFunc,4000);

socket.on('disconnect', function(){});

