import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

const Graph = ({ data }) => {
  const svgRef = useRef();

  useEffect(() => {
    if (!data || data.length === 0) return;

    const genreCounts = d3.rollups(
      data,
      (v) => v.length,
      (d) => d.genre
    );

    const width = 600;
    const height = 300;
    const margin = { top: 20, right: 20, bottom: 40, left: 60 };

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove(); // temizle

    const x = d3
      .scaleBand()
      .domain(genreCounts.map(([genre]) => genre))
      .range([margin.left, width - margin.right])
      .padding(0.2);

    const y = d3
      .scaleLinear()
      .domain([0, d3.max(genreCounts, ([, count]) => count)])
      .nice()
      .range([height - margin.bottom, margin.top]);

    svg.attr("width", width).attr("height", height);

    svg
      .append("g")
      .selectAll("rect")
      .data(genreCounts)
      .join("rect")
      .attr("x", ([genre]) => x(genre))
      .attr("y", ([, count]) => y(count))
      .attr("height", ([, count]) => y(0) - y(count))
      .attr("width", x.bandwidth())
      .attr("fill", "#3b82f6");

    svg
      .append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x));

    svg
      .append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(y));
  }, [data]);

  return <svg ref={svgRef}></svg>;
};

export default Graph;
