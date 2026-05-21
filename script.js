document.addEventListener('DOMContentLoaded', () => {
    // Navbar scroll effect
    const navbar = document.getElementById('navbar');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                // Update active state
                document.querySelectorAll('.nav-link').forEach(link => {
                    link.classList.remove('active');
                });
                if(this.classList.contains('nav-link')) {
                    this.classList.add('active');
                }
                
                // Close mobile menu if open
                const navRight = document.querySelector('.nav-right');
                if(navRight && navRight.classList.contains('active')) {
                    navRight.classList.remove('active');
                }
                
                // Scroll to element
                window.scrollTo({
                    top: targetElement.offsetTop - 80, // Offset for navbar
                    behavior: 'smooth'
                });
            }
        });
    });

    // Mobile menu toggle
    const mobileToggle = document.querySelector('.mobile-toggle');
    const navRight = document.querySelector('.nav-right');
    
    if (mobileToggle) {
        mobileToggle.addEventListener('click', () => {
            navRight.classList.toggle('active');
        });
    }

    // Intersection Observer for scroll animations (fade in)
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = "1";
                entry.target.style.transform = "translateY(0)";
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Apply animation starting state to sections
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        section.style.opacity = "0";
        section.style.transform = "translateY(30px)";
        section.style.transition = "opacity 0.8s ease-out, transform 0.8s ease-out";
        observer.observe(section);
    });
});
