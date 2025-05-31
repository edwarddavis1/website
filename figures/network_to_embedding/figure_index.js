import { scatterPlot } from "./scatterPlot.js";
import { networkPlot } from "./network.js";
import { temporalNetworkPlot } from "./temporalNetwork.js";

// Initialize width and height based on window size
let width = window.innerWidth;
let height = window.innerHeight;
let isMobile = width < 768;

// Create an SVG container with a responsive wrapper
const svgContainer = d3
    .select("body")
    .append("div")
    .attr("class", "svg-container");

const svg = svgContainer
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("viewBox", `0 0 ${width} ${height}`)
    .attr("preserveAspectRatio", "xMidYMid meet");

// Load data from data.json
async function loadGraph(n) {
    const data = await d3.json("./data/graph_n=" + n + ".json");
    return data;
}

// Load data from plot_df.csv
async function loadEmbedding() {
    const data = await d3.csv("./data/plot_df.csv");
    return data;
}

const sliderContainer = d3.select("body").append("div").attr("class", "slider");

const nList = [10, 20, 50, 100, 200];

// Calculate slider position based on screen size
const sliderWidth = isMobile ? Math.min(width - 40, 300) : 400;
const sliderLeft = isMobile ? (width / 2) - (sliderWidth / 2) : (width / 2) - 200;

const slider = sliderContainer
    .append("input")
    .attr("type", "range")
    .attr("min", 0)
    .attr("max", nList.length - 1)
    .attr("step", 1)
    .attr("value", 0)
    .attr("class", "slider")
    .style("position", "absolute")
    .style("bottom", "30px")
    .style("left", `${sliderLeft}px`)
    .style("width", `${sliderWidth}px`);

// Add ticks below the slider
const sliderTicks = sliderContainer
    .append("svg")
    .attr("width", sliderWidth + 20)
    .attr("height", 25)
    .style("position", "absolute")
    .style("bottom", "0px")
    .style("left", `${sliderLeft - 10}px`)
    .style("width", `${sliderWidth + 20}px`)
    .attr("class", "slider-ticks");

sliderTicks
    .selectAll("text")
    .data(nList)
    .enter()
    .append("text")
    .attr("x", (d, i) => (i * sliderWidth) / (nList.length - 1) + 10)
    .attr("y", 20)
    .attr("text-anchor", "middle")
    .text((d) => d);

// Add text above the network plot
svg.append("text")
    .attr("x", 10)
    .attr("y", 20)
    .attr("class", "plot-heading")
    .attr("fill", "grey")
    .text("Network");

svg.append("text")
    .attr("x", width / 2 + 10)
    .attr("y", 20)
    .attr("class", "plot-heading")
    .attr("fill", "grey")
    .text("Network Embedding");

// Create a network plot from the data
async function main() {
    // log the slider value
    slider.on("input", function () {
        console.log(nList[this.value]);
    });

    let n = 10;

    const embeddingData = await loadEmbedding();
    const filteredData = embeddingData.filter((d) => d.n == n);
    
    // Calculate appropriate point size based on screen size
    const pointSize = isMobile ? 3 : 5;
    
    // Set margins based on screen size
    const margins = isMobile ? 
        {
            top: 20,
            right: 20,
            bottom: 50,
            left: 20,
            left: width / 2,
        } : 
        {
            top: 30,
            right: 30,
            bottom: 100,
            left: 30,
            left: width / 2,
        };
    
    const scatter = scatterPlot()
        .width(width)
        .height(height)
        .data(filteredData)
        .margin(margins)
        .size(pointSize)
        .xValue((d) => d.x_emb)
        .yValue((d) => d.y_emb)
        .yAxisLabel("Embedding Dimension 2")
        .xAxisLabel("Embedding Dimension 1")
        .xDomain(d3.extent(embeddingData, (d) => d.x_emb))
        .yDomain([
            -d3.max(embeddingData, (d) => d.y_emb),
            d3.max(embeddingData, (d) => d.y_emb),
        ])
        .colourValue((d) => d.tau);

    svg.call(scatter);

    const graphData = await loadGraph(n);
    const network = networkPlot()
        .width(width / 2)
        .height(height)
        .data(graphData);

    svg.call(network);

    const nList = [10, 20, 50, 100, 200];
    let graphDataList = [];
    for (let i = 0; i < nList.length; i++) {
        graphDataList.push(await loadGraph(nList[i]));
    }
    let i = 0;
    function update(i) {
        n = nList[i];

        // remove all network class things
        svg.selectAll(".network").remove();

        scatter.data(embeddingData.filter((d) => d.n == n));
        svg.call(scatter);

        network.data(graphDataList[i]);
        svg.call(network);
    }

    // log the slider value
    slider.on("input", function () {
        update(this.value);
    });
    
    // Handle window resize events
    window.addEventListener('resize', function() {
        // Update width and height
        width = window.innerWidth;
        height = window.innerHeight;
        isMobile = width < 768;
        
        // Update SVG dimensions
        svg.attr("width", width)
           .attr("height", height)
           .attr("viewBox", `0 0 ${width} ${height}`);
           
        // Recalculate slider position
        const sliderWidth = isMobile ? Math.min(width - 40, 300) : 400;
        const sliderLeft = isMobile ? (width / 2) - (sliderWidth / 2) : (width / 2) - 200;
        
        slider.style("left", `${sliderLeft}px`)
              .style("width", `${sliderWidth}px`);
              
        sliderTicks
            .attr("width", sliderWidth + 20)
            .style("left", `${sliderLeft - 10}px`)
            .style("width", `${sliderWidth + 20}px`);
            
        // Update tick positions
        sliderTicks.selectAll("text")
            .attr("x", (d, i) => (i * sliderWidth) / (nList.length - 1) + 10);
        
        // Re-render visualisations with new dimensions
        const currentIdx = +slider.property("value");
        
        // Update the scatter plot and network with new dimensions
        scatter.width(width)
               .height(height)
               .margin(isMobile ? 
                  {top: 20, right: 20, bottom: 50, left: 20, left: width / 2} : 
                  {top: 30, right: 30, bottom: 100, left: 30, left: width / 2})
               .size(isMobile ? 3 : 5);
               
        network.width(width / 2)
               .height(height);
               
        update(currentIdx);
    });
}

main();
