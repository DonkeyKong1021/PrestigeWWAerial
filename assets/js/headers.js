document.addEventListener("DOMContentLoaded", function () {
  // Main Header (Home Page)
  const mainHeader = document.querySelector(".main-header");
  if (mainHeader) {
    // Mobile menu toggle
    const hamburger = mainHeader.querySelector(".hamburger");
    const navLinks = mainHeader.querySelector(".nav-links");
    
    if (hamburger && navLinks) {
      hamburger.addEventListener("click", function() {
        navLinks.classList.toggle("nav-active");
        
        // Create overlay for mobile menu
        let overlay = document.querySelector(".menu-overlay");
        if (!overlay) {
          overlay = document.createElement("div");
          overlay.className = "menu-overlay";
          document.body.appendChild(overlay);
          
          // Close menu when clicking overlay
          overlay.addEventListener("click", function() {
            navLinks.classList.remove("nav-active");
            overlay.classList.remove("active");
            document.body.classList.remove("menu-open");
          });
        }
        
        overlay.classList.toggle("active");
        document.body.classList.toggle("menu-open");
      });
    }
  }

  // Secondary Header (Interior Pages)
  const secondaryHeader = document.querySelector(".secondary-header");
  if (secondaryHeader) {
    // Secondary Header Mobile Menu Toggle
    const secondaryHamburger = secondaryHeader.querySelector(".hamburger");
    const secondaryNavLinks = secondaryHeader.querySelector(".nav-links");
    
    if (secondaryHamburger && secondaryNavLinks) {
      secondaryHamburger.addEventListener("click", function() {
        secondaryNavLinks.classList.toggle("nav-active");
        document.body.classList.toggle("menu-open");
        
        // Create overlay for mobile menu background
        let overlay = document.querySelector(".menu-overlay");
        if (!overlay) {
          overlay = document.createElement("div");
          overlay.className = "menu-overlay";
          document.body.appendChild(overlay);
          
          overlay.addEventListener("click", function() {
            secondaryNavLinks.classList.remove("nav-active");
            document.body.classList.remove("menu-open");
            overlay.classList.remove("active");
          });
        }
        overlay.classList.toggle("active");
      });
    }
  }
  
  // Add additional menu overlay styles
  const styleElement = document.createElement('style');
  styleElement.textContent = `
    .menu-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.7);
      z-index: 90;
      opacity: 0;
      visibility: hidden;
      transition: opacity 0.3s ease, visibility 0.3s ease;
    }
    
    .menu-overlay.active {
      opacity: 1;
      visibility: visible;
    }
    
    body.menu-open {
      overflow: hidden;
    }
  `;
  document.head.appendChild(styleElement);
}); 