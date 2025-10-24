// Booking Page (also updated for multi-select)
document.addEventListener("DOMContentLoaded", function () {
  // Only run if we're on the booking page
  if (!document.getElementById("btn-next-1")) return;

  let currentStep = 1;
  let bookingData = {
    services: [], // Changed to array
    date: null,
    time: null,
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    notes: "",
  };

  let currentDate = new Date();

  const steps = document.querySelectorAll(".step");
  const stepContents = document.querySelectorAll(".step-content");
  const serviceOptions = document.querySelectorAll(".service-option");

  const btnNext1 = document.getElementById("btn-next-1");
  const btnPrev2 = document.getElementById("btn-prev-2");
  const btnNext2 = document.getElementById("btn-next-2");
  const btnPrev3 = document.getElementById("btn-prev-3");
  const btnNext3 = document.getElementById("btn-next-3");
  const btnPrev4 = document.getElementById("btn-prev-4");
  const btnSubmit = document.getElementById("btn-submit");

  const confirmService = document.getElementById("confirm-service");
  const confirmDate = document.getElementById("confirm-date");
  const confirmTime = document.getElementById("confirm-time");
  const confirmDuration = document.getElementById("confirm-duration");
  const confirmPrice = document.getElementById("confirm-price");
  const confirmName = document.getElementById("confirm-name");
  const confirmEmail = document.getElementById("confirm-email");
  const confirmPhone = document.getElementById("confirm-phone");

  const successEmail = document.getElementById("success-email");
  const successDate = document.getElementById("success-date");
  const successTime = document.getElementById("success-time");

  const calendarDays = document.getElementById("calendar-days");
  const timeSlots = document.getElementById("time-slots");
  const prevMonth = document.getElementById("prev-month");
  const nextMonth = document.getElementById("next-month");

  // Initialize
  renderCalendar();
  generateTimeSlots();

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
  btnNext1.addEventListener("click", function () {
    if (validateStep(1)) {
      currentStep = 2;
      updateStepIndicator();
      updateStepContent();
    }
  });

  btnPrev2.addEventListener("click", function () {
    currentStep = 1;
    updateStepIndicator();
    updateStepContent();
  });

  btnNext2.addEventListener("click", function () {
    if (validateStep(2)) {
      currentStep = 3;
      updateStepIndicator();
      updateStepContent();
    }
  });

  btnPrev3.addEventListener("click", function () {
    currentStep = 2;
    updateStepIndicator();
    updateStepContent();
  });

  btnNext3.addEventListener("click", function () {
    if (validateStep(3)) {
      currentStep = 4;
      updateStepIndicator();
      updateStepContent();
      populateConfirmation();
    }
  });

  btnPrev4.addEventListener("click", function () {
    currentStep = 3;
    updateStepIndicator();
    updateStepContent();
  });

  // Submit Booking
  btnSubmit.addEventListener("click", function () {
    document.getElementById("step-content-4").classList.remove("active");
    document.getElementById("step-content-success").classList.add("active");

    successEmail.textContent = bookingData.email;
    successDate.textContent = formatDate(bookingData.date);
    successTime.textContent = bookingData.time;

    console.log("Booking submitted:", bookingData);
  });

  // Calendar Navigation
  prevMonth.addEventListener("click", function () {
    currentDate.setMonth(currentDate.getMonth() - 1);
    renderCalendar();
  });

  nextMonth.addEventListener("click", function () {
    currentDate.setMonth(currentDate.getMonth() + 1);
    renderCalendar();
  });

  // Functions
  function updateStepIndicator() {
    steps.forEach((step, index) => {
      if (index + 1 === currentStep) {
        step.classList.add("active");
      } else if (index + 1 < currentStep) {
        step.classList.remove("active");
        step.classList.add("completed");
      } else {
        step.classList.remove("active", "completed");
      }
    });
  }

  function updateStepContent() {
    stepContents.forEach((content, index) => {
      if (index + 1 === currentStep) {
        content.classList.add("active");
      } else {
        content.classList.remove("active");
      }
    });
  }

  function validateStep(step) {
    switch (step) {
      case 1:
        if (bookingData.services.length === 0) {
          alert("Please select at least one service");
          return false;
        }
        return true;
      case 2:
        const firstName = document.getElementById("first-name").value.trim();
        const lastName = document.getElementById("last-name").value.trim();
        const email = document.getElementById("email").value.trim();
        const phone = document.getElementById("phone").value.trim();

        if (!firstName || !lastName || !email || !phone) {
          alert("Please fill in all required fields");
          return false;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
          alert("Please enter a valid email address");
          return false;
        }

        bookingData.firstName = firstName;
        bookingData.lastName = lastName;
        bookingData.email = email;
        bookingData.phone = phone;
        bookingData.notes = document.getElementById("notes").value;

        return true;
      case 3:
        if (!bookingData.date || !bookingData.time) {
          alert("Please select a date and time for your appointment");
          return false;
        }
        return true;
      default:
        return true;
    }
  }

  function populateConfirmation() {
    // Calculate totals
    const totalPrice = bookingData.services.reduce((sum, service) => sum + service.price, 0);
    const totalDuration = bookingData.services.reduce((sum, service) => sum + service.duration, 0);
    
    // Display services list
    if (bookingData.services.length === 1) {
      confirmService.textContent = bookingData.services[0].service;
    } else {
      confirmService.innerHTML = bookingData.services.map(service => 
        `<div>• ${service.service} - UGX ${service.price.toLocaleString()}</div>`
      ).join('');
    }
    
    confirmDate.textContent = formatDate(bookingData.date);
    confirmTime.textContent = bookingData.time;
    confirmDuration.textContent = `${totalDuration} minutes`;
    confirmPrice.textContent = `UGX ${totalPrice.toLocaleString()}`;
    confirmName.textContent = `${bookingData.firstName} ${bookingData.lastName}`;
    confirmEmail.textContent = bookingData.email;
    confirmPhone.textContent = bookingData.phone;
  }

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

    for (let i = 0; i < firstDay; i++) {
      const emptyCell = document.createElement("div");
      emptyCell.className = "calendar-day disabled";
      calendarDays.appendChild(emptyCell);
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 1; i <= daysInMonth; i++) {
      const dayCell = document.createElement("div");
      dayCell.className = "calendar-day";
      dayCell.textContent = i;

      const cellDate = new Date(year, month, i);

      if (cellDate < today) {
        dayCell.classList.add("disabled");
      } else {
        dayCell.addEventListener("click", function () {
          document.querySelectorAll(".calendar-day").forEach((day) => {
            day.classList.remove("selected");
          });

          this.classList.add("selected");
          bookingData.date = new Date(cellDate);
          bookingData.time = null;
          resetTimeSlots();
        });
      }

      if (cellDate.getDate() === today.getDate() &&
          cellDate.getMonth() === today.getMonth() &&
          cellDate.getFullYear() === today.getFullYear()) {
        dayCell.classList.add("today");
      }

      if (bookingData.date &&
          cellDate.getDate() === bookingData.date.getDate() &&
          cellDate.getMonth() === bookingData.date.getMonth() &&
          cellDate.getFullYear() === bookingData.date.getFullYear()) {
        dayCell.classList.add("selected");
      }

      calendarDays.appendChild(dayCell);
    }
  }

  function generateTimeSlots() {
    const times = [
      "09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM",
      "01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM"
    ];

    timeSlots.innerHTML = "";

    times.forEach((time) => {
      const timeSlot = document.createElement("div");
      timeSlot.className = "time-slot";
      timeSlot.textContent = time;

      timeSlot.addEventListener("click", function () {
        document.querySelectorAll(".time-slot").forEach((slot) => {
          slot.classList.remove("selected");
        });

        this.classList.add("selected");
        bookingData.time = time;
      });

      timeSlots.appendChild(timeSlot);
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

    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return date.toLocaleDateString("en-US", options);
  }

  // Newsletter Form Submission
  const newsletterForm = document.getElementById("newsletter-form");
  if (newsletterForm) {
    newsletterForm.addEventListener("submit", function (e) {
      e.preventDefault();
      alert("Thank you for subscribing to our newsletter!");
      newsletterForm.reset();
    });
  }
});