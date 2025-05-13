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
    const width = 960;
    const height = 500;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();
    console.log("Harita veri kontrolü:", data);

    const projection = d3
      .geoMercator()
      .scale(140)
      .translate([width / 2, height / 1.4]);

    const path = d3.geoPath().projection(projection);

    // Harcama miktarları için color scale
    const spentValues = data.map((d) => d.totalSpent);
    const colorScale = d3
      .scaleSequential(d3.interpolateYlGnBu)
      .domain([Math.min(...spentValues), Math.max(...spentValues)]);

    // GeoJSON verisini yükle
    d3.json(
      "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json"
    ).then((worldData) => {
      const countries = topojson.feature(
        worldData,
        worldData.objects.countries
      ).features;

      svg
        .attr("width", width)
        .attr("height", height)
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
    <div style={{ position: "relative" }}>
      <svg ref={svgRef}></svg>
      {tooltip.visible && (
        <div
          style={{
            position: "absolute",
            left: tooltip.x,
            top: tooltip.y,
            backgroundColor: "white",
            padding: "8px",
            border: "1px solid #ccc",
            borderRadius: "5px",
            pointerEvents: "none",
            zIndex: 999,
            fontSize: "14px",
            fontFamily: "Arial, sans-serif",
            boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
          }}
        >
          {tooltip.content}
        </div>
      )}
    </div>
  );
};

export default WorldMap;
