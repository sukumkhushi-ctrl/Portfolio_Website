document.addEventListener("DOMContentLoaded", () => {
  // DOM Element Selectors
  const navbar = document.getElementById("navbar");
  const navLinks = document.querySelectorAll(".nav-link");
  const sections = document.querySelectorAll(".section");
  const themeToggle = document.getElementById("theme-toggle");
  const themeIcon = themeToggle ? themeToggle.querySelector(".theme-icon") : null;
  const contactForm = document.getElementById("contact-form");

  // 1. DYNAMIC NAVBAR & SCROLLSPY
  window.addEventListener("scroll", () => {
    if (navbar) {
      if (window.scrollY > 50) {
        navbar.classList.add("scrolled");
      } else {
        navbar.classList.remove("scrolled");
      }
    }

    let currentSection = "";
    sections.forEach((section) => {
      const sectionTop = section.offsetTop - 120;
      const sectionHeight = section.offsetHeight;
      if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
        currentSection = section.getAttribute("id");
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove("active");
      if (link.getAttribute("href") === `#${currentSection}`) {
        link.classList.add("active");
      }
    });
  });

  // 2. FADE-IN ANIMATION ON SCROLL
  const fadeElements = document.querySelectorAll(".fade-in");
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
        }
      });
    },
    { threshold: 0.15 }
  );

  fadeElements.forEach((el) => observer.observe(el));

  // 3. DARK MODE TOGGLE (With LocalStorage)
  const savedTheme = localStorage.getItem("theme");

  if (savedTheme === "dark") {
    document.body.classList.add("dark-theme");
    if (themeIcon) themeIcon.textContent = "☀️";
  }

  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      document.body.classList.toggle("dark-theme");
      const isDark = document.body.classList.contains("dark-theme");

      if (themeIcon) themeIcon.textContent = isDark ? "☀️" : "🌙";
      localStorage.setItem("theme", isDark ? "dark" : "light");
    });
  }

  // 4. CONTACT FORM VALIDATION
  if (contactForm) {
    const fields = {
      name: {
        input: document.getElementById("name"),
        error: document.getElementById("name-error"),
        validate: (val) => (val.trim() === "" ? "Name is required." : "")
      },
      email: {
        input: document.getElementById("email"),
        error: document.getElementById("email-error"),
        validate: (val) => {
          if (val.trim() === "") return "Email is required.";
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          return !emailRegex.test(val) ? "Enter a valid email address." : "";
        }
      },
      message: {
        input: document.getElementById("message"),
        error: document.getElementById("message-error"),
        validate: (val) => (val.trim() === "" ? "Message cannot be empty." : "")
      }
    };

    function validateField(fieldKey) {
      const field = fields[fieldKey];
      if (!field.input || !field.error) return true;

      const errorMessage = field.validate(field.input.value);

      if (errorMessage) {
        field.error.textContent = errorMessage;
        field.input.classList.add("invalid");
        return false;
      } else {
        field.error.textContent = "";
        field.input.classList.remove("invalid");
        return true;
      }
    }

    Object.keys(fields).forEach((key) => {
      if (fields[key].input) {
        fields[key].input.addEventListener("input", () => validateField(key));
      }
    });

    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();

      let isFormValid = true;
      Object.keys(fields).forEach((key) => {
        const isValid = validateField(key);
        if (!isValid) isFormValid = false;
      });

      const successMsg = document.getElementById("form-success");

      if (isFormValid) {
        if (successMsg) successMsg.textContent = "Thank you! Your message has been sent successfully.";
        contactForm.reset();

        setTimeout(() => {
          if (successMsg) successMsg.textContent = "";
        }, 4000);
      } else {
        if (successMsg) successMsg.textContent = "";
      }
    });
  }
});