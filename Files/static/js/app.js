function init() {
    //reference id in the dropdownMenu
    var dropdownMenu = d3.select("#selDataset");
    //get data
    d3.json("samples.json").then((data) => {
        data.names.forEach((name) => {
            dropdownMenu
            .append("option")
            .text(name)
            .property("value"); 
        });
    // // capture starting data
    // const newData = data[0];
    // sample_metadata(newData);
    // plotData(newData);
    optionChanged();
    });
}
//D3 change option event handler 
function optionChanged(newData){
    sample_metadata(newData);
    plotData(newData)
}
init();
// metadata function for Demographic Info panel
function plotData(newData) {
    //import the data ()
    d3.json("samples.json").then((data) => {
        //console.log to verify file was read
        console.log(data);
        var panelData = data.metadata;
        //add filter for ids
        var panel = panelData.filter(md => md.id == newData);
        var results = panel[0];
        //Add code for dropdown menu to populate the Demographic info
        var info_data = d3.select("#sample-metadata"); 
        //clear list
        info_data.html("");
        //append the demographic Info section
        Object.entries(results).forEach(([key, value]) => {
        //verify if the code is working
        var row = info_data.append("p")
        row.text(`${key}: ${value}`);
        });

    });
};
// store data for plotting 
function sample_metadata(newData) {
    //import id numbers()
    d3.json("samples.json").then((data) => {
        //console.log to verify file was read
        //console.log(data);
        //var sampledata = data.samples;
        //var metadatas = data.metadata;
        //Retrieve id and slice for the top 10 and reverse the array to work with plotly 
        var results1 = data.samples.filter(ids => ids.id == newData)[0];
        console.log(results1);
        //get properties
        var strtopIds = results1.otu_ids.map(id=>`OTUid ${id}`).slice(0,10).reverse();
        var topSamples = results1.sample_values.slice(0, 10).reverse();
        var toplabels = results1.otu_labels.slice(0, 10).reverse();  
        console.log(toplabels);
        console.log(topSamples);
        console.log(strtopIds);
    
    });
    //create Trace1 for data
    var trace1 = {
        x: topSamples,
        y: strtopIds,
        text: toplabels,
        name: "OTU",
        type: "bar",
        orientation: "h"
    };

    //Bar Chart
    var barData = [trace1];

    //apply the group bar mode to the layout
    var layout = {
        title: "Top 10 Operational Taxonomic Units",
        margin: {
                l: 100,
                r: 100,
                t: 100,
                b: 100
        }
    };
    //render the bar plot in the bar div tag
    Plotly.newPlot("bar", barData, layout);

    //Bubble Chart
    //create trace for bubble chart
    var trace2 = {
        x: data.otu_ids,
        y: data.sample_values,
        mode: "markers", 
        marker: {
            color: data.otu_lables
        },
        text: data.otu_labels 
    }; 
    // layout"
    var layout_bubble = {
    xaxis:{title:"Top 10 OTU IDs"},
    height: 500, 
    width: 800
    };
    //capture the data and create the plot
    var bub_data = [trace2];
    Plotly.newPlot("bubble",bub_data, layout_bubble);
}


