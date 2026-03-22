// Neural Dashboard Core
const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');
let particles = [];

function initBackground() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    particles = [];
    const count = 80;
    for (let i = 0; i < count; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * 0.5,
            vy: (Math.random() - 0.5) * 0.5,
            size: Math.random() * 2 + 1
        });
    }
}

function animateBackground() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'rgba(0, 210, 255, 0.3)';
    ctx.strokeStyle = 'rgba(0, 210, 255, 0.05)';
    particles.forEach((p, i) => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2); ctx.fill();
        for (let j = i + 1; j < particles.length; j++) {
            const p2 = particles[j];
            const dist = Math.hypot(p.x - p2.x, p.y - p2.y);
            if (dist < 150) {
                ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(p2.x, p2.y); ctx.stroke();
            }
        }
    });
    requestAnimationFrame(animateBackground);
}

window.addEventListener('resize', initBackground);
initBackground();
animateBackground();

// GSAP High-end reveal
gsap.from(".title-reveal", { duration: 1.5, y: 100, opacity: 0, ease: "power4.out" });
gsap.from(".subtitle", { duration: 1.5, y: 50, opacity: 0, delay: 0.3, ease: "power4.out" });
gsap.from(".project-card", { 
    duration: 1, 
    y: 50, 
    opacity: 0, 
    stagger: 0.2, 
    delay: 0.5, 
    ease: "back.out(1.7)" 
});
