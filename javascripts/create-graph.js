/*
 * Parse the data and create a graph with the data.
 */
function parseData(createGraph) {
  Papa.parse("https://raw.githubusercontent.com/spalathingal/MindSumo/master/data/metro-bike-share-trip-data.csv", {
    download: true,
    complete: function(results) {
      //function calls for different graphs
      createGraph(results.data); //bar
      createPieChart(results.data); //pie
      createDonutChart(results.data); //donut
      //createBarChart(results.data); //was not able to finish in time
    }
  });
}

//Bar Chart based on the duration values in data
function createGraph(data) {
  var range = ["0-20", "20-40", "40-60", "60-80", "80-100", "100-120", "120+"];
  var customers = ["Number of Customers",0,0,0,0,0,0,0];

  //adds to the riders array based on what the time intervals were.
  for(var i = 1; i < data.length; i ++){
    var minutes = (data[i][1])/60;
    //store in respective slots in customers array
    //ranges include upper bound, but not lower
    if(minutes <= 5)
      customers[1]++;
    else if(minutes <= 10)
      customers[2]++;
    else if(minutes <= 15)
      customers[3]++;
    else if(minutes <= 20)
      customers[4]++;
    else if(minutes <= 25)
      customers[5]++;
    else if(minutes <= 30)
      customers[6]++;
    else if(minutes > 35)
      customers[7]++;
  }
  var chart = c3.generate({
    data: {
        columns: [
            customers
        ],
        type: 'bar'
    },
    color: {
        pattern: ['#e65c00']
    },
    bar: {
        width: {
            ratio: 0.9 // this makes bar width 90% of length between ticks
        }
    },
    axis: {
      x: {
        type: 'category',
        categories:range,
        label: { 
          text: 'Range (minutes)',
          position: 'outer-center'
        }
      },
      y: {
        label: { 
          text: 'Number of customers',
          position: 'outer-middle'
        }
      }
    }
  });
}

//pie chart for distribution of pass types
function createPieChart(data){
  //counters for types of passes
  var mP = 0;
  var fP = 0;
  var wU = 0;

  //Add values of the number of times each pass is used.
  for(var i = 1; i < data.length; i ++){
    if(data[i][13] == "Monthly Pass"){
      mP++;
    }
    else if(data[i][13] == "Flex Pass"){
      fP++;
    }
    else if(data[i][13] == "Walk-up"){
      wU++;
    }
  }

  //draw pie chart
  var chart = c3.generate({
    bindto: '#pieChart',
      data: {
          columns: [
              ['Monthly Pass', mP],
              ['Flex Pass', fP],
              ['Walk-Up', wU]
          ],
          type : 'pie',
          onclick: function (d, i) { console.log("onclick", d, i); },
          onmouseover: function (d, i) { console.log("onmouseover", d, i); },
          onmouseout: function (d, i) { console.log("onmouseout", d, i); }
      }
  });
}


function createDonutChart(data){
  //min station = 3000, max station = 4108
  //could make array utilizing a heap function and linear probing but unnecessary

  var startStations = new Array(1109); //stores counts of stations started at
  var endStations = new Array(1109); //stores counts of stations ended at

  //initialize array with blank values for exact number of stations 
  for(var i=1; i<=1108; i++){
    startStations[i] = 0;
    endStations[i] = 0;
  }
  
  //increment counter at indexes as u read from file
  for(var i=1; i<data.length; i++){
    if(data[i][4] >= 3000 && data[i][4] <= 4108){
      if(data[i][7] >= 3000 && data[i][7] <= 4108){
        startStations[data[i][4]-3000]++;
        endStations[data[i][4]-3000]++;
      }
      //else: continues to next i
    }
  }
  //three most commmon start stations
  //first index is station #
  //second index is count at that station
  var sMax = [0,0];
  var sMax2 = [0,0];
  var sMax3 = [0,0];
  var sMax4 = [0,0];
  var sMax5 = [0,0];
  
  for(var i=0; i<startStations.length; i++){
    if(startStations[i] > sMax[1]){
      sMax[0] = i+3000;
      sMax[1] = startStations[i];
    }
    if(startStations[i] > sMax2[1] && startStations[i] < sMax[1]){
      sMax2[0] = i+3000;
      sMax2[1] = startStations[i];
    }
    if(startStations[i] > sMax3[1] && startStations[i] < sMax2[1]){
      sMax3[0] = i+3000;
      sMax3[1] = startStations[i];
    }
    if(startStations[i] > sMax4[1] && startStations[i] < sMax3[1]){
      sMax4[0] = i+3000;
      sMax4[1] = startStations[i];
    }
    if(startStations[i] > sMax5[1] && startStations[i] < sMax4[1]){
      sMax5[0] = i+3000;
      sMax5[1] = startStations[i];
    }
  }
  //I repeated the process for end stations, and got the same top stations

  //draw scatterplot
  var chart = c3.generate({
    bindto: '#donutChart',
    data: {
        columns: [
            [sMax[0], sMax[1]],
            [sMax2[0], sMax2[1]],
            [sMax3[0], sMax3[1]],
            [sMax4[0], sMax4[1]],
            [sMax5[0], sMax5[1]]
        ],
        type : 'donut',
        onclick: function (d, i) { console.log("onclick", d, i); },
        onmouseover: function (d, i) { console.log("onmouseover", d, i); },
        onmouseout: function (d, i) { console.log("onmouseout", d, i); }
    },
    donut: {
        title: "Most Common Stations"
    }
  });
}

function createBarChart(data){
var distance = 0.0; //Distance of each ride
var average = 0.0;
var number = 0;
var total = 0.0;
var count = data.length;
var miles = ["0","0.2","0.4", "0.6", "0.8", "1.0", "1.2", "1.4", "1.6", "1.8", "2.0" ,"2.0+"]; // Array of different distances
var distances = ["Number of riders",0,0,0,0,0,0,0,0,0,0,0,0];

for(var i = 1; i < data.length; i++){
   distance = haversineDistance(parseFloat(data[i][5]), parseFloat(data[i][6]), parseFloat(data[i][8]), parseFloat(data[i][9]));
   //checking if values are valid
   if(isNaN(distance)){
     count --;
     continue; // goes too next iteration
   }
 }
   /*
   total += parseFloat(distance);
   //adds riders to array
   if(distance <= 0)
     distances[1] ++;
   else if(distance <= 0.2)
     distances[2]++;
   else if(distance <= 0.4)
     distances[3]++;
   else if(distance <= 0.6)
     distances[4]++;
   else if(distance <= 0.8)
     distances[5]++;
   else if(distance <= 1.0)
     distances[6]++;
   else if(distance <= 1.2)
     distances[7]++;
   else if(distance <= 1.4)
     distances[8]++;
   else if(distance <= 1.6)
     distances[9]++;
   else if(distance <= 1.8)
     distances[10]++;
   else if(distance <= 2.0)
     distances[11]++;
   else if(distance > 2.0+)
     distances[12]++; 
}
average = parseFloat(total)/count;*/
/*
//draw chart
var chart = c3.generate({
  bindto: '#barChart',
  });*/
}

//Haversine Formula that calculates distance
function haversineDistance(lat1,lon1,lat2,lon2) {
  var R = 6371; // Radius of the earth in km
  //cleans the data set from emptyy values or non-numbers
  if ((isNaN(lat1)) || isNaN(lat2) || isNaN(lon1) || isNaN(lon2) || lon1 == 0 ||
    lon2 == 0 || lat1 == 0 || lat2 == 0) {
    return NaN;
  }
  var dLat = convertToRad(lat2-lat1);
  var dLon = convertToRad(lon2-lon1);
  var a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon/2) * Math.sin(dLon/2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  var d = parseFloat(R * c);  // Distance in km
  var mil = parseFloat(d/1.60934);
  return  mil;// converts to miles
}

function convertToRad(deg) {
  return deg * (Math.PI/180);
}


parseData(createGraph);