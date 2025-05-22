// function check for stored messages on page load

window.addEventListener("load", () => {
  resendOfflineMessages();
});

// function to buffer messages
function saveMessageLocally(message) {
  const savedMessages =
    JSON.parse(localStorage.getItem("unsentMessages")) || [];
  savedMessages.push(message);
  localStorage.setItem("unsentMessages", JSON.stringify(savedMessages));
}

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

  // Event listener für Scroll-Ereignisse
  window.addEventListener("scroll", function () {
    // Buttons erscheinen nach 200px Scroll
    if (!buttonsVisible && window.scrollY > 200) {
      console.log("Showing footer buttons after scroll");

      buttons.forEach((btn, index) => {
        setTimeout(() => {
          btn.classList.add("visible");
        }, index * 150);
      });

      buttonsVisible = true;
    }
    // NEUER CODE: Buttons wieder ausblenden, wenn unter 100px gescrollt
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
      // Sanftes Scrollen nach oben
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
    event.preventDefault();

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
  const revealBtn = document.getElementById("reveal-btn");
  const hiddenContent = document.querySelector(".container-hidden-content");

  revealBtn.addEventListener("click", function () {
    const isShown = hiddenContent.classList.contains("show");

    if (isShown) {
      hiddenContent.classList.remove("show");
      revealBtn.setAttribute("aria-expanded", "false");
      revealBtn.innerHTML =
        '<i class="fas fa-angle-up" style="color: #050505"></i>';
    } else {
      hiddenContent.classList.add("show");
      revealBtn.setAttribute("aria-expanded", "true");
      revealBtn.innerHTML =
        '<i class="fas fa-angle-down" style="color: #050505"></i>';
    }
  });
});

// form submission via node.js and express

const form = document.getElementById("form");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const formData = {
    name: form.name.value.trim(),
    email: form.email.value.trim(),
    message: form.message.value.trim(),
  };

  try {
    const response = await fetch("http://localhost:3000/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    const result = await response.json();

    if (response.ok) {
      alert(result.message);
      form.reset();
    } else {
      alert(result.error || "Error on Send.");
    }
  } catch (error) {
    // network error: store message locally
    alert("Network Error: Message stored locally.");

    let savedMessages =
      JSON.parse(localStorage.getItem("offlineMessages")) || [];
    savedMessages.push(formData);
    localStorage.setItem("offlineMessages", JSON.stringify(savedMessages));

    form.reset();
  }
});

// function resend offline messages

async function resendOfflineMessages() {
  let savedMessages = JSON.parse(localStorage.getItem("offlineMessages")) || [];
  if (savedMessages.length === 0) return; // if no messages

  for (let i = 0; i < savedMessages.length; i++) {
    try {
      const response = await fetch("http://localhost:3000/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(savedMessages[i]),
      });
      if (response.ok) {
        // message successfully resend -> remove
        savedMessages.splice(i, 1);
        i--; // update index
      } else {
        // server doesn't answer: break & retry later
        break;
      }
    } catch (err) {
      // network error, break & retry later
      break;
    }
  }

  // updated list saved in localStorage
  localStorage.setItem("offlineMessages", JSON.stringify(savedMessages));
}

// function, send stored messages  from localStorage
async function sendStoredMessages() {
  const storedMessages =
    JSON.parse(localStorage.getItem("offlineMessages")) || [];

  for (const msg of storedMessages) {
    try {
      const response = await fetch("http://localhost:3000/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(msg),
      });

      if (response.ok) {
        console.log("Offline-Message sent:", msg);
        // remove messages from array when successfully sent
        const index = storedMessages.indexOf(msg);
        if (index > -1) {
          storedMessages.splice(index, 1);
        }
      } else {
        console.warn("Server didn't accept message:", msg);
      }
    } catch (error) {
      console.error("Error sending stored messages:", error);
      // cancel, if server not available
      break;
    }
  }

  // refresh storage
  localStorage.setItem("offlineMessages", JSON.stringify(storedMessages));
}

// page load: try to send stored messages
window.addEventListener("load", () => {
  sendStoredMessages();
});

// submit button change on successfully sent message

const submit = document.getElementById("submit-bnt");

submit.addEventListener("click", function (event) {
  event.preventDefault();
  submit.classList.add("message-success");

})
