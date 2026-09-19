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
        mobLinks.forEach(link => {
            if (!link.classList.contains('doc-trigger')) {
                link.addEventListener('click', closeMobileNav);
            }
        });
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
                    if (!link.classList.contains('doc-trigger')) {
                        link.classList.remove('active');
                        if (link.getAttribute('href') === `#${id}`) {
                            link.classList.add('active');
                        }
                    }
                });
            }
        });
    }, observerOptions);

    sections.forEach(sec => sectionObserver.observe(sec));

    /* ============================================================ */
    /* DEDICATED DOCUMENT VIEWER (GST & WIREMAN LICENSE)            */
    /* ============================================================ */
    const docTriggers = document.querySelectorAll('.doc-trigger');
    const docViewerModal = document.getElementById('docViewerModal');
    const docViewerOverlay = document.getElementById('docViewerOverlay');
    const docViewerBody = document.getElementById('docViewerBody');
    const docHeading = document.getElementById('docHeading');
    const docCanvasWrapper = document.getElementById('docCanvasWrapper');
    const docPdfPages = document.getElementById('docPdfPages');
    const docObject = document.getElementById('docObject');
    const docIframe = document.getElementById('docIframe');

    const docBackBtn = document.getElementById('docBackBtn');
    const docCloseBtn = document.getElementById('docCloseBtn');
    const docDownloadBtn = document.getElementById('docDownloadBtn');
    const docOpenTabBtn = document.getElementById('docOpenTabBtn');

    const docZoomInBtn = document.getElementById('docZoomInBtn');
    const docZoomOutBtn = document.getElementById('docZoomOutBtn');
    const docFitBtn = document.getElementById('docFitBtn');
    const docZoomLevel = document.getElementById('docZoomLevel');
    const docFullscreenBtn = document.getElementById('docFullscreenBtn');

    const docPageControls = document.getElementById('docPageControls');
    const docPrevPageBtn = document.getElementById('docPrevPageBtn');
    const docNextPageBtn = document.getElementById('docNextPageBtn');
    const docPageIndicator = document.getElementById('docPageIndicator');

    const docLoading = document.getElementById('docLoading');
    const docErrorFallback = document.getElementById('docErrorFallback');
    const fallbackTitle = document.getElementById('fallbackTitle');
    const fallbackSub = document.getElementById('fallbackSub');
    const fallbackOpenBtn = document.getElementById('fallbackOpenBtn');
    const fallbackDownloadBtn = document.getElementById('fallbackDownloadBtn');

    /* The actual uploaded documents in /assets. Paths are resolved against the
       page base URL so they also work on the clean /gst and /wireman-license
       routes and after the site is deployed to any sub-path. */
    const docData = {
        gst: {
            title: 'GST REGISTRATION CERTIFICATE',
            file: 'assets/gst_registration_certificate.pdf',
            downloadName: 'Aaisaheb-Electricals-GST-Registration.pdf'
        },
        wireman: {
            title: 'WIREMAN LICENSE',
            file: 'assets/wireman_license.pdf',
            downloadName: 'Aaisaheb-Electricals-Wireman-License.pdf'
        }
    };

    const docRoutes = { gst: '#gst', wireman: '#wireman-license' };

    function docAssetUrl(file) {
        return new URL(file, document.baseURI).href;
    }

    let activeDocType = null;
    let pdfDoc = null;
    let pdfZoom = 1;          // user zoom multiplier applied on top of the fit scale
    let pdfFitScale = 1;      // scale that fits a page to the viewer width
    let pdfCurrentPage = 1;
    let pdfRenderToken = 0;
    let usingNativeEmbed = false;

    if (window.pdfjsLib && pdfjsLib.GlobalWorkerOptions) {
        pdfjsLib.GlobalWorkerOptions.workerSrc = docAssetUrl('assets/vendor/pdf.worker.min.js');
    }

    function setDocState(state) {
        if (docLoading) docLoading.hidden = state !== 'loading';
        if (docErrorFallback) docErrorFallback.hidden = state !== 'error';
        if (docCanvasWrapper) {
            docCanvasWrapper.style.visibility = state === 'ready' ? 'visible' : 'hidden';
        }
    }

    // Last-resort panel. The document stays reachable via Open / Download.
    function showDocError(item, reason) {
        console.error(
            '[Aaisaheb Electricals] Document preview failed for "' + item.title + '"\n' +
            'Asset path: ' + docAssetUrl(item.file) + '\n' +
            'Reason: ' + reason
        );
        if (fallbackTitle) fallbackTitle.textContent = item.title;
        if (fallbackSub) fallbackSub.textContent = 'Unable to preview the document.';
        if (docPageControls) docPageControls.hidden = true;
        setDocState('error');
    }

    // Browser-native PDF engine, used when PDF.js is unavailable.
    function showNativeEmbed(item) {
        usingNativeEmbed = true;
        const url = docAssetUrl(item.file);
        if (docObject) {
            docObject.setAttribute('data', url);
            docObject.style.display = 'block';
        }
        if (docIframe) docIframe.setAttribute('src', url);
        if (docPdfPages) docPdfPages.style.display = 'none';
        if (docPageControls) docPageControls.hidden = true;
        setDocState('ready');

        // Mobile browsers often render nothing here; show the action card instead.
        setTimeout(function () {
            const painted = docObject && docObject.offsetHeight > 40;
            if (!painted) showDocError(item, 'Native PDF embed produced no visible output.');
        }, 1800);
    }

    function updateZoomLabel() {
        if (docZoomLevel) docZoomLevel.textContent = Math.round(pdfZoom * 100) + '%';
    }

    function updatePageIndicator() {
        if (!pdfDoc) return;
        if (docPageIndicator) {
            docPageIndicator.textContent = 'Page ' + pdfCurrentPage + ' of ' + pdfDoc.numPages;
        }
        if (docPrevPageBtn) docPrevPageBtn.disabled = pdfCurrentPage <= 1;
        if (docNextPageBtn) docNextPageBtn.disabled = pdfCurrentPage >= pdfDoc.numPages;
    }

    // Width available for a rendered page, minus the viewer padding.
    function availableWidth() {
        if (!docViewerBody) return 800;
        const styles = window.getComputedStyle(docViewerBody);
        const pad = parseFloat(styles.paddingLeft) + parseFloat(styles.paddingRight);
        return Math.max(240, docViewerBody.clientWidth - pad - 8);
    }

    /* Renders every page of the PDF stacked vertically, so the complete
       document is always present, scrollable and never cropped. */
    async function renderPdfPages() {
        if (!pdfDoc || !docPdfPages) return;

        const token = ++pdfRenderToken;
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        const frag = document.createDocumentFragment();

        const firstPage = await pdfDoc.getPage(1);
        const base = firstPage.getViewport({ scale: 1 });
        pdfFitScale = availableWidth() / base.width;

        for (let num = 1; num <= pdfDoc.numPages; num++) {
            if (token !== pdfRenderToken) return;

            const page = await pdfDoc.getPage(num);
            const viewport = page.getViewport({ scale: pdfFitScale * pdfZoom });

            const holder = document.createElement('div');
            holder.className = 'doc-page-wrapper';
            holder.dataset.page = String(num);

            if (pdfDoc.numPages > 1) {
                const badge = document.createElement('span');
                badge.className = 'page-badge';
                badge.textContent = 'PAGE ' + num;
                holder.appendChild(badge);
            }

            const canvas = document.createElement('canvas');
            canvas.className = 'doc-pdf-canvas';
            canvas.width = Math.floor(viewport.width * dpr);
            canvas.height = Math.floor(viewport.height * dpr);
            canvas.style.width = Math.floor(viewport.width) + 'px';
            canvas.style.height = Math.floor(viewport.height) + 'px';
            holder.appendChild(canvas);
            frag.appendChild(holder);

            await page.render({
                canvasContext: canvas.getContext('2d'),
                viewport: viewport,
                transform: dpr !== 1 ? [dpr, 0, 0, dpr, 0, 0] : null
            }).promise;
        }

        if (token !== pdfRenderToken) return;
        docPdfPages.innerHTML = '';
        docPdfPages.appendChild(frag);
        updateZoomLabel();
        updatePageIndicator();
    }

    function loadPdfDocument(item) {
        const url = docAssetUrl(item.file);
        setDocState('loading');

        if (!window.pdfjsLib) {
            console.warn('[Aaisaheb Electricals] PDF.js unavailable - using native PDF embed for ' + url);
            showNativeEmbed(item);
            return;
        }

        usingNativeEmbed = false;
        if (docObject) docObject.style.display = 'none';
        if (docPdfPages) docPdfPages.style.display = 'flex';

        // Never leave the viewer spinning: hand over to the native engine
        // if PDF.js has not produced pages in time.
        let settled = false;
        const watchdog = setTimeout(function () {
            if (settled) return;
            settled = true;
            console.warn('[Aaisaheb Electricals] PDF.js timed out for ' + url + ' - using native embed.');
            showNativeEmbed(item);
        }, 8000);

        pdfjsLib.getDocument({ url: url }).promise.then(function (doc) {
            if (settled) return null;
            pdfDoc = doc;
            pdfZoom = 1;
            pdfCurrentPage = 1;
            if (docPageControls) docPageControls.hidden = doc.numPages < 2;
            return renderPdfPages();
        }).then(function () {
            if (settled) return;
            settled = true;
            clearTimeout(watchdog);
            setDocState('ready');
            if (docViewerBody) docViewerBody.scrollTop = 0;
        }).catch(function (err) {
            if (settled) return;
            settled = true;
            clearTimeout(watchdog);
            console.error('[Aaisaheb Electricals] PDF.js could not load: ' + url, err);
            // PDF.js failed - try the browser's own PDF engine before giving up.
            showNativeEmbed(item);
        });
    }

    function openDocViewer(type, skipHistory) {
        const item = docData[type] || docData.gst;
        activeDocType = docData[type] ? type : 'gst';

        if (docHeading) docHeading.textContent = item.title;

        const url = docAssetUrl(item.file);
        [docDownloadBtn, fallbackDownloadBtn].forEach(function (btn) {
            if (!btn) return;
            btn.href = url;
            btn.setAttribute('download', item.downloadName);
        });
        [docOpenTabBtn, fallbackOpenBtn].forEach(function (btn) {
            if (btn) btn.href = url;
        });

        if (docViewerModal) docViewerModal.classList.add('active');
        document.body.style.overflow = 'hidden';

        navLinks.forEach(function (l) { l.classList.remove('active'); });
        document.querySelectorAll('.doc-trigger[data-doc="' + activeDocType + '"]')
            .forEach(function (l) { l.classList.add('active'); });

        if (mobileNav) mobileNav.classList.remove('active');

        loadPdfDocument(item);

        if (skipHistory !== true) {
            try {
                history.pushState({ docViewer: activeDocType }, '', docRoutes[activeDocType]);
            } catch (err) {
                /* History unavailable (file://) - the viewer still works. */
            }
        }
    }

    function closeDocViewer(skipHistory) {
        if (docViewerModal) docViewerModal.classList.remove('active');
        document.body.style.overflow = '';

        // Release the document so reopening always re-reads the real asset.
        pdfRenderToken++;
        pdfDoc = null;
        if (docPdfPages) docPdfPages.innerHTML = '';
        if (docObject) docObject.setAttribute('data', '');
        if (docIframe) docIframe.setAttribute('src', '');

        document.querySelectorAll('.doc-trigger').forEach(function (l) {
            l.classList.remove('active');
        });

        if (skipHistory !== true && history.state && history.state.docViewer) {
            try {
                history.back();
            } catch (err) {
                /* Already closed. */
            }
        }
    }

    docTriggers.forEach(function (trig) {
        trig.addEventListener('click', function (e) {
            e.preventDefault();
            openDocViewer(trig.getAttribute('data-doc'));
        });
    });

    // Condensed navbar "MORE" dropdown (narrow desktop widths)
    const navMore = document.getElementById('navMore');
    const navMoreToggle = document.getElementById('navMoreToggle');

    if (navMore && navMoreToggle) {
        const closeNavMore = function () {
            navMore.classList.remove('open');
            navMoreToggle.setAttribute('aria-expanded', 'false');
        };

        navMoreToggle.addEventListener('click', function (e) {
            e.stopPropagation();
            const isOpen = navMore.classList.toggle('open');
            navMoreToggle.setAttribute('aria-expanded', String(isOpen));
        });

        document.addEventListener('click', function (e) {
            if (!navMore.contains(e.target)) closeNavMore();
        });

        window.addEventListener('keydown', function (e) {
            if (e.key === 'Escape') closeNavMore();
        });

        navMore.querySelectorAll('.nav-more-link').forEach(function (link) {
            link.addEventListener('click', closeNavMore);
        });
    }

    if (docBackBtn) docBackBtn.addEventListener('click', function () { closeDocViewer(); });
    if (docCloseBtn) docCloseBtn.addEventListener('click', function () { closeDocViewer(); });
    if (docViewerOverlay) docViewerOverlay.addEventListener('click', function () { closeDocViewer(); });

    /* ---------------- Zoom ---------------- */
    function applyZoom(next) {
        pdfZoom = Math.min(3, Math.max(0.5, parseFloat(next.toFixed(2))));
        updateZoomLabel();
        if (pdfDoc && !usingNativeEmbed) {
            renderPdfPages();
        } else if (docCanvasWrapper) {
            docCanvasWrapper.style.transform = 'scale(' + pdfZoom + ')';
        }
    }

    if (docZoomInBtn) docZoomInBtn.addEventListener('click', function () { applyZoom(pdfZoom + 0.25); });
    if (docZoomOutBtn) docZoomOutBtn.addEventListener('click', function () { applyZoom(pdfZoom - 0.25); });

    function fitToScreen() {
        pdfZoom = 1;
        updateZoomLabel();
        if (pdfDoc && !usingNativeEmbed) {
            renderPdfPages();
        } else if (docCanvasWrapper) {
            docCanvasWrapper.style.transform = 'scale(1)';
        }
        if (docViewerBody) docViewerBody.scrollTop = 0;
    }

    if (docFitBtn) docFitBtn.addEventListener('click', fitToScreen);

    /* ---------------- Page navigation ---------------- */
    function goToPage(num) {
        if (!pdfDoc || !docPdfPages) return;
        pdfCurrentPage = Math.min(Math.max(1, num), pdfDoc.numPages);
        const target = docPdfPages.querySelector('[data-page="' + pdfCurrentPage + '"]');
        if (target && docViewerBody) {
            docViewerBody.scrollTo({
                top: target.offsetTop - docViewerBody.offsetTop,
                behavior: 'smooth'
            });
        }
        updatePageIndicator();
    }

    if (docPrevPageBtn) docPrevPageBtn.addEventListener('click', function () { goToPage(pdfCurrentPage - 1); });
    if (docNextPageBtn) docNextPageBtn.addEventListener('click', function () { goToPage(pdfCurrentPage + 1); });

    // Keep the page indicator in step with manual scrolling.
    if (docViewerBody) {
        let scrollTick = false;
        docViewerBody.addEventListener('scroll', function () {
            if (!pdfDoc || scrollTick) return;
            scrollTick = true;
            requestAnimationFrame(function () {
                scrollTick = false;
                if (!docPdfPages) return;
                const pages = docPdfPages.querySelectorAll('[data-page]');
                const mid = docViewerBody.scrollTop + docViewerBody.clientHeight / 2;
                pages.forEach(function (p) {
                    if (p.offsetTop <= mid && p.offsetTop + p.offsetHeight > mid) {
                        const n = parseInt(p.dataset.page, 10);
                        if (n !== pdfCurrentPage) {
                            pdfCurrentPage = n;
                            updatePageIndicator();
                        }
                    }
                });
            });
        }, { passive: true });
    }

    // Re-fit the rendered pages when the viewport changes.
    let docResizeTimer = null;
    window.addEventListener('resize', function () {
        if (!pdfDoc || usingNativeEmbed) return;
        if (!docViewerModal || !docViewerModal.classList.contains('active')) return;
        clearTimeout(docResizeTimer);
        docResizeTimer = setTimeout(renderPdfPages, 250);
    });

    /* ---------------- Fullscreen ---------------- */
    if (docFullscreenBtn && docViewerModal) {
        docFullscreenBtn.addEventListener('click', function () {
            if (!document.fullscreenElement) {
                const req = docViewerModal.requestFullscreen || docViewerModal.webkitRequestFullscreen;
                if (req) {
                    Promise.resolve(req.call(docViewerModal)).catch(function (err) {
                        console.warn('[Aaisaheb Electricals] Fullscreen unavailable', err);
                    });
                }
            } else {
                document.exitFullscreen().catch(function (err) {
                    console.warn('[Aaisaheb Electricals] Exit fullscreen failed', err);
                });
            }
        });
        document.addEventListener('fullscreenchange', function () {
            if (pdfDoc && !usingNativeEmbed) setTimeout(renderPdfPages, 120);
        });
    }

    /* ---------------- Routing ---------------- */
    window.addEventListener('popstate', function (e) {
        if (e.state && e.state.docViewer) {
            openDocViewer(e.state.docViewer, true);
        } else if (docViewerModal && docViewerModal.classList.contains('active')) {
            closeDocViewer(true);
        }
    });

    // Deep links: /gst and /wireman-license (and their #hash equivalents).
    const initialRoute = (
        window.location.pathname.replace(/\/+$/, '') + (window.location.hash || '')
    ).toLowerCase();

    let initialDoc = null;
    if (/(^|\/|#)gst(-viewer)?$/.test(initialRoute)) initialDoc = 'gst';
    else if (/(^|\/|#)wireman(-license|-viewer)?$/.test(initialRoute)) initialDoc = 'wireman';

    if (initialDoc) {
        window.addEventListener('load', function () {
            setTimeout(function () { openDocViewer(initialDoc, true); }, 600);
        });
    }

    /* ============================================================ */
    /* HERO CINEMATIC LOOPING BACKGROUND VIDEO                      */
    /* ============================================================ */
    const heroBgVideo = document.getElementById('heroBgVideo');
    const heroBgWrapper = document.getElementById('heroBgWrapper');

    if (heroBgVideo && heroBgWrapper) {
        const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const netInfo = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
        const lightMode = !!(netInfo && (netInfo.saveData || /(^|-)2g$/.test(netInfo.effectiveType || '')));

        if (reduceMotion || lightMode) {
            // Low-power / data-saver devices keep the lightweight poster image only.
            heroBgVideo.removeAttribute('autoplay');
            heroBgVideo.preload = 'none';
            heroBgVideo.remove();
        } else {
            // Autoplay only succeeds while muted + inline on modern browsers.
            heroBgVideo.muted = true;
            heroBgVideo.defaultMuted = true;
            heroBgVideo.playsInline = true;
            heroBgVideo.loop = true;
            heroBgVideo.preload = 'auto';

            let heroInView = true;

            const heroSectionEl = document.getElementById('hero');
            const revealHeroVideo = () => {
                heroBgWrapper.classList.add('video-active');
                if (heroSectionEl) heroSectionEl.classList.add('video-active-hero');
            };

            const playHeroVideo = () => {
                const attempt = heroBgVideo.play();
                if (attempt && typeof attempt.then === 'function') {
                    attempt.then(revealHeroVideo).catch(() => {
                        /* Autoplay blocked - the poster image stays visible. */
                    });
                } else {
                    revealHeroVideo();
                }
            };

            heroBgVideo.addEventListener('loadeddata', playHeroVideo);
            heroBgVideo.addEventListener('playing', revealHeroVideo);
            if (heroBgVideo.readyState >= 2) playHeroVideo();

            // Safety net: some browsers stall the native loop, so restart manually.
            heroBgVideo.addEventListener('ended', () => {
                heroBgVideo.currentTime = 0;
                playHeroVideo();
            });

            // Retry on the first interaction for browsers that block silent autoplay.
            ['pointerdown', 'touchstart', 'keydown'].forEach(evt => {
                document.addEventListener(evt, () => {
                    if (heroBgVideo.paused && heroInView) playHeroVideo();
                }, { once: true, passive: true });
            });

            // Performance: only decode frames while the hero is actually on screen.
            if (heroSectionEl && 'IntersectionObserver' in window) {
                new IntersectionObserver(entries => {
                    entries.forEach(entry => {
                        heroInView = entry.isIntersecting;
                        if (heroInView) {
                            if (heroBgVideo.paused && !document.hidden) playHeroVideo();
                        } else if (!heroBgVideo.paused) {
                            heroBgVideo.pause();
                        }
                    });
                }, { threshold: 0.05 }).observe(heroSectionEl);
            }

            document.addEventListener('visibilitychange', () => {
                if (document.hidden) {
                    heroBgVideo.pause();
                } else if (heroInView) {
                    playHeroVideo();
                }
            });
        }
    }

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
        if (!suryaSlides.length) return;
        suryaSlides.forEach(slide => slide.classList.remove('active'));
        suryaDots.forEach(dot => dot.classList.remove('active'));

        currentSuryaSlide = (index + suryaSlides.length) % suryaSlides.length;
        if (suryaSlides[currentSuryaSlide]) suryaSlides[currentSuryaSlide].classList.add('active');
        if (suryaDots[currentSuryaSlide]) suryaDots[currentSuryaSlide].classList.add('active');
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

    // Keyboard Lightbox & Document Navigation
    window.addEventListener('keydown', (e) => {
        if (lightboxModal && lightboxModal.classList.contains('active')) {
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowLeft' && lightboxPrev) lightboxPrev.click();
            if (e.key === 'ArrowRight' && lightboxNext) lightboxNext.click();
        }
        if (docViewerModal && docViewerModal.classList.contains('active')) {
            if (e.key === 'Escape') closeDocViewer();
            if (e.key === 'ArrowLeft' && docPrevPageBtn && !docPrevPageBtn.disabled) docPrevPageBtn.click();
            if (e.key === 'ArrowRight' && docNextPageBtn && !docNextPageBtn.disabled) docNextPageBtn.click();
        }
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
    /* 24. ENQUIRY FORM SUBMISSION (CONNECTS TO BACKEND API)        */
    /* ============================================================ */
    const enquiryForm = document.getElementById('enquiryForm');
    const formSuccessMsg = document.getElementById('formSuccessMsg');

    if (enquiryForm) {
        enquiryForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const submitBtn = enquiryForm.querySelector('button[type="submit"]');
            if (submitBtn) submitBtn.disabled = true;

            const formData = {
                name: document.getElementById('formName').value,
                phone: document.getElementById('formPhone').value,
                email: document.getElementById('formEmail').value,
                projectType: document.getElementById('formProjectType').value,
                location: document.getElementById('formLocation').value,
                requirement: document.getElementById('formRequirement').value
            };

            try {
                const response = await fetch('/api/enquiry', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData)
                });

                const result = await response.json();
                if (response.ok && result.success) {
                    if (formSuccessMsg) {
                        const p = formSuccessMsg.querySelector('p');
                        if (p) p.textContent = result.message || 'Thank you! Your enquiry has been sent.';
                        formSuccessMsg.classList.add('active');
                    }
                    enquiryForm.reset();
                } else {
                    alert(result.error || 'Failed to send enquiry. Please call 8767814553 directly.');
                }
            } catch (err) {
                if (formSuccessMsg) formSuccessMsg.classList.add('active');
                enquiryForm.reset();
            } finally {
                if (submitBtn) submitBtn.disabled = false;
                setTimeout(() => {
                    if (formSuccessMsg) formSuccessMsg.classList.remove('active');
                }, 6000);
            }
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
