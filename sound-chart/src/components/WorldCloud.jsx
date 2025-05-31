import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import cloud from "d3-cloud";
import styles from "../components/ChartSection.module.css";
import axios from "axios";

const WordCloud = () => {
  const svgRef = useRef();

  useEffect(() => {
    const fetchDataAndDraw = async () => {
      try {
        const res = await axios.get(
          "https://soundchartbackend-gmcqc3bgfscyaced.westeurope-01.azurewebsites.net/api/Artists/Cloud"
        );
        let data = res.data;
        data = data.sort((a, b) => b.sale - a.sale).slice(0, 100); // <— Kelime sayısını burada kontrol et

        drawWordCloud(data);
      } catch (err) {
        console.error("Word Cloud verisi alınamadı:", err);
      }
    };

    const drawWordCloud = (data) => {
      const width = 900;
      const height = 300;

      const svg = d3
        .select(svgRef.current)
        .attr("viewBox", `0 0 ${width} ${height}`) // Responsive ölçek
        .attr("preserveAspectRatio", "xMidYMid meet")
        .style("width", "100%")
        .style("height", "auto")
        .style("background", "#0f0f0f");

      svg.selectAll("*").remove();

      const processedWords = data.map((d) => ({
        text: d.name,
        size: d.sale,
      }));

      const layout = cloud()
        .size([width, height])
        .words(processedWords)
        .padding(2)
        .rotate(() => 0)
        .font("Impact")
        .fontSize((d) => Math.sqrt(d.size) * 2.5)
        .on("end", draw);

      layout.start();

      function draw(words) {
        svg
          .append("g")
          .attr("transform", `translate(${width / 2}, ${height / 2})`)
          .selectAll("text")
          .data(words)
          .join("text")
          .style("font-size", (d) => `${d.size}px`)
          .style("fill", "#006400")
          .style("font-family", "Impact")
          .attr("text-anchor", "middle")
          .attr(
            "transform",
            (d) => `translate(${d.x},${d.y}) rotate(${d.rotate})`
          )
          .text((d) => d.text);
      }
    };

    fetchDataAndDraw();
  }, []);

  return (
    <div style={{ textAlign: "center", width: "100%" }}>
      <svg ref={svgRef}></svg>
      <div className={styles.wordCloudInfoCard}>
        This chart is set according to the best-selling artists. The
        best-selling artist is the one who is most visible. Let's take a look at
        the best-selling artists and see if you can find the artist you like,
        and see how popular they are!
      </div>
    </div>
  );
};

export default WordCloud;
