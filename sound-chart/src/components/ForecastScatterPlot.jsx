import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

const ForecastScatterPlot = ({ data }) => {
  const svgRef = useRef();

  useEffect(() => {
    if (!data || data.length === 0) return;

    const safeData = data.filter(
      (d) => d.last3MonthsAverage > 0 && d.forecast3MonthsAverage > 0
    );
    if (safeData.length === 0) return;

    const margin = { top: 40, right: 40, bottom: 100, left: 60 };
    const width = 900;
    const height = 500;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    svg.attr("viewBox", [0, 0, width, height]).style("font", "10px sans-serif");

    const countries = safeData.map((d) => d.countryName);

    const x = d3
      .scalePoint()
      .domain(countries)
      .range([margin.left, width - margin.right])
      .padding(0.5);

    const y = d3
      .scaleLinear()
      .domain(
        d3.extent([
          ...safeData.map((d) => d.last3MonthsAverage),
          ...safeData.map((d) => d.forecast3MonthsAverage),
        ])
      )
      .nice()
      .range([height - margin.bottom, margin.top]);

    // Tooltip div
    const tooltip = d3
      .select("body")
      .append("div")
      .attr("class", "tooltip")
      .style("position", "absolute")
      .style("background", "#222")
      .style("color", "#fff")
      .style("padding", "6px 10px")
      .style("border-radius", "6px")
      .style("pointer-events", "none")
      .style("font-size", "12px")
      .style("opacity", 0);

    // X axis
    svg
      .append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x))
      .selectAll("text")
      .attr("fill", "#fff")
      .attr("transform", "rotate(-35)")
      .style("text-anchor", "end");

    // Y axis
    svg
      .append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(y).ticks(20))
      .call((g) => g.selectAll("text").attr("fill", "#fff"))
      .append("text")
      .attr("x", 10)
      .attr("y", margin.top - 20)
      .attr("fill", "#fff")
      .attr("text-anchor", "start")
      .text("USD");

    // Dots, lines and labels
    safeData.forEach((d) => {
      const baseX = x(d.countryName);
      const offset = 12;

      const x1 = baseX - offset;
      const x2 = baseX + offset;
      const y1 = y(d.last3MonthsAverage);
      const y2 = y(d.forecast3MonthsAverage);

      // çizgi
      svg
        .append("line")
        .attr("x1", x1)
        .attr("y1", y1)
        .attr("x2", x1) // çizgi animasyonlu açılacak
        .attr("y2", y1)
        .attr("stroke", "#999")
        .attr("stroke-width", 1)
        .transition()
        .duration(800)
        .attr("x2", x2)
        .attr("y2", y2);

      // current point (gri) + animasyon + tooltip
      svg
        .append("circle")
        .attr("cx", x1)
        .attr("cy", height) // aşağıdan gelsin
        .attr("r", 5)
        .attr("fill", "gray")
        .attr("stroke", "#333")
        .transition()
        .duration(800)
        .attr("cy", y1);

      svg
        .append("circle")
        .attr("cx", x1)
        .attr("cy", y1)
        .attr("r", 5)
        .attr("fill", "transparent")
        .on("mouseover", (event) => {
          tooltip
            .style("opacity", 1)
            .html(
              `<strong>${d.countryName}</strong><br/>
           Current: ${d.last3MonthsAverage.toFixed(2)}<br/>
           Forecast: ${d.forecast3MonthsAverage.toFixed(2)}`
            )
            .style("left", event.pageX + 10 + "px")
            .style("top", event.pageY - 28 + "px");
        })
        .on("mousemove", (event) => {
          tooltip
            .style("left", event.pageX + 10 + "px")
            .style("top", event.pageY - 28 + "px");
        })
        .on("mouseout", () => {
          tooltip.style("opacity", 0);
        });

      // forecast point (yeşil/kırmızı) + animasyon + tooltip
      svg
        .append("circle")
        .attr("cx", x2)
        .attr("cy", height) // aşağıdan gelsin
        .attr("r", 5)
        .attr(
          "fill",
          d.forecast3MonthsAverage > d.last3MonthsAverage ? "green" : "red"
        )
        .attr("stroke", "#333")
        .transition()
        .duration(800)
        .attr("cy", y2);

      svg
        .append("circle")
        .attr("cx", x2)
        .attr("cy", y2)
        .attr("r", 5)
        .attr("fill", "transparent")
        .on("mouseover", (event) => {
          tooltip
            .style("opacity", 1)
            .html(
              `<strong>${d.countryName}</strong><br/>
           Current: ${d.last3MonthsAverage.toFixed(2)}<br/>
           Forecast: ${d.forecast3MonthsAverage.toFixed(2)}`
            )
            .style("left", event.pageX + 10 + "px")
            .style("top", event.pageY - 28 + "px");
        })
        .on("mousemove", (event) => {
          tooltip
            .style("left", event.pageX + 10 + "px")
            .style("top", event.pageY - 28 + "px");
        })
        .on("mouseout", () => {
          tooltip.style("opacity", 0);
        });

      // label (ülke adı) animasyonlu gelsin
      svg
        .append("text")
        .attr("x", (x1 + x2) / 2)
        .attr("y", 0) // yukarıdan gelsin
        .text(d.countryName)
        .style("font-size", "10px")
        .style("fill", "#fff")
        .attr("text-anchor", "middle")
        .transition()
        .duration(800)
        .attr("y", (y1 + y2) / 2 - 8);
    });

    // Legend
    svg
      .append("circle")
      .attr("cx", width - 150)
      .attr("cy", 20)
      .attr("r", 5)
      .attr("fill", "gray");
    svg
      .append("text")
      .attr("x", width - 140)
      .attr("y", 24)
      .text("Current")
      .style("font-size", "10px")
      .attr("fill", "#fff");

    svg
      .append("circle")
      .attr("cx", width - 80)
      .attr("cy", 20)
      .attr("r", 5)
      .attr("fill", "green");
    svg
      .append("text")
      .attr("x", width - 70)
      .attr("y", 24)
      .text("Increase")
      .style("font-size", "10px")
      .attr("fill", "#fff");

    svg
      .append("circle")
      .attr("cx", width - 80)
      .attr("cy", 40)
      .attr("r", 5)
      .attr("fill", "red");
    svg
      .append("text")
      .attr("x", width - 70)
      .attr("y", 44)
      .text("Decrease")
      .style("font-size", "10px")
      .attr("fill", "#fff");
  }, [data]);

  return (
    <div
      style={{
        backgroundColor: "#121212",
        padding: "16px",
        borderRadius: "10px",
        border: "2px solid #22c55e",
        boxShadow: "0 0 16px rgba(34, 197, 94, 0.4)",
        maxWidth: "1000px",
        margin: "0 auto",
      }}
    >
      {/* Grafik Alanı */}
      <div
        style={{
          backgroundColor: "#1e1e1e",
          borderRadius: "8px",
          padding: "12px",
          boxShadow: "inset 0 0 5px rgba(0, 0, 0, 0.5)",
        }}
      >
        <svg ref={svgRef} width="100%" height="500" />
      </div>

      {/* Açıklama Kartı */}
      <div
        style={{
          marginTop: "20px",
          backgroundColor: "#111",
          border: "1.5px",
          borderRadius: "12px",
          padding: "18px 24px",
          color: "#cccccc",
          fontSize: "15px",
          lineHeight: "1.6",
          boxShadow: "0 0 6px rgba(34, 197, 94, 0.25)",
          maxWidth: "800px",
          marginLeft: "auto",
          marginRight: "auto",
          textAlign: "center",
        }}
        onMouseEnter={(e) =>
          (e.currentTarget.style.transform = "translateY(-4px) scale(1.01)")
        }
        onMouseLeave={(e) =>
          (e.currentTarget.style.transform = "translateY(0) scale(1)")
        }
      >
        This chart visualizes the <strong>forecasted change</strong> in average
        media sales values for the upcoming 3 months, compared to the previous
        3-month average, for each country. <br />
        <span style={{ color: "#aaa" }}>
          Gray dots show the current average, green indicates an expected
          increase, and red indicates a forecasted decrease.
        </span>
      </div>
    </div>
  );
};

export default ForecastScatterPlot;
