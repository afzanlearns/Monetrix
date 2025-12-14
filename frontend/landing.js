/* ==========
   Monetrix Landing Page Script
   Controls:
   - Login modal open/close
   - Switch login <-> signup forms
   - Authentication requests to backend
   - LocalStorage JWT handling
   - Smooth scrolling
   - Contact form handling
   ========== */

// Element selectors
const modalOverlay = document.getElementById("modal-overlay");
const openModalBtn = document.getElementById("open-login-modal");
const closeModalBtn = document.getElementById("close-modal");

const loginForm = document.getElementById("login-form");
const signupForm = document.getElementById("signup-form");

const switchToSignup = document.getElementById("switch-to-signup");
const switchToLogin = document.getElementById("switch-to-login");

const modalTitle = document.getElementById("modal-title");
const contactForm = document.getElementById("contact-form");
const nav = document.querySelector(".nav");

// Backend API URL
const API_BASE = "http://localhost:5000"; // Change when deploying

// ========== Navbar Scroll Effect ==========
window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
        nav.classList.add("scrolled");
    } else {
        nav.classList.remove("scrolled");
    }
});

// ========== Smooth Scrolling for Nav Links ==========
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener("click", function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute("href"));
        if (target) {
            target.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });
        }
    });
});

// ========== Modal Open ==========
openModalBtn.addEventListener("click", () => {
    modalOverlay.classList.add("active");
    loginForm.classList.add("active");
    signupForm.classList.remove("active");
    modalTitle.textContent = "Login";
    document.body.style.overflow = "hidden";
});

// ========== Modal Close ==========
closeModalBtn.addEventListener("click", () => {
    modalOverlay.classList.remove("active");
    document.body.style.overflow = "auto";
});

window.addEventListener("click", (e) => {
    if (e.target === modalOverlay) {
        modalOverlay.classList.remove("active");
        document.body.style.overflow = "auto";
    }
});

// ========== Switch to Signup ==========
switchToSignup.addEventListener("click", () => {
    loginForm.classList.remove("active");
    signupForm.classList.add("active");
    modalTitle.textContent = "Create Account";
});

// ========== Switch to Login ==========
switchToLogin.addEventListener("click", () => {
    signupForm.classList.remove("active");
    loginForm.classList.add("active");
    modalTitle.textContent = "Login";
});

// ========== LOGIN LOGIC ==========
loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("login-email").value;
    const password = document.getElementById("login-password").value;

    const submitBtn = loginForm.querySelector("button[type='submit']");
    const originalText = submitBtn.textContent;
    submitBtn.textContent = "Logging in...";
    submitBtn.disabled = true;

    try {
        const res = await fetch(`${API_BASE}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        });

        const data = await res.json();

        if (!res.ok) {
            alert(data.message || "Login failed");
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
            return;
        }

        // Save JWT + user details
        localStorage.setItem("monetrix_token", data.token);
        localStorage.setItem("monetrix_user", JSON.stringify(data.user));

        // Show success message
        submitBtn.textContent = "Success! Redirecting...";

        setTimeout(() => {
            window.location.href = "analyzer.html";
        }, 500);

    } catch (err) {
        console.error(err);
        alert("Server error. Please try later.");
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }
});

// ========== SIGNUP LOGIC ==========
signupForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("signup-name").value;
    const email = document.getElementById("signup-email").value;
    const password = document.getElementById("signup-password").value;

    const submitBtn = signupForm.querySelector("button[type='submit']");
    const originalText = submitBtn.textContent;
    submitBtn.textContent = "Creating account...";
    submitBtn.disabled = true;

    try {
        const res = await fetch(`${API_BASE}/auth/signup`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, email, password })
        });

        const data = await res.json();

        if (!res.ok) {
            alert(data.message || "Signup failed");
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
            return;
        }

        // Save JWT + user
        localStorage.setItem("monetrix_token", data.token);
        localStorage.setItem("monetrix_user", JSON.stringify(data.user));

        // Show success message
        submitBtn.textContent = "Success! Redirecting...";

        setTimeout(() => {
            window.location.href = "analyzer.html";
        }, 500);

    } catch (err) {
        console.error(err);
        alert("Server error. Please try later.");
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }
});

// ========== Contact Form Handler ==========
if (contactForm) {
    contactForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const name = document.getElementById("contact-name").value;
        const email = document.getElementById("contact-email").value;
        const message = document.getElementById("contact-message").value;

        const submitBtn = contactForm.querySelector("button[type='submit']");
        const originalText = submitBtn.textContent;
        submitBtn.textContent = "Sending...";
        submitBtn.disabled = true;

        // In a real application, you would send this to your backend
        // For now, we'll just show a success message
        setTimeout(() => {
            alert("Thank you for your message! We'll get back to you soon.");
            contactForm.reset();
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }, 1000);
    });
}

// ========== Number Counter Animation ==========
function animateCounter(element, target, duration = 2000) {
    const start = 0;
    const increment = target / (duration / 16);
    let current = start;

    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target === 10000 ? "10K+" : target + "%";
            clearInterval(timer);
        } else {
            const value = Math.floor(current);
            element.textContent = target === 10000 ? value.toLocaleString() + "+" : value + "%";
        }
    }, 16);
}

// ========== Intersection Observer for Animations ==========
const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px"
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = "1";
            entry.target.style.transform = "translateY(0)";

            // Animate counters
            if (entry.target.classList.contains('stat-number')) {
                const target = parseInt(entry.target.getAttribute('data-target'));
                if (target && entry.target.textContent === "0") {
                    animateCounter(entry.target, target);
                }
            }
        }
    });
}, observerOptions);

// Observe all cards and sections
document.querySelectorAll(".about-card, .service-card, .contact-item").forEach(el => {
    el.style.opacity = "0";
    el.style.transform = "translateY(20px)";
    el.style.transition = "opacity 0.6s ease, transform 0.6s ease";
    observer.observe(el);
});

// Observe stat numbers
document.querySelectorAll(".stat-number[data-target]").forEach(el => {
    observer.observe(el);
});
