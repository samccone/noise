//jscs:disable
var raw =  [null,null,null,null,null,null,-102.56366673447282,-99.09082423277361,-149.67090362074413,-145.4314195385071,-161.3688152413999,-159.82671658659825,-138.61445734292485,-143.89220052089703,-152.89130389039494,-144.6812367293789,-120.2190542467735,-132.51860535237736,-131.145331118405,-157.36828376505483,-135.2952373020826,-123.46563843016824,-135.88397502082566,-136.9155707954695,-150.23193481325754,-132.88077324365588,-151.32553599711693,-156.35395687589272,-166.1085542921114,-158.91771100547626,-133.13980049910361,-129.93391971447244,-147.2238525005306,-143.6350680221452,-123.75469225687867,-140.11556358479237,-122.97270401590518,-113.07561991771195,-112.69364508084581,-129.23530744198698,-136.2587363588488,-156.05790505996922,-148.12778103663274,-141.49435847706135,-121.44237841359703,-160.3882681155122,-151.96465009296847,-133.55079930019022,-135.64787459390195,-155.17837494974196,-157.9997921270336,-149.72730613799592,-151.11154925261502,-137.90002789121104,-140.3486150828096,-144.81582760878948,-155.39964432424276,-142.18268110461315,-145.5363889929828,-157.99720133758464,-148.35168960132103,-152.83996264631898,-155.46323209248595,-161.12246993970732,-153.14007686886998,-138.32892806757138,-146.4067178455551,-167.23778717244,-153.92862829824196,-180.2271600360302,-137.4135939197548,-167.00039462951594,-103.7517143285419,-151.20966841915222,-151.90793429125168,-132.96912146906467,-161.34513670463886,-153.2272680535132,17.074228708586375,42.878168097928715,28.763314707497337,40.19998877830577,43.19879109226412,45.598598335597835,48.655333407181196,50.319804314813545,50.64522780374111,50.44204892799183,50.21583028853796,49.9625156955351,49.98087229358526,49.851964847638996,49.81078000434423,49.754425945585155,49.7078018070558,49.520552579676,49.28131411880584,48.959651783969626,48.38899837570033,47.770463110402225,47.31147864996559,45.97467675124956,15.831853090614501,6.325270042194726,5.155570007018189,30.645791084618324,45.73321446030437,10.563106334271843,7.902085740555517,3.128630770750153,7.865753333740894,7.007454782177804,29.637927849666102,45.75458891494889,10.225907490954668,31.15292716914717,46.15899115040964,12.87650773529904,7.445336279713917,2.7369010350674894,31.4942242406223,47.79593323469349,44.54749835399901,28.494545281359137,48.020718862260466,9.206048378463787,32.11858127790695,47.19404426011544,12.1281290591181,32.525962634794304,47.249747543294234,11.757595460806897,10.944289396529674,3.011050526630314,10.815686390521204,7.218092662772726,31.218931815481398,45.58921910047225,28.290123827413993,46.14796981872562,8.164358783594789,31.94423898011165,48.21715280511316,44.57630493697288,28.16152523243856,49.55657952506624,46.114968827117764,5.906518476621342,14.67589326325827,7.828164446974006,32.97858493646198,48.17097609415042,28.216189224779676,49.9416803629627,47.3037175310249,25.806682128072115,49.611877531596164,45.67864168339477,26.804286121984944,48.55080531525144,-5.495413505399639,31.46286239439401,47.88751827928186,-18.018090628417724,11.542213327069247,3.0906688718168738,9.063180964138,20.528360505019233,46.414427225954036,46.27496263030733,45.4910818633942,44.18977040807412,43.92502503363992,44.25356749002589,44.61476229677465,44.393478319187665,43.992264617173184,44.639988602828154,45.797256663748726,46.51868144302777,46.580829239980545,46.45112571614761,46.54650458551472,46.35480003320369,45.623223896290156,44.73291194499378,44.133323394440616,43.32569510829685,42.27816029456004,41.389340889067526,38.76012578897245,-7.4512402799671085,0.3177881708378294,-27.694731432956313,-50.4709652524408,-73.02287711305273,-83.84545135610679,-82.16973759979834,-90.62703532159287,-118.33556686139087,-122.20369370016444,-124.04369481560325,-159.00099146030112,-145.92656535392473,-145.94978732424613,-147.3929850192597,-147.4777399329641,-146.3329475111054,-155.2535255943666,-145.77434128724937,-161.05134705509104,-150.92186091429176,-157.33543676386515,-168.89430556284202,-147.37824226353302,-182.47619051699306,-171.53159394632866,-158.29410476759753,-162.64809191724694,-159.06139129834253,-177.8571206649465,-159.52471196473903,-162.95528795499834,-179.3099303518059,-176.4186031145125,-161.49900906820898,-170.666469250155,-110.3733253375737,-141.93562529782187,-159.83837808246233,-158.49260719482004];

//jscs:enable

var rawGraph = document.createElement('canvas');
var rawHeight = 100;
var rawWidth = 600;
rawGraph.setAttribute('height', rawHeight + 'px');
rawGraph.setAttribute('width', rawWidth + 'px');
var rawCtx = rawGraph.getContext('2d');

raw = raw
.filter(function(v) {
  return v !== null && v !== -Infinity;
});

var rawMin = _.min(raw);

raw = raw.map(function(v) {
  // 0 out min
  return v -= rawMin;
});

var rawMax = _.max(raw);

raw = raw
.map(function(v) {
  // Normalize to 0 - 1
  return v / rawMax;
});

raw.forEach(function(v, i) {
  rawCtx.fillRect(i * rawWidth / raw.length, v * rawHeight * 0.95 , 5 , 5);
});

document.body.appendChild(rawGraph);

var movingAverageGraph = document.createElement('canvas');
movingAverageGraph.setAttribute('height', rawHeight + 'px');
movingAverageGraph.setAttribute('width', rawWidth + 'px');
var movingAverageCtx = movingAverageGraph.getContext('2d');
var movingAverageWindow = 20;

movingAverage = raw
.map(function(v, i, arr) {
  for (var j = 0; j < movingAverageWindow && arr[i + j] !== undefined; ++j) {
    v += arr[i + j];
  }
  return v *= 1 / movingAverageWindow;
});

var movingAverageMin = _.min(movingAverage);

movingAverage = movingAverage.map(function(v) {
  return v - movingAverageMin;
});

var movingAverageMax = _.max(movingAverage);

movingAverage = movingAverage.map(function(v) {
  return v / movingAverageMax;
});

movingAverage.forEach(function(v, i) {
  movingAverageCtx.fillRect(i * rawWidth / movingAverage.length, v * rawHeight * 0.95, 5, 5);
});

movingAverageGraph.style.opacity = '0.5';
document.body.appendChild(movingAverageGraph);

var diffGraph = document.createElement('canvas');
diffGraph.setAttribute('height', rawHeight + 'px');
diffGraph.setAttribute('width', rawWidth + 'px');
var diffGraphCtx = diffGraph.getContext('2d');
var diffRange = 40;

diffPoints = movingAverage
.map(function(v, i, arr) {
  return v - _.sum(arr.slice(i, i + diffRange)) / diffRange;
});

var minDiff = _.min(diffPoints);

diffPoints = diffPoints
.map(function(v) {
  return v -= minDiff;
});

var maxDiff = _.max(diffPoints);

diffPoints = diffPoints
.map(function(v) {
  return v / maxDiff;
});

var maxChange = _.max(diffPoints);
var minChange = _.min(diffPoints);
diffPoints
.forEach(function(v, i) {
  diffGraphCtx.fillStyle = 'black';

  if (v == minChange) {
    diffGraphCtx.fillStyle = 'red';
  }

  if (v == maxChange) {
    diffGraphCtx.fillStyle = 'orange';
  }

  diffGraphCtx.fillRect(i * rawWidth / diffPoints.length, v * rawHeight * 0.95, 5, 5);
});

document.body.appendChild(diffGraph);

var dataGraph = document.createElement('canvas');
dataGraph.setAttribute('height', rawHeight + 'px');
dataGraph.setAttribute('width', rawWidth + 'px');
var dataGraphCtx = dataGraph.getContext('2d');

var dataBits = raw.slice(diffPoints.indexOf(minChange)+diffRange/2, diffPoints.indexOf(maxChange));

var minDataBit = _.min(dataBits);

dataBits = dataBits.map(function(v) {
  return v - minDataBit;
});

var maxDataBit = _.max(dataBits);

dataBits = dataBits.map(function(v) {
  return v / maxDataBit;
});

dataBits.forEach(function(v, i) {
  dataGraphCtx.fillRect(i * rawWidth / dataBits.length, v * rawHeight * 0.95, 5, 5);
});

document.body.appendChild(dataGraph);

var trimmedDataGraph = document.createElement('canvas');
trimmedDataGraph.setAttribute('height', rawHeight + 'px');
trimmedDataGraph.setAttribute('width', rawWidth + 'px');
var trimmedDataGraphCtx = trimmedDataGraph.getContext('2d');

function trimLeading(data) {
  var highFound = false;
  var lowFound = 0;
  var trimIndex = -1;
  data.forEach(function(v, i) {
    if (highFound && lowFound < 2 && v < 0.5) {
     if(++lowFound == 2) {
       trimIndex = i;
     }
    }
    if (v > 0.6) {
      highFound = true;
    }
  });

  return data.slice(trimIndex);
}

var trimmedData = trimLeading(trimLeading(dataBits).reverse()).reverse();

trimmedData.forEach(function(v, i) {
  trimmedDataGraphCtx.fillRect(i * rawWidth / trimmedData.length, v * rawHeight * 0.95, 5, 5);
});

document.body.appendChild(trimmedDataGraph);
