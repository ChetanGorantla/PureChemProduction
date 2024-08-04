import React from 'react';

let githubIcon = "https://cdn.freebiesupply.com/logos/thumbs/2x/github-icon-1-logo.png";
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
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    width: '100%',
    height: '100%',
    pointerEvents: 'none', // To ensure it does not block other content
  },
  icon: {
    width: '60px',
    height: '45px',
    opacity: 0.7,
    transition: 'opacity 0.3s',
    pointerEvents: 'auto', // Re-enable pointer events for the icon itself
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
