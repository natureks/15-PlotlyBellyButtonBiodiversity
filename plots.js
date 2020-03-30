class Observation {
  constructor(otu_ids, sample_values, otu_labels) {
    this.otu_ids = otu_ids;
    this.sample_values = sample_values;
    this.otu_labels = otu_labels;
  }
}

class Subject {
  constructor(observations, metadata) {
    this.observations = observations;
    this.metadata = metadata;
  }
}

function change() {
  console.log("selected: " + this.options[this.selectedIndex].value + "->" + this.options[this.selectedIndex].text);
  displaySubject(this.options[this.selectedIndex].value);
}

function makeSubjectsArray(json_data) {
  for (i = 0; i < json_data.metadata.length; i++) {
    var sample = json_data.samples[i];
    array_len = sample.sample_values.length;

    var observations = [];
    for (j = 0; j < array_len; j++) {
      newObservation = new Observation(sample.otu_ids[j], sample.sample_values[j], sample.otu_labels[j]);
      observations.push(newObservation);
    }

    newSubject = new Subject(observations, json_data.metadata[i]);
    subjects.push(newSubject);
  }
}

function fillDropdown(subjects) {
  var dw = d3.select("select");
  var t = dw.selectAll("option").data(subjects).enter().append("option")
    .attr("value", function (d, i) {
      return i;
    })
    .text(function (d) {
      return d3.select(this).node().__data__.metadata.id;
    });
  dw.on("change", change);
}

function fill_metaData(metadata) {
  var meta_data_table = d3.select("tbody");
  var trs = d3.selectAll("tr").remove();
  meta_data_table.append("tr").append("th").text("Demographic Info");
  for (var key in metadata) {
    var value = metadata[key];
    meta_data_table.append("tr").append("td").text(key + ":" + value);
  }
}

function make_barChart(otuIds, otuIdsWithPrefix, sampleValues, otuLabels) {
  var data = [{
    x: sampleValues,
    y: otuIdsWithPrefix,
    text: otuLabels,
    type: "bar",
    orientation: 'h'
  }];

  var layout = {
    title: "OTU Density",
    height: 450,
    width: 800
  };

  Plotly.newPlot("barplot", data, layout, {
    displayModeBar: false
  });
}

function make_gaugePlot(freqency) {
  // Indicator chart
  // Enter a speed between 0 and 180
  var level = freqency;
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
  var path = mainPath.concat(pathX, space, pathY, pathEnd);

  var data = [{
      type: 'scatter',
      x: [0],
      y: [0],
      marker: {
        size: 28,
        color: '850000'
      },
      showlegend: false,
      name: 'speed',
      text: level,
      hoverinfo: 'text+name'
    },
    {
      values: [50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50],
      rotation: 90,
      text: ['8-9', '7-8', '6-7', '5-6', '4-5', '3-4', '2-3', '1-2', '0-1', ''],
      textinfo: 'text',
      textposition: 'inside',
      marker: {
        colors: ['rgba(14, 127, 0, .5)', 'rgba(14, 127, 0, .5)', 'rgba(110, 154, 22, .5)',
          'rgba(170, 202, 42, .5)', 'rgba(170, 202, 42, .5)', 'rgba(202, 209, 95, .5)',
          'rgba(210, 206, 145, .5)', 'rgba(210, 206, 145, .5)', 'rgba(232, 226, 202, .5)',
          'rgba(255, 255, 255, 0)'
        ]
      },
      labels: ['8-9', '7-8', '6-7', '5-6', '4-5', '3-4', '2-3', '1-2', '0-1', ''],
      hoverinfo: 'label',
      hole: .5,
      type: 'pie',
      showlegend: false
    }
  ];

  var layout = {
    shapes: [{
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
    xaxis: {
      zeroline: false,
      showticklabels: false,
      showgrid: false,
      range: [-1, 1]
    },
    yaxis: {
      zeroline: false,
      showticklabels: false,
      showgrid: false,
      range: [-1, 1]
    }
  };
  Plotly.newPlot('indicatorPlot', data, layout, {
    displayModeBar: false
  });

}

function make_BubblePlot(otuIds, otuIdsWithPrefix, sampleValues, otuLabels) {
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
    height: 550,
    width: 1100
  };

  Plotly.newPlot('bubbleplot', data, layout, {
    displayModeBar: false
  });
}

function displaySubject(subjIdx) {

  var curSubject = subjects[subjIdx];
  var metadata = curSubject.metadata;
  fill_metaData(metadata);


  var topData = curSubject.observations.sort(function (a, b) {
    return b.sample_values - a.sample_values;
  }).slice(0, 10);

  sampleValues = [];
  otuIds = [];
  otuIdsWithPrefix = [];
  otuLabels = [];

  for (i = 0, j = topData.length - 1; i < topData.length; i++, j--) {
    sampleValues.push(topData[j].sample_values);
    otuIds.push(topData[j].otu_ids);
    otuIdsWithPrefix.push('OTU ' + topData[j].otu_ids);
    otuLabels.push(topData[j].otu_labels);
  }

  make_barChart(otuIds, otuIdsWithPrefix, sampleValues, otuLabels);
  make_gaugePlot(metadata.wfreq);
  make_BubblePlot(otuIds, otuIdsWithPrefix, sampleValues, otuLabels);

}

/*
 *  Execute this code on load
 *
 */
var subjects = [];

d3.json("data\\samples.json").then(function (json_data) {
  makeSubjectsArray(json_data);
  fillDropdown(subjects);
  displaySubject(0); // display first subject
});