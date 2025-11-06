// Wait for DOM to load
document.addEventListener("DOMContentLoaded", function () {
  // Navigation functionality
  const hamburger = document.getElementById("hamburger");
  const navMenu = document.getElementById("nav-menu");
  const navbar = document.getElementById("navbar");
  const navLinks = document.querySelectorAll(".nav-link");

  // Toggle mobile menu
  hamburger.addEventListener("click", function () {
    navMenu.classList.toggle("active");

    // Animate hamburger
    const spans = hamburger.querySelectorAll("span");
    if (navMenu.classList.contains("active")) {
      spans[0].style.transform = "rotate(-45deg) translate(-5px, 6px)";
      spans[1].style.opacity = "0";
      spans[2].style.transform = "rotate(45deg) translate(-5px, -6px)";
    } else {
      spans[0].style.transform = "none";
      spans[1].style.opacity = "1";
      spans[2].style.transform = "none";
    }
  });

  // Close mobile menu when clicking on nav links
  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      navMenu.classList.remove("active");
      const spans = hamburger.querySelectorAll("span");
      spans[0].style.transform = "none";
      spans[1].style.opacity = "1";
      spans[2].style.transform = "none";
    });
  });

  // Navbar scroll effect
  window.addEventListener("scroll", function () {
    if (window.scrollY > 50) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
  });

  // Active navigation link based on scroll position
  function updateActiveNavLink() {
    const sections = document.querySelectorAll("section[id]");
    const scrollPos = window.scrollY + 100;

    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute("id");
      const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);

      if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
        navLinks.forEach((link) => link.classList.remove("active"));
        if (navLink) navLink.classList.add("active");
      }
    });
  }

  window.addEventListener("scroll", updateActiveNavLink);

  // Gallery filter functionality
  const filterButtons = document.querySelectorAll(".filter-btn");
  const galleryItems = document.querySelectorAll(".gallery-item");

  filterButtons.forEach((button) => {
    button.addEventListener("click", function () {
      // Remove active class from all buttons
      filterButtons.forEach((btn) => btn.classList.remove("active"));
      // Add active class to clicked button
      this.classList.add("active");

      const filterValue = this.getAttribute("data-filter");

      galleryItems.forEach((item) => {
        const itemCategory = item.getAttribute("data-category");

        if (filterValue === "all" || itemCategory === filterValue) {
          item.style.display = "block";
          item.style.animation = "fadeInUp 0.5s ease-in-out";
        } else {
          item.style.display = "none";
        }
      });
    });
  });

  // Smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        target.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    });
  });

  // Animate skill bars on scroll
  function animateSkillBars() {
    const skillBars = document.querySelectorAll(".skill-progress");

    skillBars.forEach((bar) => {
      const barTop = bar.getBoundingClientRect().top;
      const triggerPoint = window.innerHeight * 0.8;

      if (barTop < triggerPoint) {
        const width = bar.style.width;
        bar.style.width = "0%";
        setTimeout(() => {
          bar.style.width = width;
        }, 100);
      }
    });
  }

  // Intersection Observer for animations
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  };

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("animate-in");

        // Animate skill bars when skills section is in view
        if (entry.target.id === "keahlian") {
          animateSkillBars();
        }

        // Animate stats counter
        if (entry.target.classList.contains("stat-item")) {
          animateCounter(entry.target);
        }
      }
    });
  }, observerOptions);

  // Observe elements for animation
  document
    .querySelectorAll(
      ".value-item, .achievement-item, .timeline-content, .gallery-item, .stat-item, section"
    )
    .forEach((el) => {
      observer.observe(el);
    });

  // Counter animation for stats
  function animateCounter(element) {
    const numberElement = element.querySelector(".stat-number");
    if (!numberElement) return;

    const finalNumber = parseInt(numberElement.textContent);
    const duration = 2000; // 2 seconds
    const startTime = Date.now();

    function updateCounter() {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);

      const currentNumber = Math.floor(finalNumber * progress);
      numberElement.textContent =
        currentNumber + (numberElement.textContent.includes("+") ? "+" : "");

      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      }
    }

    updateCounter();
  }

  // Contact form handling
  const contactForm = document.getElementById("contactForm");

  contactForm.addEventListener("submit", function (e) {
    e.preventDefault();

    // Get form data
    const formData = new FormData(contactForm);
    const formObject = {};
    formData.forEach((value, key) => {
      formObject[key] = value;
    });

    // Simulate form submission (you can replace this with actual form handling)
    const submitButton = contactForm.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;

    submitButton.textContent = "Mengirim...";
    submitButton.disabled = true;

    setTimeout(() => {
      submitButton.textContent = "Terkirim!";
      submitButton.style.background = "#10b981";

      // Show success message
      showNotification(
        "Pesan berhasil dikirim! Terima kasih atas pesan Anda.",
        "success"
      );

      // Reset form
      contactForm.reset();

      // Reset button after 3 seconds
      setTimeout(() => {
        submitButton.textContent = originalText;
        submitButton.disabled = false;
        submitButton.style.background = "";
      }, 3000);
    }, 2000);
  });

  // Notification system
  function showNotification(message, type = "info") {
    const notification = document.createElement("div");
    notification.className = `notification ${type}`;
    notification.textContent = message;

    // Style the notification
    Object.assign(notification.style, {
      position: "fixed",
      top: "20px",
      right: "20px",
      padding: "1rem 2rem",
      borderRadius: "10px",
      color: "white",
      zIndex: "9999",
      transform: "translateX(400px)",
      transition: "transform 0.3s ease-in-out",
      maxWidth: "300px",
      wordWrap: "break-word",
    });

    // Set background color based on type
    if (type === "success") {
      notification.style.background = "#10b981";
    } else if (type === "error") {
      notification.style.background = "#ef4444";
    } else {
      notification.style.background = "#3b82f6";
    }

    document.body.appendChild(notification);

    // Animate in
    setTimeout(() => {
      notification.style.transform = "translateX(0)";
    }, 100);

    // Remove after 5 seconds
    setTimeout(() => {
      notification.style.transform = "translateX(400px)";
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 300);
    }, 5000);
  }

  // Parallax effect for hero background
  window.addEventListener("scroll", function () {
    const scrolled = window.pageYOffset;
    const heroBackground = document.querySelector(".hero-background");
    const parallaxSpeed = 0.5;

    if (heroBackground) {
      heroBackground.style.transform = `translateY(${
        scrolled * parallaxSpeed
      }px)`;
    }
  });

  // Add loading animation for images
  const images = document.querySelectorAll("img");
  images.forEach((img) => {
    img.style.opacity = "0";
    img.style.transition = "opacity 0.5s ease-in-out";

    // Jika gambar sudah ter-load sebelumnya (cached)
    if (img.complete) {
      img.style.opacity = "1";
    } else {
      img.addEventListener("load", function () {
        this.style.opacity = "1";
      });
    }
  });

  // Typing animation for hero title
  function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.textContent = "";

    function type() {
      if (i < text.length) {
        element.textContent += text.charAt(i);
        i++;
        setTimeout(type, speed);
      }
    }

    type();
  }

  // Initialize typing animation after a delay
  setTimeout(() => {
    const heroTitle = document.querySelector(".hero-title");
    if (heroTitle) {
      const originalText = heroTitle.textContent;
      typeWriter(heroTitle, originalText, 50);
    }
  }, 1500);

  // Social media links (you can replace with actual URLs)
  const socialLinks = document.querySelectorAll(".social-link, .social-icon");
  socialLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      showNotification("Link media sosial akan segera tersedia!", "info");
    });
  });

  // Add CSS classes for animations
  const style = document.createElement("style");
  style.textContent = `
        .animate-in {
            animation: fadeInUp 0.8s ease-out;
        }
        
        .notification {
            animation: slideInRight 0.3s ease-out;
        }
        
        @keyframes slideInRight {
            from {
                transform: translateX(400px);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
    `;
    
  document.head.appendChild(style);

  console.log("Website portofolio marching band berhasil dimuat! 🥁");
});
