(() => {
    const headerDesktop = document.querySelector('.header-desktop');
    const headerMobile = document.querySelector('.header-mobile');
    const logoInfo = document.querySelector('.logo-info');
    const portfolioImage = document.querySelector('.portfolio-image');
    const portfolioPlaceholder = document.querySelector('.portfolio-placeholder');

    function handleResize() {
        const isMobile = window.innerWidth <= 1024;
        if (isMobile) {
            headerMobile && headerMobile.classList.add('active');
            headerDesktop && headerDesktop.classList.remove('active');
        } else {
            headerMobile && headerMobile.classList.remove('active');
            headerMobile && headerMobile.classList.remove('open');
            headerDesktop && headerDesktop.classList.add('active');
        }
    }

    function handleScroll() {
        if (!headerDesktop) return;
        const threshold = 100;
        if (window.scrollY > threshold) {
            headerDesktop.classList.add('scrolled');
            logoInfo && logoInfo.classList.add('scrolled');
        } else {
            headerDesktop.classList.remove('scrolled');
            logoInfo && logoInfo.classList.remove('scrolled');
        }
    }

    function initNavDropdowns() {
        const dropdowns = Array.from(document.querySelectorAll('.nav-dropdown'));
        if (!dropdowns.length) return;

        dropdowns.forEach((dropdown) => {
            const trigger = dropdown.querySelector('.nav-item');
            if (!trigger) return;

            trigger.addEventListener('click', (e) => {
                e.preventDefault();
                const isOpen = dropdown.classList.contains('open');
                dropdowns.forEach((d) => d.classList.remove('open'));
                if (!isOpen) dropdown.classList.add('open');
            });
        });

        document.addEventListener('click', (e) => {
            if (!e.target.closest('.nav-dropdown')) {
                dropdowns.forEach((d) => d.classList.remove('open'));
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                dropdowns.forEach((d) => d.classList.remove('open'));
            }
        });
    }

    function initMobileIslandMenu() {
        const mobileHeader = document.querySelector('.header-mobile');
        const toggle = document.querySelector('.mobile-island-toggle');
        const menu = document.querySelector('.mobile-island-menu');
        if (!mobileHeader || !toggle || !menu) return;

        toggle.addEventListener('click', () => {
            const isOpen = mobileHeader.classList.toggle('open');
            toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        });

        menu.querySelectorAll('a').forEach((link) => {
            link.addEventListener('click', () => {
                mobileHeader.classList.remove('open');
                toggle.setAttribute('aria-expanded', 'false');
            });
        });

        document.addEventListener('click', (e) => {
            if (!mobileHeader.contains(e.target)) {
                mobileHeader.classList.remove('open');
                toggle.setAttribute('aria-expanded', 'false');
            }
        });
    }

    function initCallActions() {
        const actionButtons = Array.from(document.querySelectorAll('.call-action-btn'));
        if (!actionButtons.length) return;
        const panels = Array.from(document.querySelectorAll('.call-panel'));
        const callNowToggle = document.getElementById('callNowToggle');
        const phoneDrop = document.getElementById('phoneDrop');
        const copyEmailBtn = document.getElementById('copyEmailBtn');
        const copyEmailHint = document.getElementById('copyEmailHint');

        function setMode(mode) {
            actionButtons.forEach((item) => item.classList.toggle('active', item.dataset.mode === mode));
            panels.forEach((panel) => panel.classList.toggle('active', panel.dataset.panel === mode));
        }

        setMode('call');

        actionButtons.forEach((button) => {
            button.addEventListener('click', () => {
                setMode(button.dataset.mode || 'call');
            });
        });

        if (callNowToggle && phoneDrop) {
            callNowToggle.addEventListener('click', () => {
                const isOpen = phoneDrop.classList.toggle('open');
                callNowToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
            });
        }

        if (copyEmailBtn) {
            copyEmailBtn.addEventListener('click', async () => {
                const email = copyEmailBtn.dataset.email || '';
                if (!email) return;

                try {
                    await navigator.clipboard.writeText(email);
                    if (copyEmailHint) copyEmailHint.textContent = 'Copied';
                } catch (_) {
                    if (copyEmailHint) copyEmailHint.textContent = 'Copy failed';
                }

                setTimeout(() => {
                    if (copyEmailHint) copyEmailHint.textContent = 'Click to copy';
                }, 1200);
            });
        }
    }

    /* Projects Section Slider */
function initProjectsSection() {
  const section = document.querySelector('.projects-section');
  const images = Array.from(document.querySelectorAll('.project-image'));
  const descriptions = Array.from(document.querySelectorAll('.project-description'));
  const nextBtn = document.querySelector('.arrow-btn.next');
  const prevBtn = document.querySelector('.arrow-btn.prev');

  if (!section || !images.length || !descriptions.length || !nextBtn || !prevBtn) return;

  const total = Math.min(images.length, descriptions.length);
  let index = 0;
  let autoTimer = null;
  let wheelLocked = false;


  function updateProjects() {
    images.forEach(img => img.classList.remove('active'));
    descriptions.forEach(desc => desc.classList.remove('active'));

    images[index].classList.add('active');
    descriptions[index].classList.add('active');
  }

  function goNext() {
    index = (index + 1) % total;
    updateProjects();
    restartAuto();
  }

  function goPrev() {
    index = (index - 1 + total) % total;
    updateProjects();
    restartAuto();
  }

  function startAuto() {
    clearInterval(autoTimer);
    autoTimer = setInterval(() => {
      index = (index + 1) % total;
      updateProjects();
    }, 4000);
  }

  function restartAuto() {
    startAuto();
  }

  nextBtn.addEventListener('click', goNext);
  prevBtn.addEventListener('click', goPrev);

  section.addEventListener('wheel', (e) => {
    if (wheelLocked) return;
    const rect = section.getBoundingClientRect();
    const inView = rect.top < window.innerHeight && rect.bottom > 0;
    if (!inView) return;

    if (Math.abs(e.deltaY) < 8) return;
    e.preventDefault();
    wheelLocked = true;
    if (e.deltaY > 0) goNext();
    else goPrev();

    setTimeout(() => {
      wheelLocked = false;
    }, 450);
  }, { passive: false });

  section.addEventListener('touchstart', (e) => {
    section.dataset.touchX = String(e.touches[0].clientX);
  }, { passive: true });

  section.addEventListener('touchend', (e) => {
    const startX = parseFloat(section.dataset.touchX || '0');
    const endX = e.changedTouches[0].clientX;
    const delta = startX - endX;
    if (delta > 35) goNext();
    if (delta < -35) goPrev();
  }, { passive: true });

  updateProjects();
  startAuto();
}


    function smoothAnchors() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) target.scrollIntoView({ behavior: 'smooth' });
            });
        });
    }

    function initPortfolioImageCheck() {
        if (!portfolioImage) return;
        if (portfolioImage.complete) {
            if (portfolioImage.naturalWidth === 0) {
                portfolioPlaceholder && portfolioPlaceholder.classList.add('visible');
            }
        }

        portfolioImage.addEventListener('error', () => {
            portfolioPlaceholder && portfolioPlaceholder.classList.add('visible');
            console.warn('Portfolio image not found at assets/port-image.png — falling back to original path or showing placeholder.');
        });

        portfolioImage.addEventListener('load', () => {
            if (portfolioImage.naturalWidth === 0) {
                portfolioPlaceholder && portfolioPlaceholder.classList.add('visible');
            } else {
                portfolioPlaceholder && portfolioPlaceholder.classList.remove('visible');
            }
        });
    }

    /* Portfolio scroll-driven animation */
    function portfolioScrollHandler() {
        const section = document.querySelector('.portfolio-section');
        if (!section) return;
        const imgWrap = section.querySelector('.portfolio-image-wrap');

        // Only animate text here. Do NOT scale/move the image inside the section
        if (imgWrap) {
            imgWrap.style.transform = '';
            imgWrap.style.opacity = '';
        }
    }

    function initPageTransitions() {
        const storageKey = 'pageTransitionOrigin';

        function getScaleFromPoint(x, y) {
            const w = window.innerWidth;
            const h = window.innerHeight;
            const maxDist = Math.max(
                Math.hypot(x, y),
                Math.hypot(w - x, y),
                Math.hypot(x, h - y),
                Math.hypot(w - x, h - y)
            );
            return Math.ceil((maxDist * 2) / 24) + 4;
        }

        function createOverlay(x, y, scale) {
            const overlay = document.createElement('div');
            overlay.className = 'page-transition-overlay';
            overlay.style.setProperty('--pt-x', `${x}px`);
            overlay.style.setProperty('--pt-y', `${y}px`);
            overlay.style.setProperty('--pt-scale', `${scale}`);
            document.body.appendChild(overlay);
            return overlay;
        }

        const saved = sessionStorage.getItem(storageKey);
        if (saved) {
            try {
                const data = JSON.parse(saved);
                if (Date.now() - data.t < 2500) {
                    const revealScale = getScaleFromPoint(data.x, data.y);
                    const reveal = createOverlay(data.x, data.y, revealScale);
                    reveal.classList.add('reveal');
                    requestAnimationFrame(() => {
                        requestAnimationFrame(() => {
                            reveal.classList.add('shrink');
                        });
                    });
                    setTimeout(() => reveal.remove(), 950);
                }
            } catch (_) {
                // Ignore invalid transition data.
            }
            sessionStorage.removeItem(storageKey);
        }

        document.addEventListener('click', (event) => {
            const link = event.target.closest('a[href]');
            if (!link) return;
            if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
            if (link.target && link.target !== '_self') return;
            if (link.hasAttribute('download')) return;

            const href = link.getAttribute('href');
            if (!href || href.startsWith('#') || href.startsWith('tel:') || href.startsWith('mailto:')) return;

            let url;
            try {
                url = new URL(link.href, window.location.href);
            } catch (_) {
                return;
            }
            if (url.origin !== window.location.origin) return;
            if (url.href === window.location.href) return;

            event.preventDefault();
            if (document.activeElement && typeof document.activeElement.blur === 'function') {
                document.activeElement.blur();
            }
            const x = event.clientX || window.innerWidth / 2;
            const y = event.clientY || window.innerHeight / 2;
            const scale = getScaleFromPoint(x, y);
            const overlay = createOverlay(x, y, scale);

            sessionStorage.setItem(storageKey, JSON.stringify({ x, y, t: Date.now() }));
            requestAnimationFrame(() => {
                overlay.classList.add('expand');
            });

            setTimeout(() => {
                window.location.href = url.href;
            }, 520);
        });
    }

    const heroEl = document.querySelector('.hero');
    const portfolioSectionEl = document.querySelector('.portfolio-section');
    const projectsSectionEl = document.querySelector('.projects-section');
    let mobileHeroImagePinned = false;
    let mobileHeroImageVisible = true;

    /* Hero bottom-right image animation (only the hero image) */
    function heroImageScrollHandler() {
        const img = document.querySelector('.portfolio-image');
        if (!img || !heroEl || !portfolioSectionEl) return;

        // Mobile: keep the hero image fixed for section 1 + section 2 only, no transition animation.
        if (window.innerWidth <= 768) {
            const sectionTop = portfolioSectionEl.getBoundingClientRect().top + window.scrollY;
            const sectionBottom = sectionTop + portfolioSectionEl.offsetHeight;
            const current = window.scrollY;
            const inFirstTwo = current < sectionBottom - 120;

            if (!mobileHeroImagePinned) {
                img.style.position = 'fixed';
                img.style.right = '0px';
                img.style.bottom = '78px';
                img.style.width = '110px';
                img.style.transform = 'none';
                img.style.transition = 'none';
                img.style.zIndex = '1200';
                img.style.opacity = inFirstTwo ? '0.95' : '0';
                mobileHeroImageVisible = inFirstTwo;
                mobileHeroImagePinned = true;
            }

            if (mobileHeroImageVisible !== inFirstTwo) {
                img.style.opacity = inFirstTwo ? '0.95' : '0';
                mobileHeroImageVisible = inFirstTwo;
            }
            return;
        }

        mobileHeroImagePinned = false;
        mobileHeroImageVisible = true;

        // Get section positions
        const heroTop = heroEl.getBoundingClientRect().top + window.scrollY;
        const sectionTop = portfolioSectionEl.getBoundingClientRect().top + window.scrollY;
        const sectionBottom = sectionTop + portfolioSectionEl.offsetHeight;
        const projectsTop = projectsSectionEl ? projectsSectionEl.getBoundingClientRect().top + window.scrollY : sectionTop + 1000;
        
        // STRICT: Stop animation at section 2 bottom, NEVER reach section 3
        const animationEndPoint = Math.min(sectionBottom - 100, projectsTop - 300);
        const totalDist = Math.max(animationEndPoint - heroTop, 300);

        // Raw progress calculation
        const currentScroll = window.scrollY;
        const raw = (currentScroll - heroTop) / totalDist;
        
        // CLAMP progress strictly to 0-1 (stops completely, doesn't go beyond)
        const progress = Math.min(Math.max(raw, 0), 1);

        // Keep image as fixed element under body
        if (img.parentElement !== document.body) document.body.appendChild(img);

        const initialRight = 120;
        const finalRight = 10;
        const initialBottom = 80;
        const vw = window.innerWidth;
        const viewportLeftShift = vw * 0.05;
        const currentRight = initialRight + (finalRight - initialRight) * progress + viewportLeftShift * progress;

        const imgRectNow = img.getBoundingClientRect();
        const secRect = portfolioSectionEl.getBoundingClientRect();

        if (!img.dataset.initialWidth) {
            img.dataset.initialWidth = imgRectNow.width;
        }
        const initialWidth = parseFloat(img.dataset.initialWidth);
        const finalScale = 3.5;
        const currentScale = 1 + (finalScale - 1) * progress;
        const currentWidth = initialWidth * currentScale;

        const imgCenterY = imgRectNow.top + imgRectNow.height / 2;
        const secCenterY = secRect.top + secRect.height / 2;
        let finalDeltaY = secCenterY - imgCenterY;
        finalDeltaY -= secRect.height * 0.05;
        const currentTranslateY = finalDeltaY * progress;

        img.style.position = 'fixed';
        img.style.zIndex = 1200;
        img.style.width = `${currentWidth}px`;
        img.style.right = `${currentRight}px`;
        img.style.bottom = `${initialBottom}px`;
        img.style.transform = `translateY(${currentTranslateY}px)`;
        img.style.transition = 'all 0.2s ease';
        img.style.opacity = 0.98 - progress * 0.02;
    }

    const onScrollOptimized = throttle(() => {
        handleScroll();
        heroImageScrollHandler();
    }, 16);
    const onResizeOptimized = throttle(() => {
        handleResize();
        portfolioScrollHandler();
        heroImageScrollHandler();
    }, 60);
    window.addEventListener('scroll', onScrollOptimized, { passive: true });
    window.addEventListener('resize', onResizeOptimized);

    // simple throttle util
    function throttle(fn, wait) {
        let last = 0;
        return function () {
            const now = Date.now();
            if (now - last >= wait) {
                last = now;
                fn();
            }
        };
    }
    /* 3D Carousel for projects section */
    function initProjects3DCarousel() {
        const carousel = document.querySelector('.carousel-3d');
        const items = document.querySelectorAll('.carousel-item');
        const descriptionText = document.querySelector('.project-description-text');
        
        if (!carousel || !items.length) return;

        // Project descriptions
        const descriptions = {
            1: 'A stunning landscape photography project capturing the beauty of nature in its raw form. This project showcases advanced lighting techniques and composition skills.',
            2: 'Modern UI/UX design project focused on creating intuitive user experiences. Features responsive design and smooth animations.',
            3: 'Creative branding campaign with bold colors and innovative visual storytelling. Demonstrates brand identity and market awareness.',
            4: 'Interactive web experience combining cutting-edge technology with artistic vision. A showcase of full-stack development capabilities.'
        };

        let currentIndex = 0;

        // Set initial description
        descriptionText.textContent = descriptions[1];
        descriptionText.classList.add('active');

        // Add click listeners to each carousel item
        items.forEach((item, index) => {
            item.addEventListener('click', () => {
                // Calculate rotation needed
                const rotationSteps = (index - currentIndex + items.length) % items.length;
                
                // Apply rotation classes
                carousel.className = 'carousel-3d';
                if (rotationSteps === 1) {
                    carousel.classList.add('rotate-1');
                } else if (rotationSteps === 2) {
                    carousel.classList.add('rotate-2');
                } else if (rotationSteps === 3) {
                    carousel.classList.add('rotate-3');
                }

                // Fade out current description
                descriptionText.classList.remove('active');
                
                // Update description after fade
                setTimeout(() => {
                    const imageNum = item.dataset.image;
                    descriptionText.textContent = descriptions[imageNum];
                    descriptionText.classList.add('active');
                }, 400);

                currentIndex = index;
            });
        });
    }

    /* Carousel functionality */
    function initCarousel() {
        const carousel = document.querySelector('.carousel');
        const items = document.querySelectorAll('.carousel-item');
        const prevBtn = document.querySelector('.carousel-btn.prev');
        const nextBtn = document.querySelector('.carousel-btn.next');
        const currentSpan = document.querySelector('.carousel-current');
        const carouselImgs = document.querySelectorAll('.carousel-img');
        const lightbox = document.getElementById('imageLightbox');
        const lightboxImg = document.getElementById('lightboxImg');

        if (!carousel || items.length === 0) return;

        let currentIndex = 0;

        function updateCarousel() {
            const translateX = -currentIndex * 100;
            carousel.style.transform = `translateX(${translateX}%)`;
            currentSpan.textContent = currentIndex + 1;
        }

        function showNext() {
            currentIndex = (currentIndex + 1) % items.length;
            updateCarousel();
        }

        function showPrev() {
            currentIndex = (currentIndex - 1 + items.length) % items.length;
            updateCarousel();
        }

        prevBtn.addEventListener('click', showPrev);
        nextBtn.addEventListener('click', showNext);

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowRight') showNext();
            if (e.key === 'ArrowLeft') showPrev();
        });

        // Touch/swipe support
        let touchStartX = 0;
        carousel.addEventListener('touchstart', (e) => {
            touchStartX = e.touches[0].clientX;
        });

        carousel.addEventListener('touchend', (e) => {
            const touchEndX = e.changedTouches[0].clientX;
            if (touchStartX - touchEndX > 50) showNext();
            if (touchEndX - touchStartX > 50) showPrev();
        });

        // Click to enlarge
        carouselImgs.forEach((img) => {
            img.addEventListener('click', () => {
                lightboxImg.src = img.src;
                lightbox.classList.add('active');
            });
        });

        // Close lightbox
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                lightbox.classList.remove('active');
            }
        });

        // Close lightbox on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                lightbox.classList.remove('active');
            }
        });
    }
    document.addEventListener('DOMContentLoaded', () => {
        initPageTransitions();
        initNavDropdowns();
        initMobileIslandMenu();
        initCallActions();
        initProjectsSection();
        handleResize();
        handleScroll();
        smoothAnchors();
        initPortfolioImageCheck();
        initProjects3DCarousel();
        // run once to set initial transforms
        heroImageScrollHandler();
        portfolioScrollHandler();
    });
})();
