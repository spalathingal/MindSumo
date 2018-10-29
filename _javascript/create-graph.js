/*
 * Parse the data and create a graph with the data.
 */
function parseData(createGraph) {
	Papa.parse("https://media.githubusercontent.com/media/spalathingal/testwebsite/master/dataAndImages/metrobikesharetripdata.csv", {
		download: true,
		complete: function(results) {
			createGraph(results.data);
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

parseData(createGraph);