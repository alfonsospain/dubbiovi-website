/* Alternative Light Academic Script for DubbiOvi */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Sticky Header Scroll Effect
    const header = document.getElementById('main-header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 20) {
            header.classList.add('bg-white/80', 'backdrop-blur-md', 'shadow-sm', 'border-b', 'border-gray-200/50');
            header.classList.remove('bg-transparent');
        } else {
            header.classList.remove('bg-white/80', 'backdrop-blur-md', 'shadow-sm', 'border-b', 'border-gray-200/50');
            header.classList.add('bg-transparent');
        }
    });

    // 2. Mobile Menu Toggle
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileMenuIcon = mobileMenuBtn?.querySelector('svg');

    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            const isHidden = mobileMenu.classList.contains('hidden');
            if (isHidden) {
                mobileMenu.classList.remove('hidden');
                mobileMenu.classList.add('flex', 'animate-fade-in');
                if (mobileMenuIcon) {
                    mobileMenuIcon.innerHTML = `
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    `;
                }
            } else {
                mobileMenu.classList.add('hidden');
                mobileMenu.classList.remove('flex', 'animate-fade-in');
                if (mobileMenuIcon) {
                    mobileMenuIcon.innerHTML = `
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
                    `;
                }
            }
        });

        // Close menu when clicking a link
        const mobileLinks = mobileMenu.querySelectorAll('a');
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.add('hidden');
                mobileMenu.classList.remove('flex');
                if (mobileMenuIcon) {
                    mobileMenuIcon.innerHTML = `
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
                    `;
                }
            });
        });
    }

    // 3. Lightbox Modal for Screenshots Gallery
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.getElementById('lightbox-caption');

    window.openLightbox = (src, caption) => {
        if (!lightbox || !lightboxImg || !lightboxCaption) return;
        lightboxImg.src = src;
        lightboxCaption.textContent = caption;
        
        // Remove hidden and add flex, then transition opacity
        lightbox.classList.remove('hidden');
        lightbox.classList.add('flex');
        
        // Force reflow to ensure the transition happens
        void lightbox.offsetWidth;
        lightbox.classList.add('show');
        document.body.style.overflow = 'hidden'; // Prevent main page scrolling
    };

    window.closeLightbox = () => {
        if (!lightbox) return;
        lightbox.classList.remove('show');
        
        // Wait for opacity transition to finish before hiding the container
        setTimeout(() => {
            lightbox.classList.add('hidden');
            lightbox.classList.remove('flex');
            document.body.style.overflow = ''; // Restore main page scrolling
        }, 300);
    };

    // Close lightbox on clicking the background overlay
    if (lightbox) {
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                window.closeLightbox();
            }
        });
        
        // Close on pressing Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && !lightbox.classList.contains('hidden')) {
                window.closeLightbox();
            }
        });
    }

    // 3.5. Interactive Workflow Stepper
    const steps = document.querySelectorAll('.workflow-step');
    const stepCards = document.querySelectorAll('.workflow-card');
    const progressLine = document.querySelector('.workflow-progress-bar');

    function selectStep(index) {
        // Update steps markers
        steps.forEach((step, idx) => {
            const stepDot = step.querySelector('.step-dot');
            const stepTitle = step.querySelector('.step-title');

            if (idx <= index) {
                stepDot?.classList.add('workflow-step-active');
                stepTitle?.classList.add('text-[#111827]', 'font-bold');
                stepTitle?.classList.remove('text-[#6B7280]');
            } else {
                stepDot?.classList.remove('workflow-step-active');
                stepTitle?.classList.remove('text-[#111827]', 'font-bold');
                stepTitle?.classList.add('text-[#6B7280]');
            }
        });

        // Update cards visibility
        stepCards.forEach((card, idx) => {
            if (idx === index) {
                card.classList.remove('hidden');
                card.classList.add('block', 'workflow-card-active');
            } else {
                card.classList.add('hidden');
                card.classList.remove('workflow-card-active');
            }
        });

        // Update progress bar width (for desktop stepper line)
        if (progressLine && steps.length > 1) {
            const percentage = (index / (steps.length - 1)) * 100;
            progressLine.style.width = `${percentage}%`;
        }
    }

    steps.forEach((step, idx) => {
        step.addEventListener('click', (e) => {
            e.preventDefault();
            selectStep(idx);
        });
    });

    // Initialize with first step
    if (steps.length > 0) {
        selectStep(0);
    }

    // 4. Scroll Reveal Animation Logic (Intersection Observer)
    const revealElements = document.querySelectorAll('.reveal');
    if ('IntersectionObserver' in window && revealElements.length > 0) {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    observer.unobserve(entry.target); // Stop tracking once revealed
                }
            });
        }, {
            threshold: 0.15,
            rootMargin: '0px 0px -50px 0px'
        });

        revealElements.forEach(el => {
            revealObserver.observe(el);
        });
    }
});
