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
  setFilteredAlbums,
  showAlbumSuggestions,
  setShowAlbumSuggestions,

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
              value={durationRange[0]}
              onChange={(e) =>
                setDurationRange([+e.target.value, durationRange[1]])
              }
              className={styles.rangeSlider}
            />
            <input
              type="range"
              min={durationLimits.min}
              max={durationLimits.max}
              value={durationRange[1]}
              onChange={(e) =>
                setDurationRange([durationRange[0], +e.target.value])
              }
              className={styles.rangeSlider}
            />
            <div className={styles.rangeInputs}>
              <input
                type="number"
                min={durationLimits.min}
                max={durationRange[1]}
                value={durationRange[0]}
                onChange={(e) =>
                  setDurationRange([+e.target.value, durationRange[1]])
                }
                className={styles.rangeInput}
              />
              <span>–</span>
              <input
                type="number"
                min={durationRange[0]}
                max={durationLimits.max}
                value={durationRange[1]}
                onChange={(e) =>
                  setDurationRange([durationRange[0], +e.target.value])
                }
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
              value={revenueRange[0]}
              onChange={(e) =>
                setRevenueRange([+e.target.value, revenueRange[1]])
              }
              className={styles.rangeSlider}
            />
            <input
              type="range"
              min={revenueLimits.min}
              max={revenueLimits.max}
              value={revenueRange[1]}
              onChange={(e) =>
                setRevenueRange([revenueRange[0], +e.target.value])
              }
              className={styles.rangeSlider}
            />
            <div className={styles.rangeInputs}>
              <input
                type="number"
                min={revenueLimits.min}
                max={revenueRange[1]}
                value={revenueRange[0]}
                onChange={(e) =>
                  setRevenueRange([+e.target.value, revenueRange[1]])
                }
                className={styles.rangeInput}
              />
              <span>–</span>
              <input
                type="number"
                min={revenueRange[0]}
                max={revenueLimits.max}
                value={revenueRange[1]}
                onChange={(e) =>
                  setRevenueRange([revenueRange[0], +e.target.value])
                }
                className={styles.rangeInput}
              />
            </div>
          </div>
        </div>

        {/* Artist (autocomplete) */}
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
              setTimeout(() => setShowArtistSuggestions(false), 100);
            }}
            placeholder="Enter artist name"
            className={styles.input}
          />
          {showArtistSuggestions && artistSuggestions.length > 0 && artist && (
            <ul className={styles.suggestionList}>
              {artistSuggestions.map((artist, index) => (
                <li
                  key={index}
                  className={styles.suggestionItem}
                  onMouseDown={() => {
                    setArtist(artist.name);
                    setShowArtistSuggestions(false);
                  }}
                >
                  {artist.name}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Album (autocomplete) */}
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
        </div>

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
                <option key={index} value={a.title}>
                  {a.title}
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
