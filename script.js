// toggle function hamburger menu
document.addEventListener("DOMContentLoaded", function () {
  const toggleButton = document.querySelector(".menu-toggle");
  const navLinks = document.querySelector(".nav-links");
  const closeButton = document.querySelector(".close-menu-toggle");

  function openMenu() {
    navLinks.classList.add("show");
    toggleButton.setAttribute("aria-expanded", "true");
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("click", handleClickOutside, true);
    trapFocus(navLinks);
  }

  function closeMenu() {
    navLinks.classList.remove("show");
    toggleButton.setAttribute("aria-expanded", "false");
    document.removeEventListener("keydown", handleKeyDown);
    document.removeEventListener("click", handleClickOutside, true);
    releaseFocus();
  }

  function handleKeyDown(e) {
    if (e.key === "Escape") {
      closeMenu();
      toggleButton.focus(); // focus on toggle button
    }
  }

  function handleClickOutside(e) {
    if (!navLinks.contains(e.target) && !toggleButton.contains(e.target)) {
      closeMenu();
    }
  }

  // Focus-Trap menu toggle handling
  let focusableElements = [];
  let firstFocusableEl;
  let lastFocusableEl;

  function trapFocus(element) {
    focusableElements = element.querySelectorAll(
      'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
    );
    if (focusableElements.length === 0) return;

    firstFocusableEl = focusableElements[0];
    lastFocusableEl = focusableElements[focusableElements.length - 1];
    firstFocusableEl.focus();

    element.addEventListener("keydown", handleFocusTrap);
  }

  function handleFocusTrap(e) {
    if (e.key !== "Tab") return;

    if (e.shiftKey) {
      // Shift + Tab
      if (document.activeElement === firstFocusableEl) {
        e.preventDefault();
        lastFocusableEl.focus();
      }
    } else {
      // Tab
      if (document.activeElement === lastFocusableEl) {
        e.preventDefault();
        firstFocusableEl.focus();
      }
    }
  }

  function releaseFocus() {
    navLinks.removeEventListener("keydown", handleFocusTrap);
  }

  toggleButton.addEventListener("click", () => {
    const isExpanded = toggleButton.getAttribute("aria-expanded") === "true";
    if (isExpanded) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  if (closeButton) {
    closeButton.addEventListener("click", () => {
      closeMenu();
      toggleButton.focus();
    });
  }
});

// footer cta buttons appearance
document.addEventListener("DOMContentLoaded", function () {
  const buttons = document.querySelectorAll(".footer-btn");
  let buttonsVisible = false;

  // Event listener für Scroll-events
  window.addEventListener("scroll", function () {
    // Buttons appear on 100px scroll
    if (!buttonsVisible && window.scrollY > 100) {
      buttons.forEach((btn, index) => {
        setTimeout(() => {
          btn.classList.add("visible");
        }, index * 150);
      });

      buttonsVisible = true;
    }
    // remove Buttons below 100px scroll
    else if (buttonsVisible && window.scrollY < 100) {
      console.log("Hiding footer buttons");

      buttons.forEach((btn, index) => {
        setTimeout(() => {
          btn.classList.remove("visible");
        }, index * 150);
      });

      buttonsVisible = false;
    }
  });

  // Back to top
  const backToTopBtn = document.getElementById("back-to-top");
  if (backToTopBtn) {
    backToTopBtn.addEventListener("click", function () {
      // smooth scroll up
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    });
  }

  // Scroll to projects
  const projectsBtn = document.getElementById("projects-btn");
  if (projectsBtn) {
    projectsBtn.addEventListener("click", function () {
      // soft scroll to projects
      window.scrollTo({
        top: 100,
        behavior: "smooth",
      });
    });
  }
});

// function to change visited state nav links

const link = document.querySelectorAll(".state");

link.forEach((link) => {
  link.addEventListener("click", function (event) {
    setTimeout(() => {
      link.classList.add("visited");
    }, 3000);

    setTimeout(() => {
      link.classList.remove("visited");
    }, 5000);
  });
});

// function reveal hidden content about me section

document.addEventListener("DOMContentLoaded", function () {
  // secure DOM-element-references w/ null-check
  const revealBtn = document.getElementById("reveal-btn");
  const hiddenContent = document.querySelector(".container-hidden-content");
  const introHeading = document.getElementById("intro-heading");
  
  // return if important elements are missing
  if (!revealBtn || !hiddenContent) {
    console.warn("Required elements not found");
    return;
  }

  // event listener w/ secure DOM manipulation
  revealBtn.addEventListener("click", function () {
    const isShown = hiddenContent.classList.contains("show");
    
    if (isShown) {
      // content hide
      hiddenContent.classList.remove("show");
      revealBtn.setAttribute("aria-expanded", "false");
      
      // secure icon change
      updateButtonIcon(revealBtn, "down");
      
    } else {
      // content show
      hiddenContent.classList.add("show");
      revealBtn.setAttribute("aria-expanded", "true");
      
      // secure icon change
      updateButtonIcon(revealBtn, "up");
      
      // set focus w/ null check
      if (introHeading) {
        setTimeout(() => {
          introHeading.focus();
        }, 200);
      }
    }
  });
});

/**
 * function update icon
 * @param {HTMLElement} button - open/close
 * @param {string} direction - "up" or "down"
 */
function updateButtonIcon(button, direction) {
  // remove existing children
  button.replaceChildren();
  
  // create new icon
  const icon = document.createElement("i");
  
  if (direction === "up") {
    icon.className = "fas fa-angle-up";
    icon.style.color = "#050505";
  } else {
    icon.className = "fas fa-angle-down";
  }
  
  // append icon
  button.appendChild(icon);
}


// submit button change on successfully sent message

const form = document.getElementById("form");
const submit = document.getElementById("submit-btn");
const message = document.querySelector(".message");

submit.addEventListener("click", function (event) {
  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }

  submit.classList.add("success-btn");
  message.classList.add("show");

  // Confetti start
  confetti({
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 },
  });
  // delay send message to show animation
  setTimeout(() => {
    form.submit();
  }, 2000);
});
