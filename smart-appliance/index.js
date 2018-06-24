const serverConfig = require('./constants');

var socket = require('socket.io-client')(serverConfig.serverUrl);
const access_data = require('./access_credentials.json');
console.log(access_data["username"], access_data["password"]);
socket.token = null;
const deviceName = access_data["username"];
const password = access_data["password"];
const { Client } = require('tplink-smarthome-api');
const client = new Client();

socket.on('connect', function(){
    console.log("connected on client");
    socket.emit('login', {deviceName, password});
});

socket.on('login.success', function(data) {
    socket.token = data.token;
   
})

socket.on('update-bulb', function(updateState,ack) {
    console.log(updateState.data);
    const bulb = client.getDevice({host:'192.168.1.104'})
    .then((device)=>{
        // device.getSysInfo().then(console.log);
        device.lighting.setLightState({ 
            on_off :updateState.data.on_off,
            color_temp: updateState.data.color_temp,
            brightness :updateState.data.brightness
        }).then((resp) => {
            ack({message: "Updated bulb"});
        });
  });
    
})

socket.on('disconnect', function(){});