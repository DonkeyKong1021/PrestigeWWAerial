// Main JavaScript for PrestigeWW Aerial Media

document.addEventListener("DOMContentLoaded", () => {
  // Testimonial slider
  const slides = document.querySelectorAll(".testimonial-slide");
  const dots = document.querySelectorAll(".dot");
  if (slides.length && dots.length) {
    let currentSlide = 0;

    const showSlide = (index) => {
      slides.forEach((slide) => slide.classList.remove("active"));
      dots.forEach((dot) => dot.classList.remove("active"));
      slides[index].classList.add("active");
      dots[index].classList.add("active");
    };

    dots.forEach((dot, index) => {
      dot.addEventListener("click", () => {
        currentSlide = index;
        showSlide(currentSlide);
      });
    });

    setInterval(() => {
      currentSlide = (currentSlide + 1) % slides.length;
      showSlide(currentSlide);
    }, 5000);
  }

  // Portfolio item hover effect
  document.querySelectorAll(".gallery-item").forEach((item) => {
    item.addEventListener("mouseenter", () => {
      const overlay = item.querySelector(".overlay");
      if (overlay) overlay.style.opacity = "1";
    });
    item.addEventListener("mouseleave", () => {
      const overlay = item.querySelector(".overlay");
      if (overlay) overlay.style.opacity = "0";
    });
  });

  // Smooth scrolling for internal anchor links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", (e) => {
      e.preventDefault();
      const targetId = anchor.getAttribute("href");
      if (targetId === "#") return;
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        const header = document.querySelector("header");
        const headerHeight = header ? header.offsetHeight : 0;
        const additionalOffset = 0; // Adjust as needed
        const targetPosition =
          targetElement.getBoundingClientRect().top +
          window.pageYOffset -
          headerHeight - additionalOffset;
        window.scrollTo({ top: targetPosition, behavior: "smooth" });
      }
    });
  });

  // Image lazy loading
  if ("IntersectionObserver" in window) {
    const lazyImages = document.querySelectorAll("img[data-src]");
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.removeAttribute("data-src");
          observer.unobserve(img);
        }
      });
    });
    lazyImages.forEach((img) => imageObserver.observe(img));
  } else {
    document.querySelectorAll("img[data-src]").forEach((img) => {
      img.src = img.dataset.src;
      img.removeAttribute("data-src");
    });
  }

  // Simple parallax effect for the CTA section
  const ctaSection = document.querySelector(".cta-section");
  if (ctaSection) {
    window.addEventListener("scroll", () => {
      const scrollPosition = window.pageYOffset;
      ctaSection.style.backgroundPositionY = scrollPosition * 0.1 + "px";
    });
  }

  // Video modal functionality
  const viewDemoBtn = document.getElementById("viewDemoBtn");
  const videoModal = document.getElementById("videoModal");
  const videoModalClose = document.getElementById("videoModalClose");
  const videoContainer = document.getElementById("videoContainer");

  if (viewDemoBtn && videoModal && videoModalClose && videoContainer) {
    viewDemoBtn.addEventListener("click", (e) => {
      e.preventDefault();
      // Create YouTube iframe and add it to the container
      videoContainer.innerHTML = `
        <iframe width="800" height="450" 
          src="https://www.youtube.com/embed/FcgIzmUAzA8" 
          frameborder="0" 
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
          allowfullscreen>
        </iframe>
      `;
      videoModal.classList.add("active");
    });

    videoModalClose.addEventListener("click", () => {
      videoModal.classList.remove("active");
      videoContainer.innerHTML = "";
    });

    window.addEventListener("click", (e) => {
      if (e.target === videoModal) {
        videoModal.classList.remove("active");
        videoContainer.innerHTML = "";
      }
    });
  }

  // FAQ Accordion
  const faqItems = document.querySelectorAll('.faq-item');
  
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    
    question.addEventListener('click', () => {
      // Close all other items
      faqItems.forEach(otherItem => {
        if (otherItem !== item) {
          otherItem.classList.remove('active');
        }
      });
      
      // Toggle current item
      item.classList.toggle('active');
    });
  });

  // Mobile navigation toggle
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');
  const header = document.querySelector('header');
  
  if (hamburger) {
    hamburger.addEventListener('click', () => {
      navLinks.classList.toggle('active');
      hamburger.classList.toggle('active');
    });
  }
  
  // Dropdown functionality
  const dropdownItems = document.querySelectorAll('.dropdown');
  
  // For desktop hover functionality (already handled by CSS)
  
  // For mobile click functionality
  if (window.innerWidth <= 768) {
    dropdownItems.forEach(dropdown => {
      const dropdownToggle = dropdown.querySelector('.dropdown-toggle');
      
      if (dropdownToggle) {
        dropdownToggle.addEventListener('click', (e) => {
          e.preventDefault();
          
          // Close all other dropdowns
          dropdownItems.forEach(item => {
            if (item !== dropdown) {
              item.classList.remove('active');
            }
          });
          
          // Toggle current dropdown
          dropdown.classList.toggle('active');
        });
      }
    });
  }
  
  // Update dropdown behavior on window resize
  window.addEventListener('resize', () => {
    if (window.innerWidth <= 768) {
      dropdownItems.forEach(dropdown => {
        const dropdownToggle = dropdown.querySelector('.dropdown-toggle');
        
        if (dropdownToggle) {
          dropdownToggle.addEventListener('click', (e) => {
            e.preventDefault();
            dropdown.classList.toggle('active');
          });
        }
      });
    } else {
      // Remove event listeners for larger screens (hover handled by CSS)
      dropdownItems.forEach(dropdown => {
        dropdown.classList.remove('active');
      });
    }
  });
  
  // Scroll event for header background change
  window.addEventListener('scroll', function() {
    if (header && window.scrollY > 50) {
      header.classList.add('scrolled');
    } else if (header) {
      header.classList.remove('scrolled');
    }
  });
  
  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
  
  // Portfolio item hover effect
  const portfolioItems = document.querySelectorAll('.portfolio-item');
  portfolioItems.forEach(item => {
    item.addEventListener('mouseenter', () => {
      const overlay = item.querySelector('.item-overlay');
      if (overlay) {
        overlay.style.opacity = '1';
        overlay.style.transform = 'translateY(0)';
      }
    });
    
    item.addEventListener('mouseleave', () => {
      const overlay = item.querySelector('.item-overlay');
      if (overlay) {
        overlay.style.opacity = '0';
        overlay.style.transform = 'translateY(20px)';
      }
    });
  });
  
  // Lazy loading images
  const lazyImages = document.querySelectorAll('img.lazy-load');
  
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          if (img.dataset.srcset) {
            img.srcset = img.dataset.srcset;
          }
          
          img.onload = () => {
            img.classList.add('loaded');
          };
          
          imageObserver.unobserve(img);
        }
      });
    });
    
    lazyImages.forEach(img => {
      imageObserver.observe(img);
    });
  } else {
    // Fallback for browsers without IntersectionObserver support
    const lazyLoad = () => {
      const scrollTop = window.pageYOffset;
      
      lazyImages.forEach(img => {
        if (img.offsetTop < window.innerHeight + scrollTop) {
          img.src = img.dataset.src;
          if (img.dataset.srcset) {
            img.srcset = img.dataset.srcset;
          }
          img.classList.add('loaded');
        }
      });
      
      if (lazyImages.length === 0) { 
        document.removeEventListener('scroll', lazyLoad);
        window.removeEventListener('resize', lazyLoad);
        window.removeEventListener('orientationChange', lazyLoad);
      }
    };
    
    document.addEventListener('scroll', lazyLoad);
    window.addEventListener('resize', lazyLoad);
    window.addEventListener('orientationChange', lazyLoad);
  }
  
  // Animate elements when they come into view
  const animateElements = document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right');
  
  if ('IntersectionObserver' in window) {
    const animationObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.visibility = 'visible';
          animationObserver.unobserve(entry.target);
        }
      });
    });
    
    animateElements.forEach(el => {
      el.style.visibility = 'hidden';
      animationObserver.observe(el);
    });
  }
});
