const { Client } = require('tplink-smarthome-api');

const client = new Client();
function setLightState (onoff, color_temp,brightness) {
    const bulb = client.getDevice({host:'192.168.1.101'})
    .then((device)=>{
        // device.getSysInfo().then(console.log);
        device.lighting.setLightState({
            on_off :onoff,
            color_temp,
            brightness
        }).then(console.log);
  });
}
setLightState(false,4000, 2);

// client.startDiscovery().on('device-new', (device) => {
//     device.getSysInfo().then((bulb)=>{
//         console.log(bulb);
//         device.setPowerState(true);
    
//     });
//   });