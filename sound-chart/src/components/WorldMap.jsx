// WorldMap.jsx (tam kod)

import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import * as topojson from "topojson-client";

const WorldMap = ({
  data,
  genre,
  mediaType,
  durationRange,
  revenueRange,
  artist,
  album,
}) => {
  const svgRef = useRef();
  const [tooltip, setTooltip] = useState({
    visible: false,
    x: 0,
    y: 0,
    content: "",
  });

  const buildTooltipContent = (countryData) => {
    return `
      <strong>${countryData.country}</strong><br/>
      Total Revenue: $${countryData.totalSpent.toFixed(2)}<br/>
      <br/>
      <strong>Filters:</strong><br/>
      ${genre ? `• Genre: ${genre}<br/>` : ""}
      ${mediaType ? `• Media Type: ${mediaType}<br/>` : ""}
      ${
        durationRange[0] != null && durationRange[1] != null
          ? `• Duration: ${durationRange[0]}-${durationRange[1]} sec<br/>`
          : ""
      }
      ${
        revenueRange[0] != null && revenueRange[1] != null
          ? `• Revenue: $${revenueRange[0]}-$${revenueRange[1]}<br/>`
          : ""
      }
      ${artist ? `• Artist: ${artist}<br/>` : ""}
      ${album ? `• Album: ${album}<br/>` : ""}
    `;
  };

  //burada eslint hatası gösteriyor ama dokunmak zorunda değiliz hatasız çalışıyor ekstra bir riski de yok
  useEffect(() => {
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const width = 960;
    const height = 500;

    svg
      .attr("viewBox", `0 0 ${width} ${height}`)
      .attr("preserveAspectRatio", "xMidYMid meet")
      .style("width", "100%")
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
              content: buildTooltipContent(countryData),
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
  }, [data, genre, mediaType, durationRange, revenueRange, artist, album]);

  return (
    <div
      style={{
        position: "relative",
        backgroundColor: "#1a1a1a",
        borderRadius: "16px",
        padding: "20px",
        margin: "0 auto",
        width: "100%",
        maxWidth: "960px",
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
          dangerouslySetInnerHTML={{ __html: tooltip.content }}
        ></div>
      )}
    </div>
  );
};

export default WorldMap;
