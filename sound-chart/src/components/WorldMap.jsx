import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import * as topojson from "topojson-client";

const WorldMap = ({ data }) => {
  const svgRef = useRef();
  const [tooltip, setTooltip] = useState({
    visible: false,
    x: 0,
    y: 0,
    content: "",
  });

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();
    console.log("Harita veri kontrolü:", data);

    const width = 960;
    const height = 500;

    svg
      .attr("viewBox", `0 0 ${width} ${height}`) // ✅ responsive
      .attr("preserveAspectRatio", "xMidYMid meet") // ✅ orantılı küçülme
      .style("width", "100%") // ✅ container'a uyar
      .style("height", "auto");

    const projection = d3
      .geoMercator()
      .scale(140)
      .translate([width / 2, height / 1.4]);

    const path = d3.geoPath().projection(projection);

    const spentValues = data.map((d) => d.totalSpent);
    const colorScale = d3
      .scaleLinear()
      .domain([Math.min(...spentValues), Math.max(...spentValues)])
      .range(["#d9f99d", "#166534"]);

    d3.json(
      "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json"
    ).then((worldData) => {
      const countries = topojson.feature(
        worldData,
        worldData.objects.countries
      ).features;

      svg
        .selectAll("path")
        .data(countries)
        .join("path")
        .attr("d", path)
        .attr("fill", (d) => {
          const countryData = data.find((c) => c.countryIsoCode === +d.id);
          return countryData ? colorScale(countryData.totalSpent) : "#eee";
        })
        .attr("stroke", "#999")
        .on("mouseover", (event, d) => {
          const countryData = data.find((c) => c.countryIsoCode === +d.id);
          if (countryData && svgRef.current) {
            const svgRect = svgRef.current.getBoundingClientRect();
            setTooltip({
              visible: true,
              x: event.clientX - svgRect.left,
              y: event.clientY - svgRect.top - 40,
              content: `${
                countryData.country
              } – $${countryData.totalSpent.toFixed(2)}`,
            });
          }
        })
        .on("mousemove", (event) => {
          const svgRect = svgRef.current.getBoundingClientRect();
          setTooltip((prev) => ({
            ...prev,
            x: event.clientX - svgRect.left,
            y: event.clientY - svgRect.top - 40,
          }));
        })
        .on("mouseout", () => {
          setTooltip((prev) => ({ ...prev, visible: false }));
        });
    });
  }, [data]);

  return (
    <div
      style={{
        position: "relative",
        backgroundColor: "#111827",
        borderRadius: "16px",
        padding: "20px",
        margin: "0 auto",
        width: "100%", // ✅ container'a oturur
        maxWidth: "960px", // ✅ isteğe göre sınırlı genişlik
        boxShadow: "0 0 20px rgba(0,0,0,0.4)",
      }}
    >
      <svg ref={svgRef}></svg>
      {tooltip.visible && (
        <div
          style={{
            position: "absolute",
            left: tooltip.x,
            top: tooltip.y,
            backgroundColor: "#1f1f1f",
            color: "#e5e5e5",
            padding: "8px 12px",
            border: "1px solid #374151",
            borderRadius: "6px",
            pointerEvents: "none",
            zIndex: 999,
            fontSize: "14px",
            fontFamily: "Inter, sans-serif",
            boxShadow: "0 4px 8px rgba(0,0,0,0.3)",
            whiteSpace: "nowrap",
          }}
        >
          {tooltip.content}
        </div>
      )}
    </div>
  );
};

export default WorldMap;
