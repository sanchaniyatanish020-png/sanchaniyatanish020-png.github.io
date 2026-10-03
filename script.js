/* ==========================================================================
   TANISH SANCHANIYA - PORTFOLIO INTERACTIVITY & BEHAVIOR
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
    initTypewriter();
    initScrollSpy();
    initMobileNav();
    initScrollReveal();
    initBackToTop();
    initDynamicBackground();
    initCustomCursor();
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

/* --------------------------------------------------------------------------
   7. DYNAMIC INTERACTIVE BACKGROUND CANVAS
   -------------------------------------------------------------------------- */
function initDynamicBackground() {
    const canvas = document.getElementById("bg-canvas");
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Respect reduced motion preference
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let width = 0;
    let height = 0;
    let particles = [];
    let animationFrameId = null;

    // Mouse position tracking
    const mouse = {
        x: null,
        y: null,
        radius: 150,
        active: false
    };

    // Color palette for particles matching portfolio branding (Blue, Violet, Cyan, Indigo)
    const colors = [
        { r: 37, g: 99, b: 235 },   // Primary Blue (#2563eb)
        { r: 124, g: 58, b: 237 },  // Violet (#7c3aed)
        { r: 6, g: 182, b: 212 },   // Cyan (#06b6d4)
        { r: 99, g: 102, b: 241 }   // Indigo (#6366f1)
    ];

    class Particle {
        constructor() {
            this.reset(true);
        }

        reset(isInitial = false) {
            this.x = Math.random() * width;
            this.y = isInitial ? Math.random() * height : (Math.random() < 0.5 ? -10 : height + 10);
            
            // Slow smooth vector velocity
            const speed = Math.random() * 0.45 + 0.15;
            const angle = Math.random() * Math.PI * 2;
            this.vx = Math.cos(angle) * speed;
            this.vy = Math.sin(angle) * speed;

            this.radius = Math.random() * 2.2 + 1.2;
            this.baseRadius = this.radius;
            
            this.color = colors[Math.floor(Math.random() * colors.length)];
            this.alpha = Math.random() * 0.35 + 0.15;
            this.baseAlpha = this.alpha;
            
            // Opacity pulsing parameters
            this.pulseAngle = Math.random() * Math.PI * 2;
            this.pulseSpeed = Math.random() * 0.02 + 0.005;
        }

        update() {
            // Pulse opacity
            this.pulseAngle += this.pulseSpeed;
            this.alpha = this.baseAlpha + Math.sin(this.pulseAngle) * 0.1;

            // Move position
            this.x += this.vx;
            this.y += this.vy;

            // Interactive mouse attraction / repulsion & size glow
            if (mouse.active && mouse.x !== null && mouse.y !== null) {
                const dx = mouse.x - this.x;
                const dy = mouse.y - this.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < mouse.radius) {
                    const force = (mouse.radius - dist) / mouse.radius;
                    // Gentle push outward from cursor
                    this.x -= (dx / dist) * force * 1.5;
                    this.y -= (dy / dist) * force * 1.5;

                    // Expand particle when mouse is close
                    this.radius = this.baseRadius + force * 2.5;
                    this.alpha = Math.min(0.85, this.baseAlpha + force * 0.4);
                } else {
                    this.radius += (this.baseRadius - this.radius) * 0.08;
                }
            } else {
                this.radius += (this.baseRadius - this.radius) * 0.08;
            }

            // Screen edge boundary wrapping
            if (this.x < -20) this.x = width + 20;
            if (this.x > width + 20) this.x = -20;
            if (this.y < -20) this.y = height + 20;
            if (this.y > height + 20) this.y = -20;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, Math.max(0.5, this.radius), 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${Math.max(0, this.alpha)})`;
            ctx.fill();
        }
    }

    function resizeCanvas() {
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        width = window.innerWidth;
        height = window.innerHeight;

        canvas.width = width * dpr;
        canvas.height = height * dpr;
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;

        ctx.resetTransform();
        ctx.scale(dpr, dpr);

        // Adjust particle density based on display area
        const area = width * height;
        const particleCount = prefersReducedMotion 
            ? 0 
            : Math.min(85, Math.max(25, Math.floor(area / 19000)));

        particles = [];
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }
    }

    function drawConnections() {
        const maxDist = 130;
        const maxDistSq = maxDist * maxDist;

        for (let i = 0; i < particles.length; i++) {
            const p1 = particles[i];
            
            // Connect nearby node pairs
            for (let j = i + 1; j < particles.length; j++) {
                const p2 = particles[j];
                const dx = p1.x - p2.x;
                const dy = p1.y - p2.y;
                const distSq = dx * dx + dy * dy;

                if (distSq < maxDistSq) {
                    const dist = Math.sqrt(distSq);
                    const alpha = (1 - dist / maxDist) * 0.16;

                    ctx.beginPath();
                    ctx.moveTo(p1.x, p1.y);
                    ctx.lineTo(p2.x, p2.y);
                    ctx.strokeStyle = `rgba(${p1.color.r}, ${p1.color.g}, ${p1.color.b}, ${alpha})`;
                    ctx.lineWidth = 0.8;
                    ctx.stroke();
                }
            }

            // Connect node to mouse pointer
            if (mouse.active && mouse.x !== null && mouse.y !== null) {
                const dx = p1.x - mouse.x;
                const dy = p1.y - mouse.y;
                const distSq = dx * dx + dy * dy;
                const mouseMaxDist = mouse.radius;

                if (distSq < mouseMaxDist * mouseMaxDist) {
                    const dist = Math.sqrt(distSq);
                    const alpha = (1 - dist / mouseMaxDist) * 0.32;

                    ctx.beginPath();
                    ctx.moveTo(p1.x, p1.y);
                    ctx.lineTo(mouse.x, mouse.y);
                    ctx.strokeStyle = `rgba(${p1.color.r}, ${p1.color.g}, ${p1.color.b}, ${alpha})`;
                    ctx.lineWidth = 1.2;
                    ctx.stroke();
                }
            }
        }
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);

        particles.forEach((particle) => {
            particle.update();
            particle.draw();
        });

        drawConnections();

        animationFrameId = requestAnimationFrame(animate);
    }

    // Window Listeners
    let resizeTimeout;
    window.addEventListener("resize", () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(resizeCanvas, 100);
    });

    window.addEventListener("mousemove", (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
        mouse.active = true;
    });

    window.addEventListener("mouseleave", () => {
        mouse.active = false;
        mouse.x = null;
        mouse.y = null;
    });

    // Touch interaction for mobile browsers
    window.addEventListener("touchmove", (e) => {
        if (e.touches.length > 0) {
            mouse.x = e.touches[0].clientX;
            mouse.y = e.touches[0].clientY;
            mouse.active = true;
        }
    }, { passive: true });

    window.addEventListener("touchend", () => {
        mouse.active = false;
        mouse.x = null;
        mouse.y = null;
    });

    // Performance optimization: Pause rendering when page is hidden
    document.addEventListener("visibilitychange", () => {
        if (document.visibilityState === "hidden") {
            if (animationFrameId) cancelAnimationFrame(animationFrameId);
        } else {
            animationFrameId = requestAnimationFrame(animate);
        }
    });

    // Run Initial Setup & Start Loop
    resizeCanvas();
    if (!prefersReducedMotion) {
        animate();
    }
}

/* --------------------------------------------------------------------------
   8. CUSTOM GLOWING INTERACTIVE CURSOR
   -------------------------------------------------------------------------- */
function initCustomCursor() {
    const dot = document.getElementById("cursor-dot");
    const ring = document.getElementById("cursor-ring");
    if (!dot || !ring) return;

    // Disable if user prefers reduced motion or is on touch device
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
        window.matchMedia("(hover: none) and (pointer: coarse)").matches) {
        return;
    }

    let mouseX = -100;
    let mouseY = -100;
    let ringX = -100;
    let ringY = -100;
    let isMoving = false;

    // Instant dot tracking & position update
    window.addEventListener("mousemove", (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        dot.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;

        if (!isMoving) {
            document.body.classList.add("custom-cursor-active");
            isMoving = true;
            renderCursorRing();
        }
    });

    // Smooth lerping loop for ring follower
    function renderCursorRing() {
        if (!isMoving) return;

        ringX += (mouseX - ringX) * 0.18;
        ringY += (mouseY - ringY) * 0.18;

        ring.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%, -50%)`;

        requestAnimationFrame(renderCursorRing);
    }

    // Hide cursor when mouse leaves document window
    document.addEventListener("mouseleave", () => {
        document.body.classList.remove("custom-cursor-active");
        isMoving = false;
    });

    // Hover effect on interactive UI components
    const interactiveSelectors = "a, button, input, textarea, select, .project-card, .project-featured-card, .skill-category-card, .highlight-card, .timeline-card, .btn, .nav-logo, .hamburger";
    
    document.addEventListener("mouseover", (e) => {
        if (e.target.closest(interactiveSelectors)) {
            document.body.classList.add("cursor-hover");
        }
    });

    document.addEventListener("mouseout", (e) => {
        if (e.target.closest(interactiveSelectors)) {
            document.body.classList.remove("cursor-hover");
        }
    });

    // Click pulse animation
    window.addEventListener("mousedown", () => {
        document.body.classList.add("cursor-click");
    });

    window.addEventListener("mouseup", () => {
        document.body.classList.remove("cursor-click");
    });
}
