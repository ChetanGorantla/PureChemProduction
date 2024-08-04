import React from 'react';
import githubIcon from '.../public/github-logo.png'; // Make sure the path is correct

function Footer() {
  return (
    <div style={styles.container}>
      <a href="https://github.com/ChetanGorantla/PureChem" target="_blank" rel="noopener noreferrer">
        <img src={githubIcon} alt="GitHub" style={styles.icon} />
      </a>
    </div>
  );
}

const styles = {
  container: {
    position: 'fixed',
    bottom: '10px',
    left: '10px',
    zIndex: 1000, // Ensure it stays on top
  },
  icon: {
    width: '40px',
    height: '40px',
    opacity: 0.7,
    transition: 'opacity 0.3s',
  },
};

const handleHover = (e) => {
  e.target.style.opacity = 1;
};

const handleUnhover = (e) => {
  e.target.style.opacity = 0.7;
};

document.addEventListener('DOMContentLoaded', () => {
  const iconElement = document.querySelector('img[alt="GitHub"]');
  if (iconElement) {
    iconElement.addEventListener('mouseover', handleHover);
    iconElement.addEventListener('mouseout', handleUnhover);
  }
});

export default Footer;
