import React, { useEffect, useState } from "react";
import styles from "./HomePage.module.css";
import WorldMap from "../components/WorldMap";
import Header from "../components/header";
import FilterPanel from "../components/FilterPanel";
import GenreStackedChart from "../components/GenreStackedChart";
import EmployeePieChart from "../components/EmployeePieChart";
import WordCloud from "../components/WorldCloud";
import BubbleChart from "../components/BubbleChart";
import chartStyles from "../components/ChartSection.module.css";
import ForecastScatterPlot from "../components/ForecastScatterPlot";
import GenreForecastChart from "../components/GenreForecastChart";

import axios from "axios";
import SectionWrapper from "../components/SectionWrapper";

const HomePage = () => {
  // Filtre state'leri
  const [genre, setGenre] = useState("");
  const [mediaType, setMediaType] = useState("");
  const [durationRange, setDurationRange] = useState([0, 0]);
  const [revenueRange, setRevenueRange] = useState([0, 0]);
  const [durationLimits, setDurationLimits] = useState({ min: 0, max: 0 });
  const [revenueLimits, setRevenueLimits] = useState({ min: 0, max: 0 });

  const [genreOptions, setGenreOptions] = useState([]);
  const [mediaTypeOptions, setMediaTypeOptions] = useState([]);

  const [artist, setArtist] = useState("");
  const [artistSuggestions, setArtistSuggestions] = useState([]);
  const [showArtistSuggestions, setShowArtistSuggestions] = useState(false);

  const [album, setAlbum] = useState("");
  const [filteredAlbums, setFilteredAlbums] = useState([]);
  const [showAlbumSuggestions, setShowAlbumSuggestions] = useState(false);

  const [mapData, setMapData] = useState([]);

  const [forecastData, setForecastData] = useState([]);

  // Reset fonksiyonu
  const handleReset = () => {
    setGenre("");
    setMediaType("");
    setArtist("");
    setAlbum("");
    setMapData([]);
    setArtistSuggestions([]);
    setFilteredAlbums([]);
    if (durationLimits.min != null && durationLimits.max != null) {
      setDurationRange([durationLimits.min, durationLimits.max]);
    }

    if (revenueLimits.min != null && revenueLimits.max != null) {
      setRevenueRange([revenueLimits.min, revenueLimits.max]);
    }
  };

  // Sayfa açıldığında genre ve mediaType opsiyonlarını al
  useEffect(() => {
    const fetchInitialOptions = async () => {
      try {
        const [genreRes, mediaRes] = await Promise.all([
          axios.get(
            "https://soundchartbackend-gmcqc3bgfscyaced.westeurope-01.azurewebsites.net/api/genres"
          ),
          axios.get(
            "https://soundchartbackend-gmcqc3bgfscyaced.westeurope-01.azurewebsites.net/api/mediaTypes"
          ),
        ]);
        setGenreOptions(genreRes.data);
        setMediaTypeOptions(mediaRes.data);
      } catch (err) {
        console.error("Filtre verileri alınamadı:", err);
      }
    };

    fetchInitialOptions();
  }, []);
  //duration ve totalspent min maxlı yap
  useEffect(() => {
    const fetchLimits = async () => {
      try {
        const [durationRes, revenueRes] = await Promise.all([
          axios.get(
            "https://soundchartbackend-gmcqc3bgfscyaced.westeurope-01.azurewebsites.net/api/durations"
          ),
          axios.get(
            "https://soundchartbackend-gmcqc3bgfscyaced.westeurope-01.azurewebsites.net/api/revenueRanges"
          ),
        ]);

        // Backend response example: { min: 30, max: 400 }
        setDurationLimits(durationRes.data);
        setDurationRange([durationRes.data.min, durationRes.data.max]);

        setRevenueLimits(revenueRes.data);
        setRevenueRange([revenueRes.data.min, revenueRes.data.max]);
      } catch (err) {
        console.error("Min/max verileri alınamadı:", err);
      }
    };

    fetchLimits();
  }, []);

  // Autocomplete için sanatçı önerisi al
  useEffect(() => {
    const fetchArtists = async () => {
      if (!artist) {
        setArtistSuggestions([]);
        return;
      }

      try {
        const res = await axios.get(
          "https://soundchartbackend-gmcqc3bgfscyaced.westeurope-01.azurewebsites.net/api/artists",
          { params: { search: artist } }
        );

        console.log("API'den gelen sanatçılar:", res.data);
        console.log("örnek sanatçı:", res.data[0]); // bunu geçici olarak ekle

        setArtistSuggestions(res.data);
      } catch (err) {
        console.error("Sanatçılar alınamadı:", err);
      }
    };

    fetchArtists();
  }, [artist]);

  // Albüm verisini al
  useEffect(() => {
    const fetchAlbums = async () => {
      if (!artist) {
        setFilteredAlbums([]);
        return;
      }

      try {
        const res = await axios.get(
          "https://soundchartbackend-gmcqc3bgfscyaced.westeurope-01.azurewebsites.net/api/albums/artistName",
          {
            params: { artistName: artist }, // backend query param ile bekliyorsa
          }
        );
        setFilteredAlbums(res.data);
      } catch (err) {
        console.error("Albüm verisi alınamadı:", err);
      }
    };

    fetchAlbums();
  }, [artist]);

  // Harita verisini filtrelere göre backend'den çek
  useEffect(() => {
    const fetchData = async () => {
      try {
        const params = {};
        if (genre) params.genre = genre;
        if (mediaType) params.mediaType = mediaType;
        if (durationRange) params.durationRange = durationRange; //değiştir min max
        if (revenueRange) params.totalSpent = revenueRange;
        if (artist) params.artist = artist;
        if (album) params.album = album;

        const response = await axios.get(
          "https://soundchartbackend-gmcqc3bgfscyaced.westeurope-01.azurewebsites.net/api/tracks/worldMap",
          {
            params,
          }
        );

        setMapData(response.data);
      } catch (error) {
        console.error("Veri çekme hatası:", error);
      }
    };

    fetchData();
  }, [genre, mediaType, durationRange, revenueRange, artist, album]);

  //Forecast Scatterplot
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          "https://soundchartbackend-gmcqc3bgfscyaced.westeurope-01.azurewebsites.net/api/ForecastFiles/country"
        );
        console.log("API response:", res.data); // 🔍 BURAYA DİKKAT
        const mapped = res.data.map((item) => ({
          countryName: item.countryName,
          last3MonthsAverage: parseFloat(item.last3MonthsAverage),
          forecast3MonthsAverage: parseFloat(item.forecast3MonthsAverage),
        }));
        console.log("Mapped forecast data:", mapped); // 🔍 BURAYA DİKKAT
        setForecastData(mapped);
      } catch (error) {
        console.error("Error fetching forecast data", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <Header />
      {/*  ABOUT SECTION */}
      <SectionWrapper id="about" className={styles.aboutSection}>
        <div className={styles.card}>
          <h3 className={styles.cardTitle}>Platform Mission</h3>
          <div className={styles.cardContent}>
            <p>
              Welcome to <strong>Sound Chart</strong> – a platform dedicated to
              visualizing the evolution of music consumption worldwide.
            </p>
            <p>
              Our goal is to show how genres, countries, and listening habits
              have shifted over the years, using interactive charts and visuals.
            </p>
          </div>
        </div>

        <div className={styles.card}>
          <h3 className={styles.cardTitle}>How We Collect Data</h3>
          <div className={styles.cardContent}>
            <p>
              We gather music data from global streaming APIs, industry reports,
              and open datasets.
            </p>
            <p>
              This data is processed by our backend to power our visualizations
              and machine learning-based predictions.
            </p>
          </div>
        </div>
      </SectionWrapper>

      {/* 🎛️ FİLTRE PANELİ */}
      <SectionWrapper id="filter">
        <h2 className={styles.sectionHeading}>Filters</h2>
        <FilterPanel
          genre={genre}
          setGenre={setGenre}
          genreOptions={genreOptions}
          mediaType={mediaType}
          setMediaType={setMediaType}
          mediaTypeOptions={mediaTypeOptions}
          durationRange={durationRange}
          setDurationRange={setDurationRange}
          revenueRange={revenueRange}
          setRevenueRange={setRevenueRange}
          durationLimits={durationLimits}
          revenueLimits={revenueLimits}
          artist={artist}
          setArtist={setArtist}
          artistSuggestions={artistSuggestions}
          setArtistSuggestions={setArtistSuggestions}
          showArtistSuggestions={showArtistSuggestions}
          setShowArtistSuggestions={setShowArtistSuggestions}
          album={album}
          setAlbum={setAlbum}
          filteredAlbums={filteredAlbums}
          setFilteredAlbums={setFilteredAlbums}
          showAlbumSuggestions={showAlbumSuggestions}
          setShowAlbumSuggestions={setShowAlbumSuggestions}
          onReset={handleReset}
        />
      </SectionWrapper>

      {/*  HARİTA */}
      <SectionWrapper id="map" className={styles.mapSection}>
        <h2 className={styles.sectionHeading}>
          {genre ? `${genre.toUpperCase()} Listening Rates` : "Sale Rates"}
        </h2>
        <WorldMap
          data={mapData}
          genre={genre}
          mediaType={mediaType}
          durationRange={durationRange}
          revenueRange={revenueRange}
          artist={artist}
          album={album}
        />
      </SectionWrapper>

      <div className={styles.sectionDivider}></div>
      <SectionWrapper id="graph" className={styles.chartSection}>
        <h3 className={styles.sectionHeading}>Genre Distribution by Country</h3>

        <GenreStackedChart />
      </SectionWrapper>

      <div className={styles.sectionDivider}></div>

      <SectionWrapper id="employee" className={styles.EmployeePieChart}>
        <h3 className={styles.sectionHeading}>Employee Contribution Chart</h3>
        <EmployeePieChart />
      </SectionWrapper>

      <div className={styles.sectionDivider}></div>

      <SectionWrapper className={chartStyles.chartSection}>
        <h3 className={styles.sectionHeading}>WordCloud for Artists</h3>
        <WordCloud />
      </SectionWrapper>

      <SectionWrapper className={chartStyles.chartBlock}>
        <h3 className={styles.sectionHeading}>Playlist-Sale Relation</h3>
        <BubbleChart />
      </SectionWrapper>

      <div className={styles.sectionDivider}></div>

      {/* 📊 PREDICTION PLACEHOLDER */}
      <SectionWrapper id="prediction" className={styles.chartSection}>
        <h3 className={styles.sectionHeading}>Forecast Spending Scatterplot</h3>
        <ForecastScatterPlot data={forecastData} />
      </SectionWrapper>

      <SectionWrapper id="prediction" className={styles.chartSection}>
        <h3 className={styles.sectionHeading}>Forecast Spending Comparison</h3>
        <GenreForecastChart />
      </SectionWrapper>
    </div>
  );
};

export default HomePage;
