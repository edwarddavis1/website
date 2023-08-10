export const temporalNetworkPlot = () => {
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
        const simulation = d3
            .forceSimulation()
            .force("charge", d3.forceManyBody())
            .force(
                "link",
                d3.forceLink().id((d) => d.id)
            )
            .force("x", d3.forceX())
            .force("y", d3.forceY())
            .on("tick", ticked);

        const svg = d3
            .create("svg")
            .attr("viewBox", [-width / 2, -height / 2, width, height])
            .attr("width", width)
            .attr("height", height)
            .attr("style", "max-width: 100%; height: auto;");

        let link = svg
            .append("g")
            .attr("stroke", "#999")
            .attr("stroke-opacity", 0.6)
            .selectAll("line");

        let node = svg
            .append("g")
            .attr("stroke", "#fff")
            .attr("stroke-width", 1.5)
            .selectAll("circle");

        function ticked() {
            node.attr("cx", (d) => d.x).attr("cy", (d) => d.y);

            link.attr("x1", (d) => d.source.x)
                .attr("y1", (d) => d.source.y)
                .attr("x2", (d) => d.target.x)
                .attr("y2", (d) => d.target.y);
        }

        invalidation.then(() => simulation.stop());

        return Object.assign(svg.node(), {
            update({ nodes, links }) {
                // Make a shallow copy to protect against mutation, while
                // recycling old nodes to preserve position and velocity.
                const old = new Map(node.data().map((d) => [d.id, d]));
                nodes = nodes.map((d) => ({ ...old.get(d.id), ...d }));
                links = links.map((d) => ({ ...d }));

                node = node
                    .data(nodes, (d) => d.id)
                    .join((enter) =>
                        enter
                            .append("circle")
                            .attr("r", 5)
                            .call(drag(simulation))
                            .call((node) =>
                                node.append("title").text((d) => d.id)
                            )
                    );

                link = link
                    .data(links, (d) => [d.source, d.target])
                    .join("line");

                simulation.nodes(nodes);
                simulation.force("link").links(links);
                simulation.alpha(1).restart().tick();
                ticked(); // render now!
            },
        });
    };
};
