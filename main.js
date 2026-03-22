// Neural Background Canvas
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
        p.x += p.vx;
        p.y += p.vy;
        
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
        
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        
        for (let j = i + 1; j < particles.length; j++) {
            const p2 = particles[j];
            const dist = Math.hypot(p.x - p2.x, p.y - p2.y);
            if (dist < 150) {
                ctx.beginPath();
                ctx.moveTo(p.x, p.y);
                ctx.lineTo(p2.x, p2.y);
                ctx.stroke();
            }
        }
    });
    
    requestAnimationFrame(animateBackground);
}

window.addEventListener('resize', initBackground);
initBackground();
animateBackground();

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

// Project Management
const viewer = document.getElementById('project-viewer');
const container = document.getElementById('project-app-container');
let stream = null;

function openProject(id) {
    viewer.style.display = 'block';
    container.innerHTML = '<div style="text-align: center;"><i class="fas fa-spinner fa-spin"></i> Initializing Neural Engine...</div>';
    
    if (id === 'vision') {
        loadVisionProject();
    } else if (id === 'gen') {
        loadGenProject();
    } else if (id === 'chat') {
        loadChatProject();
    } else if (id === 'pose') {
        loadPoseProject();
    } else if (id === 'mood') {
        loadMoodProject();
    } else if (id === 'pulse') {
        loadPulseProject();
    }
}

function closeProject() {
    viewer.style.display = 'none';
    container.innerHTML = '';
    if (stream) {
        stream.getTracks().forEach(t => t.stop());
        stream = null;
    }
}

// ---- INDUSTRIAL SAFETY (Computer Vision) ----
let model = null;
async function loadVisionProject() {
    container.innerHTML = `
        <h2 style="margin-bottom: 2rem;">INDUSTRIAL SAFETY MONITOR</h2>
        <div class="ml-container" style="position: relative;">
            <video id="webcam" autoplay muted playsinline style="width:100%; max-width:640px; border-radius:16px;"></video>
            <canvas id="vision-canvas" class="canvas-overlay"></canvas>
        </div>
        <p style="margin-top: 1rem; color: #888;">AI-driven PPE and hazard detection. (Compliance mode active)</p>
    `;

    const video = document.getElementById('webcam');
    const canvasOverlay = document.getElementById('vision-canvas');
    if (!model) model = await cocoSsd.load();

    try {
        stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
        video.srcObject = stream;
        video.onloadedmetadata = () => {
            canvasOverlay.width = video.videoWidth;
            canvasOverlay.height = video.videoHeight;
            const ctxOverlay = canvasOverlay.getContext('2d');
            detectFrame(video, model, ctxOverlay);
        };
    } catch (e) {
        container.innerHTML = `<p style="color: #ff4444;">Camera Error: ${e.message}</p>`;
    }
}

async function detectFrame(video, model, ctx) {
    if (viewer.style.display !== 'block') return;
    const predictions = await model.detect(video);
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    predictions.forEach(p => {
        const isPerson = p.class === 'person';
        ctx.strokeStyle = isPerson ? '#00ff88' : '#00d2ff';
        ctx.lineWidth = 3;
        ctx.strokeRect(...p.bbox);
        ctx.fillStyle = isPerson ? '#00ff88' : '#00d2ff';
        ctx.fillText(isPerson ? 'CERTIFIED PERSONNEL' : `OBJECT: ${p.class.toUpperCase()}`, p.bbox[0], p.bbox[1] > 10 ? p.bbox[1] - 5 : 10);
    });
    requestAnimationFrame(() => detectFrame(video, model, ctx));
}

// ---- GEN DESIGN STUDIO ----
function loadGenProject() {
    container.innerHTML = `
        <h2 style="margin-bottom: 1rem;">GEN DESIGN STUDIO</h2>
        <div style="display: flex; flex-direction: column; gap: 1rem;">
             <input type="text" id="prompt-input" placeholder="Industrial titanium pivot joint design..." style="width: 100%; padding: 1rem; border-radius: 12px; background: #222; color: #fff;">
             <button onclick="generateMockImage()" class="neon-button">GENERATE CAD</button>
             <div id="image-gallery" style="margin-top: 2rem;"><div style="aspect-ratio:16/9; background:#111; border-radius:12px;"></div></div>
        </div>
    `;
}

function generateMockImage() {
    const prompt = document.getElementById('prompt-input').value;
    const gallery = document.getElementById('image-gallery');
    gallery.innerHTML = '<div style="text-align:center;"><i class="fas fa-spinner fa-spin"></i> Processing Neural CAD...</div>';
    setTimeout(() => {
        const keyword = prompt.toLowerCase().includes('joint') ? 'mechanical' : 'architecture';
        gallery.innerHTML = `<img src="https://source.unsplash.com/featured/?${keyword},blueprint" style="width: 100%; border-radius: 16px;">`;
    }, 1500);
}

// ---- ENTERPRISE HUB (NLP) ----
function loadChatProject() {
    container.innerHTML = `
        <h2 style="margin-bottom: 1rem;">ENTERPRISE COGNITIVE HUB</h2>
        <div id="chat-box" style="height:300px; overflow-y:auto; background:#111; padding:1rem; border-radius:12px; margin-bottom:1rem;"></div>
        <div style="display:flex; gap:10px;">
            <input type="text" id="chat-input" placeholder="Ask about operations..." style="flex:1; padding:10px; background:#222; color:#fff;">
            <button onclick="sendChatMessage()" class="neon-button">ASK</button>
        </div>
    `;
}

function sendChatMessage() {
    const input = document.getElementById('chat-input');
    const box = document.getElementById('chat-box');
    if (!input.value) return;
    box.innerHTML += `<div style="text-align:right; margin-bottom:10px;">User: ${input.value}</div>`;
    const text = input.value.toLowerCase();
    input.value = '';
    setTimeout(() => {
        let resp = "Accessing encrypted data nodes...";
        if (text.includes('hi')) resp = "Welcome to the Enterprise Hub. Status: Green.";
        box.innerHTML += `<div style="color:#ff007a;">AI: ${resp}</div>`;
        box.scrollTop = box.scrollHeight;
    }, 600);
}

// ---- KINETIC HEALTH (Med-Edge) ----
let poseModel = null;
async function loadPoseProject() {
    container.innerHTML = `<h2 style="margin-bottom:2rem;">KINETIC HEALTH</h2><video id="posecam" autoplay muted playsinline style="width:100%; border-radius:16px;"></video><canvas id="pose-canvas" class="canvas-overlay"></canvas>`;
    const video = document.getElementById('posecam');
    if (!poseModel) poseModel = await posenet.load();
    try {
        stream = await navigator.mediaDevices.getUserMedia({ video: true });
        video.srcObject = stream;
        video.onloadedmetadata = () => {
            const canvas = document.getElementById('pose-canvas');
            canvas.width = video.videoWidth; canvas.height = video.videoHeight;
            detectPose(video, poseModel, canvas.getContext('2d'));
        };
    } catch (e) { container.innerHTML = "Camera access denied."; }
}

async function detectPose(video, model, ctx) {
    if (viewer.style.display !== 'block') return;
    const pose = await model.estimateSinglePose(video);
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    pose.keypoints.forEach(k => {
        if (k.score > 0.5) {
            ctx.fillStyle = '#ff9d00'; ctx.beginPath(); ctx.arc(k.position.x, k.position.y, 5, 0, 2 * Math.PI); ctx.fill();
        }
    });
    requestAnimationFrame(() => detectPose(video, model, ctx));
}

// ---- QUANTUM PULSE (Finance) ----
function loadPulseProject() {
    container.innerHTML = `<h2 style="margin-bottom:1rem;">QUANTUM PULSE</h2><div style="height:300px; background:#111; border-radius:16px; padding:1rem;"><canvas id="pulse-chart"></canvas></div>`;
    const ctx = document.getElementById('pulse-chart').getContext('2d');
    new Chart(ctx, { 
        type: 'line', 
        data: { labels: ['M','T','W','T','F','S','S'], datasets: [{ label: 'Market Prediction', data: [10, 25, 15, 40, 30, 60, 55], borderColor: '#00d2ff', fill: true, backgroundColor: 'rgba(0,210,255,0.1)' }] },
        options: { maintainAspectRatio: false, scales: { y: { grid: { color: '#222' } }, x: { grid: { color: '#222' } } } }
    });
}

// ---- BRAND ANALYTICS (Sentiment) ----
function loadMoodProject() {
    container.innerHTML = `<h2 style="margin-bottom:2rem;">BRAND ANALYTICS</h2><textarea id="mood-input" placeholder="Paste social text..." style="width:100%; height:100px; background:#222; color:#fff; padding:1rem;"></textarea><div id="mood-status" style="font-size:1.5rem; margin-top:1rem;">NEUTRAL</div>`;
    document.getElementById('mood-input').addEventListener('input', (e) => {
        const score = e.target.value.split(' ').filter(w => ['good','great','love'].includes(w)).length - e.target.value.split(' ').filter(w => ['bad','sad','hate'].includes(w)).length;
        const status = document.getElementById('mood-status');
        status.innerText = score > 0 ? "POSITIVE" : (score < 0 ? "NEGATIVE" : "NEUTRAL");
        status.style.color = score > 0 ? "#00ff88" : (score < 0 ? "#ff4e50" : "#888");
    });
}

window.openProject = openProject;
window.closeProject = closeProject;
window.generateMockImage = generateMockImage;
window.sendChatMessage = sendChatMessage;
