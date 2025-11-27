/*******************************
 * BELLEZA A DOMICILIO - SCRIPT *
 * Professional Beauty Services *
 *******************************/

// ===== DOM CONTENT LOADED =====
document.addEventListener('DOMContentLoaded', function() {
    initializeAnimations();
    initializeNavigation();
    initializeScrollEffects();
    initializeFormHandling();
    initializeBackToTop();
    initializeMobileMenu();
    initializeLazyLoading();
    initializeInstagramFeed();
});

// ===== ANIMATIONS =====
function initializeAnimations() {
    // Initialize AOS (Animate On Scroll)
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            easing: 'ease-in-out',
            once: true,
            offset: 100,
            delay: 100
        });
    }

    // Add custom animations
    animateElementsOnScroll();
    animateCounters();
}

function animateElementsOnScroll() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const elementsToAnimate = document.querySelectorAll(
        '.service-card, .about-content, .contact-item, .instagram-item'
    );
    
    elementsToAnimate.forEach(element => {
        observer.observe(element);
    });
}

function animateCounters() {
    const counters = document.querySelectorAll('.stat-number');
    
    counters.forEach(counter => {
        const target = parseInt(counter.textContent);
        const increment = target / 100;
        let current = 0;
        
        const updateCounter = () => {
            if (current < target) {
                current += increment;
                counter.textContent = Math.ceil(current);
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target;
            }
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    updateCounter();
                    observer.unobserve(entry.target);
                }
            });
        });
        
        observer.observe(counter);
    });
}

// ===== NAVIGATION =====
function initializeNavigation() {
    const navbar = document.querySelector('.navbar');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Navbar scroll effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
    
    // Smooth scrolling for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            
            if (targetId.startsWith('#')) {
                const targetSection = document.querySelector(targetId);
                if (targetSection) {
                    targetSection.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });
}

// ===== MOBILE MENU =====
function initializeMobileMenu() {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
        
        // Close mobile menu when clicking on links
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
        
        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });
    }
}

// ===== SCROLL EFFECTS =====
function initializeScrollEffects() {
    const scrollIndicator = document.querySelector('.scroll-indicator');
    
    // Hide scroll indicator after scrolling
    window.addEventListener('scroll', () => {
        if (scrollIndicator) {
            if (window.scrollY > 100) {
                scrollIndicator.style.opacity = '0';
                scrollIndicator.style.visibility = 'hidden';
            } else {
                scrollIndicator.style.opacity = '1';
                scrollIndicator.style.visibility = 'visible';
            }
        }
    });
    
    // Parallax effect for hero section
    const hero = document.querySelector('.hero');
    if (hero) {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const parallax = hero.querySelector('.hero-background');
            if (parallax) {
                parallax.style.transform = `translateY(${scrolled * 0.5}px)`;
            }
        });
    }
}

// ===== FORM HANDLING =====
function initializeFormHandling() {
    const contactForm = document.querySelector('.contact-form');
    const formSuccess = document.querySelector('.form-success');
    
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const formData = new FormData(contactForm);
            const submitButton = contactForm.querySelector('.cta-button-primary');
            const originalButtonText = submitButton.innerHTML;
            
            // Validate selects before submission
            const serviceSelect = document.getElementById('service');
            const timeSelect = document.getElementById('time');
            
            let isValid = true;
            
            if (serviceSelect) {
                if (!validateSelect(serviceSelect)) {
                    isValid = false;
                }
            }
            
            if (timeSelect) {
                if (!validateSelect(timeSelect)) {
                    isValid = false;
                }
            }
            
            // If validation fails, don't submit
            if (!isValid) {
                // Scroll to first error
                const firstError = document.querySelector('.custom-select.error');
                if (firstError) {
                    firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
                return;
            }
            
            // Show loading state
            submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
            submitButton.disabled = true;
            
            try {
                // Simulate form submission (replace with actual API call)
                await simulateFormSubmission(formData);
                
                // Show success message
                contactForm.style.display = 'none';
                formSuccess.style.display = 'block';
                
                // Reset form after 3 seconds
                setTimeout(() => {
                    contactForm.reset();
                    contactForm.style.display = 'flex';
                    formSuccess.style.display = 'none';
                    submitButton.innerHTML = originalButtonText;
                    submitButton.disabled = false;
                }, 3000);
                
            } catch (error) {
                console.error('Error submitting form:', error);
                alert('Hubo un error al enviar el formulario. Por favor, intenta nuevamente.');
                submitButton.innerHTML = originalButtonText;
                submitButton.disabled = false;
            }
        });
    }
}

async function simulateFormSubmission(formData) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Log form data (in real implementation, send to actual API)
    console.log('Form submission data:');
    for (let [key, value] of formData.entries()) {
        console.log(`${key}: ${value}`);
    }
    
    // Simulate success
    return { success: true };
}

// ===== BACK TO TOP BUTTON =====
function initializeBackToTop() {
    const backToTopButton = document.querySelector('.back-to-top');
    
    if (backToTopButton) {
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                backToTopButton.classList.add('show');
            } else {
                backToTopButton.classList.remove('show');
            }
        });
        
        backToTopButton.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

// ===== LAZY LOADING =====
function initializeLazyLoading() {
    const lazyImages = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                observer.unobserve(img);
            }
        });
    });
    
    lazyImages.forEach(img => {
        imageObserver.observe(img);
    });
}

// ===== INSTAGRAM FEED =====
function initializeInstagramFeed() {
    const instagramGrid = document.querySelector('.instagram-grid');
    
    if (instagramGrid) {
        // Simulate Instagram feed (in real implementation, use Instagram API)
        const instagramPosts = [
            { id: 1, image: 'img/manicura_permanente.jpg', link: '#' },
            { id: 2, image: 'img/pedicure_permanente.jpg', link: '#' },
            { id: 3, image: 'img/lifting_pestanas.jpg', link: '#' },
            { id: 4, image: 'img/manicura_rusa.jpg', link: '#' },
            { id: 5, image: 'img/extensiones_gel.jpg', link: '#' },
            { id: 6, image: 'img/patricia.jpg', link: '#' }
        ];
        
        instagramPosts.forEach(post => {
            const postElement = createInstagramPost(post);
            instagramGrid.appendChild(postElement);
        });
    }
}

function createInstagramPost(post) {
    const postElement = document.createElement('div');
    postElement.className = 'instagram-item';
    postElement.innerHTML = `
        <a href="${post.link}" target="_blank">
            <img src="${post.image}" alt="Instagram Post" loading="lazy">
            <div class="instagram-overlay">
                <i class="fab fa-instagram"></i>
            </div>
        </a>
    `;
    
    return postElement;
}

// ===== SERVICE CARD INTERACTIONS =====
document.addEventListener('click', (e) => {
    const serviceCard = e.target.closest('.service-card');
    
    if (serviceCard) {
        // Add click animation
        serviceCard.style.transform = 'scale(0.98)';
        setTimeout(() => {
            serviceCard.style.transform = '';
        }, 150);
        
        // Log service interaction (for analytics)
        const serviceName = serviceCard.querySelector('h3').textContent;
        console.log(`Service clicked: ${serviceName}`);
    }
});

// ===== WHATSAPP INTEGRATION =====
document.addEventListener('click', (e) => {
    const whatsappLink = e.target.closest('a[href*="wa.me"]');
    
    if (whatsappLink) {
        // Add tracking for WhatsApp clicks
        console.log('WhatsApp link clicked');
        
        // You can add custom tracking here
        if (typeof gtag !== 'undefined') {
            gtag('event', 'click', {
                'event_category': 'Contact',
                'event_label': 'WhatsApp'
            });
        }
    }
});

// ===== PERFORMANCE OPTIMIZATIONS =====
// Debounce function for scroll events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Throttle function for resize events
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// ===== ERROR HANDLING =====
window.addEventListener('error', (e) => {
    console.error('JavaScript Error:', e.error);
    
    // You can send error reports to your error tracking service
    if (typeof Sentry !== 'undefined') {
        Sentry.captureException(e.error);
    }
});

// ===== ACCESSIBILITY =====
// Add keyboard navigation support
document.addEventListener('keydown', (e) => {
    // Escape key to close mobile menu
    if (e.key === 'Escape') {
        const navMenu = document.querySelector('.nav-menu');
        const navToggle = document.querySelector('.nav-toggle');
        
        if (navMenu && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
        }
    }
    
    // Tab navigation enhancement
    if (e.key === 'Tab') {
        document.body.classList.add('keyboard-navigation');
    }
});

// Remove keyboard navigation class on mouse use
document.addEventListener('mousedown', () => {
    document.body.classList.remove('keyboard-navigation');
});

// ===== UTILITY FUNCTIONS =====
function isMobile() {
    return window.innerWidth <= 768;
}

function isTablet() {
    return window.innerWidth > 768 && window.innerWidth <= 1024;
}

function isDesktop() {
    return window.innerWidth > 1024;
}

// ===== CUSTOM EVENTS =====
// Dispatch custom events for tracking
document.dispatchEvent(new CustomEvent('websiteLoaded', {
    detail: {
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent
    }
}));

// ===== CUSTOM SELECT ENHANCEMENT =====
function initializeCustomSelects() {
    const customSelects = document.querySelectorAll('.custom-select select');
    
    customSelects.forEach(select => {
        // Skip if already initialized
        if (select.dataset.initialized === 'true') return;
        
        // Get the custom dropdown elements
        const customDropdown = select.parentElement.querySelector('.custom-dropdown');
        if (!customDropdown) return;
        
        const selectedElement = customDropdown.querySelector('.dropdown-selected');
        const optionsContainer = customDropdown.querySelector('.dropdown-options');
        const dropdownOptions = customDropdown.querySelectorAll('.dropdown-option');
        const dropdownText = customDropdown.querySelector('.dropdown-text');
        
        // Toggle dropdown
        selectedElement.addEventListener('click', function(e) {
            e.stopPropagation();
            const isOpen = optionsContainer.classList.contains('show');
            
            // Close all other dropdowns
            document.querySelectorAll('.dropdown-options.show').forEach(container => {
                container.classList.remove('show');
                container.parentElement.classList.remove('active');
                // Also remove active class from custom-select parent
                const customSelect = container.closest('.custom-select');
                if (customSelect) {
                    customSelect.classList.remove('focused', 'active');
                }
            });
            
            if (!isOpen) {
                optionsContainer.classList.add('show');
                selectedElement.classList.add('active');
                // Add active class to custom-select parent for arrow rotation
                const customSelect = selectedElement.closest('.custom-select');
                if (customSelect) {
                    customSelect.classList.add('active');
                }
            } else {
                optionsContainer.classList.remove('show');
                selectedElement.classList.remove('active');
                // Remove active class from custom-select parent
                const customSelect = selectedElement.closest('.custom-select');
                if (customSelect) {
                    customSelect.classList.remove('active');
                }
            }
        });
        
        // Handle option selection
        dropdownOptions.forEach(option => {
            option.addEventListener('click', function(e) {
                e.stopPropagation();
                
                const value = this.dataset.value;
                const text = this.textContent;
                
                // Update hidden select
                select.value = value;
                
                // Update visible dropdown
                dropdownText.textContent = text;
                
                // Update selected state
                dropdownOptions.forEach(opt => opt.classList.remove('selected'));
                this.classList.add('selected');
                
                // Close dropdown
                optionsContainer.classList.remove('show');
                selectedElement.classList.remove('active');
                // Remove active class from custom-select parent
                const customSelect = selectedElement.closest('.custom-select');
                if (customSelect) {
                    customSelect.classList.remove('active');
                }
                
                // Trigger change event for validation
                select.dispatchEvent(new Event('change'));
                
                // Add animation class
                selectedElement.classList.add('selected');
                setTimeout(() => {
                    selectedElement.classList.remove('selected');
                }, 300);
            });
        });
        
        // Close dropdown when clicking outside
        document.addEventListener('click', function() {
            optionsContainer.classList.remove('show');
            selectedElement.classList.remove('active');
            // Remove active class from custom-select parent
            const customSelect = selectedElement.closest('.custom-select');
            if (customSelect) {
                customSelect.classList.remove('active');
            }
        });
        
        // Prevent dropdown from closing when clicking inside
        optionsContainer.addEventListener('click', function(e) {
            e.stopPropagation();
        });
        
        // Keyboard navigation
        selectedElement.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                selectedElement.click();
            }
        });
        
        // Mark as initialized
        select.dataset.initialized = 'true';
    });
}

// Initialize custom selects when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeCustomSelects);

// ===== SELECT VALIDATION FUNCTIONS =====
function validateSelect(selectElement) {
    const selectWrapper = selectElement.closest('.custom-select');
    const isValid = selectElement.value !== '';
    
    // Remove previous validation classes
    selectElement.classList.remove('error', 'success');
    
    if (isValid) {
        selectElement.classList.add('success');
        selectWrapper.classList.remove('error');
    } else {
        selectElement.classList.add('error');
        selectWrapper.classList.add('error');
    }
    
    return isValid;
}

function initializeSelectValidation() {
    const serviceSelect = document.getElementById('service');
    const timeSelect = document.getElementById('time');
    
    // Add validation on change
    if (serviceSelect) {
        serviceSelect.addEventListener('change', function() {
            validateSelect(this);
        });
        
        // Add validation on blur
        serviceSelect.addEventListener('blur', function() {
            validateSelect(this);
        });
    }
    
    if (timeSelect) {
        timeSelect.addEventListener('change', function() {
            validateSelect(this);
        });
        
        timeSelect.addEventListener('blur', function() {
            validateSelect(this);
        });
    }
}

// Initialize select validation
document.addEventListener('DOMContentLoaded', initializeSelectValidation);

// ===== EXPORT FUNCTIONS (for testing) =====
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initializeAnimations,
        initializeNavigation,
        initializeFormHandling,
        debounce,
        throttle,
        isMobile,
        isTablet,
        isDesktop
    };
}