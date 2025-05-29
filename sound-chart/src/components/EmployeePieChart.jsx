import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import axios from "axios";
import styles from "./PieChart.module.css";

const EmployeePieChart = () => {
  const svgRef = useRef();
  const [selectedEmployee, setSelectedEmployee] = useState(null);

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

      const color = d3
        .scaleOrdinal()
        .domain(data.map((d) => d.fullName))
        .range(d3.schemeTableau10);

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
      // Draw pie slices
      svg
        .append("g")
        .attr("stroke", "#fff")
        .selectAll("path")
        .data(arcs)
        .join("path")
        .attr("fill", (d) => color(d.data.fullName))
        .attr("d", arc)
        .style("cursor", "pointer")
        .on("click", async (event, d) => {
          try {
            const id = d.data.employeeId;
            console.log("Tıklanan dilimin ID'si:", id); // ✅ ID kontrol

            const detailRes = await axios.get(
              `https://soundchartbackend-gmcqc3bgfscyaced.westeurope-01.azurewebsites.net/api/employees/detail/${id}`
            );

            console.log("Gelen detay verisi:", detailRes.data); // ✅ Veri kontrol

            setSelectedEmployee(detailRes.data[0]);
          } catch (err) {
            console.error("Detay verisi alınamadı:", err);
          }
        });

      // Add labels (full name + totalSold) inside each slice
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

  return (
    <div className={styles.employeeChartWrapper}>
      <svg ref={svgRef}></svg>

      {selectedEmployee && (
        <div className={styles.employeeDetailPanel}>
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
