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

parseData(createGraph);