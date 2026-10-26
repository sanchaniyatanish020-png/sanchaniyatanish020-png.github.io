/* ==========================================================================
   TANISH SANCHANIYA - PORTFOLIO INTERACTIVITY & BEHAVIOR
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
    initTypewriter();
    initNavPill();
    initScrollSpy();
    initMobileNav();
    initScrollReveal();
    initBackToTop();
    initDynamicBackground();
    initLiveClock();
    initCopyEmail();
    initProjectFilter();
    initProjectModal();
    initTerminal();
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

    function updateActiveLink() {
        const scrollY = window.scrollY;

        // Navbar shadow on scroll
        navbar?.classList.toggle("scrolled", scrollY > 50);

        // Determine active section
        let activeSectionId = null;
        sections.forEach((section) => {
            const top = section.offsetTop - 110;
            if (scrollY >= top && scrollY < top + section.offsetHeight) {
                activeSectionId = section.getAttribute("id");
            }
        });

        navLinks.forEach((link) => {
            const isActive = link.getAttribute("href") === `#${activeSectionId}`;
            link.classList.toggle("active", isActive);
        });

        updatePill();
    }

    window.addEventListener("scroll", updateActiveLink, { passive: true });
    updateActiveLink(); // run once on load
}

/* --------------------------------------------------------------------------
   3. MOBILE NAVIGATION MENU
   -------------------------------------------------------------------------- */
function initMobileNav() {
    const hamburger = document.getElementById("hamburger");
    const navMenu   = document.getElementById("nav-menu");
    const navLinks  = document.querySelectorAll(".nav-link");

    function openMenu() {
        navMenu?.classList.add("active");
        hamburger?.classList.add("active");
        document.body.style.overflow = "hidden";
    }

    function closeMenu() {
        navMenu?.classList.remove("active");
        hamburger?.classList.remove("active");
        document.body.style.overflow = "";
    }

    hamburger?.addEventListener("click", () => {
        navMenu?.classList.contains("active") ? closeMenu() : openMenu();
    });

    // Close when a link is clicked
    navLinks.forEach((link) => link.addEventListener("click", closeMenu));

    // Close on Escape key
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") closeMenu();
    });

    // Close on outside click (clicking the overlay backdrop)
    navMenu?.addEventListener("click", (e) => {
        if (e.target === navMenu) closeMenu();
    });
}

/* --------------------------------------------------------------------------
   3b. NAV PILL INDICATOR — slides smoothly on hover & tracks active link
   -------------------------------------------------------------------------- */
let isHoveringNav = false;

function initNavPill() {
    const pill = document.getElementById("nav-active-pill");
    const navList = document.querySelector(".nav-list");
    const navLinks = document.querySelectorAll(".nav-link");

    if (!pill || !navList) return;

    // Hover effect: glide pill to whatever link is hovered
    navLinks.forEach((link) => {
        link.addEventListener("mouseenter", () => {
            isHoveringNav = true;
            movePillTo(link);
        });
    });

    // Return to the active section link when mouse leaves the navbar
    navList.addEventListener("mouseleave", () => {
        isHoveringNav = false;
        updatePill();
    });

    window.addEventListener("resize", () => {
        if (!isHoveringNav) updatePill();
    });

    // Initial position after render
    setTimeout(updatePill, 100);
}

function movePillTo(targetLink) {
    const pill = document.getElementById("nav-active-pill");
    const navList = document.querySelector(".nav-list");
    const navLinks = document.querySelectorAll(".nav-link");

    if (!pill || !navList || !targetLink) return;
    if (window.innerWidth <= 768) {
        pill.style.opacity = "0";
        navLinks.forEach(l => l.classList.remove("has-pill"));
        return;
    }

    const listRect = navList.getBoundingClientRect();
    const targetRect = targetLink.getBoundingClientRect();

    pill.style.width = `${targetRect.width}px`;
    pill.style.height = `${targetRect.height}px`;
    pill.style.left = `${targetRect.left - listRect.left}px`;
    pill.style.top = `${targetRect.top - listRect.top}px`;
    pill.style.opacity = "1";

    // Apply white text ONLY to the tab currently covered by the pill
    navLinks.forEach((link) => {
        if (link === targetLink) {
            link.classList.add("has-pill");
        } else {
            link.classList.remove("has-pill");
        }
    });
}

function updatePill() {
    if (isHoveringNav) return; // Don't interrupt hover glide
    const navList = document.querySelector(".nav-list");
    const active = navList?.querySelector(".nav-link.active") || navList?.querySelector(".nav-link");
    movePillTo(active);
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

            this.radius += (this.baseRadius - this.radius) * 0.08;

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
   9. REAL-TIME SURAT (IST) CLOCK
   -------------------------------------------------------------------------- */
function initLiveClock() {
    const clockEl = document.getElementById("hero-clock");
    if (!clockEl) return;

    function updateClock() {
        const now = new Date();
        const options = {
            timeZone: "Asia/Kolkata",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: true
        };
        const timeString = new Intl.DateTimeFormat("en-US", options).format(now);
        clockEl.textContent = timeString;
    }

    updateClock();
    setInterval(updateClock, 1000);
}

/* --------------------------------------------------------------------------
   10. TOAST NOTIFICATION SYSTEM
   -------------------------------------------------------------------------- */
function showToast(message, type = "info", duration = 3200) {
    const container = document.getElementById("toast-container");
    if (!container) return;

    const toast = document.createElement("div");
    toast.className = `toast toast-${type}`;

    let iconHtml = '<i class="fa-solid fa-circle-info"></i>';
    if (type === "success") iconHtml = '<i class="fa-solid fa-circle-check"></i>';
    if (type === "warning") iconHtml = '<i class="fa-solid fa-triangle-exclamation"></i>';

    toast.innerHTML = `${iconHtml} <span>${message}</span>`;
    container.appendChild(toast);

    requestAnimationFrame(() => {
        toast.classList.add("show");
    });

    setTimeout(() => {
        toast.classList.remove("show");
        toast.addEventListener("transitionend", () => {
            toast.remove();
        });
    }, duration);
}

/* --------------------------------------------------------------------------
   11. 1-CLICK EMAIL CLIPBOARD COPY
   -------------------------------------------------------------------------- */
function initCopyEmail() {
    const email = "sanchaniyatanish020@gmail.com";
    const heroBtn = document.getElementById("hero-copy-email-btn");
    const contactBtn = document.getElementById("contact-copy-email-btn");

    function copyAction(e) {
        e.preventDefault();
        e.stopPropagation();
        navigator.clipboard.writeText(email).then(() => {
            showToast("📋 Email copied to clipboard!", "success");
        }).catch(() => {
            showToast(`Email: ${email}`, "info");
        });
    }

    heroBtn?.addEventListener("click", copyAction);
    contactBtn?.addEventListener("click", copyAction);
}

/* --------------------------------------------------------------------------
   12. PROJECT FILTERING & REAL-TIME SEARCH
   -------------------------------------------------------------------------- */
function initProjectFilter() {
    const filterTabs = document.querySelectorAll(".filter-tab");
    const searchInput = document.getElementById("project-search-input");
    const clearBtn = document.getElementById("search-clear-btn");
    const projectCards = document.querySelectorAll(".project-featured-card, .project-card");

    let activeFilter = "all";
    let searchQuery = "";

    function filterProjects() {
        projectCards.forEach((card) => {
            const category = card.getAttribute("data-category") || "";
            const tech = (card.getAttribute("data-tech") || "").toLowerCase();
            const textContent = card.textContent.toLowerCase();

            const matchesCategory = activeFilter === "all" || category === activeFilter;
            const matchesSearch = !searchQuery || tech.includes(searchQuery) || textContent.includes(searchQuery);

            if (matchesCategory && matchesSearch) {
                card.style.display = "";
                card.classList.remove("hidden-project");
            } else {
                card.style.display = "none";
                card.classList.add("hidden-project");
            }
        });

        if (clearBtn) {
            clearBtn.style.display = searchQuery ? "flex" : "none";
        }
    }

    filterTabs.forEach((tab) => {
        tab.addEventListener("click", () => {
            filterTabs.forEach((t) => t.classList.remove("active"));
            tab.classList.add("active");
            activeFilter = tab.getAttribute("data-filter");
            filterProjects();
        });
    });

    searchInput?.addEventListener("input", (e) => {
        searchQuery = e.target.value.trim().toLowerCase();
        filterProjects();
    });

    clearBtn?.addEventListener("click", () => {
        if (searchInput) searchInput.value = "";
        searchQuery = "";
        filterProjects();
    });
}

/* --------------------------------------------------------------------------
   13. PROJECT QUICK VIEW MODAL
   -------------------------------------------------------------------------- */
function initProjectModal() {
    const modal = document.getElementById("project-modal");
    const modalContent = document.getElementById("project-modal-content");
    const closeBtn = document.getElementById("project-modal-close");
    const viewBtns = document.querySelectorAll(".quick-view-btn");

    const projectsData = {
        library: {
            title: "Library Management System",
            category: "Full-Stack System",
            status: "Completed across 3 Stacks",
            description: "An enterprise-grade academic project created to manage book cataloging, user membership, loan tracking, reserves, and administrator dashboards across multiple technology approaches.",
            stacks: [
                { name: "ASP.NET Edition", desc: "C# backend with SQL Server database & Razor UI components." },
                { name: "PHP & MySQL Edition", desc: "Classic LAMP stack architecture with relational database queries." },
                { name: "MERN Stack Edition", desc: "Modern React SPA frontend, Node.js/Express REST APIs, and MongoDB database." }
            ],
            features: [
                "Role-based authentication (Admin & User)",
                "Book search, pagination & dynamic category filtering",
                "Issue / Return tracking with automated fine calculation",
                "User book reservation & request approval flow",
                "Analytics dashboard for total books, active loans & overdue alerts"
            ],
            link: "https://github.com/sanchaniyatanish020-png"
        },
        portfolio: {
            title: "Personal Developer Portfolio",
            category: "Frontend Web Application",
            status: "Live & Active",
            description: "A custom-built, responsive portfolio website featuring fluid ambient animations, theme switching (Light/Dark), real-time project searching, interactive CLI terminal, and clean semantic architecture.",
            stacks: [
                { name: "Core Stack", desc: "HTML5, Vanilla CSS3 (Custom Glassmorphism), ES6+ JavaScript" },
                { name: "Libraries", desc: "Font Awesome 6, Devicon, Google Fonts" }
            ],
            features: [
                "Interactive CLI terminal drawer with fun commands",
                "Theme toggle with LocalStorage state persistence",
                "Real-time IST Surat local time clock badge",
                "1-Click Copy Email & Toast Notification feedback",
                "Filterable project matrix and search bar"
            ],
            link: "https://github.com/sanchaniyatanish020-png"
        },
        nehvisa: {
            title: "Nehvisa Holidays | Best Travel Agency in Surat",
            category: "Web Application (React + Vite)",
            status: "Completed & Live",
            description: "A complete, live responsive travel agency web platform for Nehvisa Holidays built using React and Vite. Offers domestic and international tour packages, destination highlights, hotel & transport arrangements, and instant customer booking inquiry integration.",
            stacks: [
                { name: "Frontend Framework", desc: "React with modular component architecture" },
                { name: "Build Tool & Bundler", desc: "Vite (Fast Hot Module Replacement & optimized build)" },
                { name: "Core Languages", desc: "JavaScript (ES6+), HTML5, CSS3" },
                { name: "Deployment", desc: "Netlify Production Hosting with Continuous Deployment" }
            ],
            features: [
                "Domestic & International tour packages showcase",
                "Built with React and Vite for blazing-fast page loads and smooth navigation",
                "Mobile-first responsive design tailored for fast mobile browsing",
                "Direct WhatsApp inquiry and quick booking contact integration",
                "Destination highlights, detailed itineraries, and travel consultation"
            ],
            liveUrl: "https://nehvisa-holiday.netlify.app/",
            link: "https://github.com/sanchaniyatanish020-png"
        }
    };

    function openModal(projectId) {
        const data = projectsData[projectId];
        if (!data || !modal || !modalContent) return;

        let stacksHtml = data.stacks.map(s => `
            <div class="modal-stack-item">
                <strong><i class="fa-solid fa-layer-group"></i> ${s.name}:</strong> ${s.desc}
            </div>
        `).join("");

        let featuresHtml = data.features.map(f => `
            <li><i class="fa-solid fa-circle-check"></i> ${f}</li>
        `).join("");

        modalContent.innerHTML = `
            <span class="modal-badge">${data.category} &bull; ${data.status}</span>
            <h2 class="modal-title">${data.title}</h2>
            <p class="modal-desc">${data.description}</p>
            
            <div class="modal-section">
                <h3>Architecture & Tech Stack</h3>
                <div class="modal-stacks-grid">${stacksHtml}</div>
            </div>

            <div class="modal-section">
                <h3>Key Features</h3>
                <ul class="modal-features-list">${featuresHtml}</ul>
            </div>

            <div class="modal-actions">
                ${data.liveUrl ? `
                <a href="${data.liveUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-primary">
                    <i class="fa-solid fa-arrow-up-right-from-square"></i> Visit Live Website
                </a>
                ` : ''}
                <a href="${data.link}" target="_blank" rel="noopener noreferrer" class="btn btn-outline">
                    <i class="fa-brands fa-github"></i> View GitHub Repository
                </a>
            </div>
        `;

        modal.classList.add("active");
        document.body.style.overflow = "hidden";
    }

    function closeModal() {
        if (!modal) return;
        modal.classList.remove("active");
        document.body.style.overflow = "";
    }

    viewBtns.forEach(btn => {
        btn.addEventListener("click", (e) => {
            e.preventDefault();
            const pid = btn.getAttribute("data-project");
            openModal(pid);
        });
    });

    closeBtn?.addEventListener("click", closeModal);
    modal?.addEventListener("click", (e) => {
        if (e.target === modal) closeModal();
    });
    window.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && modal?.classList.contains("active")) closeModal();
    });
}

/* --------------------------------------------------------------------------
   14. DEVELOPER CLI INTERACTIVE TERMINAL
   -------------------------------------------------------------------------- */
function initTerminal() {
    const triggerBtn = document.getElementById("terminal-trigger-btn");
    const modal = document.getElementById("terminal-modal");
    const closeBtn = document.getElementById("terminal-close-btn");
    const closeDot = document.getElementById("terminal-close-dot");
    const input = document.getElementById("terminal-input");
    const output = document.getElementById("terminal-output");
    const quickBtns = document.querySelectorAll(".quick-cmd-btn");

    if (!modal || !input || !output) return;

    function openTerminal() {
        modal.classList.add("active");
        document.body.style.overflow = "hidden";
        setTimeout(() => input.focus(), 150);
    }

    function closeTerminal() {
        modal.classList.remove("active");
        document.body.style.overflow = "";
    }

    triggerBtn?.addEventListener("click", openTerminal);
    closeBtn?.addEventListener("click", closeTerminal);
    closeDot?.addEventListener("click", closeTerminal);
    modal.addEventListener("click", (e) => {
        if (e.target === modal) closeTerminal();
    });

    quickBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            const cmd = btn.getAttribute("data-cmd");
            if (cmd) executeCommand(cmd);
        });
    });

    input.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            const cmd = input.value.trim();
            if (cmd) {
                executeCommand(cmd);
                input.value = "";
            }
        }
    });

    function executeCommand(rawCmd) {
        const cmd = rawCmd.trim().toLowerCase();
        
        const line = document.createElement("div");
        line.className = "terminal-line user-input-line";
        line.innerHTML = `<span class="prompt">tanish@dev:~$</span> <span class="cmd-text">${escapeHtml(rawCmd)}</span>`;
        output.appendChild(line);

        const resp = document.createElement("div");
        resp.className = "terminal-line response-line";

        switch (cmd) {
            case "help":
            case "?":
                resp.innerHTML = `
<span class="highlight">Available Commands:</span>
  <span class="cmd-name">about</span>     - Summary about Tanish Sanchaniya
  <span class="cmd-name">skills</span>    - Technical skills & proficiency breakdown
  <span class="cmd-name">projects</span>  - List of featured projects & status
  <span class="cmd-name">contact</span>   - Contact email, phone & social profiles
  <span class="cmd-name">time</span>      - Current time in Surat, Gujarat (IST)
  <span class="cmd-name">hire</span>      - Inquiry message & quick copy action
  <span class="cmd-name">clear</span>     - Clear terminal screen
  <span class="cmd-name">sudo</span>      - Gain root guest privileges
`;
                break;

            case "about":
            case "bio":
                resp.innerHTML = `
<span class="highlight">👨‍💻 Tanish Sanchaniya</span>
  • Degree: BCA (5th Semester Completed)
  • Institution: Sutex Bank College of Computer Application & Science
  • Location: Surat, Gujarat, India
  • Passion: Full-Stack Web Development, Clean Code & Database Systems
`;
                break;

            case "skills":
            case "tech":
                resp.innerHTML = `
<span class="highlight">🛠️ Technical Skill Matrix:</span>
  • <span class="cmd-name">Frontend:</span> HTML5, CSS3, JavaScript (ES6+), React
  • <span class="cmd-name">Backend:</span> Node.js, PHP, ASP.NET (C#)
  • <span class="cmd-name">Databases:</span> MySQL, MongoDB
  • <span class="cmd-name">Languages:</span> C, C++, Java, Python
  • <span class="cmd-name">Tools:</span> Git, GitHub, VS Code
`;
                break;

            case "projects":
            case "work":
                resp.innerHTML = `
<span class="highlight">🚀 Featured Projects:</span>
  1. <span class="cmd-name">Library Management System</span> [ASP.NET | PHP/MySQL | MERN]
  2. <span class="cmd-name">Personal Portfolio Website</span> [HTML, CSS, Vanilla JS]
  3. <a href="https://nehvisa-holiday.netlify.app/" target="_blank" class="term-link"><span class="cmd-name">Nehvisa Holidays</span></a> [Live Travel Platform - React, Vite, JS, HTML5, CSS3]
`;
                break;

            case "contact":
            case "email":
                resp.innerHTML = `
<span class="highlight">📬 Contact Information:</span>
  • Email: <a href="mailto:sanchaniyatanish020@gmail.com" class="term-link">sanchaniyatanish020@gmail.com</a>
  • Phone: +91 87584498557
  • GitHub: <a href="https://github.com/sanchaniyatanish020-png" target="_blank" class="term-link">sanchaniyatanish020-png</a>
  • LinkedIn: <a href="https://www.linkedin.com/in/tanishsanchaniya020/" target="_blank" class="term-link">tanishsanchaniya020</a>
`;
                break;


            case "time":
            case "date":
                const now = new Date();
                const timeString = new Intl.DateTimeFormat("en-US", {
                    timeZone: "Asia/Kolkata",
                    dateStyle: "full",
                    timeStyle: "medium"
                }).format(now);
                resp.innerHTML = `🕒 Current Time (Surat, IST): <span class="highlight">${timeString}</span>`;
                break;

            case "hire":
            case "sudo hire":
                navigator.clipboard.writeText("sanchaniyatanish020@gmail.com");
                resp.innerHTML = `🎉 Thank you for your interest! Email copied: <span class="highlight">sanchaniyatanish020@gmail.com</span>. Feel free to send a message!`;
                showToast("📋 Email copied to clipboard!", "success");
                break;

            case "clear":
            case "cls":
                output.innerHTML = "";
                return;

            case "sudo":
                resp.innerHTML = `🔐 <span class="highlight">ACCESS GRANTED.</span> Welcome Superuser! You have full access to explore Tanish's portfolio.`;
                break;

            default:
                resp.innerHTML = `⚠️ Command not recognized: <span class="err-text">'${escapeHtml(cmd)}'</span>. Type <span class="cmd-highlight">help</span> for a list of available commands.`;
                break;
        }

        output.appendChild(resp);
        
        const terminalBody = document.getElementById("terminal-body");
        if (terminalBody) {
            terminalBody.scrollTop = terminalBody.scrollHeight;
        }
    }

    function escapeHtml(str) {
        return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    }
}
