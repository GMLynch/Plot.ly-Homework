
// metadata function for Demographic Info panel
function sample_metadata(newData) {
    //import id numbers()
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
function plotData(newData) {
    //import the data ()
    d3.json("samples.json").then((data) => {
        //console.log to verify file was read
        //console.log(data);

        //Retrieve id and slice for the top 10 and reverse the array to work with plotly 
        var results = data.samples.filter(ids => ids.id == newData);
        console.log(results);
        var results1 = results[0];
        //get properties
        var topSamples = results1.sample_values.slice(0, 10).reverse();
        var strtopIds = results1.otu_ids.slice(0,10).map(id=>`OTUid ${id}`).reverse();
        var toplabels = results1.otu_labels.slice(0, 10).reverse();  
        
        console.log(topSamples);
        console.log(strtopIds);
        console.log(toplabels);
        //create Trace1 for data
        var trace1 = {
            y: strtopIds,
            x: topSamples,
            text: toplabels,
            name: "OTU",
            type: "bar",
            orientation: "h",
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
            x: results1.otu_ids,
            y: results1.sample_values,
            text: results1.otu_labels, 
            mode: "markers", 
            marker: {
                color: results1.otu_ids,
                size: results1.sample_values,
                colorscale: "Earth"
            }
            
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
    });
        
};
function init() {
    //reference id in the dropdownMenu
    var dropdownMenu = d3.select("#selDataset");
    //get data
    d3.json("samples.json").then((data) => {
        var firstData = data.names
        firstData.forEach((name) => {
            dropdownMenu
            .append("option")
            .text(name)
            .property("value", name); 
        });
        var sample1 = firstData[0];
        sample_metadata(sample1);
        plotData(sample1);      
        //optionChanged(sample1[0]);
    });
}
//D3 change option event handler 
function optionChanged(newData){
    sample_metadata(newData);
    plotData(newData);
}
init();

