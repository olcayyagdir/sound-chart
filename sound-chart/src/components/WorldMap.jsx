import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import * as topojson from "topojson-client";

const WorldMap = ({ data, selectedFilters }) => {
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

    // Varsayılan colorScale
    const colorScale = d3.scaleSequential(d3.interpolateBlues).domain([0, 100]);

    // Eğer veri varsa dinamik domain kullan
    if (data && data.length > 0) {
      const listenRates = data.map((d) => d.listen_rate);
      const minRate = Math.min(...listenRates);
      const maxRate = Math.max(...listenRates);
      colorScale.domain([minRate, maxRate]);
    }

    // Dünya haritası verisini çek
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
          if (!data || data.length === 0) return "#eee";
          const countryData = data.find((c) => c.country_code === +d.id); // string->number
          return countryData ? colorScale(countryData.listen_rate) : "#eee";
        })
        .attr("stroke", "#999")
        .on("mouseover", (event, d) => {
          const countryData = data.find((c) => c.country_code === +d.id);
          if (countryData && svgRef.current) {
            const svgRect = svgRef.current.getBoundingClientRect();
            const infoItems = [
              `${countryData.country_name} – %${countryData.listen_rate}`, // her zaman göster
              selectedFilters.genre && countryData.genre,
              selectedFilters.mediaType && countryData.media_type,
              selectedFilters.durationRange && countryData.duration_range,
              selectedFilters.composer && countryData.composer,
              selectedFilters.revenueRange && `$${countryData.unit_price}`,
            ].filter(Boolean);

            setTooltip({
              visible: true,
              x: event.clientX - svgRect.left,
              y: event.clientY - svgRect.top - 40,
              content: infoItems.join(" – "),
            });
          }
        })
        .on("mousemove", (event) => {
          if (svgRef.current) {
            const svgRect = svgRef.current.getBoundingClientRect();
            setTooltip((prev) => ({
              ...prev,
              x: event.clientX - svgRect.left,
              y: event.clientY - svgRect.top - 40,
            }));
          }
        })

        .on("mouseout", () => {
          setTooltip((prev) => ({ ...prev, visible: false }));
        });
    });
  }, [data, selectedFilters]);

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
