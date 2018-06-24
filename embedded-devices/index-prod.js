const serverConfig = require('./constants');

var socket = require('socket.io-client')(serverConfig.serverUrl);
const access_data = require('./access_credentials.json');
console.log(access_data["username"], access_data["password"]);
socket.token = null;
const deviceName = access_data["username"];
const password = access_data["password"];

const sensor = require('node-dht-sensor');
const SerialPort = require('serialport');

const port = new SerialPort('/dev/ttyACM0', {
    baudRate: 9600
});

const parsers = SerialPort.parsers;
const parser = new parsers.Readline({
    delimiter: '\r\n'
});

port.pipe(parser);


socket.on('connect', function () {
    console.log("connected on client");
    socket.emit('login', { deviceName, password });
});

socket.on('event', function (data) {

});

socket.on('login.success', function (data) {
    socket.token = data.token;
    console.log(data);
    socket.clocking = data.profile.clocking;
})

socket.on('change-clocking', function (data, ack) {
    if (data.state === true) {
        socket.clocking = true;
        console.log("REQUEST Change clock state")
        ack({
            message: "Clock state is set to logging mode",
            clocking: true
        });
    } else {
        socket.clocking = false;
        console.log("REQUEST Change clock state to false")
        ack({
            message: "Clock state is set to register mode",
            clocking: false
        });
    }
})

socket.on('user.success', function (data) {
    console.log("fetch data")
    console.log(data);

})
socket.on('client.error', function (data) {
    console.log(data);
})
socket.on('error.messages', function (data) {
    console.log(data);
    console.log(socket.token);
})
socket.on("message", function (data) {
    console.log("got message", data)
})

socket.on("cloud-message-temperature", function (data, ack) {
    console.log("REQUEST CM Temperature", data)
    sensor.read(11, 4, function (err, temperature, humidity) {
        if (!err) {
            ack({ temperature: temperature.toFixed(1) });
            console.log('temp: ' + temperature.toFixed(1) + '°C, ' +
                'humidity: ' + humidity.toFixed(1) + '%'
            );
        }
        else {
            console.log(err);
        }
    });
})

socket.on("cloud-message-humidity", function (data, ack) {
    console.log("REQUEST CM Humidity", data)
    sensor.read(11, 4, function (err, temperature, humidity) {
        if (!err) {
            ack({ humidity: humidity.toFixed(1) });
            console.log('temp: ' + temperature.toFixed(1) + '°C, ' +
                'humidity: ' + humidity.toFixed(1) + '%'
            );
        }
        else {
            console.log(err);
        }
    });
})


port.open(function () {
    console.log("port is open")
})

parser.on('data', function (data) {

    let tagId = data.toString("utf8").split(" ").join("");
    console.log('Data:', tagId);
    if (socket.clocking) {
        //clocking
        socket.emit("data-log", { tagId });
    } else {
        //registration
        socket.emit("data-tag", { tagId });
    }
    console.log("TagID emited", tagId);
})


socket.on('disconnect', function () { });

