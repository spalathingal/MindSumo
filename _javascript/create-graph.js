/*
 * Parse the data and create a graph with the data.
 */
function parseData(createGraph) {
	Papa.parse("../_data/metro-bike-share-trip-data.csv", {
		download: true,
		complete: function(results) {
			createGraph(results.data);
		}
	});
}

function createGraph(data) {
	var duration = [];
	var passholderType = ["Passholder Types:"];

	for (var i = 1; i < data.length; i++) {
		duration.push(data[i][1]);
		passholderType.push(data[i][13]);
	}

	console.log(duration);
	console.log(passholderType);

	var chart = c3.generate({
		bindto: '#chart',
	    data: {
	        columns: [
	        	duration
	        ]
	    },
	    axis: {
	        x: {
	            type: 'category',
	            categories: passholderType,
	            tick: {
	            	multiline: false,
                	culling: {
                    	max: 15
                	}
            	}
	        }
	    },
	    zoom: {
        	enabled: true
    	},
	    legend: {
	        position: 'right'
	    }
	});
}

parseData(createGraph);