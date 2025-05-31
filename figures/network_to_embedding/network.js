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
        // Determine node radius based on screen size and number of nodes
        const isMobile = window.innerWidth < 768;
        const nodeRadius = isMobile ? 3 : (data.nodes.length > 50 ? 3 : 5);
        const linkOpacity = data.nodes.length > 50 ? 0.4 : 0.6;
        
        const simulation = d3
            .forceSimulation(data.nodes)
            .force(
                "link",
                d3.forceLink(data.links).id((d) => d.id)
            )
            .force("charge", d3.forceManyBody().strength(isMobile ? -30 : -50))
            .force("center", d3.forceCenter(width / 2, height / 2));

        // Only draw the links if the data length is less than 100
        const link = selection
            .append("g")
            .attr("stroke", "#999")
            .attr("stroke-opacity", linkOpacity)
            .selectAll("line")
            .data(data.links)
            .join("line")
            .attr("stroke-width", (d) => Math.sqrt(d.weight))
            .attr("class", "network");

        const node = selection
            .append("g")
            .selectAll("circle")
            .data(data.nodes)
            .join("circle")
            .attr("r", nodeRadius)
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

        // Use the same isMobile variable that was defined earlier
        const hoverRadius = isMobile ? 6 : 10;

        d3.selectAll("circle")
            .on("mouseover", function (_) {
                d3.select(this).attr("r", hoverRadius);

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
                            return hoverRadius;
                        } else {
                            return nodeRadius;
                        }
                    });
            })
            .on("mouseout", function (_) {
                d3.select(this).attr("r", nodeRadius).attr("stroke", "none");

                d3.selectAll("circle")
                    .attr("fill", (d) => {
                        return d.tau == 1 ? colours[0] : colours[1];
                    })
                    .attr("r", nodeRadius);
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
