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
        .style("background", "#0f0f0f");

      svg.selectAll("*").remove();

      //  Glow filtresi (yeşilimsi parıltı)
      svg.append("defs").append("filter").attr("id", "glow").html(`
          <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        `);

      const greenPalette = [
        "#006400",
        "#228B22",
        "#32CD32",
        "#3CB371",
        "#66CDAA",
        "#7CFC00",
        "#00FA9A",
        "#90EE90",
        "#2E8B57",
        "#00C957",
        "#50C878",
      ];

      const names = data.map((d) => d.name);

      const color = d3.scaleOrdinal().domain(names).range(greenPalette);

      const root = d3.pack().size([width, height]).padding(5)(
        d3.hierarchy({ children: data }).sum((d) => d.sale)
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
        .attr("fill-opacity", 0.85)
        .attr("filter", "url(#glow)"); //  Glow uygulanıyor

      node
        .append("title")
        .text(
          (d) => `Playlist: ${d.data.name}\nSale: $${d.data.sale.toFixed(2)}`
        );

      node
        .filter((d) => d.r > 25)
        .append("text")
        .attr("text-anchor", "middle")
        .attr("dy", "0.3em")
        .style("font-size", (d) => `${Math.min(10, d.r / 2.5)}px`)
        .style("fill", "#ffffff")
        .text((d) => {
          const charLimit = Math.floor(d.r / 3);
          return d.data.name.slice(0, charLimit);
        });
    };

    fetchDataAndDraw();
  }, []);

  return <svg ref={svgRef}></svg>;
};

export default BubbleChart;
