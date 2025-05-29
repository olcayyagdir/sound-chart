import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import cloud from "d3-cloud";
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
        .attr("width", width)
        .attr("height", height)
        .style("background", "#fff"); // .style("border", ...) SİLİNDİ

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
          .style("fill", "#333")
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
    <div style={{ textAlign: "center" }}>
      <svg ref={svgRef}></svg>
      <p style={{ marginTop: "16px", fontSize: "20px", color: "#666" }}>
        This chart is set according to the best-selling artists. The
        best-selling artist is the one who is most visible. Let's take a look at
        the best-selling artists and see if you can find the artist you like,
        and see how popular they are!
      </p>
    </div>
  );
};

export default WordCloud;
