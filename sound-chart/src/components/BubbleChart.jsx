import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import axios from "axios";
import styles from "../components/ChartSection.module.css";

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
      const width = 600;
      const height = 600;

      const svg = d3
        .select(svgRef.current)
        .attr("viewBox", `0 0 ${width} ${height}`)
        .attr("preserveAspectRatio", "xMidYMid meet")
        .style("width", "100%")
        .style("height", "auto")
        .style("background", "#0f0f0f");

      svg.selectAll("*").remove();

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
        .attr("filter", "url(#glow)");

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
        .style("font-size", (d) => `${Math.max(7, d.r / 3)}px`)
        .style("fill", "#cccccc")
        .text((d) => {
          const charLimit = Math.floor(d.r / 3);
          return d.data.name.slice(0, charLimit);
        });
    };

    fetchDataAndDraw();
  }, []);

  return (
    <div className={styles.bubbleChartWrapper}>
      <div className={styles.bubbleSvgWrapper}>
        <svg ref={svgRef}></svg>
      </div>
      <div className={styles.bubbleInfoCard}>
        <p>
          This bubble chart represents the relationship between playlists and
          their total sales. The size of each bubble corresponds to the total
          sale amount of the playlist. Larger bubbles indicate higher sales.
        </p>
      </div>
    </div>
  );
};

export default BubbleChart;
