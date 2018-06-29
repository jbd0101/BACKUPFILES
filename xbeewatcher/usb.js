const fs = require('fs')
const download = require('image-downloader')
var SerialPort = require("serialport");

var serialport = new SerialPort("/dev/ttyUSB0",{
baudRate: 9600,
parser: SerialPort.parsers.readline("\n")
});
var io = require('socket.io-client');
var socket = io.connect('http://localhost:3000', {reconnect: true});
socket.emit("identify",{})
//Exemple de commande :-)
//Début du code
//nouveau :
//https://maps.googleapis.com/maps/api/staticmap?path=color:0x0000ff|weight:5|50.4822,6.1808|50.4822,6.1805&maptype=satellite&size=512x512

//https://maps.googleapis.com/maps/api/staticmap?autoscale=1&size=600x300&maptype=satellite&format=png&visual_refresh=true&markers=size:mid%7Ccolor:0xff0000%7Clabel:1%7C50.4822,6.1809&markers=size:mid%7Ccolor:0xff0000%7Clabel:2%7C50.4822,6.1807&markers=size:mid%7Ccolor:0xff0000%7Clabel:3%7C50.4822,6.1805

var lastDatas = {}
var GPS = []

var i = 0
var randomalt = [53.5323954025012,
105.850323978697,
159.365398501023,
211.748928952519,
273.599831552026,
333.796312286832,
392.450135251396,
431.995387965606,
501.642466575542,
555.794182756213,
603.548810354196,
645.957724772723,
669.842729875084,
750.441166401805,
801.817051937433,
897.805063560585,
971.480681078655,
945.361105647147,
991.780896954598,
1151.3805188231,
1119.20535192174,
1266.48276194271,
1225.97843824855,
1387.44679812407,
1419.59949030483,
1389.94793795998,
1433.90937570961,
1512.4168617281,
1686.18290205499,
1562.50064588396,
1715.66200066479,
1809.76463473526,
1836.68759613004,
1918.62472131961,
1850.46822430419,
2003.3461310265,
2021.23913583163,
2097.55751441738,
2108.96452304831,
2309.6025827489,
2399.88596869542,
2368.41670161338,
2544.18205525574,
2376.94534460961,
2339.11779930372,
2398.97239300063,
2720.69235724162,
2798.85496133691,
2901.5424307865,
2904.01474197941,
2892.39392618978,
2823.40864337724,
3087.65768116532,
3169.98104010312,
3002.32628231347,
2890.44773077546,
2983.47453220236,
3099.40077575201,
3168.51616965129,
3159.83958807572,
3578.09955647076,
3399.10028726751,
3517.46058396377,
3704.25757733007,
3365.86100107422,
3452.27174888369,
3858.19857783277,
3760.91032562138,
3682.93354516098,
3796.87648814081,
4179.6069441982,
4256.81868310539,
4034.39081981305,
4227.72484497285,
4052.90330612677,
4385.9732747599,
4210.03979708453,
4173.37896632444,
4672.95582965962,
4591.54289403324,
4342.42936874647,
4789.25360786867,
4579.46678049599,
4461.50060156882,
4583.7657196871,
4773.61574347814,
4850.94650270652,
4698.99291984717,
4957.60985347555,
4728.66582930455,
4891.17846951728,
5410.45222506579,
4844.43407356227,
5241.38652529155,
5188.98008245221,
5459.85841956883,
5543.04356583665,
5095.44197471096,
5738.15038222682,
5236.99480072483,
5672.19114547728,
5855.87722182839,
5872.33589752911,
5858.10788708271,
5519.06645619568,
5738.27735797354,
5817.1477166204,
6163.2513983214,
5619.7296922224,
6446.03754555401,
5874.73604116631,
6380.89013441998,
6125.63034039361,
6176.54964695087,
6599.10754761092,
6369.7194545865,
6227.27161576888,
6248.04726414205,
6761.93077545269,
6179.28491356804,
]
function random(val=251){
  return Math.floor(Math.random() * val);
}

function createMap(values){
  /* options = {
  url: "https://maps.googleapis.com/maps/api/staticmap?path=color:0x0000ff|weight:5|"+values.join("|")+"&maptype=satellite&size=650x512",
  dest: '../public/photo.jpg'        // Save to /path/to/dest/photo.jpg
  }

  download.image(options)
  .then(({ filename, image }) => {
  console.log('File saved to', filename)
  }).catch((err) => {
    console.log("error")
  }) */
}
function median(values) {

    values.sort( function(a,b) {return a - b;} );

    var half = Math.floor(values.length/2);

    if(values.length % 2)
        return values[half];
    else
        return (values[half-1] + values[half]) / 2.0;
}

function addDataToTable(text,response){
  //ce code est foireux je le bypass
  if(1!=1){
    //situation la plus pratique : il n y a aucun passe sur ces données
    let resp_value = []
    for (var i = 0; i < response.length; i++) {
      let val = response[i]
      let key = (text+"-"+i).toString()
      if(lastDatas[key]===undefined){
        lastDatas[key]=[val]
        resp_value.push(val)
        continue
      }else{
        //on push les nouvelles valeurs
        lastDatas[key].push(val)
        //recuperation des anciennces donnees
        if(lastDatas[key].length >= 4){
          lastDatas[key] = lastDatas[key].slice(0).slice(-5)

          resp_value.push(median(lastDatas[key]))
          continue
        }else{
          resp_value.push(val)
          continue
        }
      }
    }
    console.log(resp_value)
    // console.log(lastDatas)
    return resp_value
  }
  return response
}
//Traîter le code de façonlisible
function handleData(data, smooth=true){
  var response = []
  text = data.split(":")[0]
  if(data.includes(":")){
    // data = data.replace(/--/g,"-@");
    data = data.replace(/\s/g,'')
    data = (data.split(":")[1])
      data.split(";").map(function(value){
        // value = value.replace(/@/,"-");
        if(isNaN(parseFloat(value))){
              //nothing
            }else{
              response.push(parseFloat(value))
            }
          })
  }
  // if(smooth===true){
    // response = addDataToTable(text,response)
  // }
  let now = new Date();
  now = now.toLocaleTimeString();
    fs.appendFile(text+'.txt',now+";"+text+";"+response.join(";")+"\n",(err)=>{
  })

  return response
}

//Renvoyer les données
  function handleBNO(data){
    let realData = handleData(data)
    socket.emit("BNO",{BNO_X: realData[0],BNO_Y: realData[1],BNO_Z: realData[2]});
  }
  function handleBNO1(data){
    let realData = handleData(data)
    socket.emit("BNO1",{temp: realData[0]});
  }
  function handleBNO2(data){
    let realData = handleData(data)
    socket.emit("BNO2",{x: realData[0],y: realData[1],z: realData[2]});
  }
  function handleBNO3(data){
    let realData = handleData(data)
    socket.emit("BNO3",{w: realData[0], y: realData[1],x: realData[2],z: realData[3]});
  }
  function handleBNO6(data){
    let realData = handleData(data)
    socket.emit("BNO6",{x: realData[0], y: realData[1],z: realData[2]});
  }
  function handleBNO7(data){
    let realData = handleData(data)
    socket.emit("BNO7",{x: realData[0], y: realData[1],z: realData[2]});
  }
  function handleBNO8(data){
    let realData = handleData(data)
    socket.emit("BNO8",{x: realData[0], y: realData[1],z: realData[2]});
  }
  function handleBNO9(data){
    let realData = handleData(data)
    socket.emit("BNO9",{x: realData[0], y: realData[1],z: realData[2]});
  }
  function handleBNO10(data){
    let realData = handleData(data)
    socket.emit("BNO10",{x: realData[0], y: realData[1],z: realData[2]});
  }
  function handleBNO11(data){
    let realData = handleData(data)
    socket.emit("BNO11",{x: realData[0], y: realData[1],z: realData[2]});
  }
  function handleBMP(data){
    let realData = handleData(data)
    socket.emit("BMP",{Temp: realData[0], Pres: realData[1], Alt: realData[2]});
  }
  function handleGPS(data){
    let realData = handleData(data)
    //let realData = handleData(data,false)
    //GPS.push(realData[0]+","+realData[1])
    //createMap(GPS);
    socket.emit("GPS",{Lat: realData[0], Lon: realData[1],alt: realData[2],mpx: realData[3]});
    }
  function handleMPX(data){
    let realData = handleData(data)
    socket.emit("MPX",{MPX_Bas: realData[0]});
  }
  function handleBNOTemp(data){
    let realData = handleData(data)
    socket.emit("BNOTemp",{Temp: realData[0]});
  }
  function handleBNOQuat(data){
    let realData = handleData(data)
    socket.emit("BNOQuat",{x: realData[0], y: realData[1], z: realData[2], w: realData[3]});
  }
  function handleBNOOrient(data){
    let realData = handleData(data)
    socket.emit("BNOOrient",{x: realData[0], y: realData[1], z: realData[2]});
  }
  function handleBNOAcc(data){
    let realData = handleData(data)
    socket.emit("BNOAcc",{x: realData[0], y: realData[1], z: realData[2]});
  }
  function handleBNOLAcc(data){
    let realData = handleData(data)
    socket.emit("BNOLAcc",{x: realData[0], y: realData[1], z: realData[2]});
  }
  function handleBNOGrav(data){
    let realData = handleData(data)
    socket.emit("BNOGrav",{x: realData[0], y: realData[1], z: realData[2]});
  }
  function handleBNOGyro(data){
    let realData = handleData(data)
    socket.emit("BNOGyro",{x: realData[0], y: realData[1], z: realData[2]});
  }
  function handleBNOEuler(data){
    let realData = handleData(data)
    socket.emit("BNOEuler",{x: realData[0], y: realData[1], z: realData[2]});
  }
  function handleBNOMagnet(data){
    let realData = handleData(data)
    socket.emit("BNOMagnet",{x: realData[0], y: realData[1], z: realData[2]});
  }
  function handleStat(data){
    let realData = handleData(data)
    socket.emit("Stat",{bmp: realData[0], bno: realData[1], sd: realData[2], gps:realData[3]});
  }

//Traîter les différents cas de lecture
function dispatch(data){
  //console.log(data)
  dispatchable = true
  if(data.includes("BNO:")){
    handleBNO(data);
  }else if(data.includes("BMP:")){
    handleBMP(data);
  }else if(data.includes("BNO1:")){
    handleBNO1(data);
  }else if(data.includes("BNO2:")){
    handleBNO2(data);
  }else if(data.includes("BNO3:")){
    handleBNO3(data);
  }else if(data.includes("BNO6:")){
    handleBNO6(data);
  }else if(data.includes("BNO7:")){
    handleBNO7(data);
  }else if(data.includes("BNO8:")){
    handleBNO8(data);
  }else if(data.includes("BNO9:")){
    handleBNO9(data);
  }else if(data.includes("BNO10:")){
    handleBNO10(data);
  }else if(data.includes("BNO11:")){
    handleBNO11(data);
  }else if(data.includes("GPSM:")){
    handleGPS(data);
  }else if(data.includes("MPX:")){
    handleMPX(data);
  }else if(data.includes("BNOT:")){
    handleBNOTemp(data);
  }else if(data.includes("BNOQ:")){
    handleBNOQuat(data);
  }else if(data.includes("BNOO:")){
    handleBNOOrient(data);
  }else if(data.includes("BNOA:")){
    handleBNOAcc(data);
  }else if(data.includes("BNOL:")){
    handleBNOLAcc(data);
  }else if(data.includes("BNOG:")){
    handleBNOGrav(data);
  }else if(data.includes("BNOGy:")){
    handleBNOGyro(data);
  }else if(data.includes("BNOE:")){
    handleBNOEuler(data);
  }else if(data.includes("BNOM:")){
    handleBNOMagnet(data);
  }else if(data.includes("Stat:")){
    handleStat(data);
  }else{
    dispatchable = true
    console.log("---Donnée Non-Dispatchable")
  }
  // if(dispatchable===true){
  //  }
}
/*
 setInterval(function(){
  // dispatch("BNO1: 20")
// dispatch("BMP: "+random(100)+";"+random(500)+";"+random(900))
// dispatch("MPX: "+random()+";"+random())
 // dispatch("n: 50.484"+random(10)+";6.18"+random(100)+";578.5;401")
 dispatch("BMP: "+random(100)+";"+random(500)+";"+randomalt[i])
 i ++
},1000) */


//Lecture (Ne pas mettre le souc)

serialport.on('open', function(){
 console.log('---Lancemenecture---');
 serialport.on('data', function(data){
   if(data.includes("#") == false){
     data = data.replace(/\uFFFD/g, '')
     console.log(data);
     dispatch(data)
   }
 });
});

