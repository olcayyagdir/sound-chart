import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import axios from "axios";

const GenreStackedChart = () => {
  const svgRef = useRef();

  useEffect(() => {
    const fetchDataAndDraw = async () => {
      const res = await axios.get(
        "https://soundchartbackend-gmcqc3bgfscyaced.westeurope-01.azurewebsites.net/api/genres/Stacked"
      );
      const rawData = res.data;

      const grouped = d3.group(rawData, (d) => d.country);
      const transformedData = Array.from(grouped, ([country, entries]) => {
        const obj = { country };
        entries.forEach(({ genre, totalSpent }) => {
          obj[genre] = totalSpent;
        });
        return obj;
      });

      const allGenres = Array.from(new Set(rawData.map((d) => d.genre)));

      const width = 1100;
      const height = transformedData.length * 25 + 40;
      const margin = { top: 30, right: 20, bottom: 30, left: 160 };

      const x = d3
        .scaleLinear()
        .domain([
          0,
          d3.max(transformedData, (d) => d3.sum(allGenres, (g) => d[g] || 0)),
        ])
        .range([margin.left, width - margin.right - 200]);

      const y = d3
        .scaleBand()
        .domain(transformedData.map((d) => d.country))
        .range([margin.top, height - margin.bottom])
        .padding(0.2);

      const color = d3
        .scaleOrdinal()
        .domain(allGenres)
        .range(d3.schemeTableau10);

      const stack = d3
        .stack()
        .keys(allGenres)
        .value((d, key) => d[key] || 0);
      const series = stack(transformedData);

      const svg = d3
        .select(svgRef.current)
        .attr("viewBox", `0 0 ${width} ${height}`)
        .attr("preserveAspectRatio", "xMidYMid meet")
        .style("width", "100%")
        .style("height", "auto")
        .style("background", "#0f0f0f");

      svg.selectAll("*").remove();

      svg
        .append("g")
        .selectAll("g")
        .data(series)
        .join("g")
        .attr("fill", (d) => color(d.key))
        .selectAll("rect")
        .data((d) =>
          d.map((v) => ({
            ...v,
            genre: d.key, // genre burada her rect'e ekleniyor
          }))
        )
        .join("rect")
        .attr("x", (d) => x(d[0]))
        .attr("y", (d) => y(d.data.country))
        .attr("width", (d) => x(d[1]) - x(d[0]))
        .attr("height", y.bandwidth())
        .append("title")
        .text((d) => {
          const value = d[1] - d[0];
          const formattedValue = new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
            minimumFractionDigits: 2,
          }).format(value);

          return `${d.genre} in ${d.data.country}: ${formattedValue}`;
        });

      svg
        .append("g")
        .attr("transform", `translate(0,${margin.top})`)
        .call(
          d3
            .axisTop(x)
            .ticks(10) // ➕ daha fazla aralık (örn: 10 tick)
            .tickFormat(d3.format("$.2s")) // ➕ "$1.2k", "$2M" gibi okunabilir para biçimi
        )
        .call((g) => g.selectAll(".domain").remove());

      svg
        .append("g")
        .attr("transform", `translate(${margin.left},0)`)
        .call(d3.axisLeft(y))
        .call((g) => g.selectAll(".domain").remove());

      const legend = svg
        .append("g")
        .attr("transform", `translate(${width - 180},${margin.top})`)
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
        .attr("fill", "white")
        .style("font-size", "12px");
    };

    fetchDataAndDraw();
  }, []);

  return (
    <div style={{ width: "100%", overflowX: "auto" }}>
      <svg ref={svgRef}></svg>
      <h3 style={{ textAlign: "center", color: "#ccc", marginBottom: "12px" }}>
        Each bar shows how much each genre contributes to total revenue per
        country.
      </h3>
    </div>
  );
};

export default GenreStackedChart;
