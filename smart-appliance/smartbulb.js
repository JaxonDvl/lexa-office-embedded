const { Client } = require('tplink-smarthome-api');

const client = new Client();
const bulb = client.getDevice({host:'192.168.1.101'})
    .then((device)=>{
        device.getSysInfo().then(console.log);
        device.setPowerState(false);
  });
// client.startDiscovery().on('device-new', (device) => {
//     device.getSysInfo().then((bulb)=>{
//         console.log(bulb);
//         device.setPowerState(true);
    
//     });
//   });