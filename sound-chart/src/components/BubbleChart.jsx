import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import axios from "axios";

const BubbleChart = () => {
  const svgRef = useRef();

  useEffect(() => {
    const fetchDataAndDraw = async () => {
      try {
        const res = await axios.get(
          "https://soundchartbackend-gmcqc3bgfscyaced.westeurope-01.azurewebsites.net/api/playlists/Bubble"
        );
        const data = res.data.filter(
          (d) => d.sale !== null && d.playlist !== null
        );
        draw(data);
      } catch (err) {
        console.error("Bubble chart verisi alınamadı:", err);
      }
    };

    const draw = (data) => {
      const width = 700;
      const height = 800;

      const svg = d3
        .select(svgRef.current)
        .attr("width", width)
        .attr("height", height)
        .style("background", "#fff");

      svg.selectAll("*").remove();

      const color = d3.scaleOrdinal(d3.schemeSet2); // ✅ sadece burada tanımlandı

      const root = d3.pack().size([width, height]).padding(5)(
        d3.hierarchy({ children: data }).sum((d) => d.sale * 1.5)
      );

      const node = svg
        .append("g")
        .attr("transform", `translate(0, 0)`)
        .selectAll("g")
        .data(root.leaves())
        .join("g")
        .attr("transform", (d) => `translate(${d.x},${d.y})`);

      node
        .append("circle")
        .attr("r", (d) => d.r)
        .attr("fill", (d) => color(d.data.name))
        .attr("fill-opacity", 0.7);

      node.append("title").text((d) => `${d.data.name}\nSale: ${d.data.sale}`);

      node
        .append("text")
        .attr("text-anchor", "middle")
        .attr("dy", "0.3em")
        .style("font-size", "10px")
        .text((d) => d.data.name.slice(0, 10));
    };

    fetchDataAndDraw();
  }, []);

  return <svg ref={svgRef}></svg>;
};

export default BubbleChart;
