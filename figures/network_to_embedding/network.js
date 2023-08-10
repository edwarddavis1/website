export const networkPlot = () => {
    let width;
    let height;
    let data;
    let colours = [
        "#41b6c4",
        "#CA054D",
        "#3B1C32",
        "#B96D40",
        "#F9C846",
        "#6153CC",
    ];

    const my = (selection) => {
        // const myTransition = d3.transition().duration(1000);

        const simulation = d3
            .forceSimulation(data.nodes)
            .force(
                "link",
                d3.forceLink(data.links).id((d) => d.id)
            )
            .force("charge", d3.forceManyBody())
            .force("center", d3.forceCenter(width / 2, height / 2));

        // Only draw the links if the data length is less than 100
        const link = selection
            .append("g")
            .attr("stroke", "#999")
            .attr("stroke-opacity", 0.6)
            .selectAll("line")
            .data(data.links)
            .join("line")
            .attr("stroke-width", (d) => Math.sqrt(d.weight))
            .attr("class", "network");

        const node = selection
            .append("g")
            // .attr("stroke", "#fff")
            // .attr("stroke-width", 1.5)
            .selectAll("circle")
            .data(data.nodes)
            .join("circle")
            .attr("r", 5)
            .attr("fill", (d) => (d.tau == 1 ? colours[0] : colours[1]))
            .attr("class", "network")
            .attr("id", (d) => d.id);

        node.append("title").text((d) => d.id);

        simulation.on("tick", () => {
            if (data.nodes.length <= 20) {
                link.attr("x1", (d) => d.source.x)
                    .attr("y1", (d) => d.source.y)
                    .attr("x2", (d) => d.target.x)
                    .attr("y2", (d) => d.target.y);
            }

            node.attr("cx", (d) => d.x).attr("cy", (d) => d.y);
        });

        d3.selectAll("circle")
            .on("mouseover", function (_) {
                d3.select(this).attr("r", 10);

                d3.selectAll("circle")
                    .attr("fill", (d) => {
                        if (d.id == this.id) {
                            return colours[4];
                        } else {
                            return d.tau == 1 ? colours[0] : colours[1];
                        }
                    })
                    .attr("r", (d) => {
                        if (d.id == this.id) {
                            return 10;
                        } else {
                            return 5;
                        }
                    });
            })
            .on("mouseout", function (_) {
                d3.select(this).attr("r", 5).attr("stroke", "none");

                d3.selectAll("circle")
                    .attr("fill", (d) => {
                        return d.tau == 1 ? colours[0] : colours[1];
                    })
                    .attr("r", 5);
            });
    };
    my.width = function (_) {
        return arguments.length ? ((width = _), my) : width;
    };
    my.height = function (_) {
        return arguments.length ? ((height = _), my) : height;
    };
    my.data = function (_) {
        return arguments.length ? ((data = _), my) : data;
    };
    my.get_node = function (id) {
        return data.nodes.filter((d) => d.id == id)[0];
    };
    return my;
};
