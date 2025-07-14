// Main JavaScript for Aryan Patodiya's Portfolio

document.addEventListener('DOMContentLoaded', function() {
    // Initialize AOS (Animate On Scroll)
    AOS.init({
        duration: 800,
        easing: 'ease',
        once: true,
        offset: 100
    });
    
    // Typewriter Animation for Name - Removed as requested
    // Display name without animation
    const nameElement = document.getElementById('name-typewriter');
    if (nameElement) {
        nameElement.textContent = 'Aryan Patodiya';
        nameElement.classList.remove('typewriter');
    }
    
    // Typewriter Animation for Role
    const roleTypewriter = new Typed('#role-typewriter', {
        strings: ['Developer', 'Engineer', 'Researcher', 'Innovator'],
        typeSpeed: 80,
        backSpeed: 50,
        backDelay: 2000,
        loop: true,
        showCursor: false
    });
    
    // Sticky Header
    const header = document.getElementById('header');
    const scrollThreshold = 100;
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > scrollThreshold) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
    
    // Back to Top Button
    const backToTopButton = document.querySelector('.back-to-top');
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 500) {
            backToTopButton.classList.add('show');
        } else {
            backToTopButton.classList.remove('show');
        }
    });
    
    backToTopButton.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // Smooth Scrolling for Navigation Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const headerHeight = document.getElementById('header').offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                if (document.querySelector('.mobile-menu.active')) {
                    toggleMobileMenu();
                }
            }
        });
    });
    
    // Mobile Menu Toggle
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const mobileMenu = document.createElement('div');
    mobileMenu.className = 'mobile-menu';
    
    const overlay = document.createElement('div');
    overlay.className = 'overlay';
    
    // Create mobile menu content
    mobileMenu.innerHTML = `
        <div class="mobile-menu-close">
            <i class="fas fa-times"></i>
        </div>
        <div class="mobile-menu-links">
            <a href="#about">About</a>
            <a href="#skills">Skills</a>
            <a href="#experience">Experience</a>
            <a href="#projects">Projects</a>
            <a href="#education">Education</a>
            <a href="#contact">Contact</a>
        </div>
        <div class="mobile-menu-social">
            <a href="#" class="social-link" aria-label="LinkedIn">
                <i class="fab fa-linkedin-in"></i>
            </a>
            <a href="#" class="social-link" aria-label="GitHub">
                <i class="fab fa-github"></i>
            </a>
            <a href="#" class="social-link" aria-label="Email">
                <i class="fas fa-envelope"></i>
            </a>
        </div>
    `;
    
    document.body.appendChild(mobileMenu);
    document.body.appendChild(overlay);
    
    function toggleMobileMenu() {
        mobileMenu.classList.toggle('active');
        overlay.classList.toggle('active');
        document.body.classList.toggle('no-scroll');
    }
    
    mobileMenuToggle.addEventListener('click', toggleMobileMenu);
    
    document.querySelector('.mobile-menu-close').addEventListener('click', toggleMobileMenu);
    overlay.addEventListener('click', toggleMobileMenu);
    
    // Theme Toggle (Light/Dark Mode)
    const themeToggle = document.querySelector('.theme-toggle');
    const body = document.body;
    
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme');
    
    if (savedTheme === 'dark') {
        body.classList.add('dark-theme');
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    }
    
    themeToggle.addEventListener('click', function() {
        body.classList.toggle('dark-theme');
        
        if (body.classList.contains('dark-theme')) {
            localStorage.setItem('theme', 'dark');
            themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
        } else {
            localStorage.setItem('theme', 'light');
            themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
        }
    });
    
    const contactForm = document.querySelector('.contact-form' );
    
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form values
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const subject = document.getElementById('subject').value;
        const message = document.getElementById('message').value;
        
        // Simple form validation
        if (!name || !email || !subject || !message) {
            showFormStatus('Please fill in all fields', 'error');
            return;
        }
        
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showFormStatus('Please enter a valid email address', 'error');
            return;
        }
        
        const submitButton = contactForm.querySelector('button[type="submit"]');
        const originalText = submitButton.innerHTML;
        
        submitButton.disabled = true;
        submitButton.innerHTML = '<span class="btn-text">Sending...</span>';
        showFormStatus('Sending your message...', 'loading');
        
        // Create FormData object
        const formData = new FormData();
        formData.append('name', name);
        formData.append('email', email);
        formData.append('subject', subject);
        formData.append('message', message);
        formData.append('_subject', `Portfolio Contact: ${subject} - from ${name}`);
        formData.append('_captcha', 'false');
        
        // Send to Formspree
        fetch('https://formspree.io/f/mqalzlbl', {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json'
            }
        } )
        .then(response => {
            if (response.ok) {
                showFormStatus(`Thank you, ${name}! Your message has been sent successfully. I'll get back to you soon.`, 'success');
                contactForm.reset();
            } else {
                response.json().then(data => {
                    if (Object.hasOwnProperty.call(data, 'errors')) {
                        showFormStatus('Error: ' + data.errors.map(error => error.message).join(', '), 'error');
                    } else {
                        showFormStatus('There was a problem sending your message. Please try again.', 'error');
                    }
                });
            }
        })
        .catch(error => {
            console.error('Error:', error);
            showFormStatus('Network error. Please check your connection and try again.', 'error');
        })
        .finally(() => {
            submitButton.disabled = false;
            submitButton.innerHTML = originalText;
        });
    });
}

// Function to show form status messages
function showFormStatus(message, type) {
    const statusDiv = document.getElementById('form-status');
    if (statusDiv) {
        statusDiv.textContent = message;
        statusDiv.className = `form-status status-${type}`;
        statusDiv.style.display = 'block';
        
        // Auto-hide success messages after 5 seconds
        if (type === 'success') {
            setTimeout(() => {
                statusDiv.style.display = 'none';
            }, 5000);
        }
    }
}

// Handle success redirect
window.addEventListener('load', function() {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('success') === 'true') {
        showFormStatus('Thank you! Your message has been sent successfully.', 'success');
        // Remove the success parameter from URL
        window.history.replaceState({}, document.title, window.location.pathname);
    }
});

    
    // Skill Icon Animation on Hover
    const skillItems = document.querySelectorAll('.skill-item');
    
    skillItems.forEach(item => {
        const icon = item.querySelector('.skill-icon');
        
        item.addEventListener('mouseenter', () => {
            icon.style.transform = 'translateY(-10px)';
        });
        
        item.addEventListener('mouseleave', () => {
            icon.style.transform = 'translateY(0)';
        });
    });
    
    // Project Image Parallax Effect
    const projectImages = document.querySelectorAll('.project-img');
    
    window.addEventListener('scroll', () => {
        projectImages.forEach(image => {
            const imageTop = image.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (imageTop < windowHeight && imageTop > -windowHeight) {
                const scrollPosition = window.scrollY;
                const parallaxSpeed = 0.1;
                const parallaxOffset = scrollPosition * parallaxSpeed;
                
                image.style.transform = `translateY(${parallaxOffset}px)`;
            }
        });
    });
    
    // Animate Numbers (for experience years, etc.)
    function animateNumbers() {
        const numberElements = document.querySelectorAll('.animate-number');
        
        numberElements.forEach(element => {
            const targetNumber = parseInt(element.getAttribute('data-target'));
            const duration = 2000; // 2 seconds
            const startTime = performance.now();
            
            function updateNumber(currentTime) {
                const elapsedTime = currentTime - startTime;
                const progress = Math.min(elapsedTime / duration, 1);
                const currentNumber = Math.floor(progress * targetNumber);
                
                element.textContent = currentNumber;
                
                if (progress < 1) {
                    requestAnimationFrame(updateNumber);
                } else {
                    element.textContent = targetNumber;
                }
            }
            
            requestAnimationFrame(updateNumber);
        });
    }
    
    // Trigger number animation when elements are in viewport
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateNumbers();
                observer.disconnect();
            }
        });
    });
    
    const experienceBadge = document.querySelector('.experience-badge');
    if (experienceBadge) {
        observer.observe(experienceBadge);
    }
    
    // Particle Animation in Hero Section
    function createParticles() {
        const heroSection = document.getElementById('hero');
        const particleContainer = document.createElement('div');
        particleContainer.className = 'particles-container';
        
        heroSection.appendChild(particleContainer);
        
        for (let i = 0; i < 50; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle-small';
            
            // Random position
            const posX = Math.random() * 100;
            const posY = Math.random() * 100;
            
            // Random size
            const size = Math.random() * 5 + 2;
            
            // Random opacity
            const opacity = Math.random() * 0.5 + 0.1;
            
            // Random animation duration
            const duration = Math.random() * 20 + 10;
            
            // Set styles
            particle.style.left = `${posX}%`;
            particle.style.top = `${posY}%`;
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            particle.style.opacity = opacity;
            particle.style.animationDuration = `${duration}s`;
            
            particleContainer.appendChild(particle);
        }
    }
    
    createParticles();
});

