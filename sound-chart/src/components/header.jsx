import React, { useState } from "react";
import styles from "./header.module.css";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <header className={styles.header}>
      <h1 className={styles.logo}>Sound Chart</h1>

      <button className={styles.hamburger} onClick={toggleMenu}>
        ☰
      </button>

      <nav className={`${styles.nav} ${isMenuOpen ? styles.show : ""}`}>
        <div className={styles.menu}>
          <div className={styles.menuItem}>
            <a href="#about">About</a>
          </div>
          <div className={styles.menuItem}>
            <a href="#filter">Filter</a>
          </div>
          <div className={styles.menuItem}>
            <a href="#map">Map</a>
          </div>
          <div className={styles.menuItem}>
            <a href="#graph">Graph</a>
          </div>
          <div className={styles.menuItem}>
            <a href="#prediction">Prediction</a>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
