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
    services: [], // Changed to array to store multiple services
    date: null,
    time: null,
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    notes: "",
  };

  // Calendar State
  let currentDate = new Date();

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
        const price = parseInt(this.getAttribute("data-price"));
        const duration = parseInt(this.getAttribute("data-duration"));

        serviceOptions.forEach((option) => {
          if (option.getAttribute("data-service") === service) {
            // Add to selected services
            const serviceData = {
              service: service,
              price: price,
              duration: duration
            };
            
            // Check if already selected
            const existingIndex = bookingData.services.findIndex(s => s.service === service);
            if (existingIndex === -1) {
              bookingData.services.push(serviceData);
              option.classList.add("selected");
            }
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

  // Service Selection - MULTI-SELECT
  serviceOptions.forEach((option) => {
    option.addEventListener("click", function () {
      const service = this.getAttribute("data-service");
      const price = parseInt(this.getAttribute("data-price"));
      const duration = parseInt(this.getAttribute("data-duration"));
      
      // Toggle selection
      this.classList.toggle("selected");
      
      // Find if service is already in the array
      const existingIndex = bookingData.services.findIndex(s => s.service === service);
      
      if (this.classList.contains("selected")) {
        // Add service if not already selected
        if (existingIndex === -1) {
          bookingData.services.push({
            service: service,
            price: price,
            duration: duration
          });
        }
      } else {
        // Remove service if deselected
        if (existingIndex !== -1) {
          bookingData.services.splice(existingIndex, 1);
        }
      }
      
      console.log("Selected services:", bookingData.services);
    });
  });

  // Step Navigation
  btnNext.addEventListener("click", function () {
    if (currentStep < 3 && validateStep(currentStep)) {
      currentStep++;
      updateUI();
      if (currentStep === 3) {
        populateConfirmation();
      }
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
    successDate.textContent = formatDate(bookingData.date);
    successTime.textContent = bookingData.time;

    console.log("Booking submitted:", bookingData);
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

  // UI Update Helper - FIXED STEP DISPLAY
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
      // Only show the current step content
      if (i + 1 === currentStep) {
        content.classList.add("active");
      } else {
        content.classList.remove("active");
      }
    });
    
    // Ensure success step is hidden unless we're on it
    const successContent = document.getElementById("step-content-success");
    if (currentStep !== 4) {
      successContent.classList.remove("active");
    }
  }

  function updateNavigationButtons() {
    btnPrev.disabled = currentStep === 1;
    btnNext.style.display = currentStep === 3 ? "none" : "block";
    
    // Show submit button only on step 3
    if (submitBooking) {
      submitBooking.style.display = currentStep === 3 ? "block" : "none";
    }
  }

  // ✅ UPDATED VALIDATION LOGIC - Check for at least one service
  function validateStep(step) {
    switch (step) {
      case 1:
        if (bookingData.services.length === 0) {
          alert("Please select at least one service.");
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
          bookingDataDate: bookingData.date,
          bookingDataTime: bookingData.time,
          servicesCount: bookingData.services.length
        });

        if (!firstName || !lastName || !email || !phone) {
          alert("Please fill in all required personal information fields.");
          return false;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
          alert("Please enter a valid email address.");
          return false;
        }

        // Check bookingData directly instead of separate variables
        if (!bookingData.date) {
          alert("Please select a date for your appointment.");
          return false;
        }

        if (!bookingData.time) {
          alert("Please select a time slot for your appointment.");
          return false;
        }

        // Save data only if valid
        bookingData.firstName = firstName;
        bookingData.lastName = lastName;
        bookingData.email = email;
        bookingData.phone = phone;
        bookingData.notes = notes;
        return true;

      default:
        return true;
    }
  }

  // ✅ UPDATED POPULATE CONFIRMATION - Show multiple services
  function populateConfirmation() {
    // Calculate totals
    const totalPrice = bookingData.services.reduce((sum, service) => sum + service.price, 0);
    const totalDuration = bookingData.services.reduce((sum, service) => sum + service.duration, 0);
    
    // Display services list
    if (bookingData.services.length === 1) {
      confirmService.textContent = bookingData.services[0].service;
    } else {
      confirmService.innerHTML = bookingData.services.map(service => 
        `<div style="margin-bottom: 5px;">• ${service.service} - UGX ${service.price.toLocaleString()}</div>`
      ).join('');
    }
    
    confirmDate.textContent = formatDate(bookingData.date);
    confirmTime.textContent = bookingData.time || "-";
    confirmDuration.textContent = `${totalDuration} minutes`;
    confirmPrice.textContent = `UGX ${totalPrice.toLocaleString()}`;
    confirmName.textContent = `${bookingData.firstName} ${bookingData.lastName}`;
    confirmEmail.textContent = bookingData.email;
    confirmPhone.textContent = bookingData.phone;
  }

  function resetModal() {
    currentStep = 1;
    bookingData = {
      services: [], // Reset to empty array
      date: null,
      time: null,
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      notes: "",
    };

    updateUI();
    personalInfoForm.reset();
    serviceOptions.forEach((opt) => opt.classList.remove("selected"));
    renderCalendar();
    resetTimeSlots();
    document.querySelector(".modal-footer").style.display = "flex";
    
    // Reset all step contents to proper state
    document.getElementById("step-content-success").classList.remove("active");
    document.getElementById("step-content-1").classList.add("active");
    document.getElementById("step-content-2").classList.remove("active");
    document.getElementById("step-content-3").classList.remove("active");
  }

  // Calendar Rendering
  function renderCalendar() {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const monthNames = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    document.querySelector(".calendar-month").textContent = `${monthNames[month]} ${year}`;

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
          document.querySelectorAll(".calendar-day").forEach((d) => d.classList.remove("selected"));
          this.classList.add("selected");
          
          // Set bookingData directly
          bookingData.date = new Date(cellDate);
          bookingData.time = null; // Reset time when date changes
          resetTimeSlots();
          console.log("Selected date:", bookingData.date);
        });
      }

      // Mark as selected if this is the currently selected date
      if (bookingData.date &&
          cellDate.getDate() === bookingData.date.getDate() &&
          cellDate.getMonth() === bookingData.date.getMonth() &&
          cellDate.getFullYear() === bookingData.date.getFullYear()) {
        cell.classList.add("selected");
      }

      calendarDays.appendChild(cell);
    }
  }

  // Time Slots
  function generateTimeSlots() {
    const times = [
      "09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM",
      "01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM"
    ];
    timeSlots.innerHTML = "";

    times.forEach((time) => {
      const slot = document.createElement("div");
      slot.className = "time-slot";
      slot.textContent = time;
      slot.addEventListener("click", function () {
        if (!bookingData.date) {
          alert("Please select a date first.");
          return;
        }

        document.querySelectorAll(".time-slot").forEach((s) => s.classList.remove("selected"));
        this.classList.add("selected");
        
        // Set bookingData directly
        bookingData.time = time;
        console.log("Selected time:", bookingData.time);
      });
      timeSlots.appendChild(slot);
    });
  }

  function resetTimeSlots() {
    document.querySelectorAll(".time-slot").forEach((slot) => {
      slot.classList.remove("selected");
    });
    bookingData.time = null;
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

  // Back to Top Button
  const backToTop = document.getElementById("back-to-top");
  if (backToTop) {
    window.addEventListener("scroll", () => {
      backToTop.classList.toggle("active", window.pageYOffset > 300);
    });
    backToTop.addEventListener("click", () =>
      window.scrollTo({ top: 0, behavior: "smooth" })
    );
  }

  // Header scroll effect
  window.addEventListener("scroll", () => {
    const header = document.getElementById("header");
    if (header) {
      header.classList.toggle("scrolled", window.scrollY > 100);
    }
  });

  // Gallery filter
  document.querySelectorAll(".filter-btn").forEach((btn) => {
    btn.addEventListener("click", function () {
      document.querySelectorAll(".filter-btn").forEach((b) => b.classList.remove("active"));
      this.classList.add("active");
      const filter = this.dataset.filter;
      document.querySelectorAll(".gallery-item").forEach((item) => {
        item.style.display = filter === "all" || item.dataset.category === filter ? "block" : "none";
      });
    });
  });

  // Forms
  document.getElementById("appointment-form")?.addEventListener("submit", (e) => {
    e.preventDefault();
    alert("Thank you! We'll contact you shortly to confirm your booking.");
    e.target.reset();
  });
  
  document.getElementById("newsletter-form")?.addEventListener("submit", (e) => {
    e.preventDefault();
    alert("Thank you for subscribing!");
    e.target.reset();
  });

  // FAQ
  document.querySelectorAll(".faq-item").forEach((item) => {
    item.querySelector(".faq-question").addEventListener("click", function () {
      document.querySelectorAll(".faq-item").forEach((i) => i !== item && i.classList.remove("active"));
      item.classList.toggle("active");
    });
  });
});



// Hero Carousel
document.addEventListener("DOMContentLoaded", function () {
  const slides = document.querySelectorAll(".slide");
  const navLines = document.querySelectorAll(".nav-line");
  let currentSlide = 0;

  function showSlide(index) {
    slides.forEach((slide) => slide.classList.remove("active"));
    navLines.forEach((line) => line.classList.remove("active"));

    slides[index].classList.add("active");
    navLines[index].classList.add("active");

    currentSlide = index;
  }

  function nextSlide() {
    let next = currentSlide + 1;
    if (next >= slides.length) next = 0;
    showSlide(next);
  }

  let slideInterval = setInterval(nextSlide, 6000);

  navLines.forEach((line, index) => {
    line.addEventListener("click", () => {
      clearInterval(slideInterval);
      showSlide(index);
      slideInterval = setInterval(nextSlide, 6000);
    });
  });

  const carousel = document.querySelector(".carousel");
  carousel.addEventListener("mouseenter", () => clearInterval(slideInterval));
  carousel.addEventListener("mouseleave", () => slideInterval = setInterval(nextSlide, 6000));
});

// Mobile Navigation
document.addEventListener("DOMContentLoaded", function () {
  const header = document.getElementById("header");
  const hamburgerCheckbox = document.getElementById("hamburger-checkbox");
  const mobileNavOverlay = document.getElementById("mobile-nav-overlay");

  function closeMobileMenu() {
    hamburgerCheckbox.checked = false;
    mobileNavOverlay.classList.remove("active");
    document.body.style.overflow = "auto";
  }

  function checkWindowSize() {
    if (window.innerWidth > 1024) closeMobileMenu();
  }

  window.addEventListener("scroll", function () {
    if (window.scrollY > 100) {
      header.classList.remove("transparent");
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
      header.classList.add("transparent");
    }
  });

  hamburgerCheckbox.addEventListener("change", function () {
    if (this.checked) {
      mobileNavOverlay.classList.add("active");
      document.body.style.overflow = "hidden";
    } else {
      mobileNavOverlay.classList.remove("active");
      document.body.style.overflow = "auto";
    }
  });

  const mobileLinks = document.querySelectorAll(".mobile-nav-menu a, .mobile-book-btn");
  mobileLinks.forEach((link) => {
    link.addEventListener("click", closeMobileMenu);
  });

  mobileNavOverlay.addEventListener("click", function (e) {
    if (e.target === mobileNavOverlay) closeMobileMenu();
  });

  window.addEventListener("resize", checkWindowSize);
  checkWindowSize();
});

// Testimonials Carousel
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

  function updateCarousel() {
    track.style.transform = `translateX(-${currentSlide * 100}%)`;

    slides.forEach((slide, index) => {
      slide.classList.toggle("active", index === currentSlide);
    });

    dots.forEach((dot, index) => {
      dot.classList.toggle("active", index === currentSlide);
    });
  }

  function goToSlide(slideIndex) {
    currentSlide = slideIndex;
    updateCarousel();
  }

  function nextSlide() {
    currentSlide = (currentSlide + 1) % slideCount;
    updateCarousel();
  }

  function prevSlide() {
    currentSlide = (currentSlide - 1 + slideCount) % slideCount;
    updateCarousel();
  }

  prevArrow.addEventListener("click", prevSlide);
  nextArrow.addEventListener("click", nextSlide);

  let slideInterval = setInterval(nextSlide, 5000);

  const carousel = document.querySelector(".testimonials-carousel");
  carousel.addEventListener("mouseenter", () => clearInterval(slideInterval));
  carousel.addEventListener("mouseleave", () => slideInterval = setInterval(nextSlide, 5000));

  updateCarousel();
});



// CONTACT US PAGE
document.addEventListener("DOMContentLoaded", function () {
  // Only run FAQ if we're on a page with FAQ items
  const faqItems = document.querySelectorAll(".faq-item");
  if (faqItems.length > 0) {
    faqItems.forEach((item) => {
      const question = item.querySelector(".faq-question");
      question.addEventListener("click", function () {
        const isActive = item.classList.contains("active");
        faqItems.forEach((otherItem) => otherItem.classList.remove("active"));
        if (!isActive) item.classList.add("active");
      });
    });
  }

  // Contact Form
  const contactForm = document.getElementById("contact-form");
  if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();
      alert("Thank you for your message! We will get back to you as soon as possible.");
      contactForm.reset();
    });
  }

  // Newsletter Form
  const newsletterForm = document.getElementById("newsletter-form");
  if (newsletterForm) {
    newsletterForm.addEventListener("submit", function (e) {
      e.preventDefault();
      alert("Thank you for subscribing to our newsletter!");
      newsletterForm.reset();
    });
  }

  // Back to Top Button
  const backToTop = document.getElementById("back-to-top");
  if (backToTop) {
    window.addEventListener("scroll", function () {
      backToTop.classList.toggle("active", window.pageYOffset > 300);
    });

    backToTop.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }
});