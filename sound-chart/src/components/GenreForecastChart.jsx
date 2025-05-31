import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import axios from "axios";

const GenreForecastChart = () => {
  const chartRef = useRef();
  const [isForecastVisible, setIsForecastVisible] = useState(true);
  const svgElements = useRef(null);

  useEffect(() => {
    const fetchDataAndDraw = async () => {
      try {
        const response = await axios.get(
          "https://soundchartbackend-gmcqc3bgfscyaced.westeurope-01.azurewebsites.net/api/ForecastFiles/genre"
        );
        const rawData = response.data;

        const data = rawData.map((d) => ({
          genre: d.genreName,
          current: +d.last3MonthsAverage,
          forecast: +d.forecast3MonthsAverage,
        }));

        // 🚫 Mevcut SVG varsa sil → TEK grafik garantisi
        d3.select(chartRef.current).select("svg").remove();

        drawChart(data);

        // ⏱ 2 saniye sonra forecast'e geç
        setTimeout(() => {
          transitionTo("forecast");
          setIsForecastVisible(true);
        }, 2000);
      } catch (error) {
        console.error("API error:", error);
      }
    };

    fetchDataAndDraw();
  }, []);

  const drawChart = (data) => {
    const width = 600;
    const height = 350;
    const margin = { top: 30, right: 30, bottom: 40, left: 60 };

    const svg = d3
      .select(chartRef.current)
      .append("svg")
      .attr("viewBox", `0 0 ${width} ${height}`)
      .style("overflow", "visible");

    const x = d3
      .scaleBand()
      .domain(data.map((d) => d.genre))
      .range([margin.left, width - margin.right])
      .padding(0.2);

    const y = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => Math.max(d.current, d.forecast)) * 1.1])
      .nice()
      .range([height - margin.bottom, margin.top]);

    svg
      .append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x));

    svg
      .append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(y));

    const bars = svg
      .selectAll(".bar")
      .data(data)
      .join("rect")
      .attr("class", "bar")
      .attr("x", (d) => x(d.genre))
      .attr("width", x.bandwidth())
      .attr("y", (d) => y(d.current))
      .attr("height", (d) => y(0) - y(d.current))
      .attr("fill", "#22c55e");

    const labels = svg
      .selectAll(".label")
      .data(data)
      .join("text")
      .attr("class", "label")
      .attr("x", (d) => x(d.genre) + x.bandwidth() / 2)
      .attr("y", (d) => y(d.current) - 5)
      .attr("text-anchor", "middle")
      .text((d) => d.current.toFixed(1))
      .style("fill", "white")
      .style("font-size", "12px");

    svgElements.current = { bars, labels, y };
  };

  const transitionTo = (targetKey) => {
    const { bars, labels, y } = svgElements.current;

    bars
      .transition()
      .duration(1000)
      .attr("y", (d) => y(d[targetKey]))
      .attr("height", (d) => y(0) - y(d[targetKey]));

    labels
      .transition()
      .duration(1000)
      .attr("y", (d) => y(d[targetKey]) - 5)
      .text((d) => d[targetKey].toFixed(1));
  };

  const handleToggle = () => {
    const nextState = !isForecastVisible;
    const targetKey = nextState ? "forecast" : "current";
    transitionTo(targetKey);
    setIsForecastVisible(nextState);
  };

  return (
    <div
      style={{
        backgroundColor: "#121212",
        padding: "16px",
        borderRadius: "10px",
        border: "2px solid #22c55e",
        boxShadow: "0 0 16px rgba(34, 197, 94, 0.4)",
        maxWidth: "800px",
        margin: "0 auto",
      }}
    >
      {/* Grafik Alanı */}
      <div
        ref={chartRef}
        style={{
          backgroundColor: "#1e1e1e",
          borderRadius: "8px",
          padding: "12px",
          boxShadow: "inset 0 0 5px rgba(0, 0, 0, 0.5)",
        }}
      ></div>

      {/* Toggle Button */}
      <div style={{ textAlign: "center", marginTop: "16px" }}>
        <button
          onClick={handleToggle}
          style={{
            padding: "8px 16px",
            backgroundColor: "#22c55e",
            border: "none",
            color: "white",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "14px",
          }}
        >
          {isForecastVisible ? "Show Current" : "Show Forecast"}
        </button>
      </div>

      {/* Açıklama Kartı */}
      <div
        style={{
          marginTop: "20px",
          backgroundColor: "#111",
          border: "1.5px ",
          borderRadius: "12px",
          padding: "18px 24px",
          color: "#ccc",
          fontSize: "15px",
          lineHeight: "1.6",
          boxShadow: "0 0 6px rgba(34, 197, 94, 0.25)",
          transition: "transform 0.3s ease, box-shadow 0.3s ease",
          textAlign: "center",
          maxWidth: "700px",
          marginLeft: "auto",
          marginRight: "auto",
        }}
        onMouseEnter={(e) =>
          (e.currentTarget.style.transform = "translateY(-4px) scale(1.01)")
        }
        onMouseLeave={(e) =>
          (e.currentTarget.style.transform = "translateY(0) scale(1)")
        }
      >
        This chart shows the comparison between the{" "}
        <strong>current average</strong> and the{" "}
        <strong>forecasted average</strong> media revenue by genre. Use the
        toggle button above to switch between the current and predicted values.
      </div>
    </div>
  );
};

export default GenreForecastChart;
