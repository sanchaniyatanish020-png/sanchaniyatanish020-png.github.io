/* ==========================================================================
   TANISH SANCHANIYA - PORTFOLIO INTERACTIVITY & BEHAVIOR
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
    initTypewriter();
    initScrollSpy();
    initMobileNav();
    initScrollReveal();
    initBackToTop();
});

/* --------------------------------------------------------------------------
   1. HERO TYPEWRITER ANIMATION
   -------------------------------------------------------------------------- */
function initTypewriter() {
    const target = document.getElementById("typing-text");
    if (!target) return;

    const titles = [
        "Computer Science Student",
        "Aspiring Full-Stack Developer",
        "Web Software Builder"
    ];

    let titleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    const typeSpeed = 90;
    const deleteSpeed = 45;
    const pauseDelay = 2200;

    function step() {
        const currentTitle = titles[titleIndex];

        if (isDeleting) {
            target.textContent = currentTitle.substring(0, charIndex - 1);
            charIndex--;
        } else {
            target.textContent = currentTitle.substring(0, charIndex + 1);
            charIndex++;
        }

        let delay = isDeleting ? deleteSpeed : typeSpeed;

        if (!isDeleting && charIndex === currentTitle.length) {
            delay = pauseDelay;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            titleIndex = (titleIndex + 1) % titles.length;
            delay = 400;
        }

        setTimeout(step, delay);
    }

    step();
}

/* --------------------------------------------------------------------------
   2. SCROLL SPY & NAVBAR STICKY EFFECT
   -------------------------------------------------------------------------- */
function initScrollSpy() {
    const navbar = document.getElementById("navbar");
    const sections = document.querySelectorAll("section[id]");
    const navLinks = document.querySelectorAll(".nav-link");

    window.addEventListener("scroll", () => {
        const scrollY = window.scrollY;

        // Navbar Shadow on scroll
        if (scrollY > 50) {
            navbar?.classList.add("scrolled");
        } else {
            navbar?.classList.remove("scrolled");
        }

        // Active Link Highlight
        sections.forEach((current) => {
            const sectionHeight = current.offsetHeight;
            const sectionTop = current.offsetTop - 100;
            const sectionId = current.getAttribute("id");

            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                navLinks.forEach((link) => {
                    link.classList.remove("active");
                    if (link.getAttribute("href") === `#${sectionId}`) {
                        link.classList.add("active");
                    }
                });
            }
        });
    });
}

/* --------------------------------------------------------------------------
   3. MOBILE NAVIGATION MENU
   -------------------------------------------------------------------------- */
function initMobileNav() {
    const hamburger = document.getElementById("hamburger");
    const navMenu = document.getElementById("nav-menu");
    const navLinks = document.querySelectorAll(".nav-link");

    hamburger?.addEventListener("click", () => {
        const isActive = navMenu?.classList.toggle("active");
        hamburger.classList.toggle("active");
        document.body.style.overflow = isActive ? "hidden" : "";
    });

    navLinks.forEach((link) => {
        link.addEventListener("click", () => {
            navMenu?.classList.remove("active");
            hamburger?.classList.remove("active");
            document.body.style.overflow = "";
        });
    });
}

/* --------------------------------------------------------------------------
   4. SCROLL REVEAL ANIMATION (INTERSECTION OBSERVER)
   -------------------------------------------------------------------------- */
function initScrollReveal() {
    // Check if user prefers reduced motion
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        return;
    }

    const revealElements = document.querySelectorAll(
        ".section-title-wrapper, .about-text-card, .highlight-card, .skill-category-card, .timeline-card, .project-featured-card, .project-card, .contact-info-box, .contact-form-box"
    );

    const revealObserver = new IntersectionObserver(
        (entries, observer) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = "1";
                    entry.target.style.transform = "translateY(0)";
                    observer.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.12 }
    );

    revealElements.forEach((el) => {
        el.style.opacity = "0";
        el.style.transform = "translateY(25px)";
        el.style.transition = "all 0.6s cubic-bezier(0.16, 1, 0.3, 1)";
        revealObserver.observe(el);
    });
}

/* --------------------------------------------------------------------------
   5. BACK TO TOP BUTTON
   -------------------------------------------------------------------------- */
function initBackToTop() {
    const backToTopBtn = document.getElementById("back-to-top");
    if (!backToTopBtn) return;

    window.addEventListener("scroll", () => {
        if (window.scrollY > 300) {
            backToTopBtn.classList.add("visible");
        } else {
            backToTopBtn.classList.remove("visible");
        }
    });

    backToTopBtn.addEventListener("click", () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    });
}

/* --------------------------------------------------------------------------
   6. CONTACT FORM & MAILTO HANDLER
   -------------------------------------------------------------------------- */
function handleContactSubmit(event) {
    event.preventDefault();

    const nameInput = document.getElementById("sender-name");
    const emailInput = document.getElementById("sender-email");
    const subjectInput = document.getElementById("sender-subject");
    const messageInput = document.getElementById("sender-message");
    const feedback = document.getElementById("form-feedback");

    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const subject = subjectInput.value.trim();
    const message = messageInput.value.trim();

    if (!feedback) return;

    // Reset Feedback
    feedback.className = "form-feedback";
    feedback.style.display = "none";
    feedback.textContent = "";

    // Validation Check
    if (!name || !email || !subject || !message) {
        feedback.className = "form-feedback error";
        feedback.textContent = "⚠️ Please fill in all required fields before sending.";
        return;
    }

    // Basic Email format check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        feedback.className = "form-feedback error";
        feedback.textContent = "⚠️ Please enter a valid email address.";
        return;
    }

    // Construct Mailto URI
    const targetEmail = "sanchaniyatanish020@gmail.com";
    const mailtoSubject = encodeURIComponent(`[Portfolio Inquiry] ${subject}`);
    const mailtoBody = encodeURIComponent(
        `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
    );

    const mailtoUrl = `mailto:${targetEmail}?subject=${mailtoSubject}&body=${mailtoBody}`;

    // Show Success feedback
    feedback.className = "form-feedback success";
    feedback.textContent = "✅ Opening your default email application to complete sending...";

    setTimeout(() => {
        window.location.href = mailtoUrl;
    }, 400);
}
