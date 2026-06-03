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

    // Lead Signup Form handler
    const signupForm = document.getElementById('lead-signup-form');
    if (signupForm) {
        // Place webhook URL here. The user will provide their GoHighLevel webhook.
        const GOHIGHLEVEL_WEBHOOK_URL = 'https://services.leadconnectorhq.com/hooks/DAqjBo0Yp526LGicWLef/webhook-trigger/fca55af0-9283-4b95-9770-2675581765d4';

        signupForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const nameInput = document.getElementById('signup-name');
            const emailInput = document.getElementById('signup-email');
            const submitBtn = signupForm.querySelector('.signup-btn');
            const btnText = submitBtn.querySelector('.btn-text');
            const btnLoader = submitBtn.querySelector('.btn-loader');
            const successMsg = signupForm.querySelector('.success-message');
            const errorMsg = signupForm.querySelector('.error-message');

            // Hide previous messages
            successMsg.classList.add('hidden');
            errorMsg.classList.add('hidden');

            // Gather selected interests
            const checkedCheckboxes = signupForm.querySelectorAll('input[name="interests"]:checked');
            const interests = Array.from(checkedCheckboxes).map(cb => cb.value);

            // Prepare payload
            const payload = {
                name: nameInput.value.trim(),
                email: emailInput.value.trim(),
                interests: interests
            };

            // Loading state
            submitBtn.disabled = true;
            btnText.classList.add('hidden');
            btnLoader.classList.remove('hidden');

            try {
                // If the webhook is not configured yet, log it, but attempt the request anyway.
                // If it is a placeholder string, we'll simulate success locally.
                if (GOHIGHLEVEL_WEBHOOK_URL.includes('YOUR_GOHIGHLEVEL_WEBHOOK_URL_HERE')) {
                    console.warn('GoHighLevel Webhook URL is not configured. Simulating successful submission.');
                    await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate delay
                    successMsg.classList.remove('hidden');
                    signupForm.reset();
                } else {
                    const response = await fetch(GOHIGHLEVEL_WEBHOOK_URL, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(payload)
                    });

                    if (response.ok) {
                        successMsg.classList.remove('hidden');
                        signupForm.reset();
                    } else {
                        throw new Error('Server responded with status: ' + response.status);
                    }
                }
            } catch (error) {
                console.error('Submission error:', error);
                errorMsg.classList.remove('hidden');
            } finally {
                // Restore button state
                submitBtn.disabled = false;
                btnText.classList.remove('hidden');
                btnLoader.classList.add('hidden');
            }
        });
    }
});
