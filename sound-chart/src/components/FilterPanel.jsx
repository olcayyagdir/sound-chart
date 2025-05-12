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

  durationOptions,
  revenueOptions,

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
              <option key={i} value={m}>
                {m}
              </option>
            ))}
          </select>
        </div>

        {/* Duration */}
        <div className={styles.filterItem}>
          <label className={styles.filterLabel}>Duration</label>
          <select
            value={durationRange}
            onChange={(e) => setDurationRange(e.target.value)}
            className={styles.select}
          >
            <option value="">-- Select Duration --</option>
            {durationOptions.map((d, i) => (
              <option key={i} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>

        {/* Revenue Range */}
        <div className={styles.filterItem}>
          <label className={styles.filterLabel}>Revenue Range</label>
          <select
            value={revenueRange}
            onChange={(e) => setRevenueRange(e.target.value)}
            className={styles.select}
          >
            <option value="">-- Select Revenue --</option>
            {revenueOptions.map((r, i) => (
              <option key={i} value={r}>
                {r}
              </option>
            ))}
          </select>
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
              {artistSuggestions.map((name, index) => (
                <li
                  key={index}
                  className={styles.suggestionItem}
                  onMouseDown={() => {
                    setArtist(name);
                    setShowArtistSuggestions(false);
                  }}
                >
                  {name}
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
                .filter((a) => a.toLowerCase().includes(album.toLowerCase()))
                .map((a, index) => (
                  <li
                    key={index}
                    className={styles.suggestionItem}
                    onMouseDown={() => {
                      setAlbum(a);
                      setShowAlbumSuggestions(false);
                    }}
                  >
                    {a}
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
                <option key={index} value={a}>
                  {a}
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
