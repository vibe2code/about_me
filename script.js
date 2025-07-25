// Language and theme management
class PortfolioApp {
    constructor() {
        this.currentLanguage = 'en';
        this.currentTheme = 'light';
        this.init();
    }

    init() {
        this.detectSystemPreferences();
        this.setupEventListeners();
        this.updateLanguage();
        this.updateTheme();
        this.setupNavigation();
        this.setupScrollEffects();
    }

    // Detect system preferences for theme and language
    detectSystemPreferences() {
        // Detect system theme preference
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            this.currentTheme = 'dark';
        }

        // Detect system language preference
        const systemLanguage = navigator.language || navigator.userLanguage;
        if (systemLanguage.startsWith('ru')) {
            this.currentTheme = 'ru';
        }

        // Load saved preferences from localStorage
        const savedTheme = localStorage.getItem('theme');
        const savedLanguage = localStorage.getItem('language');
        
        if (savedTheme) this.currentTheme = savedTheme;
        if (savedLanguage) this.currentLanguage = savedLanguage;
    }

    // Setup event listeners
    setupEventListeners() {
        // Language toggle
        const languageToggle = document.getElementById('languageToggle');
        if (languageToggle) {
            languageToggle.addEventListener('click', () => {
                this.currentLanguage = this.currentLanguage === 'en' ? 'ru' : 'en';
                localStorage.setItem('language', this.currentLanguage);
                this.updateLanguage();
            });
        }

        // Theme toggle
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => {
                this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
                localStorage.setItem('theme', this.currentTheme);
                this.updateTheme();
            });
        }

        // Navigation buttons
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const section = link.getAttribute('data-section');
                this.scrollToSection(section);
            });
        });

        // Hero section buttons
        const heroButtons = document.querySelectorAll('.btn[data-section]');
        heroButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const section = button.getAttribute('data-section');
                this.scrollToSection(section);
            });
        });

        // Listen for system theme changes
        if (window.matchMedia) {
            window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
                if (!localStorage.getItem('theme')) {
                    this.currentTheme = e.matches ? 'dark' : 'light';
                    this.updateTheme();
                }
            });
        }
    }

    // Update language across the site
    updateLanguage() {
        const elements = document.querySelectorAll('[data-en][data-ru]');
        elements.forEach(element => {
            const text = element.getAttribute(`data-${this.currentLanguage}`);
            if (text) {
                element.textContent = text;
            }
        });

        // Update page title
        const title = document.querySelector('title');
        if (title) {
            const titleText = title.getAttribute(`data-${this.currentLanguage}`);
            if (titleText) {
                title.textContent = titleText;
            }
        }

        // Update language toggle button
        const languageToggle = document.getElementById('languageToggle');
        if (languageToggle) {
            const span = languageToggle.querySelector('span');
            if (span) {
                span.textContent = this.currentLanguage.toUpperCase();
            }
        }

        // Update HTML lang attribute
        document.documentElement.lang = this.currentLanguage;
    }

    // Update theme across the site
    updateTheme() {
        document.documentElement.setAttribute('data-theme', this.currentTheme);
        
        // Update theme toggle icon
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            const sunIcon = themeToggle.querySelector('.sun-icon');
            const moonIcon = themeToggle.querySelector('.moon-icon');
            
            if (this.currentTheme === 'dark') {
                sunIcon.style.display = 'block';
                moonIcon.style.display = 'none';
            } else {
                sunIcon.style.display = 'none';
                moonIcon.style.display = 'block';
            }
        }
    }

    // Setup smooth navigation
    setupNavigation() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link');

        // Update active navigation link on scroll
        window.addEventListener('scroll', () => {
            let current = '';
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.clientHeight;
                if (window.pageYOffset >= sectionTop - 200) {
                    current = section.getAttribute('id');
                }
            });

            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('data-section') === current) {
                    link.classList.add('active');
                }
            });
        });
    }

    // Scroll to section
    scrollToSection(sectionId) {
        const section = document.getElementById(sectionId);
        if (section) {
            const headerHeight = document.querySelector('.header').offsetHeight;
            const targetPosition = section.offsetTop - headerHeight - 20;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    }

    // Setup scroll effects
    setupScrollEffects() {
        // Intersection Observer for animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);

        // Observe elements for animation
        const animatedElements = document.querySelectorAll('.project-card, .skill-category, .stat');
        animatedElements.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(el);
        });
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new PortfolioApp();
});

// Add some interactive features
document.addEventListener('DOMContentLoaded', () => {
    // Typing effect for hero title
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        const text = heroTitle.textContent;
        heroTitle.textContent = '';
        
        let i = 0;
        const typeWriter = () => {
            if (i < text.length) {
                heroTitle.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, 100);
            }
        };
        
        // Start typing effect after a short delay
        setTimeout(typeWriter, 500);
    }

    // Parallax effect for hero section
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const hero = document.querySelector('.hero');
        if (hero) {
            const rate = scrolled * -0.5;
            hero.style.transform = `translateY(${rate}px)`;
        }
    });

    // Skill bars animation on scroll
    const skillBars = document.querySelectorAll('.skill-progress');
    const skillObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const width = entry.target.style.width;
                entry.target.style.width = '0';
                setTimeout(() => {
                    entry.target.style.width = width;
                }, 100);
            }
        });
    }, { threshold: 0.5 });

    skillBars.forEach(bar => {
        skillObserver.observe(bar);
    });

    // Add hover effects to project cards
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0) scale(1)';
        });
    });

    // Add click effects to buttons
    const buttons = document.querySelectorAll('.btn, .nav-link, .language-toggle, .theme-toggle');
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            // Create ripple effect
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('ripple');
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
});

// Add CSS for ripple effect
const style = document.createElement('style');
style.textContent = `
    .btn, .nav-link, .language-toggle, .theme-toggle {
        position: relative;
        overflow: hidden;
    }
    
    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.3);
        transform: scale(0);
        animation: ripple-animation 0.6s linear;
        pointer-events: none;
    }
    
    @keyframes ripple-animation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Add loading animation
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});

// Add CSS for loading state
const loadingStyle = document.createElement('style');
loadingStyle.textContent = `
    body {
        opacity: 0;
        transition: opacity 0.5s ease;
    }
    
    body.loaded {
        opacity: 1;
    }
`;
document.head.appendChild(loadingStyle); 