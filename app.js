/* ============================================================
   AAISAHEB ELECTRICALS — CRAZY CINEMATIC & ANIMATED ENGINE (APP.JS)
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Initialize Lucide Icons
    if (window.lucide) {
        lucide.createIcons();
    }

    // 2. Register GSAP & ScrollTrigger if available
    if (window.gsap && window.ScrollTrigger) {
        gsap.registerPlugin(ScrollTrigger);
    }

    /* ============================================================ */
    /* 5. CINEMATIC LOADING SCREEN SEQUENCE                         */
    /* ============================================================ */
    const loaderScreen = document.getElementById('loader');
    const loaderFill = document.getElementById('loaderFill');
    const loaderPercent = document.getElementById('loaderPercent');
    const sparkCanvas = document.getElementById('loaderSparkCanvas');
    
    if (sparkCanvas) {
        const ctx = sparkCanvas.getContext('2d');
        sparkCanvas.width = window.innerWidth;
        sparkCanvas.height = window.innerHeight;
        
        let sparks = [];
        for (let i = 0; i < 40; i++) {
            sparks.push({
                x: Math.random() * sparkCanvas.width,
                y: Math.random() * sparkCanvas.height,
                size: Math.random() * 2 + 1,
                vx: (Math.random() - 0.5) * 4,
                vy: (Math.random() - 0.5) * 4,
                life: Math.random() * 100
            });
        }
        
        function animateLoaderSparks() {
            if (!loaderScreen || loaderScreen.style.display === 'none') return;
            ctx.clearRect(0, 0, sparkCanvas.width, sparkCanvas.height);
            
            ctx.fillStyle = '#FFDC00';
            sparks.forEach(s => {
                ctx.beginPath();
                ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
                ctx.fill();
                s.x += s.vx;
                s.y += s.vy;
                s.life--;
                if (s.life <= 0) {
                    s.x = Math.random() * sparkCanvas.width;
                    s.y = Math.random() * sparkCanvas.height;
                    s.life = 100;
                }
            });
            requestAnimationFrame(animateLoaderSparks);
        }
        animateLoaderSparks();
    }

    let loadProgress = 0;
    const progressInterval = setInterval(() => {
        loadProgress += Math.floor(Math.random() * 15) + 5;
        if (loadProgress >= 100) {
            loadProgress = 100;
            clearInterval(progressInterval);
            
            if (loaderPercent) loaderPercent.textContent = '100';
            if (loaderFill) loaderFill.style.width = '100%';
            
            // Subtle Electrical Flash
            setTimeout(() => {
                if (loaderScreen) {
                    loaderScreen.classList.add('loader-flash');
                    setTimeout(() => {
                        loaderScreen.style.opacity = '0';
                        loaderScreen.style.visibility = 'hidden';
                        initPageAnimations();
                    }, 500);
                }
            }, 300);
        } else {
            if (loaderPercent) loaderPercent.textContent = loadProgress < 10 ? `0${loadProgress}` : loadProgress;
            if (loaderFill) loaderFill.style.width = `${loadProgress}%`;
        }
    }, 120);

    /* ============================================================ */
    /* 29. CUSTOM CURSOR (DESKTOP)                                  */
    /* ============================================================ */
    const cursorDot = document.getElementById('cursorDot');
    const cursorFollower = document.getElementById('cursorFollower');
    const cursorText = document.getElementById('cursorText');

    if (cursorDot && cursorFollower && window.matchMedia('(pointer: fine)').matches) {
        let mouseX = 0, mouseY = 0;
        let followerX = 0, followerY = 0;

        window.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            cursorDot.style.left = `${mouseX}px`;
            cursorDot.style.top = `${mouseY}px`;
        });

        function animateCursor() {
            followerX += (mouseX - followerX) * 0.15;
            followerY += (mouseY - followerY) * 0.15;
            cursorFollower.style.left = `${followerX}px`;
            cursorFollower.style.top = `${followerY}px`;
            requestAnimationFrame(animateCursor);
        }
        animateCursor();

        // Magnetic & Hover Targets
        document.querySelectorAll('.magnetic-target, [data-cursor]').forEach(elem => {
            elem.addEventListener('mouseenter', () => {
                cursorFollower.classList.add('cursor-hover');
                const text = elem.getAttribute('data-cursor');
                if (text && cursorText) {
                    cursorText.textContent = text;
                }
            });
            elem.addEventListener('mouseleave', () => {
                cursorFollower.classList.remove('cursor-hover');
                if (cursorText) cursorText.textContent = '';
            });
        });
    }

    /* ============================================================ */
    /* 6. FLOATING NAVBAR & MOBILE MENU                             */
    /* ============================================================ */
    const mainHeader = document.getElementById('mainHeader');
    let lastScrollY = window.scrollY;

    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;
        
        if (currentScrollY > 100) {
            if (currentScrollY > lastScrollY && currentScrollY > 300) {
                mainHeader.classList.add('nav-hidden');
            } else {
                mainHeader.classList.remove('nav-hidden');
            }
        } else {
            mainHeader.classList.remove('nav-hidden');
        }
        lastScrollY = currentScrollY;
    });

    // Mobile Navigation Drawer Toggle
    const hamburgerBtn = document.getElementById('hamburgerBtn');
    const mobileCloseBtn = document.getElementById('mobileCloseBtn');
    const mobileNav = document.getElementById('mobileNav');
    const mobLinks = document.querySelectorAll('.mob-link');

    if (hamburgerBtn && mobileNav) {
        hamburgerBtn.addEventListener('click', () => {
            mobileNav.classList.add('active');
            document.body.style.overflow = 'hidden';
        });

        function closeMobileNav() {
            mobileNav.classList.remove('active');
            document.body.style.overflow = '';
        }

        if (mobileCloseBtn) mobileCloseBtn.addEventListener('click', closeMobileNav);
        mobLinks.forEach(link => link.addEventListener('click', closeMobileNav));
    }

    // Active Section Link Highlight via IntersectionObserver
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    const observerOptions = {
        root: null,
        rootMargin: '-20% 0px -60% 0px',
        threshold: 0
    };

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, observerOptions);

    sections.forEach(sec => sectionObserver.observe(sec));

    /* ============================================================ */
    /* 8. HERO CANVAS CIRCUIT BACKGROUND                            */
    /* ============================================================ */
    const circuitCanvas = document.getElementById('heroCircuitCanvas');
    if (circuitCanvas) {
        const ctx = circuitCanvas.getContext('2d');
        function resizeCircuitCanvas() {
            circuitCanvas.width = circuitCanvas.offsetWidth;
            circuitCanvas.height = circuitCanvas.offsetHeight;
        }
        resizeCircuitCanvas();
        window.addEventListener('resize', resizeCircuitCanvas);

        let pulses = [];
        for (let i = 0; i < 15; i++) {
            pulses.push({
                x: Math.random() * circuitCanvas.width,
                y: Math.random() * circuitCanvas.height,
                length: Math.random() * 80 + 40,
                speed: Math.random() * 2 + 1,
                direction: Math.random() > 0.5 ? 'horizontal' : 'vertical'
            });
        }

        function drawCircuitPattern() {
            ctx.clearRect(0, 0, circuitCanvas.width, circuitCanvas.height);
            ctx.strokeStyle = 'rgba(255, 220, 0, 0.08)';
            ctx.lineWidth = 1;

            // Draw grid lines
            const step = 60;
            for (let x = 0; x < circuitCanvas.width; x += step) {
                ctx.beginPath();
                ctx.moveTo(x, 0);
                ctx.lineTo(x, circuitCanvas.height);
                ctx.stroke();
            }
            for (let y = 0; y < circuitCanvas.height; y += step) {
                ctx.beginPath();
                ctx.moveTo(0, y);
                ctx.lineTo(circuitCanvas.width, y);
                ctx.stroke();
            }

            // Draw pulses
            pulses.forEach(p => {
                ctx.strokeStyle = '#FFDC00';
                ctx.lineWidth = 2;
                ctx.shadowColor = '#FFDC00';
                ctx.shadowBlur = 10;
                ctx.beginPath();

                if (p.direction === 'horizontal') {
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(p.x + p.length, p.y);
                    p.x += p.speed;
                    if (p.x > circuitCanvas.width) p.x = -p.length;
                } else {
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(p.x, p.y + p.length);
                    p.y += p.speed;
                    if (p.y > circuitCanvas.height) p.y = -p.length;
                }
                ctx.stroke();
                ctx.shadowBlur = 0;
            });

            requestAnimationFrame(drawCircuitPattern);
        }
        drawCircuitPattern();
    }

    /* ============================================================ */
    /* 32. 3D CARD TILT EFFECT                                      */
    /* ============================================================ */
    const tiltCards = document.querySelectorAll('[data-tilt]');
    tiltCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = ((y - centerY) / centerY) * -8;
            const rotateY = ((x - centerX) / centerX) * 8;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
        });
    });

    /* ============================================================ */
    /* 11. SURYA HOSPITAL CAROUSEL SLIDER                           */
    /* ============================================================ */
    const suryaSlides = document.querySelectorAll('.surya-slide');
    const suryaDots = document.querySelectorAll('.surya-dots .dot');
    const suryaPrevBtn = document.getElementById('suryaPrevBtn');
    const suryaNextBtn = document.getElementById('suryaNextBtn');
    let currentSuryaSlide = 0;

    function goToSuryaSlide(index) {
        suryaSlides.forEach(slide => slide.classList.remove('active'));
        suryaDots.forEach(dot => dot.classList.remove('active'));
        
        currentSuryaSlide = (index + suryaSlides.length) % suryaSlides.length;
        suryaSlides[currentSuryaSlide].classList.add('active');
        suryaDots[currentSuryaSlide].classList.add('active');
    }

    if (suryaPrevBtn && suryaNextBtn) {
        suryaPrevBtn.addEventListener('click', () => goToSuryaSlide(currentSuryaSlide - 1));
        suryaNextBtn.addEventListener('click', () => goToSuryaSlide(currentSuryaSlide + 1));
        
        suryaDots.forEach((dot, idx) => {
            dot.addEventListener('click', () => goToSuryaSlide(idx));
        });

        // Auto slide every 5s
        setInterval(() => goToSuryaSlide(currentSuryaSlide + 1), 5000);
    }

    /* ============================================================ */
    /* 13. SEQUENTIAL LIGHT TURN-ON ANIMATION                       */
    /* ============================================================ */
    const outdoorSection = document.getElementById('outdoorLightingSection');
    const lightStage = document.getElementById('lightStage');
    const bollardPoints = [
        document.getElementById('bollard1'),
        document.getElementById('bollard2'),
        document.getElementById('bollard3'),
        document.getElementById('bollard4')
    ];

    if (outdoorSection && lightStage) {
        const lightObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    lightStage.classList.add('illuminated');
                    
                    bollardPoints.forEach((pt, i) => {
                        if (pt) {
                            setTimeout(() => {
                                pt.classList.add('turned-on');
                            }, (i + 1) * 450);
                        }
                    });
                    lightObserver.unobserve(outdoorSection);
                }
            });
        }, { threshold: 0.3 });

        lightObserver.observe(outdoorSection);
    }

    /* ============================================================ */
    /* 17. DRAGGABLE BEFORE / AFTER SLIDER                          */
    /* ============================================================ */
    const baContainer = document.getElementById('baContainer');
    const baBeforeLayer = document.getElementById('baBeforeLayer');
    const baHandle = document.getElementById('baHandle');

    if (baContainer && baBeforeLayer && baHandle) {
        let isDragging = false;

        function updateBA(x) {
            const rect = baContainer.getBoundingClientRect();
            let offsetX = x - rect.left;
            if (offsetX < 0) offsetX = 0;
            if (offsetX > rect.width) offsetX = rect.width;
            
            const percent = (offsetX / rect.width) * 100;
            baBeforeLayer.style.width = `${percent}%`;
            baHandle.style.left = `${percent}%`;
        }

        baHandle.addEventListener('mousedown', () => isDragging = true);
        window.addEventListener('mouseup', () => isDragging = false);
        window.addEventListener('mousemove', (e) => {
            if (isDragging) updateBA(e.clientX);
        });

        // Touch support
        baHandle.addEventListener('touchstart', () => isDragging = true);
        window.addEventListener('touchend', () => isDragging = false);
        window.addEventListener('touchmove', (e) => {
            if (isDragging && e.touches[0]) updateBA(e.touches[0].clientX);
        });
    }

    /* ============================================================ */
    /* 21. FILTERABLE GALLERY & LIGHTBOX MODAL                      */
    /* ============================================================ */
    const filterBtns = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');
    const lightboxModal = document.getElementById('lightboxModal');
    const lightboxOverlay = document.getElementById('lightboxOverlay');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxTitle = document.getElementById('lightboxTitle');
    const lightboxCat = document.getElementById('lightboxCat');
    const lightboxClose = document.getElementById('lightboxClose');
    const lightboxPrev = document.getElementById('lightboxPrev');
    const lightboxNext = document.getElementById('lightboxNext');

    let visibleGalleryItems = Array.from(galleryItems);
    let currentLightboxIndex = 0;

    // Gallery Filtering
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.getAttribute('data-filter');
            visibleGalleryItems = [];

            galleryItems.forEach(item => {
                if (filter === 'all' || item.classList.contains(filter)) {
                    item.style.display = 'block';
                    visibleGalleryItems.push(item);
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });

    // Lightbox Open
    galleryItems.forEach(item => {
        item.addEventListener('click', () => {
            const index = visibleGalleryItems.indexOf(item);
            if (index !== -1) {
                openLightbox(index);
            }
        });
    });

    function openLightbox(index) {
        currentLightboxIndex = index;
        const targetItem = visibleGalleryItems[currentLightboxIndex];
        if (!targetItem) return;

        const src = targetItem.getAttribute('data-src');
        const title = targetItem.getAttribute('data-title');
        const cat = targetItem.getAttribute('data-category');

        if (lightboxImg) lightboxImg.src = src;
        if (lightboxTitle) lightboxTitle.textContent = title;
        if (lightboxCat) lightboxCat.textContent = cat;

        if (lightboxModal) lightboxModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        if (lightboxModal) lightboxModal.classList.remove('active');
        document.body.style.overflow = '';
    }

    if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
    if (lightboxOverlay) lightboxOverlay.addEventListener('click', closeLightbox);

    if (lightboxPrev && lightboxNext) {
        lightboxPrev.addEventListener('click', () => {
            const newIndex = (currentLightboxIndex - 1 + visibleGalleryItems.length) % visibleGalleryItems.length;
            openLightbox(newIndex);
        });

        lightboxNext.addEventListener('click', () => {
            const newIndex = (currentLightboxIndex + 1) % visibleGalleryItems.length;
            openLightbox(newIndex);
        });
    }

    // Keyboard Lightbox Navigation
    window.addEventListener('keydown', (e) => {
        if (!lightboxModal || !lightboxModal.classList.contains('active')) return;
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft' && lightboxPrev) lightboxPrev.click();
        if (e.key === 'ArrowRight' && lightboxNext) lightboxNext.click();
    });

    /* ============================================================ */
    /* 22. VIDEO SHOWCASE TRIGGER MODAL                            */
    /* ============================================================ */
    const videoTrigger = document.getElementById('videoTrigger');
    if (videoTrigger) {
        videoTrigger.addEventListener('click', () => {
            openLightbox(3); // Opens Surya Hospital Project in Lightbox
        });
    }

    /* ============================================================ */
    /* 24. ENQUIRY FORM SUBMISSION                                  */
    /* ============================================================ */
    const enquiryForm = document.getElementById('enquiryForm');
    const formSuccessMsg = document.getElementById('formSuccessMsg');

    if (enquiryForm) {
        enquiryForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const submitBtn = enquiryForm.querySelector('button[type="submit"]');
            if (submitBtn) submitBtn.disabled = true;

            setTimeout(() => {
                if (formSuccessMsg) formSuccessMsg.classList.add('active');
                enquiryForm.reset();
                if (submitBtn) submitBtn.disabled = false;

                setTimeout(() => {
                    if (formSuccessMsg) formSuccessMsg.classList.remove('active');
                }, 5000);
            }, 600);
        });
    }

    /* ============================================================ */
    /* PAGE ANIMATIONS & GSAP SCROLL REVEALS                        */
    /* ============================================================ */
    function initPageAnimations() {
        if (window.gsap && window.ScrollTrigger) {
            gsap.from('.hero-title .title-line', {
                y: 60,
                opacity: 0,
                duration: 1,
                stagger: 0.2,
                ease: 'power3.out'
            });

            gsap.from('.hero-description', {
                y: 30,
                opacity: 0,
                duration: 0.8,
                delay: 0.6,
                ease: 'power3.out'
            });

            gsap.from('.hero-cta-group', {
                y: 30,
                opacity: 0,
                duration: 0.8,
                delay: 0.8,
                ease: 'power3.out'
            });

            // ScrollTrigger for Section Headers
            gsap.utils.toArray('.section-header').forEach(header => {
                gsap.from(header, {
                    scrollTrigger: {
                        trigger: header,
                        start: 'top 85%'
                    },
                    y: 40,
                    opacity: 0,
                    duration: 0.8,
                    ease: 'power2.out'
                });
            });

            // Service Cards Stagger
            gsap.from('.service-card', {
                scrollTrigger: {
                    trigger: '.services-grid',
                    start: 'top 80%'
                },
                y: 50,
                opacity: 0,
                duration: 0.8,
                stagger: 0.15,
                ease: 'power3.out'
            });

            // Process Steps Stagger
            gsap.from('.process-step-card', {
                scrollTrigger: {
                    trigger: '.process-grid',
                    start: 'top 80%'
                },
                y: 40,
                opacity: 0,
                duration: 0.8,
                stagger: 0.12,
                ease: 'power2.out'
            });
        }
    }
});
