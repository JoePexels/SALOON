document.addEventListener("DOMContentLoaded", function () {
  // Modal Elements
  const modal = document.getElementById("booking-modal");
  const openModalButtons = document.querySelectorAll(
    "#open-booking-modal, #hero-book-btn, #about-book-btn, .book-service-btn, .book-promo-btn"
  );
  const closeModal = document.getElementById("close-modal");
  const closeSuccess = document.getElementById("close-success");

  // Step Elements
  const steps = document.querySelectorAll(".step");
  const stepContents = document.querySelectorAll(".step-content");
  const btnPrev = document.getElementById("btn-prev");
  const btnNext = document.getElementById("btn-next");

  // Service Selection
  const serviceOptions = document.querySelectorAll(".service-option");

  // Form Elements - Scoped to modal
  const personalInfoForm = document.getElementById("personal-info-form");
  const submitBooking = document.getElementById("submit-booking");
  const editAppointment = document.getElementById("edit-appointment");

  // Confirmation Elements
  const confirmService = document.getElementById("confirm-service");
  const confirmDate = document.getElementById("confirm-date");
  const confirmTime = document.getElementById("confirm-time");
  const confirmDuration = document.getElementById("confirm-duration");
  const confirmPrice = document.getElementById("confirm-price");
  const confirmName = document.getElementById("confirm-name");
  const confirmEmail = document.getElementById("confirm-email");
  const confirmPhone = document.getElementById("confirm-phone");

  // Success Elements
  const successEmail = document.getElementById("success-email");
  const successDate = document.getElementById("success-date");
  const successTime = document.getElementById("success-time");

  // Calendar Elements
  const calendarDays = document.getElementById("calendar-days");
  const timeSlots = document.getElementById("time-slots");
  const prevMonth = document.getElementById("prev-month");
  const nextMonth = document.getElementById("next-month");

  // Booking Data
  let currentStep = 1;
  let bookingData = {
    service: null,
    price: null,
    duration: null,
    date: null,
    time: null,
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    notes: "",
  };

  // Calendar & Time State
  let currentDate = new Date();
  let selectedDate = null;
  let selectedTime = null;

  // Open Modal
  openModalButtons.forEach((button) => {
    button.addEventListener("click", function (e) {
      e.preventDefault();
      modal.style.display = "block";
      document.body.style.overflow = "hidden";
      resetTimeSlots();

      // Pre-select service if coming from service card
      if (this.classList.contains("book-service-btn")) {
        const service = this.getAttribute("data-service");
        const price = this.getAttribute("data-price");
        const duration = this.getAttribute("data-duration");

        serviceOptions.forEach((option) => {
          if (option.getAttribute("data-service") === service) {
            option.classList.add("selected");
            bookingData.service = service;
            bookingData.price = price;
            bookingData.duration = duration;
          }
        });
      }
    });
  });

  // Close Modal
  function closeModalHandler() {
    modal.style.display = "none";
    document.body.style.overflow = "auto";
    resetModal();
  }

  closeModal.addEventListener("click", closeModalHandler);
  closeSuccess.addEventListener("click", closeModalHandler);

  window.addEventListener("click", function (e) {
    if (e.target === modal) closeModalHandler();
  });

  // Service Selection
  serviceOptions.forEach((option) => {
    option.addEventListener("click", function () {
      serviceOptions.forEach((opt) => opt.classList.remove("selected"));
      this.classList.add("selected");
      bookingData.service = this.getAttribute("data-service");
      bookingData.price = this.getAttribute("data-price");
      bookingData.duration = this.getAttribute("data-duration");
    });
  });

  // Step Navigation
  btnNext.addEventListener("click", function () {
    if (currentStep < 3 && validateStep(currentStep)) {
      currentStep++;
      updateUI();
      if (currentStep === 3) populateConfirmation();
    }
  });

  btnPrev.addEventListener("click", function () {
    if (currentStep > 1) {
      currentStep--;
      updateUI();
    }
  });

  editAppointment.addEventListener("click", function () {
    currentStep = 2;
    updateUI();
  });

  submitBooking.addEventListener("click", function () {
    document.getElementById("step-content-3").classList.remove("active");
    document.getElementById("step-content-success").classList.add("active");
    document.querySelector(".modal-footer").style.display = "none";

    successEmail.textContent = bookingData.email;
    successDate.textContent = formatDate(selectedDate);
    successTime.textContent = selectedTime;

    console.log("Booking submitted:", bookingData);
    // Here you would typically send the data to your backend
    // Example: sendBookingData(bookingData);
  });

  // Calendar Navigation
  prevMonth.addEventListener("click", () => {
    currentDate.setMonth(currentDate.getMonth() - 1);
    renderCalendar();
  });

  nextMonth.addEventListener("click", () => {
    currentDate.setMonth(currentDate.getMonth() + 1);
    renderCalendar();
  });

  // Initialize
  renderCalendar();
  generateTimeSlots();

  // UI Update Helper
  function updateUI() {
    updateStepIndicator();
    updateStepContent();
    updateNavigationButtons();
  }

  function updateStepIndicator() {
    steps.forEach((step, i) => {
      step.classList.toggle("active", i + 1 === currentStep);
      step.classList.toggle("completed", i + 1 < currentStep);
    });
  }

  function updateStepContent() {
    stepContents.forEach((content, i) => {
      content.classList.toggle("active", i + 1 === currentStep);
    });
  }

  function updateNavigationButtons() {
    btnPrev.disabled = currentStep === 1;
    btnNext.style.display = currentStep === 3 ? "none" : "block";
  }

  // ✅ FIXED VALIDATION LOGIC - Using form-scoped elements
  function validateStep(step) {
    switch (step) {
      case 1:
        if (!bookingData.service) {
          alert("Please select a service.");
          return false;
        }
        return true;

      case 2:
        // Use the modal form specifically to avoid conflicts
        const modalForm = document.getElementById("personal-info-form");
        const firstName = modalForm.querySelector("#first-name").value.trim();
        const lastName = modalForm.querySelector("#last-name").value.trim();
        const email = modalForm.querySelector("#email").value.trim();
        const phone = modalForm.querySelector("#phone").value.trim();
        const notes = modalForm.querySelector("#notes").value.trim();

        console.log("Validation data:", {
          firstName,
          lastName,
          email,
          phone,
          selectedDate,
          selectedTime,
        }); // Debug log

        if (!firstName || !lastName || !email || !phone) {
          alert("Please fill in all required personal information fields.");
          return false;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
          alert("Please enter a valid email address.");
          return false;
        }

        if (!selectedDate) {
          alert("Please select a date for your appointment.");
          return false;
        }

        if (!selectedTime) {
          alert("Please select a time slot for your appointment.");
          return false;
        }

        // Save data only if valid
        bookingData.firstName = firstName;
        bookingData.lastName = lastName;
        bookingData.email = email;
        bookingData.phone = phone;
        bookingData.notes = notes;
        bookingData.date = selectedDate;
        bookingData.time = selectedTime;
        return true;

      default:
        return true;
    }
  }

  function populateConfirmation() {
    confirmService.textContent = bookingData.service || "-";
    confirmDate.textContent = formatDate(selectedDate);
    confirmTime.textContent = selectedTime || "-";
    confirmDuration.textContent = bookingData.duration
      ? `${bookingData.duration} minutes`
      : "-";
    confirmPrice.textContent = bookingData.price
      ? `UGX ${Number(bookingData.price).toLocaleString()}`
      : "-";
    confirmName.textContent = `${bookingData.firstName} ${bookingData.lastName}`;
    confirmEmail.textContent = bookingData.email;
    confirmPhone.textContent = bookingData.phone;
  }

  function resetModal() {
    currentStep = 1;
    bookingData = {
      service: null,
      price: null,
      duration: null,
      date: null,
      time: null,
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      notes: "",
    };
    selectedDate = null;
    selectedTime = null;

    updateUI();
    personalInfoForm.reset();
    serviceOptions.forEach((opt) => opt.classList.remove("selected"));
    renderCalendar();
    resetTimeSlots();
    document.querySelector(".modal-footer").style.display = "flex";
    document.getElementById("step-content-success").classList.remove("active");
    document.getElementById("step-content-3").classList.add("active");
  }

  // Calendar Rendering
  function renderCalendar() {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    document.querySelector(
      ".calendar-month"
    ).textContent = `${monthNames[month]} ${year}`;

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    calendarDays.innerHTML = "";

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      const empty = document.createElement("div");
      empty.className = "calendar-day disabled";
      calendarDays.appendChild(empty);
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const cell = document.createElement("div");
      const cellDate = new Date(year, month, day);
      cell.textContent = day;
      cell.className = "calendar-day";

      if (cellDate < today) {
        cell.classList.add("disabled");
      } else {
        cell.addEventListener("click", function () {
          document
            .querySelectorAll(".calendar-day")
            .forEach((d) => d.classList.remove("selected"));
          this.classList.add("selected");
          selectedDate = cellDate;
          selectedTime = null; // Reset time when date changes
          resetTimeSlots();
          console.log("Selected date:", selectedDate); // Debug log
        });
      }

      // Mark as selected if this is the currently selected date
      if (
        selectedDate &&
        cellDate.getDate() === selectedDate.getDate() &&
        cellDate.getMonth() === selectedDate.getMonth() &&
        cellDate.getFullYear() === selectedDate.getFullYear()
      ) {
        cell.classList.add("selected");
      }

      calendarDays.appendChild(cell);
    }
  }

  // Time Slots
  function generateTimeSlots() {
    const times = [
      "09:00 AM",
      "10:00 AM",
      "11:00 AM",
      "12:00 PM",
      "01:00 PM",
      "02:00 PM",
      "03:00 PM",
      "04:00 PM",
      "05:00 PM",
    ];
    timeSlots.innerHTML = "";

    times.forEach((time) => {
      const slot = document.createElement("div");
      slot.className = "time-slot";
      slot.textContent = time;
      slot.addEventListener("click", function () {
        if (!selectedDate) {
          alert("Please select a date first.");
          return;
        }

        document
          .querySelectorAll(".time-slot")
          .forEach((s) => s.classList.remove("selected"));
        this.classList.add("selected");
        selectedTime = time;
        console.log("Selected time:", selectedTime); // Debug log
      });
      timeSlots.appendChild(slot);
    });
  }

  function resetTimeSlots() {
    document.querySelectorAll(".time-slot").forEach((slot) => {
      slot.classList.remove("selected");
    });
    selectedTime = null;
  }

  function formatDate(date) {
    if (!date) return "-";
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

  
  const backToTop = document.getElementById("back-to-top");
  window.addEventListener("scroll", () => {
    backToTop.classList.toggle("active", window.pageYOffset > 300);
  });
  backToTop.addEventListener("click", () =>
    window.scrollTo({ top: 0, behavior: "smooth" })
  );

  window.addEventListener("scroll", () => {
    const header = document.getElementById("header");
    header.classList.toggle("scrolled", window.scrollY > 100);
  });

  document.querySelectorAll(".filter-btn").forEach((btn) => {
    btn.addEventListener("click", function () {
      document
        .querySelectorAll(".filter-btn")
        .forEach((b) => b.classList.remove("active"));
      this.classList.add("active");
      const filter = this.dataset.filter;
      document.querySelectorAll(".gallery-item").forEach((item) => {
        item.style.display =
          filter === "all" || item.dataset.category === filter
            ? "block"
            : "none";
      });
    });
  });

  document
    .getElementById("appointment-form")
    ?.addEventListener("submit", (e) => {
      e.preventDefault();
      alert("Thank you! We'll contact you shortly to confirm your booking.");
      e.target.reset();
    });
  document
    .getElementById("newsletter-form")
    ?.addEventListener("submit", (e) => {
      e.preventDefault();
      alert("Thank you for subscribing!");
      e.target.reset();
    });

  // FAQ
  document.querySelectorAll(".faq-item").forEach((item) => {
    item.querySelector(".faq-question").addEventListener("click", function () {
      document
        .querySelectorAll(".faq-item")
        .forEach((i) => i !== item && i.classList.remove("active"));
      item.classList.toggle("active");
    });
  });
});

document.addEventListener("DOMContentLoaded", function () {
  const slides = document.querySelectorAll(".slide");
  const navLines = document.querySelectorAll(".nav-line");
  let currentSlide = 0;

  // Function to show a specific slide
  function showSlide(index) {
    // Remove active class from all slides and nav lines
    slides.forEach((slide) => slide.classList.remove("active"));
    navLines.forEach((line) => line.classList.remove("active"));

    // Add active class to current slide and nav line
    slides[index].classList.add("active");
    navLines[index].classList.add("active");

    currentSlide = index;
  }

  // Auto-advance slides
  function nextSlide() {
    let next = currentSlide + 1;
    if (next >= slides.length) {
      next = 0;
    }
    showSlide(next);
  }

  // Set up auto-rotation
  let slideInterval = setInterval(nextSlide, 6000);

  // Add click events to navigation lines
  navLines.forEach((line, index) => {
    line.addEventListener("click", () => {
      clearInterval(slideInterval);
      showSlide(index);
      slideInterval = setInterval(nextSlide, 6000);
    });
  });

  // Pause auto-rotation when hovering over carousel
  const carousel = document.querySelector(".carousel");
  carousel.addEventListener("mouseenter", () => {
    clearInterval(slideInterval);
  });

  carousel.addEventListener("mouseleave", () => {
    slideInterval = setInterval(nextSlide, 6000);
  });
});

document.addEventListener("DOMContentLoaded", function () {
  const header = document.getElementById("header");
  const navMenu = document.getElementById("nav-menu");
  const hamburgerMenu = document.getElementById("hamburger-menu");
  const hamburgerCheckbox = document.getElementById("hamburger-checkbox");
  const mobileNavOverlay = document.getElementById("mobile-nav-overlay");

  // Function to close mobile menu
  function closeMobileMenu() {
    hamburgerCheckbox.checked = false;
    mobileNavOverlay.classList.remove("active");
    document.body.style.overflow = "auto";
  }

  // Function to check window size and close menu if needed
  function checkWindowSize() {
    if (window.innerWidth > 1024) {
      closeMobileMenu();
    }
  }

  // Handle scroll event
  window.addEventListener("scroll", function () {
    if (window.scrollY > 100) {
      header.classList.remove("transparent");
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
      header.classList.add("transparent");
    }
  });

  // Handle hamburger menu toggle
  hamburgerCheckbox.addEventListener("change", function () {
    if (this.checked) {
      mobileNavOverlay.classList.add("active");
      document.body.style.overflow = "hidden";
    } else {
      mobileNavOverlay.classList.remove("active");
      document.body.style.overflow = "auto";
    }
  });

  // Close mobile menu when clicking on a link
  const mobileLinks = document.querySelectorAll(
    ".mobile-nav-menu a, .mobile-book-btn"
  );
  mobileLinks.forEach((link) => {
    link.addEventListener("click", function () {
      closeMobileMenu();
    });
  });

  // Close menu when clicking outside on mobile
  mobileNavOverlay.addEventListener("click", function (e) {
    if (e.target === mobileNavOverlay) {
      closeMobileMenu();
    }
  });

  // Close mobile menu when window is resized to desktop size
  window.addEventListener("resize", function () {
    checkWindowSize();
  });

  // Initialize on page load
  checkWindowSize();
});

document.addEventListener("DOMContentLoaded", function () {
  const track = document.getElementById("testimonials-track");
  const slides = document.querySelectorAll(".testimonial-slide");
  const dotsContainer = document.getElementById("carousel-dots");
  const prevArrow = document.getElementById("prev-arrow");
  const nextArrow = document.getElementById("next-arrow");

  let currentSlide = 0;
  const slideCount = slides.length;

  // Create dots
  slides.forEach((_, index) => {
    const dot = document.createElement("div");
    dot.classList.add("dot");
    if (index === 0) dot.classList.add("active");
    dot.addEventListener("click", () => goToSlide(index));
    dotsContainer.appendChild(dot);
  });

  const dots = document.querySelectorAll(".dot");

  // Function to update carousel position
  function updateCarousel() {
    track.style.transform = `translateX(-${currentSlide * 100}%)`;

    // Update active states
    slides.forEach((slide, index) => {
      slide.classList.toggle("active", index === currentSlide);
    });

    dots.forEach((dot, index) => {
      dot.classList.toggle("active", index === currentSlide);
    });
  }

  // Function to go to specific slide
  function goToSlide(slideIndex) {
    currentSlide = slideIndex;
    updateCarousel();
  }

  // Function to go to next slide
  function nextSlide() {
    currentSlide = (currentSlide + 1) % slideCount;
    updateCarousel();
  }

  // Function to go to previous slide
  function prevSlide() {
    currentSlide = (currentSlide - 1 + slideCount) % slideCount;
    updateCarousel();
  }

  // Event listeners for arrows
  prevArrow.addEventListener("click", prevSlide);
  nextArrow.addEventListener("click", nextSlide);

  // Auto-advance slides
  let slideInterval = setInterval(nextSlide, 5000);

  // Pause auto-advance on hover
  const carousel = document.querySelector(".testimonials-carousel");
  carousel.addEventListener("mouseenter", () => {
    clearInterval(slideInterval);
  });

  carousel.addEventListener("mouseleave", () => {
    slideInterval = setInterval(nextSlide, 5000);
  });

  // Initialize carousel
  updateCarousel();
});


// CONTACT US PAGE

// FAQ Accordion Functionality
document.addEventListener("DOMContentLoaded", function () {
  const faqItems = document.querySelectorAll(".faq-item");

  faqItems.forEach((item) => {
    const question = item.querySelector(".faq-question");

    question.addEventListener("click", function () {
      // Toggle current item
      const isActive = item.classList.contains("active");

      // Close all items first
      faqItems.forEach((otherItem) => {
        otherItem.classList.remove("active");
      });

      // If it wasn't active, open it
      if (!isActive) {
        item.classList.add("active");
      }
    });
  });

  // Contact Form Submission
  const contactForm = document.getElementById("contact-form");
  contactForm.addEventListener("submit", function (e) {
    e.preventDefault();
    alert(
      "Thank you for your message! We will get back to you as soon as possible."
    );
    contactForm.reset();
  });

  // Newsletter Form Submission
  const newsletterForm = document.getElementById("newsletter-form");
  newsletterForm.addEventListener("submit", function (e) {
    e.preventDefault();
    alert("Thank you for subscribing to our newsletter!");
    newsletterForm.reset();
  });

  // Back to Top Button
  const backToTop = document.getElementById("back-to-top");

  window.addEventListener("scroll", function () {
    if (window.pageYOffset > 300) {
      backToTop.classList.add("active");
    } else {
      backToTop.classList.remove("active");
    }
  });

  backToTop.addEventListener("click", function () {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });
});