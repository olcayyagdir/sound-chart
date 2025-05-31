import React from "react";
import styles from "./FilterPanel.module.css";

const FilterPanel = ({
  // Filtre değerleri ve setState'ler
  genre,
  setGenre,
  genreOptions,
  mediaType,
  setMediaType,
  mediaTypeOptions,
  durationRange,
  setDurationRange,
  revenueRange,
  setRevenueRange,

  // Artist
  artist,
  setArtist,
  artistSuggestions,
  showArtistSuggestions,
  setShowArtistSuggestions,

  // Album
  album,
  setAlbum,
  filteredAlbums,
  // setFilteredAlbums,
  // showAlbumSuggestions,
  // setShowAlbumSuggestions,

  durationLimits,
  revenueLimits,

  // Reset
  onReset,
}) => {
  return (
    <>
      <section className={styles.filterGrid}>
        {/* Genre */}
        <div className={styles.filterItem}>
          <label className={styles.filterLabel}>Genre</label>
          <select
            value={genre}
            onChange={(e) => setGenre(e.target.value)}
            className={styles.select}
          >
            <option value="">-- Select Genre --</option>
            {genreOptions.map((g, i) => (
              <option key={i} value={g}>
                {g}
              </option>
            ))}
          </select>
        </div>

        {/* Media Type */}
        <div className={styles.filterItem}>
          <label className={styles.filterLabel}>Media Type</label>
          <select
            value={mediaType}
            onChange={(e) => setMediaType(e.target.value)}
            className={styles.select}
          >
            <option value="">-- Select Media --</option>
            {mediaTypeOptions.map((m, i) => (
              <option key={i} value={m.name}>
                {m.name}
              </option>
            ))}
          </select>
        </div>

        {/* Duration */}
        <div className={styles.filterItem}>
          <label className={styles.filterLabel}>Duration (sec)</label>
          <div className={styles.rangeWrapper}>
            <input
              type="range"
              min={durationLimits.min}
              max={durationLimits.max}
              value={durationRange[0] ?? durationLimits.min}
              onChange={(e) =>
                setDurationRange([+e.target.value, durationRange[1]])
              }
              className={styles.rangeSlider}
            />
            <input
              type="range"
              min={durationLimits.min}
              max={durationLimits.max}
              value={durationRange[1] ?? durationLimits.max}
              onChange={(e) =>
                setDurationRange([durationRange[0], +e.target.value])
              }
              className={styles.rangeSlider}
            />
            <div className={styles.rangeInputs}>
              <input
                type="text"
                inputMode="numeric"
                placeholder="min"
                value={durationRange[0] != null ? durationRange[0] : ""}
                onChange={(e) => {
                  const val = e.target.value;
                  if (val === "") {
                    setDurationRange([null, durationRange[1]]);
                  } else if (/^\d+$/.test(val)) {
                    const clamped = Math.min(
                      Math.max(+val, durationLimits.min),
                      durationRange[1] ?? durationLimits.max
                    );
                    setDurationRange([clamped, durationRange[1]]);
                  }
                }}
                className={styles.rangeInput}
              />
              <span>–</span>
              <input
                type="text"
                inputMode="numeric"
                placeholder="max"
                value={durationRange[1] != null ? durationRange[1] : ""}
                onChange={(e) => {
                  const val = e.target.value;
                  if (val === "") {
                    setDurationRange([durationRange[0], null]);
                  } else if (/^\d+$/.test(val)) {
                    const clamped = Math.max(
                      Math.min(+val, durationLimits.max),
                      durationRange[0] ?? durationLimits.min
                    );
                    setDurationRange([durationRange[0], clamped]);
                  }
                }}
                className={styles.rangeInput}
              />
            </div>
          </div>
        </div>

        {/* Revenue */}
        <div className={styles.filterItem}>
          <label className={styles.filterLabel}>Revenue</label>
          <div className={styles.rangeWrapper}>
            <input
              type="range"
              min={revenueLimits.min}
              max={revenueLimits.max}
              value={revenueRange[0] ?? revenueLimits.min}
              onChange={(e) =>
                setRevenueRange([+e.target.value, revenueRange[1]])
              }
              className={styles.rangeSlider}
            />
            <input
              type="range"
              min={revenueLimits.min}
              max={revenueLimits.max}
              value={revenueRange[1] ?? revenueLimits.max}
              onChange={(e) =>
                setRevenueRange([revenueRange[0], +e.target.value])
              }
              className={styles.rangeSlider}
            />
            <div className={styles.rangeInputs}>
              <input
                type="text"
                inputMode="numeric"
                placeholder="min"
                value={revenueRange[0] != null ? revenueRange[0] : ""}
                onChange={(e) => {
                  const val = e.target.value;
                  if (val === "") {
                    setRevenueRange([null, revenueRange[1]]);
                  } else if (/^\d+$/.test(val)) {
                    const clamped = Math.min(
                      Math.max(+val, revenueLimits.min),
                      revenueRange[1] ?? revenueLimits.max
                    );
                    setRevenueRange([clamped, revenueRange[1]]);
                  }
                }}
                className={styles.rangeInput}
              />
              <span>–</span>
              <input
                type="text"
                inputMode="numeric"
                placeholder="max"
                value={revenueRange[1] != null ? revenueRange[1] : ""}
                onChange={(e) => {
                  const val = e.target.value;
                  if (val === "") {
                    setRevenueRange([revenueRange[0], null]);
                  } else if (/^\d+$/.test(val)) {
                    const clamped = Math.max(
                      Math.min(+val, revenueLimits.max),
                      revenueRange[0] ?? revenueLimits.min
                    );
                    setRevenueRange([revenueRange[0], clamped]);
                  }
                }}
                className={styles.rangeInput}
              />
            </div>
          </div>
        </div>

        {/* 🎤 Artist (autocomplete) */}
        <div className={`${styles.filterItem} ${styles.autocompleteWrapper}`}>
          <label className={styles.filterLabel}>Artist</label>
          <input
            type="text"
            value={artist}
            onChange={(e) => {
              setArtist(e.target.value);
              setShowArtistSuggestions(true);
            }}
            onFocus={() => {
              if (artistSuggestions.length > 0) setShowArtistSuggestions(true);
            }}
            onBlur={() => {
              setTimeout(() => setShowArtistSuggestions(false), 150);
            }}
            placeholder="Enter artist name"
            className={styles.input}
          />

          {showArtistSuggestions && artistSuggestions.length > 0 && artist && (
            <ul className={styles.suggestionList}>
              {artistSuggestions
                .filter((s) =>
                  s.name.toLowerCase().includes(artist.toLowerCase())
                )
                .sort((a, b) => {
                  const input = artist.toLowerCase();
                  const aStarts = a.name.toLowerCase().startsWith(input)
                    ? 0
                    : 1;
                  const bStarts = b.name.toLowerCase().startsWith(input)
                    ? 0
                    : 1;
                  return aStarts - bStarts; // önce başlayanlar öne gelsin
                })
                .map((suggestion, index) => (
                  <li
                    key={index}
                    className={styles.suggestionItem}
                    onMouseDown={() => {
                      setArtist(suggestion.name);
                      setShowArtistSuggestions(false);
                    }}
                  >
                    {suggestion.name}
                  </li>
                ))}
            </ul>
          )}
        </div>

        {/* Album (autocomplete)
        <div className={`${styles.filterItem} ${styles.autocompleteWrapper}`}>
          <label className={styles.filterLabel}>Album</label>
          <input
            type="text"
            value={album}
            onChange={(e) => {
              const value = e.target.value;
              setAlbum(e.target.value);
              setShowAlbumSuggestions(true);
              if (!value) {
                setFilteredAlbums([]);
              }
            }}
            onFocus={() => {
              if (filteredAlbums.length > 0) setShowAlbumSuggestions(true);
            }}
            onBlur={() => {
              setTimeout(() => setShowAlbumSuggestions(false), 100);
            }}
            placeholder="Enter album name"
            className={styles.input}
          />
          {showAlbumSuggestions && filteredAlbums.length > 0 && album && (
            <ul className={styles.suggestionList}>
              {filteredAlbums
                .filter((a) =>
                  a.title.toLowerCase().includes(album.toLowerCase())
                )
                .map((a, index) => (
                  <li
                    key={index}
                    className={styles.suggestionItem}
                    onMouseDown={() => {
                      setAlbum(a.title);
                      setShowAlbumSuggestions(false);
                    }}
                  >
                    {a.title}
                  </li>
                ))}
            </ul>
          )}
        </div> */}

        {/* Album Select (artist seçildiyse) */}
        {artist && filteredAlbums.length > 0 && (
          <div className={styles.filterItem}>
            <label className={styles.filterLabel}>
              Select Album from {artist}
            </label>
            <select
              value={album}
              onChange={(e) => setAlbum(e.target.value)}
              className={styles.select}
            >
              <option value="">-- Select Album --</option>
              {filteredAlbums.map((a, index) => (
                <option key={index} value={a.album}>
                  {a.album}
                </option>
              ))}
            </select>
          </div>
        )}
      </section>

      {/* Reset butonu her zaman altta sabit */}
      <div style={{ textAlign: "center", marginTop: "20px" }}>
        <button onClick={onReset} className={styles.resetButton}>
          Reset Filters
        </button>
      </div>
    </>
  );
};

export default FilterPanel;
