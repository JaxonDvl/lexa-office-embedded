var socket = require('socket.io-client')('http://localhost:8080');
// const access_data = require('./access_credentials.json');
// console.log(access_data["username"], access_data["password"]);
socket.token = null;
const deviceName = process.env.DEVICE_NAME;
const password = process.env.DEVICE_PASSWORD;

socket.on('connect', function(){
    console.log("connected on client");
    socket.emit('login', {deviceName, password});
});

socket.on('event', function(data){

});

socket.on('login.success', function(data) {
    socket.token = data.token;
    socket.clocking = true;
    // socket.emit('getDevice', {token:socket.token,deviceName}, {deviceName});
    // socket.emit("message",{token:socket.token,deviceName,message:"test"})
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
    ack({temperature: "40"});
})

socket.on("cloud-message-humidity", function(data, ack){
    console.log("REQUEST CM Humidity", data)
    ack({humidity: "20"});
})
//this is information comming from the serial
function intervalFunc() {
    const tagId = "123141";
    if(socket.clocking) {
        socket.emit("data-log", {tagId});
    } else {
        socket.emit("data-tag", {tagId});
    }
    console.log("Hello!!!!");
     }

setInterval(intervalFunc,4000);

socket.on('disconnect', function(){});

