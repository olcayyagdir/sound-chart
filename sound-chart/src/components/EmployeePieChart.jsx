import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import axios from "axios";
import styles from "./PieChart.module.css";

const EmployeePieChart = () => {
  const svgRef = useRef();
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const detailRef = useRef(); // ✅ detay kartı için yeni referans

  useEffect(() => {
    const fetchAndDraw = async () => {
      try {
        const res = await axios.get(
          "https://soundchartbackend-gmcqc3bgfscyaced.westeurope-01.azurewebsites.net/api/employees"
        ); // Pie chart data
        drawChart(res.data);
      } catch (err) {
        console.error("Pie chart verisi alınamadı:", err);
      }
    };

    const drawChart = (data) => {
      const width = 600;
      const height = 400;

      const greenScale = [
        "#006400",
        "#228B22",
        "#32CD32",
        "#3CB371",
        "#66CDAA",
        "#7CFC00",
        "#ADFF2F",
        "#C0FF70",
      ];

      const color = d3
        .scaleOrdinal()
        .domain(data.map((d) => d.fullName))
        .range(greenScale);

      const pie = d3
        .pie()
        .value((d) => d.totalSold)
        .sort(null);

      const arc = d3
        .arc()
        .innerRadius(0)
        .outerRadius(Math.min(width, height) / 2 - 10);

      const arcs = pie(data);

      const svg = d3.select(svgRef.current);
      svg.selectAll("*").remove();
      svg
        .attr("width", width)
        .attr("height", height)
        .attr("viewBox", [-width / 2, -height / 2, width, height]);

      // Draw pie slices
      svg
        .append("g")
        .attr("stroke", "#000")
        .selectAll("path")
        .data(arcs)
        .join("path")
        .attr("fill", (d) => color(d.data.fullName))
        .attr("d", arc)
        .style("cursor", "pointer")
        .on("click", async (event, d) => {
          try {
            const id = d.data.employeeId;
            const detailRes = await axios.get(
              `https://soundchartbackend-gmcqc3bgfscyaced.westeurope-01.azurewebsites.net/api/employees/detail/${id}`
            );
            setSelectedEmployee(detailRes.data[0]);
          } catch (err) {
            console.error("Detay verisi alınamadı:", err);
          }
        });

      // Add labels
      svg
        .append("g")
        .attr("text-anchor", "middle")
        .style("font", "11px sans-serif")
        .selectAll("text")
        .data(arcs)
        .join("text")
        .attr("transform", (d) => `translate(${arc.centroid(d)})`)
        .each(function (d) {
          const text = d3.select(this);
          text
            .append("tspan")
            .attr("x", 0)
            .attr("y", "-0.4em")
            .attr("font-weight", "bold")
            .text(d.data.fullName);

          text
            .append("tspan")
            .attr("x", 0)
            .attr("y", "0.9em")
            .attr("font-weight", "bold")
            .text(`$${d.data.totalSold.toFixed(2)}`);
        });
    };

    fetchAndDraw();
  }, []);

  useEffect(() => {
    const handleClick = (event) => {
      const isInsideSvg = svgRef.current?.contains(event.target);
      const isInsideDetail = detailRef.current?.contains(event.target);

      //  hem svg'ye hem karta tıklamada kartı kapat
      if (!isInsideSvg || isInsideDetail) {
        setSelectedEmployee(null);
      }
    };

    // D3 olaylarıyla çakışmaması için kısa gecikme
    setTimeout(() => {
      document.addEventListener("click", handleClick);
    }, 0);

    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, []);

  return (
    <div className={styles.employeeChartWrapper}>
      <svg ref={svgRef}></svg>

      {selectedEmployee && (
        <div className={styles.employeeDetailPanel} ref={detailRef}>
          <h3>
            {selectedEmployee.firstName} {selectedEmployee.lastName}
          </h3>
          <p>
            <strong>Title:</strong> {selectedEmployee.title}
          </p>
          <p>
            <strong>Location:</strong> {selectedEmployee.city},{" "}
            {selectedEmployee.country}
          </p>
          <p>
            <strong>About:</strong>
          </p>
          <p>{selectedEmployee.description}</p>
        </div>
      )}
    </div>
  );
};

export default EmployeePieChart;
