// ===== ATTENDRE QUE LE DOM SOIT CHARGÉ =====
document.addEventListener('DOMContentLoaded', function() {
    initHeader();
    initMobileMenu();
    initThemeToggle();
    initScrollEffects();
    initStatsCounter();
    initSmoothScroll();
    initFormSubmit();
});

// ===== HEADER SCROLL EFFECT =====
function initHeader() {
    const header = document.getElementById('header');
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
}

// ===== MENU MOBILE =====
function initMobileMenu() {
    const menuToggle = document.getElementById('menuToggle');
    const navMobile = document.getElementById('navMobile');
    
    if (!menuToggle || !navMobile) return;

    menuToggle.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        navMobile.classList.toggle('show');
    });

    const mobileLinks = document.querySelectorAll('.mobile-link');
    mobileLinks.forEach(link => {
        link.addEventListener('click', function() {
            navMobile.classList.remove('show');
        });
    });

    document.addEventListener('click', function(e) {
        if (!menuToggle.contains(e.target) && !navMobile.contains(e.target)) {
            navMobile.classList.remove('show');
        }
    });
}

// ===== THEME TOGGLE (DARK MODE) =====
function initThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    const themeToggleMobile = document.getElementById('themeToggleMobile');
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
    
    // Vérifier le thème sauvegardé
    const savedTheme = localStorage.getItem('theme');
    
    if (savedTheme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
        updateThemeIcons(true);
    } else if (savedTheme === 'light') {
        document.documentElement.setAttribute('data-theme', 'light');
        updateThemeIcons(false);
    } else if (prefersDarkScheme.matches) {
        // Si pas de préférence sauvegardée, utiliser la préférence système
        document.documentElement.setAttribute('data-theme', 'dark');
        updateThemeIcons(true);
        localStorage.setItem('theme', 'dark');
    }

    function toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        
        updateThemeIcons(newTheme === 'dark');
    }

    function updateThemeIcons(isDark) {
        const icon = isDark ? 'fa-sun' : 'fa-moon';
        const text = isDark ? 'Mode clair' : 'Mode sombre';
        
        if (themeToggle) {
            themeToggle.innerHTML = `<i class="fas ${icon}"></i>`;
        }
        
        if (themeToggleMobile) {
            themeToggleMobile.innerHTML = `<i class="fas ${icon}"></i> ${text}`;
        }
    }

    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }
    
    if (themeToggleMobile) {
        themeToggleMobile.addEventListener('click', toggleTheme);
    }
}

// ===== ANIMATIONS AU SCROLL =====
function initScrollEffects() {
    const animatedElements = document.querySelectorAll('.feature-card, .testimonial-card, .stat-item, .contact-item');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });

    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        observer.observe(el);
    });
}

// ===== COMPTEUR DE STATISTIQUES =====
function initStatsCounter() {
    const statsSection = document.querySelector('.stats');
    const statNumbers = document.querySelectorAll('.stat-number');
    let animated = false;

    function animateStats() {
        if (animated) return;
        
        statNumbers.forEach(stat => {
            const target = parseInt(stat.getAttribute('data-target'));
            let current = 0;
            const increment = target / 50;
            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    if (target === 50) stat.textContent = '50K+';
                    else if (target === 1000) stat.textContent = '1M+';
                    else if (target === 48) stat.textContent = '4.8/5';
                    else stat.textContent = target + '+';
                    clearInterval(timer);
                } else {
                    if (target === 50) stat.textContent = Math.floor(current) + 'K+';
                    else if (target === 1000) {
                        if (current < 1000) stat.textContent = (current/1000).toFixed(1) + 'M+';
                        else stat.textContent = '1M+';
                    }
                    else if (target === 48) stat.textContent = (Math.floor(current*10)/100).toFixed(1) + '/5';
                    else stat.textContent = Math.floor(current) + '+';
                }
            }, 30);
        });
        
        animated = true;
    }

    if (!statsSection) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateStats();
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    observer.observe(statsSection);
}

// ===== SCROLL SMOOTH POUR LES LIENS =====
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            if (href === '#' || href === '') return;
            
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// ===== GESTION DU FORMULAIRE DE CONTACT =====
function initFormSubmit() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Envoi...';
            submitBtn.disabled = true;
            
            setTimeout(() => {
                submitBtn.innerHTML = '<i class="fas fa-check"></i> Message envoyé !';
                submitBtn.style.background = '#4CAF50';
                
                this.reset();
                
                setTimeout(() => {
                    submitBtn.innerHTML = originalText;
                    submitBtn.style.background = '';
                    submitBtn.disabled = false;
                }, 3000);
            }, 2000);
        });
    }
}

// ===== MODAL =====
window.showModal = function(type) {
    const modal = document.getElementById('modal');
    if (modal) {
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
        
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeModal();
            }
        });
    }
}

window.closeModal = function() {
    const modal = document.getElementById('modal');
    if (modal) {
        modal.classList.remove('show');
        document.body.style.overflow = 'auto';
    }
}

window.notifyMe = function() {
    const email = document.getElementById('modalEmail').value;
    if (email) {
        alert('Merci ! Vous serez notifié dès la sortie de ScoolNet.');
        closeModal();
    } else {
        alert('Veuillez entrer votre email');
    }
}

// ===== HEADER HIDE ON SCROLL =====
let lastScrollTop = 0;
window.addEventListener('scroll', function() {
    const header = document.getElementById('header');
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    if (scrollTop > 100) {
        if (scrollTop > lastScrollTop) {
            header.style.transform = 'translateY(-100%)';
        } else {
            header.style.transform = 'translateY(0)';
        }
    } else {
        header.style.transform = 'translateY(0)';
    }
    
    lastScrollTop = scrollTop;
});

// ===== RESIZE HANDLER =====
window.addEventListener('resize', function() {
    if (window.innerWidth > 768) {
        const navMobile = document.getElementById('navMobile');
        if (navMobile) {
            navMobile.classList.remove('show');
        }
    }
});