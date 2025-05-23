import React, { useEffect, useState } from "react";
import styles from "./HomePage.module.css";
import WorldMap from "../components/WorldMap";
import Header from "../components/header";
import FilterPanel from "../components/FilterPanel";
import GenreStackedChart from "../components/GenreStackedChart";
import axios from "axios";

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

  // Reset fonksiyonu
  const handleReset = () => {
    setGenre("");
    setMediaType("");
    setDurationRange("");
    setRevenueRange("");
    setArtist("");
    setAlbum("");
    setMapData([]);
    setArtistSuggestions([]);
    setFilteredAlbums([]);
  };

  // Sayfa açıldığında genre ve mediaType opsiyonlarını al
  useEffect(() => {
    const fetchInitialOptions = async () => {
      try {
        const [genreRes, mediaRes] = await Promise.all([
          axios.get("https://localhost:7020/api/genres"),
          axios.get("https://localhost:7020/api/mediaTypes"),
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
          axios.get("https://localhost:7020/api/durations"),
          axios.get("https://localhost:7020/api/revenueRanges"),
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

  // Artist input'a yazıldıkça backend'den öneri getir
  useEffect(() => {
    const fetchArtists = async () => {
      if (!artist) {
        setArtistSuggestions([]);
        return;
      }

      try {
        const res = await axios.get("https://localhost:7020/api/artists", {
          params: { search: artist },
        });
        setArtistSuggestions(res.data);
      } catch (err) {
        console.error("Sanatçılar alınamadı:", err);
      }
    };

    fetchArtists();
  }, [artist]);

  // Artist seçildiyse albümleri al
  useEffect(() => {
    const fetchAlbums = async () => {
      if (!artist) {
        setFilteredAlbums([]);
        return;
      }

      try {
        const res = await axios.get("https://localhost:7020/api/albums", {
          params: { artist },
        });
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
          "https://localhost:7020/api/tracks/worldMap",
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

  return (
    <>
      <Header />

      {/* 📘 ABOUT SECTION */}
      <section id="about" className={styles.aboutSection}>
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>About Us</h2>
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
          <h2 className={styles.cardTitle}>How We Collect Data</h2>
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
      </section>

      {/* 🎛️ FİLTRE PANELİ */}
      <section id="filter">
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
      </section>

      {/* 🌍 HARİTA */}
      <section id="map" className={styles.mapSection}>
        <h2 className={styles.mapTitle}>
          {genre ? `${genre.toUpperCase()} Listening Rates` : "Listening Rates"}
        </h2>
        <WorldMap
          data={mapData}
          selectedFilters={{
            genre,
            mediaType,
            durationRange,
            artist,
            revenueRange,
          }}
        />
      </section>
      <button
        onClick={() => {
          const el = document.getElementById("chart");
          if (el) el.scrollIntoView({ behavior: "smooth" });
        }}
        style={{
          margin: "20px auto",
          padding: "10px 20px",
          backgroundColor: "#3b82f6",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
          display: "block",
        }}
      >
        Show Graphs
      </button>
      <section id="graph" className={styles.chartSection}>
        <h3>Genre Distribution by Country</h3>
        <GenreStackedChart />
      </section>

      {/* 📊 PREDICTION PLACEHOLDER */}
      <section id="prediction" className={styles.chartSection}>
        <h3>Genre Popularity by Country (Chart Coming Soon)</h3>
        <div className={styles.placeholder}></div>
      </section>
    </>
  );
};

export default HomePage;
