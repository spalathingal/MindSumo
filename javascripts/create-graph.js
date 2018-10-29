
/*
 * csv = [0] = Trip ID, [1] = Duration, [2] = Start Time,[3] = End Time [4] = Starting Station ID,
 * [5] = Start Station Lat, [6] = Start station long, [7] = Ending station ID,
 * [8] = End Station Lat, [9] = End Station Long, [10] = Bike ID, [11] = Plan Duration,
 * [12] = Trip Route Category, [13] = Passholder type, [14] = Start Lat-Long,
 * [15] = Ending Lat-Long
 */

//parse data from the csv file using PapaParse and create graphs needed.
function parseData(createGraph){
	Papa.parse("https://media.githubusercontent.com/media/edwinomeara/LABikeShareData/master/dataAndImages/metrobikesharetripdata.csv", {
      download: true,
      complete: function(results) {
        createGraph(results.data);    //Line Chart
        createPieRiders(results.data);//Pie Chart
        createBarChart(results.data); //First Bar Chart
        createBarChart2(results.data);//Second Bar Chart
      }
    });
}

//Creates Bar Chart based on distances travelled using longitudes and lattitudes
function createBarChart(data){
var number = 0;
var totalDistance = 0.0;  //Add together all Distances to find average
var singleDistance = 0.0; //Distance of each ride
var averageDistance = 0.0;//Average overall Distance
var count = data.length;
var miles = ["0","0.1","0.2", "0.3", "0.4", "0.5", "0.6", "0.7", "0.8", "0.9", "1.0" ,"1.2",
"1.4","1.6","1.8","2.0","2.5","3", "3+"]; // Array of different distances
var distance = ["Amount of riders",0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];//19 length used to add each rider
  for(var i = 1; i < data.length-1; i ++){
    singleDistance = getDistanceFromLatLonInKm(parseFloat(data[i][5]), parseFloat(data[i][6]), parseFloat(data[i][8]), parseFloat(data[i][9]));
    //Some values were incorrect and returning NaN so I decided it best to just continue.
    if(isNaN(singleDistance)){
      count --;
      continue;
    }
    totalDistance += parseFloat(singleDistance);

    //Switch case to add each rider to the distance array based on the length of their ride
    switch(true) {
       case singleDistance <= 0:
         distance[1] ++;
         break;

       case singleDistance < 0.1 && singleDistance >= 0:
         distance[2] ++;
         break;

       case singleDistance < 0.2 && singleDistance >= 0.1:
         distance[3] ++;
         break;

       case singleDistance < 0.3 && singleDistance >= 0.2:
         distance[4] ++;
         break;

       case singleDistance < 0.4 && singleDistance >= 0.3:
         distance[5] ++;
         break;

       case singleDistance < 0.5 && singleDistance >= 0.4:
         distance[6] ++;
         break;

       case singleDistance < 0.6 && singleDistance >= 0.5:
         distance[7] ++;
         break;

       case singleDistance < 0.7 && singleDistance >= 0.6:
         distance[8] ++;
         break;

       case singleDistance < 0.8 && singleDistance >= 0.7:
         distance[9] ++;
         break;

       case singleDistance < 0.9 && singleDistance >= 0.8:
         distance[10] ++;
         break;

       case singleDistance < 1 && singleDistance >= 0.9:
         distance[11] ++;
         break;

       case singleDistance < 1.2 && singleDistance >= 1:
         distance[12] ++;
         break;

       case singleDistance < 1.4 && singleDistance >= 1.2:
         distance[13] ++;
         break;

       case singleDistance < 1.6 && singleDistance >= 1.4:
         distance[14] ++;
         break;

       case singleDistance < 1.8 && singleDistance >= 1.6:
         distance[15] ++;
         break;

       case singleDistance < 2 && singleDistance >= 1.8:
         distance[16] ++;
         break;

       case singleDistance < 2.5 && singleDistance >= 2:
         distance[17] ++;
         break;

       case singleDistance < 3 && singleDistance >= 2.5:
         distance[18] ++;
         break;

       default:
         distance[19] ++;
         break;
    }
  }

averageDistance = parseFloat(totalDistance)/count;

//First Bar Chart
var chart = c3.generate({
  padding: { //Stops graph from being cut off on the right side
      right: 20
  },
  bindto: '#barChart',
    data: {
        columns: [distance
        ],
        type: 'bar'
    },

    bar: {
        width: {
            ratio: 0.5
        }
    },
       axis: {
           rotated: true, // sideways bar chart
           x: {
               type: 'category',
               categories:miles,
               label:{
                 text: 'Miles',
                 position: 'outer-middle' // Miles text easier to identify
               },
          }
     },
     grid: {
     x: {
         lines: [ //Creates the red average distance line
             {value: averageDistance + 5.5,class: 'avgDist', text: 'Average Distance: ' + averageDistance.toFixed(2) + ' Miles'}
         ]
     }
 }
});
}

//Haversine Formula to calculate the distance based on lattitudes and longitudes
function getDistanceFromLatLonInKm(lat1,lon1,lat2,lon2) {
	var R = 6371; // Radius of the earth in km

  //missing data sets or a 0 where there should've been a lat or lon (Ex. line 46418) were totally
  //throwing off my results, decided it best to just return a 0 here.
  if ((isNaN(lat1)) || isNaN(lat2) || isNaN(lon1) || isNaN(lon2) || lon1 == 0 ||
lon2 == 0 || lat1 == 0 || lat2 == 0) {
    return NaN;
  }

	var dLat = deg2rad(lat2-lat1);  // deg2rad below
	var dLon = deg2rad(lon2-lon1);
	var a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon/2) * Math.sin(dLon/2);
	var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
	var d = parseFloat(R * c);  // Distance in km
	return parseFloat(d/1.60934); // returns distance in miles
}

function deg2rad(deg) {
  return deg * (Math.PI/180)
}

//create pie chart based on passes the riders used
function createPieRiders(data){
  var monthly = 0; //Monthly Pass
  var flex = 0;    //Flex Pass
  var walkUp = 0;  //Walk-Up Pass

  //Add values of the number of times each pass is used.
  for(var i = 1; i < data.length; i ++){
    if(data[i][13] == "Flex Pass"){
      flex++;
    }
    else if(data[i][13] == "Monthly Pass"){
      monthly ++;
    }
    else{
      walkUp++;
    }
  }

  var totalUsers = monthly + flex + walkUp;
  var stringRegularUsers = "Regular Users: " + parseInt(((flex + monthly)/totalUsers) * 100, 10) + "%"; //Value to put in PieChart

  var chart = c3.generate({
    bindto: '#pieChart',
      data: {
          // iris data from R
          columns: [
              ['Monthly Users', monthly],
              ['Flex Pass', flex],
              ['Walk Up', walkUp]
          ],
          type : 'donut',
          onclick: function (d, i) { console.log("onclick", d, i); },
          onmouseover: function (d, i) { console.log("onmouseover", d, i); },
          onmouseout: function (d, i) { console.log("onmouseout", d, i); }
      },
      donut: {
        title: stringRegularUsers,
        label: {
            format: function (value, ratio, id) {
                return d3.format('#')(value);
            }
        }
      }
  });

//Changes the 3 seperate values into 2
  setTimeout(function () {
    chart.load({
        columns: [
            ["Regular users", monthly, flex],
            ["NonRegular users", walkUp],
        ]
    });
}, 1500);

//Time till change
setTimeout(function () {
    chart.unload({
        ids: 'Flex Pass'
    });
    chart.unload({
        ids: 'Walk Up'
    });
    chart.unload({
        ids: 'Monthly Users'
    })
}, 2500);
}

//Second Bar Chart of the most popular start/stops
function createBarChart2(data){
var startStation = [];
var stopStation = [];
var startCount = ['Start Station'];
var stationID = [];
var stopCount = ['Stop Station'];

//created an array to add each station to and then incremented the next index with the count of that station.
  for(var i = 1; i < data.length; i++){
    if(data[i][4] == undefined || data[i][7] == undefined || data[i][4] == "" || data[i][7] == ""){
      continue;
    }
    //if the station is not in the array, push it in and push a 1 into the next index
    if(!startStation.includes(data[i][4])){
      startStation.push(data[i][4]);
      startStation.push(1);
    }else{
    //if it is in the array add to the count by incrementing the station location at its index +1;
      startStation[startStation.indexOf(data[i][4]) + 1] += 1;
    }

    if(!stopStation.includes(data[i][7])){
      stopStation.push(data[i][7]);
      stopStation.push(1);
    }else{
      stopStation[stopStation.indexOf(data[i][7]) + 1] += 1;
    }
}

//seperate the array into ID and the count
for(var i = 0; i < startStation.length; i += 2){
  stationID.push('ID ' + startStation[i]);
  startCount.push(startStation[i + 1]);
  stopCount.push(stopStation[i + 1]);
}

  var chart = c3.generate({
    padding: {
        right: 20 //right side was a little close to the edge
    },
    bindto:'#barChart2',
    data: {
        columns: [
            startCount,
            stopCount
        ],

        type: 'bar'
    },
    bar: {
        width: {
            ratio: 0.75 // this makes bar width 50% of length between ticks
        }
      },
        axis: {
            x: {
                type: 'category',
                categories:stationID,
                label:{
                  text: '',
                  position: 'outer-left'
                },
                tick: {
                    rotate:15,
                    multiline: false,
                    culling: {
                        max: 15 // the number of tick texts will be adjusted to less than this value
                    },
                },
        }
      },
      grid: {
       y: {
           lines: [
               {value: 6262, class:'stopLine',text: 'Most Popular Stop: Station ID 3022'},
                {value: 5135, class:'startLine',text: 'Most Popular Start: Station ID 3069'}
           ]
       }
   }
});
}


//Line Chart based on the time spent on the bike.
function createGraph(data) {
  var minutes = ["0 - 5", "6 - 10" , "11 - 15", "16 - 20", "21 - 25","26 - 30", "31 - 35" ,
   "36 - 40", "41 - 45", "46 - 50","51 - 55","56 - 60", "61 - 65" ,"66 - 70", "71 - 75", "76 - 80", "81 - 85", "86 - 90", "91 - 95",
   "96 - 100", "101 - 105", "106 - 110", "111 - 115", "116-120", "120 +"];
  var riders = ["Number of Riders",0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
  var counter = 0;

  //adds to the riders array based on what the time intervals were.
  for(var i = 1; i < data.length; i ++){
    var num = (data[i][1])/60;
    switch(true) {
       case num < 6:
         riders[1] ++;
         break;

       case num < 11 && num >= 6:
         riders[2] ++;
         break;

       case num < 16 && num >= 11:
         riders[3] ++;
         break;

       case num < 21 && num >= 16:
         riders[4] ++;
         break;

       case num < 26 && num >= 21:
         riders[5] ++;
         break;

       case num < 31 && num >= 26:
         riders[6] ++;
         break;

       case num < 36 && num >= 31:
         riders[7] ++;
         break;

       case num < 41 && num >= 36:
         riders[8] ++;
         break;

       case num < 46 && num >= 41:
         riders[9] ++;
         break;

       case num < 51 && num >= 46:
         riders[10] ++;
         break;

       case num < 56 && num >= 51:
         riders[11] ++;
         break;

       case num < 61 && num >= 56:
         riders[12] ++;
         break;

       case num < 66 && num >= 61:
         riders[13] ++;
         break;

       case num < 71 && num >= 66:
         riders[14] ++;
         break;

       case num < 76 && num >= 71:
         riders[15] ++;
         break;

       case num < 81 && num >= 76:
         riders[16] ++;
         break;

       case num < 86 && num >= 81:
         riders[17] ++;
         break;

       case num < 91 && num >= 86:
         riders[18] ++;
         break;

       case num < 96 && num >= 91:
         riders[19] ++;
         break;

       case num < 101 && num >= 96:
         riders[20] ++;
         break;

       case num < 106 && num >= 101:
         riders[21] ++;
         break;

       case num < 111 && num >= 106:
         riders[22] ++;
         break;

       case num < 116 && num >= 111:
        riders[23] ++;
         break;

       case num < 121 && num >= 116:
         riders[24] ++;
         break;

       default:
         riders[25] ++;
         break;
    }
  }

  var chart = c3.generate({
    padding: {
        right: 20
    },
    bindto: '#chart',
    data: {
        columns: [
          riders
        ]
    },
    axis: {
        x: {
            type: 'category',
            categories:minutes,
            tick: {
                multiline: false,
                culling: {
                    max: 7 // the number of tick texts will be adjusted to less than this value
                },
            },
            label: {
              text: 'Range in minutes',
              position: 'outer-left'
            }

        },
        y: {
          label: {
            text: 'Bike share riders',
            position: 'outer-middle'
          }
        },
    }
});
}

//start creating graphs
parseData(createGraph);
