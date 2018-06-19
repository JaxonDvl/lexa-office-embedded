

const SerialPort = require('serialport');

const port = new SerialPort('/dev/ttyACM0', {
  baudRate:9600
});

const parsers = SerialPort.parsers;
const parser = new parsers.Readline({
  delimiter: '\r\n'
});

port.pipe(parser);
 
port.open(function () {
  console.log("port is open")
})

parser.on('data', function (data) {

    let cardId = data.toString("utf8").split(" ").join("") ;
    console.log('Data:', cardId);

  });