// SwimHub Website JavaScript
document.addEventListener('DOMContentLoaded', function() {
    
    // ==========================================
    // SECURITY & PROTECTION MEASURES
    // ==========================================
    
    // Prevent DevTools inspection (basic deterrent)
    document.addEventListener('keydown', function(e) {
        // Prevent F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U
        if (e.key === 'F12' || 
            (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'i' || e.key === 'J' || e.key === 'j')) ||
            (e.ctrlKey && (e.key === 'U' || e.key === 'u'))) {
            e.preventDefault();
            return false;
        }
    });
    
    // Disable right-click context menu
    document.addEventListener('contextmenu', function(e) {
        e.preventDefault();
        return false;
    });
    
    // Prevent text selection on sensitive areas
    document.querySelectorAll('.cta-button, .pricing-card').forEach(el => {
        el.style.userSelect = 'none';
        el.style.webkitUserSelect = 'none';
    });
    
    // Validate purchase links before redirect
    const fungiesButtons = document.querySelectorAll('.fungies-btn');
    
    fungiesButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            const productType = this.getAttribute('data-product');
            
            // Validate it's an auth link (Discord OAuth flow)
            if (href && href.startsWith('/auth/discord')) {
                // Log purchase attempt (for analytics)
                console.log('Purchase initiated:', productType, 'at', new Date().toISOString());
                
                // Show loading state
                const originalText = this.innerHTML;
                this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Connecting to Discord...';
                this.style.pointerEvents = 'none';
                
                // Allow the navigation to proceed
                return true;
            }
            
            // Block any invalid/tampered URLs
            if (!href.startsWith('/auth/') && !href.includes('divine.land')) {
                e.preventDefault();
                console.error('Invalid checkout URL detected');
                return false;
            }
        });
    });
    
    // Protect against URL tampering - validate external links
    document.querySelectorAll('a[target="_blank"]').forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // List of allowed domains
            const allowedDomains = [
                'dsc.gg',
                'discord.gg',
                'fungies.io',
                'divine.land'
            ];
            
            // Check if URL is from allowed domain
            const url = new URL(href, window.location.origin);
            const isAllowed = allowedDomains.some(domain => url.hostname.includes(domain));
            
            if (!isAllowed && !href.startsWith('/') && !href.startsWith('./')) {
                e.preventDefault();
                console.warn('Blocked navigation to unauthorized domain:', url.hostname);
                return false;
            }
        });
    });
    
    // Anti-automation detection
    let clickCount = 0;
    let lastClickTime = 0;
    const maxClicksPerSecond = 5;
    
    document.querySelectorAll('.cta-button').forEach(btn => {
        btn.addEventListener('click', function(e) {
            const now = Date.now();
            
            if (now - lastClickTime < 1000) {
                clickCount++;
                if (clickCount > maxClicksPerSecond) {
                    e.preventDefault();
                    alert('Too many clicks detected. Please wait a moment.');
                    return false;
                }
            } else {
                clickCount = 1;
            }
            
            lastClickTime = now;
        });
    });
    
    // ==========================================
    // UI INTERACTIONS
    // ==========================================
    // Add subtle hover effects to buttons
    const buttons = document.querySelectorAll('.btn');
    
    buttons.forEach(btn => {
        btn.addEventListener('mouseenter', function() {
            this.style.transition = 'all 0.3s ease';
        });
    });
    
    // Logo face animation on hover
    const logoFace = document.querySelector('.logo-face');
    if (logoFace) {
        logoFace.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.1)';
            this.style.transition = 'transform 0.3s ease';
        });
        
        logoFace.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
    }
    
    // Pricing card tilt effect on mouse move
    const pricingCards = document.querySelectorAll('.pricing-card');
    
    pricingCards.forEach(card => {
        card.addEventListener('mousemove', function(e) {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px) scale(1.02)`;
        });
        
        card.addEventListener('mouseleave', function() {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0) scale(1)';
            card.style.transition = 'transform 0.5s ease';
        });
        
        card.addEventListener('mouseenter', function() {
            card.style.transition = 'transform 0.1s ease';
        });
    });
    
    // Ripple effect on CTA buttons
    const ctaButtons = document.querySelectorAll('.cta-button');
    
    ctaButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const ripple = document.createElement('span');
            ripple.style.cssText = `
                position: absolute;
                background: rgba(255, 255, 255, 0.3);
                border-radius: 50%;
                transform: scale(0);
                animation: ripple 0.6s ease-out;
                pointer-events: none;
                left: ${x}px;
                top: ${y}px;
                width: 100px;
                height: 100px;
                margin-left: -50px;
                margin-top: -50px;
            `;
            
            btn.style.position = 'relative';
            btn.style.overflow = 'hidden';
            btn.appendChild(ripple);
            
            setTimeout(() => ripple.remove(), 600);
        });
    });
    
    // Add ripple animation keyframes dynamically
    const style = document.createElement('style');
    style.textContent = `
        @keyframes ripple {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
    
    // Intersection Observer for scroll animations
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
    
    // Observe pricing cards for scroll animations
    document.querySelectorAll('.pricing-card').forEach(card => {
        observer.observe(card);
    });
    
    // Payment icon hover sound effect (visual feedback)
    const paymentIcons = document.querySelectorAll('.payment-icon');
    
    paymentIcons.forEach(icon => {
        icon.addEventListener('mouseenter', function() {
            this.style.animation = 'bounce 0.3s ease';
        });
        
        icon.addEventListener('animationend', function() {
            this.style.animation = '';
        });
    });
    
    // Add bounce animation
    const bounceStyle = document.createElement('style');
    bounceStyle.textContent = `
        @keyframes bounce {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-5px); }
        }
    `;
    document.head.appendChild(bounceStyle);
    
    // Parallax effect for gradient orbs
    document.addEventListener('mousemove', function(e) {
        const orbs = document.querySelectorAll('.gradient-orb');
        const mouseX = e.clientX / window.innerWidth;
        const mouseY = e.clientY / window.innerHeight;
        
        orbs.forEach((orb, index) => {
            const speed = (index + 1) * 20;
            const x = (mouseX - 0.5) * speed;
            const y = (mouseY - 0.5) * speed;
            
            orb.style.transform = `translate(${x}px, ${y}px)`;
        });
    });
    
    // Typing effect for page title (optional)
    const pageTitle = document.querySelector('.page-title');
    if (pageTitle && pageTitle.textContent.includes('Purchase')) {
        const originalText = pageTitle.textContent;
        pageTitle.textContent = '';
        pageTitle.style.opacity = '1';
        
        let i = 0;
        const typeWriter = () => {
            if (i < originalText.length) {
                pageTitle.textContent += originalText.charAt(i);
                i++;
                setTimeout(typeWriter, 50);
            }
        };
        
        setTimeout(typeWriter, 300);
    }
});
