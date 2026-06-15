// Interactive Logic for DubbiOvi Public Website

document.addEventListener('DOMContentLoaded', () => {
    // 1. Sticky Header Scroll Effect
    const header = document.getElementById('main-header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 20) {
            header.classList.add('backdrop-blur-md', 'bg-opacity-70', 'border-b', 'border-opacity-10');
            header.classList.remove('bg-transparent');
        } else {
            header.classList.remove('backdrop-blur-md', 'bg-opacity-70', 'border-b', 'border-opacity-10');
            header.classList.add('bg-transparent');
        }
    });

    // 2. Mobile Menu Toggle
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileMenuIcon = mobileMenuBtn?.querySelector('svg');

    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            const isExpanded = mobileMenu.classList.contains('hidden');
            if (isExpanded) {
                mobileMenu.classList.remove('hidden');
                mobileMenu.classList.add('flex', 'animate-fade-in');
                // Change icon to close (X)
                if (mobileMenuIcon) {
                    mobileMenuIcon.innerHTML = `
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    `;
                }
            } else {
                mobileMenu.classList.add('hidden');
                mobileMenu.classList.remove('flex', 'animate-fade-in');
                // Change icon back to hamburger
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

    // 3. Interactive Workflow Stepper
    const steps = document.querySelectorAll('.workflow-step');
    const stepCards = document.querySelectorAll('.workflow-card');
    const progressLine = document.querySelector('.workflow-progress-bar');

    function selectStep(index) {
        // Update steps markers
        steps.forEach((step, idx) => {
            const stepDot = step.querySelector('.step-dot');
            const stepNum = step.querySelector('.step-num');
            const stepTitle = step.querySelector('.step-title');

            if (idx <= index) {
                stepDot?.classList.add('workflow-step-active');
                stepTitle?.classList.add('text-white');
                stepTitle?.classList.remove('text-gray-400');
            } else {
                stepDot?.classList.remove('workflow-step-active');
                stepTitle?.classList.remove('text-white');
                stepTitle?.classList.add('text-gray-400');
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

    // 4. Citation Style Tabs & Copy Utility
    const citationTabs = document.querySelectorAll('.citation-tab');
    const citationBlocks = document.querySelectorAll('.citation-block');
    const copyBtn = document.getElementById('copy-citation-btn');
    const toast = document.getElementById('toast');

    citationTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const selectedStyle = tab.dataset.style;

            // Update tab selection styles
            citationTabs.forEach(t => {
                if (t === tab) {
                    t.classList.add('text-white', 'border-indigo-500', 'bg-indigo-950', 'bg-opacity-30');
                    t.classList.remove('text-gray-400', 'border-transparent');
                } else {
                    t.classList.remove('text-white', 'border-indigo-500', 'bg-indigo-950', 'bg-opacity-30');
                    t.classList.add('text-gray-400', 'border-transparent');
                }
            });

            // Show matching block, hide others
            citationBlocks.forEach(block => {
                if (block.id === `citation-${selectedStyle}`) {
                    block.classList.remove('hidden');
                } else {
                    block.classList.add('hidden');
                }
            });
        });
    });

    if (copyBtn) {
        copyBtn.addEventListener('click', () => {
            // Find the currently active citation text
            const activeBlock = Array.from(citationBlocks).find(block => !block.classList.contains('hidden'));
            if (!activeBlock) return;

            const textToCopy = activeBlock.textContent.trim();

            navigator.clipboard.writeText(textToCopy).then(() => {
                // Success feedback in button
                const btnText = copyBtn.querySelector('.btn-text');
                const btnIcon = copyBtn.querySelector('svg');
                const originalText = btnText ? btnText.textContent : 'Copy';
                const originalIcon = btnIcon ? btnIcon.innerHTML : '';

                if (btnText) btnText.textContent = 'Copied!';
                if (btnIcon) {
                    btnIcon.innerHTML = `
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                    `;
                }

                // Show toast notification
                if (toast) {
                    toast.classList.add('show');
                    setTimeout(() => {
                        toast.classList.remove('show');
                    }, 2500);
                }

                // Revert button styling after delay
                setTimeout(() => {
                    if (btnText) btnText.textContent = originalText;
                    if (btnIcon) btnIcon.innerHTML = originalIcon;
                }, 2000);
            }).catch(err => {
                console.error('Failed to copy text: ', err);
            });
        });
    }

    // 5. Scroll Reveal Animation Logic (Intersection Observer)
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
