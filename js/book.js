
// BOOKING PAGE

document.addEventListener("DOMContentLoaded", function () {
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

  // Calendar Data
  let currentDate = new Date();
  let selectedDate = null;
  let selectedTime = null;

  // Step Elements
  const steps = document.querySelectorAll(".step");
  const stepContents = document.querySelectorAll(".step-content");

  // Service Selection
  const serviceOptions = document.querySelectorAll(".service-option");

  // Navigation Buttons
  const btnNext1 = document.getElementById("btn-next-1");
  const btnPrev2 = document.getElementById("btn-prev-2");
  const btnNext2 = document.getElementById("btn-next-2");
  const btnPrev3 = document.getElementById("btn-prev-3");
  const btnNext3 = document.getElementById("btn-next-3");
  const btnPrev4 = document.getElementById("btn-prev-4");
  const btnSubmit = document.getElementById("btn-submit");

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

  // Initialize Calendar
  renderCalendar();
  generateTimeSlots();

  // Service Selection
  serviceOptions.forEach((option) => {
    option.addEventListener("click", function () {
      // Remove selected class from all options
      serviceOptions.forEach((opt) => opt.classList.remove("selected"));

      // Add selected class to clicked option
      this.classList.add("selected");

      // Update booking data
      bookingData.service = this.getAttribute("data-service");
      bookingData.price = this.getAttribute("data-price");
      bookingData.duration = this.getAttribute("data-duration");
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
    // In a real application, you would send the data to a server here
    // For this demo, we'll just show the success message

    // Show success step
    document.getElementById("step-content-4").classList.remove("active");
    document.getElementById("step-content-success").classList.add("active");

    // Update success details
    successEmail.textContent = bookingData.email;
    successDate.textContent = formatDate(selectedDate);
    successTime.textContent = selectedTime;

    // In a real application, you would send the form data to a server here
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

  // Newsletter Form Submission
  const newsletterForm = document.getElementById("newsletter-form");
  newsletterForm.addEventListener("submit", function (e) {
    e.preventDefault();
    alert("Thank you for subscribing to our newsletter!");
    newsletterForm.reset();
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
        if (!bookingData.service) {
          alert("Please select a service");
          return false;
        }
        return true;
      case 2:
        // Get form values
        const firstName = document.getElementById("first-name").value.trim();
        const lastName = document.getElementById("last-name").value.trim();
        const email = document.getElementById("email").value.trim();
        const phone = document.getElementById("phone").value.trim();

        // Validate required fields
        if (!firstName || !lastName || !email || !phone) {
          alert("Please fill in all required fields");
          return false;
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
          alert("Please enter a valid email address");
          return false;
        }

        // Update booking data
        bookingData.firstName = firstName;
        bookingData.lastName = lastName;
        bookingData.email = email;
        bookingData.phone = phone;
        bookingData.notes = document.getElementById("notes").value;

        return true;
      case 3:
        if (!selectedDate || !selectedTime) {
          alert("Please select a date and time for your appointment");
          return false;
        }

        // Update booking data
        bookingData.date = selectedDate;
        bookingData.time = selectedTime;

        return true;
      default:
        return true;
    }
  }

  function populateConfirmation() {
    confirmService.textContent = bookingData.service;
    confirmDate.textContent = formatDate(selectedDate);
    confirmTime.textContent = selectedTime;
    confirmDuration.textContent = `${bookingData.duration} minutes`;
    confirmPrice.textContent = `UGX ${Number(
      bookingData.price
    ).toLocaleString()}`;
    confirmName.textContent = `${bookingData.firstName} ${bookingData.lastName}`;
    confirmEmail.textContent = bookingData.email;
    confirmPhone.textContent = bookingData.phone;
  }

  function renderCalendar() {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    // Update calendar header
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

    // Get first day of month and number of days
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    // Clear previous calendar
    calendarDays.innerHTML = "";

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      const emptyCell = document.createElement("div");
      emptyCell.className = "calendar-day disabled";
      calendarDays.appendChild(emptyCell);
    }

    // Add cells for each day of the month
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 1; i <= daysInMonth; i++) {
      const dayCell = document.createElement("div");
      dayCell.className = "calendar-day";
      dayCell.textContent = i;

      const cellDate = new Date(year, month, i);

      // Disable past dates
      if (cellDate < today) {
        dayCell.classList.add("disabled");
      } else {
        dayCell.addEventListener("click", function () {
          // Remove selected class from all days
          document.querySelectorAll(".calendar-day").forEach((day) => {
            day.classList.remove("selected");
          });

          // Add selected class to clicked day
          this.classList.add("selected");

          // Update selected date
          selectedDate = new Date(cellDate);

          // Reset time selection
          selectedTime = null;
          resetTimeSlots();
        });
      }

      // Mark today
      if (
        cellDate.getDate() === today.getDate() &&
        cellDate.getMonth() === today.getMonth() &&
        cellDate.getFullYear() === today.getFullYear()
      ) {
        dayCell.classList.add("today");
      }

      // Mark selected date
      if (
        selectedDate &&
        cellDate.getDate() === selectedDate.getDate() &&
        cellDate.getMonth() === selectedDate.getMonth() &&
        cellDate.getFullYear() === selectedDate.getFullYear()
      ) {
        dayCell.classList.add("selected");
      }

      calendarDays.appendChild(dayCell);
    }
  }

  function generateTimeSlots() {
    // In a real application, you would get available time slots from the server
    // For this demo, we'll generate some sample time slots
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
      const timeSlot = document.createElement("div");
      timeSlot.className = "time-slot";
      timeSlot.textContent = time;

      timeSlot.addEventListener("click", function () {
        // Remove selected class from all time slots
        document.querySelectorAll(".time-slot").forEach((slot) => {
          slot.classList.remove("selected");
        });

        // Add selected class to clicked time slot
        this.classList.add("selected");

        // Update selected time
        selectedTime = time;
      });

      timeSlots.appendChild(timeSlot);
    });
  }

  function resetTimeSlots() {
    document.querySelectorAll(".time-slot").forEach((slot) => {
      slot.classList.remove("selected");
    });
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
});