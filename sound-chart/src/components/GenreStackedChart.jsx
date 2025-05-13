import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import axios from "axios";

const GenreStackedChart = () => {
  const svgRef = useRef();

  useEffect(() => {
    const fetchDataAndDraw = async () => {
      const res = await axios.get("https://localhost:7020/api/genres/Stacked");
      const rawData = res.data;

      // Step 1: Veriyi dönüştür → [{ country: "USA", Rock: 300, Jazz: 150 }, ...]
      const grouped = d3.group(rawData, (d) => d.country);

      const transformedData = Array.from(grouped, ([country, entries]) => {
        const obj = { country };
        entries.forEach(({ genre, totalSpent }) => {
          obj[genre] = totalSpent;
        });
        return obj;
      });

      const allGenres = Array.from(new Set(rawData.map((d) => d.genre)));

      // Step 2: SVG setup
      const width = 900;
      const height = transformedData.length * 35 + 40;
      const margin = { top: 30, right: 20, bottom: 30, left: 100 };

      const svg = d3.select(svgRef.current);
      svg.selectAll("*").remove();
      svg.attr("width", width).attr("height", height);

      // Stack işlemi
      const stack = d3
        .stack()
        .keys(allGenres)
        .value((d, key) => d[key] || 0); // boş değerleri 0 yap

      const series = stack(transformedData);

      const x = d3
        .scaleLinear()
        .domain([0, d3.max(series, (s) => d3.max(s, (d) => d[1]))])
        .range([margin.left, width - margin.right]);

      const y = d3
        .scaleBand()
        .domain(transformedData.map((d) => d.country))
        .range([margin.top, height - margin.bottom])
        .padding(0.2);

      const color = d3
        .scaleOrdinal()
        .domain(allGenres)
        .range(d3.schemeTableau10);

      // Draw stacked bars
      svg
        .append("g")
        .selectAll("g")
        .data(series)
        .join("g")
        .attr("fill", (d) => color(d.key))
        .selectAll("rect")
        .data((d) => d)
        .join("rect")
        .attr("x", (d) => x(d[0]))
        .attr("y", (d) => y(d.data.country))
        .attr("width", (d) => x(d[1]) - x(d[0]))
        .attr("height", y.bandwidth())
        .append("title")
        .text((d) => `${d.data.country} – ${d[1] - d[0]}`);

      // X Axis
      svg
        .append("g")
        .attr("transform", `translate(0,${margin.top})`)
        .call(d3.axisTop(x).ticks(width / 100, "s"))
        .call((g) => g.selectAll(".domain").remove());

      // Y Axis
      svg
        .append("g")
        .attr("transform", `translate(${margin.left},0)`)
        .call(d3.axisLeft(y))
        .call((g) => g.selectAll(".domain").remove());

      // Legend
      const legend = svg
        .append("g")
        .attr(
          "transform",
          `translate(${width - margin.right - 120},${margin.top})`
        )
        .selectAll("g")
        .data(allGenres)
        .join("g")
        .attr("transform", (d, i) => `translate(0,${i * 20})`);

      legend
        .append("rect")
        .attr("width", 15)
        .attr("height", 15)
        .attr("fill", (d) => color(d));

      legend
        .append("text")
        .attr("x", 20)
        .attr("y", 12)
        .text((d) => d)
        .style("font-size", "12px");
    };

    fetchDataAndDraw();
  }, []);

  return <svg ref={svgRef}></svg>;
};

export default GenreStackedChart;
