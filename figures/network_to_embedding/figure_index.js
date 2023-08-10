import { scatterPlot } from "./scatterPlot.js";
import { networkPlot } from "./network.js";
import { temporalNetworkPlot } from "./temporalNetwork.js";

const width = window.innerWidth;
const height = window.innerHeight;

const svg = d3
    .select("body")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

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
    .style("left", `${width / 2 - 200}px`)
    .style("width", "400px");

// Add ticks below the slider
const sliderTicks = sliderContainer
    .append("svg")
    .attr("width", 400)
    .attr("height", 25)
    .style("position", "absolute")
    .style("bottom", "0px")
    .style("left", `${width / 2 - 210}px`)
    .style("width", "500px")
    .attr("class", "slider-ticks");

sliderTicks
    .selectAll("text")
    .data(nList)
    .enter()
    .append("text")
    .attr("x", (d, i) => (i * 400) / (nList.length - 1) + 10)
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
    .attr("class", "plot-heading"\)
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
    const scatter = scatterPlot()
        .width(width)
        .height(height)
        .data(filteredData)
        .margin({
            top: 30,
            right: 30,
            bottom: 100,
            left: 30,
            left: width / 2,
        })
        .size(5)
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

    // const network = temporalNetworkPlot()
    //     .width(width / 2)
    //     .height(height)

    svg.call(network);

    const nList = [10, 20, 50, 100, 200, 100, 50, 20];
    // const nList = [100, 50, 20, 10];
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
        // console.log(nList[this.value]);
        update(this.value);
    });

    // setInterval(update, 2000);
}

main();
