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
        
        // Connect nearby points
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

function openProject(id) {
    viewer.style.display = 'block';
    container.innerHTML = '<div style="text-align: center;"><i class="fas fa-spinner fa-spin"></i> Initializing AI Engine...</div>';
    
    if (id === 'vision') {
        loadVisionProject();
    } else if (id === 'gen') {
        loadGenProject();
    } else if (id === 'chat') {
        loadChatProject();
    }
}

function closeProject() {
    viewer.style.display = 'none';
    container.innerHTML = '';
}

// ---- ORION VISION (TensorFlow.js) ----
let model = null;
let stream = null;

async function loadVisionProject() {
    container.innerHTML = `
        <h2 style="margin-bottom: 2rem;">ORION VISION</h2>
        <div class="ml-container" style="position: relative;">
            <video id="webcam" autoplay muted playsinline></video>
            <canvas id="vision-canvas" class="canvas-overlay"></canvas>
        </div>
        <p style="margin-top: 1rem; color: #888;">Live edge detection. Powered by TensorFlow.js COCO-SSD.</p>
    `;

    const video = document.getElementById('webcam');
    const canvasOverlay = document.getElementById('vision-canvas');
    const ctxOverlay = canvasOverlay.getContext('2d');

    if (!model) {
        model = await cocoSsd.load();
    }

    try {
        stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
        video.srcObject = stream;
        video.onloadedmetadata = () => {
            canvasOverlay.width = video.videoWidth;
            canvasOverlay.height = video.videoHeight;
            detectFrame(video, model, ctxOverlay);
        };
    } catch (e) {
        container.innerHTML = `<p style="color: #ff4444;">Error accessing webcam: ${e.message}</p>`;
    }
}

async function detectFrame(video, model, ctx) {
    const predictions = await model.detect(video);
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    
    predictions.forEach(p => {
        ctx.strokeStyle = '#00d2ff';
        ctx.lineWidth = 3;
        ctx.strokeRect(...p.bbox);
        
        ctx.fillStyle = '#00d2ff';
        const text = `${p.class} (${Math.round(p.score * 100)}%)`;
        ctx.fillText(text, p.bbox[0], p.bbox[1] > 10 ? p.bbox[1] - 5 : 10);
    });
    
    if (viewer.style.display === 'block') {
        requestAnimationFrame(() => detectFrame(video, model, ctx));
    } else {
        stream.getTracks().forEach(t => t.stop());
    }
}

// ---- AURORA GEN (Generative Art Interface) ----
function loadGenProject() {
     container.innerHTML = `
        <h2 style="margin-bottom: 1rem;">AURORA GEN</h2>
        <div style="display: flex; flex-direction: column; gap: 1rem;">
             <input type="text" id="prompt-input" placeholder="A futuristic cyberpunk city with neon rain..." 
                    style="width: 100%; padding: 1rem; border-radius: 12px; border: 1px solid #444; background: #222; color: #fff;">
             <button onclick="generateMockImage()" class="neon-button">GENERATE MASTERPIECE</button>
             <div id="image-gallery" style="margin-top: 2rem; display: grid; grid-template-columns: 1fr; gap: 1rem;">
                <div style="aspect-ratio: 16/9; background: #111; border-radius: 12px; display: flex; align-items: center; justify-content: center;">
                    <span style="color: #444;">No art generated yet</span>
                </div>
             </div>
        </div>
    `;
}

async function generateMockImage() {
    const prompt = document.getElementById('prompt-input').value;
    const gallery = document.getElementById('image-gallery');
    gallery.innerHTML = '<div style="text-align:center;"><i class="fas fa-spinner fa-spin"></i> Diffusing...</div>';
    
    // Simulations AI thinking
    setTimeout(() => {
        const keywords = ['cyberpunk', 'nebula', 'robot', 'forest', 'ocean', 'abstract'];
        const keyword = keywords.find(k => prompt.toLowerCase().includes(k)) || 'ai';
        gallery.innerHTML = `
            <img src="https://source.unsplash.com/featured/?${keyword},future" 
                 style="width: 100%; border-radius: 16px; box-shadow: 0 0 30px rgba(110,0,255,0.3); transition: all 1s ease; opacity: 0;"
                 onload="this.style.opacity = '1'">
        `;
    }, 2000);
}

// ---- SENTIENCE CHAT (Advanced NLP Hub) ----
function loadChatProject() {
    container.innerHTML = `
        <h2 style="margin-bottom: 1rem;">SENTIENCE CHAT</h2>
        <div style="height: 400px; overflow-y: auto; background: #111; padding: 1.5rem; border-radius: 16px; border: 1px solid #333; margin-bottom: 1rem;" id="chat-box">
             <div style="margin-bottom: 1rem; color: #00d2ff;"><strong>AI:</strong> Welcome, explorer. I am the Sentience Hub. How may I assist your voyage into the neural networks today?</div>
        </div>
        <div style="display: flex; gap: 1rem;">
            <input type="text" id="chat-input" placeholder="Ask anything..." style="flex: 1; padding: 1rem; border-radius: 12px; border: 1px solid #444; background: #222; color: #fff;">
            <button onclick="sendChatMessage()" class="neon-button">SEND</button>
        </div>
    `;
}

function sendChatMessage() {
    const input = document.getElementById('chat-input');
    const box = document.getElementById('chat-box');
    if (!input.value) return;

    box.innerHTML += `<div style="margin-bottom: 1rem; text-align: right;"><strong>User:</strong> ${input.value}</div>`;
    const userText = input.value.toLowerCase();
    input.value = '';

    setTimeout(() => {
        let response = "I'm processing that through my semantic layers. Fascinating query.";
        if (userText.includes('hello') || userText.includes('hi')) response = "Greetings, user. Connection established.";
        if (userText.includes('future')) response = "The future is algorithmic. We are but data in the stream.";
        
        box.innerHTML += `<div style="margin-bottom: 1rem; color: #00d2ff;"><strong>AI:</strong> ${response}</div>`;
        box.scrollTop = box.scrollHeight;
    }, 800);
}

window.openProject = openProject;
window.closeProject = closeProject;
window.generateMockImage = generateMockImage;
window.sendChatMessage = sendChatMessage;
