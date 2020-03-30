
d3.json("data\\samples.json").then(function(json_data) {

  console.log(json_data);
  var individual_metadata = json_data.metadata[0];

  var meta_data_table = d3.select("tbody");
  for(var key in individual_metadata) {
    var value = individual_metadata[key];
    meta_data_table.append("tr").append("td").text(key + ":"+ value);
  }
  
  var individual_sample = json_data.samples[0];
  console.log("Individual Observation:");
  console.log(individual_sample);
  array_len = individual_sample.sample_values.length;
  console.log("Individual Observation size:" + array_len);

  class Observation {
    constructor(otu_ids, sample_values, otu_labels) {
      this.otu_ids = otu_ids;
      this.sample_values = sample_values;
      this.otu_labels = otu_labels;
    }
  }

  var observations = [];

  for(i=0;i<array_len;i++)
  {
    newObservation = new Observation(individual_sample.otu_ids[i], 
      individual_sample.sample_values[i], individual_sample.otu_labels[i]);
    observations.push(newObservation);
  }

  var topData = observations.sort(function(a, b) {
    return b.sample_values - a.sample_values;
  }).slice(0, 10);


  sampleValues = [];
  otuIds = [];
  otuIdsWithPrefix = [];
  otuLabels = [];

  for(i=0, j = topData.length - 1;i<topData.length;i++,j--)
  {
    sampleValues.push(topData[j].sample_values);
    otuIds.push(topData[j].otu_ids);
    otuIdsWithPrefix.push('OTU ' + topData[j].otu_ids);
    otuLabels.push(topData[j].otu_labels);
  }

  var data = [{
    x: sampleValues,
    y: otuIdsWithPrefix,
    text: otuLabels,
    type: "bar",
    orientation: 'h'
  }];

  var layout = {
    title: "Bar Chart"
  };

  Plotly.newPlot("barplot", data, layout);

  // Indicator chart
// Enter a speed between 0 and 180
var level = individual_metadata.wfreq;
var maxValue = 10;

// Trig to calc meter point	
var degrees = maxValue - level;
var radius = .5;
var radians = degrees * Math.PI / maxValue;
var x = radius * Math.cos(radians);
var y = radius * Math.sin(radians);

// Path: may have to change to create a better triangle
var mainPath = 'M -.0 -0.025 L .0 0.025 L ',
	 pathX = String(x),
	 space = ' ',
	 pathY = String(y),
	 pathEnd = ' Z';
var path = mainPath.concat(pathX,space,pathY,pathEnd);

var data = [{ type: 'scatter',
   x: [0], y:[0],
	marker: {size: 28, color:'850000'},
	showlegend: false,
	name: 'speed',
	text: level,
	hoverinfo: 'text+name'},
  { values: [50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50],
  rotation: 90,
  text: ['8-9', '7-8', '6-7', '5-6', '4-5', '3-4', '2-3', '1-2', '0-1', ''],
  textinfo: 'text',
  textposition:'inside',	  
  marker: {colors:['rgba(14, 127, 0, .5)', 'rgba(14, 127, 0, .5)', 'rgba(110, 154, 22, .5)',
						 'rgba(170, 202, 42, .5)', 'rgba(170, 202, 42, .5)', 'rgba(202, 209, 95, .5)',
						 'rgba(210, 206, 145, .5)', 'rgba(210, 206, 145, .5)', 'rgba(232, 226, 202, .5)',
						 'rgba(255, 255, 255, 0)']},
  	 labels: ['8-9', '7-8', '6-7', '5-6', '4-5', '3-4', '2-3', '1-2', '0-1', ''],
  hoverinfo: 'label',
  hole: .5,
  type: 'pie',
  showlegend: false
}];

var layout = {
  shapes:[{
      type: 'path',
      path: path,
      fillcolor: '850000',
      line: {
        color: '850000'
      }
    }],
  title: '<b>Belly Button Washing Frequency</b> <br> Scrubs Per Week',
  height: 500,
  width: 500,
  xaxis: {zeroline:false, showticklabels:false,
			 showgrid: false, range: [-1, 1]},
  yaxis: {zeroline:false, showticklabels:false,
			 showgrid: false, range: [-1, 1]}
};

Plotly.newPlot('indicatorPlot', data, layout, {showSendToCloud:true});


  // bubble plot
  var data = [{
    x: otuIds,
    y: sampleValues,
    text: otuLabels,
    mode: 'markers',
    marker: {
      size: sampleValues,
      color: otuIds
    }
  }];

  var layout = {
    title: 'Bubble Chart',
    showlegend: false,
    height: 600,
    width: 1500
  };

  Plotly.newPlot('bubbleplot', data, layout);

});

