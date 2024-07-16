// Build the metadata panel
function buildMetadata(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {
    console.log(data);
    
    // get the metadata field
    let metadata = data.metadata;
    console.log("MetaData:", metadata);
   
    // Filter the metadata for the object with the desired sample number
    let filteredMetadata = metadata.filter(item => item.id == sample);
    let finalMetadata = filteredMetadata[0];
    
    // Use d3 to select the panel with id of `#sample-metadata`
    let metadataPanel = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
     metadataPanel.html("");

    // Inside a loop, you will need to use d3 to append new
    // tags for each key-value in the filtered metadata.
      Object.entries(finalMetadata).forEach(([key, value]) => {
        metadataPanel.append("h6").text(`${key.toUpperCase()}: ${value}`);
      });
    });
   
  }

 
// function to build both charts
function buildCharts(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the samples field
    let samples = data.samples;
    console.log("Samples:", samples);
    
    // Filter the samples for the object with the desired sample number
    
    let filteredSamples = samples.filter(item => item.id == sample);
    let finalSamples = filteredSamples[0]; 
    console.log("Filtered Samples:", filteredSamples);
    

    // Get the otu_ids, otu_labels, and sample_values
    let otu_ids = finalSamples.otu_ids;
    let otu_labels = finalSamples.otu_labels;
    let sample_values = finalSamples.sample_values;
    
    console.log("OTU IDs:", otu_ids);
    console.log("OTU Labels:", otu_labels);
    console.log("Sample Values:", sample_values);

    
    
    // Build a Bubble Chart
    let trace = {
      x: otu_ids,
      y: sample_values,
      text: otu_labels,
      mode: 'markers',
      marker: {
        size: sample_values,
        color: otu_ids,
        colorscale: 'Plasma'
      }
    };
    
    let bubbledata = [trace];
    
    let bubblelayout = {
      title: 'Bacteria Cultures Per Sample',
      showlegend: false,
      height: 600,
      width: 1400,
      xaxis: { title: 'OTU ID' },
      yaxis: { title: 'Number of Bacteria' }
    };
    
    

    // Render the Bubble Chart
    Plotly.newPlot('bubble', bubbledata, bubblelayout);

    // For the Bar Chart, map the otu_ids to a list of strings for your yticks
    let yticks = otu_ids.slice(0, 10).map(otu => `OTU ${otu}`).reverse();
    
       // Build a Bar Chart
    // Don't forget to slice and reverse the input data appropriately 
    let barData = [{
      type: 'bar',
      x: sample_values.slice(0, 10).reverse(),
      y: yticks,
      text: otu_labels.slice(0, 10).reverse(),
      orientation: 'h'
    }];

    let barLayout = {
      title: 'Top 10 Bacteria Cultures Found',
      margin: { t: 30, l: 200 }
    };




    // Render the Bar Chart
    Plotly.newPlot('bar', barData, barLayout);
  });
}

// Function to run on page load
function init() {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the names field
    let names = data.names;
    console.log("Names", names);

    // Use d3 to select the dropdown with id of `#selDataset`
    let dropdown = d3.select("#selDataset");

    // Use the list of sample names to populate the select options
    // Hint: Inside a loop, you will need to use d3 to append a new
    // option for each sample name.
 
    names.forEach((name) => {
      dropdown.append("Option").text(name).property("Value", name);
    });
    
    dropdown.on("change", function () {
      let newSample = d3.select(this).property("value");
      optionChanged(newSample);
    });

    // Get the first sample from the list
    let firstSample = data.names[0];
    console.log("First Sample:", firstSample);

    // Build charts and metadata panel with the first sample
    buildCharts(firstSample);
    buildMetadata(firstSample);
});


// Function for event listener
function optionChanged(newSample) {
  console.log("New Sample:", newSample);
  
  // Build charts and metadata panel each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}}

// Initialize the dashboard
init();
