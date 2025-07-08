// Smooth scrolling for ALL in-page anchor links (including nav and CTA)
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        // Only handle links that refer to a target on this page (not just '#')
        const targetId = this.getAttribute('href');
        if (targetId && targetId.length > 1 && document.querySelector(targetId)) {
            e.preventDefault();

            const targetElement = document.querySelector(targetId);

            // Adjust for sticky nav height—more offset on small screens
            const offset = window.innerWidth <= 768 ? 80 : 100;
            const elementPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
            const offsetPosition = elementPosition - offset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
        // If href just "#", do nothing or allow default
    });
});

// Basic form submission handling (for demonstration)
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault(); // Prevent actual form submission
        alert('Thank you for your message! Mieke will get back to you soon!');
        contactForm.reset();
    });
}

// Scroll reveal animation
const revealElements = document.querySelectorAll('.reveal-on-scroll');
const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.1 });

revealElements.forEach(element => {
    observer.observe(element);
});