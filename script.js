// =====================================================
// ALOPURE BODYWASH — INTERACTIVE LOGIC & ANIMATIONS
// =====================================================

// ─── CURSOR GLOW ───
const cursorGlow = document.getElementById('cursor-glow');
if (cursorGlow) {
  document.addEventListener('mousemove', (e) => {
    cursorGlow.style.left = e.clientX + 'px';
    cursorGlow.style.top  = e.clientY + 'px';
  });
}

// ─── SCROLL PROGRESS & BACK TO TOP ───
const scrollBar = document.getElementById('scroll-progress');
const backToTopBtn = document.getElementById('back-to-top');
const circle = document.querySelector('.progress-ring-circle');
const radius = 20;
const circumference = 2 * Math.PI * radius;

if (circle) {
  circle.style.strokeDasharray = `${circumference} ${circumference}`;
  circle.style.strokeDashoffset = `${circumference}`;
}

window.addEventListener('scroll', () => {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const scrollFraction = docHeight > 0 ? scrollTop / docHeight : 0;
  
  // Top bar
  if (scrollBar) {
    scrollBar.style.width = (scrollFraction * 100) + '%';
  }

  // Back to top button & circular ring
  if (backToTopBtn) {
    if (scrollTop > 400) {
      backToTopBtn.classList.add('visible');
    } else {
      backToTopBtn.classList.remove('visible');
    }
  }

  if (circle) {
    const offset = circumference - (scrollFraction * circumference);
    circle.style.strokeDashoffset = offset;
  }
});

// ─── NAVBAR & MOBILE HAMBURGER ───
const navbar = document.getElementById('navbar');
const navLinks = document.getElementById('nav-links');
const hamburger = document.getElementById('hamburger');

window.addEventListener('scroll', () => {
  if (navbar) {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  }
  updateNavActive();
});

if (hamburger && navLinks) {
  hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('open');
  });

  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
    });
  });
}

function updateNavActive() {
  const sections = document.querySelectorAll('section[id]');
  let currentId = '';
  sections.forEach(s => {
    const top = s.offsetTop - 140;
    if (window.scrollY >= top) {
      currentId = s.id;
    }
  });

  document.querySelectorAll('.nav-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href === '#' + currentId) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}

// ─── PARTICLE CANVAS ───
const canvas = document.getElementById('particle-canvas');
if (canvas) {
  const ctx = canvas.getContext('2d');
  let W, H;
  let particles = [];

  function resizeCanvas() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  function Particle() {
    this.reset = function() {
      this.x = Math.random() * W;
      this.y = Math.random() * H;
      this.radius = Math.random() * 1.6 + 0.4;
      this.vx = (Math.random() - 0.5) * 0.4;
      this.vy = (Math.random() - 0.5) * 0.4;
      this.alpha = Math.random() * 0.45 + 0.08;
      this.color = Math.random() > 0.5 ? '56, 189, 248' : '52, 211, 153';
    };
    this.reset();

    this.update = function() {
      this.x += this.vx;
      this.y += this.vy;
      if (this.x < 0 || this.x > W || this.y < 0 || this.y > H) {
        this.reset();
      }
    };

    this.draw = function() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${this.color}, ${this.alpha})`;
      ctx.fill();
    };
  }

  for (let i = 0; i < 75; i++) {
    particles.push(new Particle());
  }

  function drawLines() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 90) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(56, 189, 248, ${(1 - dist / 90) * 0.07})`;
          ctx.lineWidth = 0.6;
          ctx.stroke();
        }
      }
    }
  }

  function animateCanvas() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => {
      p.update();
      p.draw();
    });
    drawLines();
    requestAnimationFrame(animateCanvas);
  }
  animateCanvas();
}

// ─── TYPED TEXT EFFECT ───
const typedEl = document.getElementById('typed-text');
const phrases = ['Skin-Balanced Bodywash', 'Gentle Botanical Formula', 'Chemical Proto Project', 'Dermal Protective Matrix'];
let phraseIdx = 0;
let charIdx = 0;
let isDeleting = false;

function typeLoop() {
  if (!typedEl) return;
  const current = phrases[phraseIdx];
  if (isDeleting) {
    typedEl.textContent = current.substring(0, --charIdx);
    if (charIdx === 0) {
      isDeleting = false;
      phraseIdx = (phraseIdx + 1) % phrases.length;
      setTimeout(typeLoop, 450);
      return;
    }
    setTimeout(typeLoop, 45);
  } else {
    typedEl.textContent = current.substring(0, ++charIdx);
    if (charIdx === current.length) {
      setTimeout(() => {
        isDeleting = true;
        typeLoop();
      }, 2200);
      return;
    }
    setTimeout(typeLoop, 75);
  }
}
setTimeout(typeLoop, 600);

// ─── SCROLL REVEAL OBSERVER ───
const revealElements = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

revealElements.forEach(el => revealObserver.observe(el));

// ─── FOLLOW THE PROCESS: LIQUID TIMELINE & STEP TRACKER ───
const procTrack = document.querySelector('.proc-track');
const procLine  = document.getElementById('proc-line');
const stepCards = [
  document.getElementById('step-card-1'),
  document.getElementById('step-card-2'),
  document.getElementById('step-card-3'),
  document.getElementById('step-card-4'),
  document.getElementById('step-card-5')
];

function updateProcessTracker() {
  if (!procTrack || !procLine) return;

  const trackRect = procTrack.getBoundingClientRect();
  const trackTop = trackRect.top;
  const trackHeight = procTrack.offsetHeight;
  const winHeight = window.innerHeight;

  // Calculate scroll penetration into the procedure section
  let progress = (winHeight * 0.65 - trackTop);
  progress = Math.max(0, Math.min(progress, trackHeight - 60));
  procLine.style.height = progress + 'px';

  // Highlight step cards and update stepper bar
  let activeStep = 1;
  stepCards.forEach((card, idx) => {
    if (!card) return;
    const cardRect = card.getBoundingClientRect();
    if (cardRect.top < winHeight * 0.65) {
      card.classList.add('step-active');
      activeStep = idx + 1;
    } else {
      card.classList.remove('step-active');
    }
  });

  // Update top stepper buttons
  for (let i = 1; i <= 5; i++) {
    const btn = document.getElementById(`psb-${i}`);
    if (btn) {
      btn.classList.toggle('active', i === activeStep);
    }
  }
}

window.addEventListener('scroll', updateProcessTracker);
window.addEventListener('resize', updateProcessTracker);

function scrollToStep(stepNumber) {
  const target = document.getElementById(`step-card-${stepNumber}`);
  if (target) {
    const y = target.getBoundingClientRect().top + window.scrollY - 120;
    window.scrollTo({ top: y, behavior: 'smooth' });
  }
}

// ─── STEP 4: LABORATORY MIXER SIMULATOR ───
let mixerHighSpeed = false;
function toggleMixerSpeed() {
  const vortex = document.getElementById('mixer-vortex');
  const rpmBadge = document.getElementById('mixer-rpm');
  const btn = document.querySelector('.btn-mixer-toggle');

  mixerHighSpeed = !mixerHighSpeed;
  if (mixerHighSpeed) {
    if (vortex) vortex.style.animationDuration = '0.7s';
    if (rpmBadge) {
      rpmBadge.textContent = '360 RPM (High Homogenization)';
      rpmBadge.style.color = '#34d399';
      rpmBadge.style.borderColor = '#34d399';
    }
    if (btn) btn.textContent = '⏸ Return to Gentle Stir (180 RPM)';
  } else {
    if (vortex) vortex.style.animationDuration = '2s';
    if (rpmBadge) {
      rpmBadge.textContent = '180 RPM';
      rpmBadge.style.color = 'var(--c1)';
      rpmBadge.style.borderColor = 'var(--c1)';
    }
    if (btn) btn.textContent = '⚡ Boost Mixing Speed';
  }
}

// ─── MICELLE TRAPPING PULSE ───
function pulseMicelle() {
  const dirt = document.getElementById('micelle-dirt');
  const monomers = document.querySelectorAll('.sls-m');
  if (dirt) {
    dirt.style.transform = 'scale(1.3)';
    dirt.style.boxShadow = '0 0 25px #f59e0b';
    setTimeout(() => {
      dirt.style.transform = 'scale(0.85)';
      dirt.style.boxShadow = '0 0 8px #f59e0b';
      setTimeout(() => dirt.style.transform = 'scale(1)', 400);
    }, 400);
  }
  monomers.forEach((m, idx) => {
    setTimeout(() => {
      m.style.transform = 'scale(1.4)';
      setTimeout(() => m.style.transform = 'scale(1)', 300);
    }, idx * 50);
  });
}

// ─── INTERACTIVE pH SIMULATOR ───
function updatePhSimulator(val) {
  const num = parseFloat(val);
  const displayVal = document.getElementById('ph-display-val');
  const safetyPill = document.getElementById('ph-safety-pill');
  const descText   = document.getElementById('ph-desc-text');
  const beakerLiquid = document.getElementById('beaker-liquid');
  const stripPad     = document.getElementById('test-strip-pad');
  const slider       = document.getElementById('ph-slider');

  if (slider) slider.value = num;
  if (displayVal) displayVal.textContent = num.toFixed(1);

  // Dynamic Color and Description Mapping
  let color = '#f59e0b';
  let pillText = 'Optimal Skin Equilibrium';
  let pillColor = '#34d399';
  let desc = '';

  if (num < 3.5) {
    color = '#ef4444'; // Red Acid
    pillText = 'Excessive Acidity (Irritant)';
    pillColor = '#ef4444';
    desc = 'Highly acidic (pH < 3.5). Can cause burning, chemical desquamation, and erythema if left unbuffered on sensitive human skin.';
  } else if (num >= 3.5 && num < 4.5) {
    color = '#f97316'; // Orange
    pillText = 'Astringent Exfoliant';
    pillColor = '#f97316';
    desc = 'Low pH clinical exfoliation zone. Active keratolytic action, suitable for medical acne treatments but strong for daily bodywash.';
  } else if (num >= 4.5 && num <= 5.5) {
    color = '#eab308'; // Golden / Honey Amber
    pillText = 'Target Optimal (Skin-Safe)';
    pillColor = '#34d399';
    desc = 'Perfect physiological skin mantle match (pH 4.8 – 5.2). Guards natural bacterial flora, preserves sebum lipid barrier, and creates comfortable cleansing.';
  } else if (num > 5.5 && num <= 7.5) {
    color = '#22c55e'; // Green Neutral
    pillText = 'Neutral Range';
    pillColor = '#38bdf8';
    desc = 'Neutral pH (6.0 – 7.5). Safe for general rinses, but slightly higher than human skin acid mantle, which averages 4.7 to 5.5.';
  } else if (num > 7.5 && num <= 9.5) {
    color = '#3b82f6'; // Blue Alkaline
    pillText = 'Alkaline Soap Range';
    pillColor = '#f59e0b';
    desc = 'Standard bar soap alkalinity (pH 8.5 – 9.5). Strips natural acid lipids, causing post-shower tightness, dryness, and barrier disruption.';
  } else {
    color = '#8b5cf6'; // Violet Strong Alkaline
    pillText = 'Harsh Caustic Base';
    pillColor = '#ef4444';
    desc = 'Strongly alkaline (pH > 10). Denatures skin proteins and severely degrades the epidermal stratum corneum.';
  }

  if (safetyPill) {
    safetyPill.textContent = pillText;
    safetyPill.style.color = pillColor;
    safetyPill.style.borderColor = pillColor;
  }
  if (descText) descText.textContent = desc;
  if (beakerLiquid) {
    beakerLiquid.style.background = color;
    beakerLiquid.style.boxShadow = `0 0 25px ${color}`;
  }
  if (stripPad) {
    stripPad.style.background = color;
  }

  // Update presets active class
  document.querySelectorAll('.ph-preset').forEach(btn => {
    btn.classList.remove('active-preset');
  });
}

function setPh(val) {
  updatePhSimulator(val);
}

// ─── PROCESS DIAGRAM TABS ───
function showDiagram(type) {
  const panelFlow  = document.getElementById('panel-flow');
  const panelBlock = document.getElementById('panel-block');
  const tabFlow    = document.getElementById('tab-flow');
  const tabBlock   = document.getElementById('tab-block');

  if (panelFlow) panelFlow.classList.toggle('hidden', type !== 'flow');
  if (panelBlock) panelBlock.classList.toggle('hidden', type !== 'block');
  if (tabFlow) tabFlow.classList.toggle('active', type === 'flow');
  if (tabBlock) tabBlock.classList.toggle('active', type === 'block');
}

// ─── PROCESS FLOW DIAGRAM: NODE INSPECTOR ───
const nodeDetails = {
  raw: {
    title: "Stage 01: Raw Feedstocks Preparation",
    specs: [
      { key: "Total Reagents", val: "7 Chemical Components" },
      { key: "Purity Grade", val: "Analytical / Cosmetic Grade" },
      { key: "Storage Condition", val: "Amber Glass Bottles, 20°C" },
      { key: "Safety Precautions", val: "Nitrile Gloves & Lab Goggles Mandatory" }
    ]
  },
  weigh: {
    title: "Stage 02: Analytical Calibration & Weighing",
    specs: [
      { key: "Balance Model", val: "Electronic Precision (±0.01g)" },
      { key: "Syringes", val: "Medical-grade Luer Lock Calibrated" },
      { key: "Target Base H₂O", val: "250 mL Demineralized" },
      { key: "Surfactant SLS", val: "15% Weight-by-Volume Ratio" }
    ]
  },
  water: {
    title: "Stage 03A: Aqueous Base Dissolution",
    specs: [
      { key: "Components", val: "Distilled Water + SLS + Glycerine" },
      { key: "Mixing Vessel", val: "500 mL Borosilicate Glass Beaker" },
      { key: "Temperature", val: "Ambient (24°C)" },
      { key: "Appearance", val: "Translucent Viscous Matrix" }
    ]
  },
  mix: {
    title: "Stage 03B: Low-Shear Agitation",
    specs: [
      { key: "Stirring Speed", val: "120 RPM (Laminar Flow)" },
      { key: "Objective", val: "Complete SLS dissolution without aeration" },
      { key: "Foam Suppression", val: "Subsurface Impeller Action" }
    ]
  },
  oil: {
    title: "Stage 04A: Active Lipophilic Phase",
    specs: [
      { key: "Active Agent", val: "Salicylic Acid (BHA Powder)" },
      { key: "Carrier Diol", val: "Ethylene Glycol Cosolvent" },
      { key: "Solubility Equilibrium", val: "100% Solubilized at 40°C" }
    ]
  },
  heat: {
    title: "Stage 04B: Controlled Thermal Dissolution",
    specs: [
      { key: "Thermal Bath", val: "40°C Constant Temperature" },
      { key: "Duration", val: "10 Minutes Gentle Stirring" },
      { key: "Filtration", val: "Whatman Qualitative Filter Paper" }
    ]
  },
  aloe: {
    title: "Stage 05: Aloe Vera Botanical Infusion",
    specs: [
      { key: "Botanical Extract", val: "Cold-Pressed Aloe Barbadensis" },
      { key: "Bioactive Molecule", val: "Acemannan Polysaccharide" },
      { key: "Mixing Method", val: "Gentle folding to preserve enzyme activity" }
    ]
  },
  ph: {
    title: "Stage 06: Acid Mantle pH Titration",
    specs: [
      { key: "Titrant", val: "5% w/v Citric Acid Solution" },
      { key: "Target pH Range", val: "4.8 to 5.2 Equilibrium" },
      { key: "Indicator", val: "Calibrated Micro-pH Test Strips" }
    ]
  },
  qc: {
    title: "Stage 07: Finished Batch Quality Clearance",
    specs: [
      { key: "Viscosity Index", val: "450 – 520 cP (Silky Gel Flow)" },
      { key: "Ross-Miles Foam Test", val: "18.5 cm (Dense Micro-Lather)" },
      { key: "Microbial Barrier", val: "Preserved via natural acidity" }
    ]
  },
  out: {
    title: "Final Product: AloePure Bodywash",
    specs: [
      { key: "Final Volume", val: "300 mL Net Formulated Batch" },
      { key: "pH Rating", val: "5.0 (Skin Acid Barrier Certified)" },
      { key: "Packaging", val: "Airless Pump Dispenser Bottle" },
      { key: "Lab Status", val: "Experimental Prototype Completed ✓" }
    ]
  }
};

function inspectNode(key) {
  const data = nodeDetails[key];
  if (!data) return;

  const drawer = document.getElementById('node-inspector');
  const title  = document.getElementById('ni-title');
  const body   = document.getElementById('ni-body');

  if (title) title.textContent = data.title;
  if (body) {
    body.innerHTML = data.specs.map(s => `
      <div class="ni-row">
        <span>${s.key}:</span>
        <strong>${s.val}</strong>
      </div>
    `).join('');
  }

  if (drawer) {
    drawer.style.display = 'block';
    drawer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
}

function closeInspector() {
  const drawer = document.getElementById('node-inspector');
  if (drawer) drawer.style.display = 'none';
}

// ─── VIDEO LOADER ───
function loadVideo() {
  const input = document.getElementById('video-url-input');
  if (!input) return;
  const url = input.value.trim();
  const ytFrame = document.getElementById('yt-frame');
  const placeholder = document.getElementById('vid-placeholder');

  if (url.includes('youtube') || url.includes('youtu.be')) {
    let embedUrl = url;
    if (url.includes('watch?v=')) {
      embedUrl = url.replace('watch?v=', 'embed/');
    }
    if (ytFrame) {
      ytFrame.src = embedUrl;
      ytFrame.style.display = 'block';
    }
    if (placeholder) placeholder.style.display = 'none';
  }
}

// Auto detect local video
window.addEventListener('load', () => {
  const localVid = document.getElementById('local-video');
  const placeholder = document.getElementById('vid-placeholder');
  if (localVid) {
    localVid.addEventListener('loadeddata', () => {
      localVid.style.display = 'block';
      if (placeholder) placeholder.style.display = 'none';
    });
  }
});

// ─── IMAGE LIGHTBOX MODAL ───
function openLightbox(src, caption) {
  const modal   = document.getElementById('img-lightbox');
  const img     = document.getElementById('lightbox-img');
  const capText = document.getElementById('lightbox-caption');

  if (modal && img) {
    img.src = src;
    if (capText) capText.textContent = caption || '';
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
}

function closeLightbox() {
  const modal = document.getElementById('img-lightbox');
  if (modal) {
    modal.classList.remove('open');
    document.body.style.overflow = '';
  }
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeLightbox();
});

// ─── AI-POWERED CHEMICAL QUIZ ENGINE ───
const fallbackQuestions = [
  {
    q: "What is the primary role of Citric Acid (Eno) in the AloePure bodywash formulation?",
    opts: [
      "To act as the primary foaming detergent",
      "To titrate and buffer the pH to match the skin's acid mantle (4.8 - 5.2)",
      "To provide an artificial citrus fragrance",
      "To crystallize the surfactant into a bar"
    ],
    ans: 1,
    exp: "Citric acid is a tri-protic organic acid used to buffer and adjust the alkaline surfactant mixture down to the skin's natural acidic pH of 4.5–5.5."
  },
  {
    q: "Why is Sodium Lauryl Sulfate (SLS) classified as an anionic surfactant?",
    opts: [
      "It possesses a positively charged quaternary ammonium head",
      "Its hydrophilic polar head carries a negative sulfate charge (SO₄⁻)",
      "It contains uncharged non-ionic ether linkages",
      "It is derived exclusively from synthetic silicon polymers"
    ],
    ans: 1,
    exp: "SLS has a negatively charged sulfate group at its polar head and a 12-carbon non-polar tail, making it an anionic detergent."
  },
  {
    q: "How does Salicylic Acid clear clogged pores in acne-prone skin?",
    opts: [
      "It is water-soluble and dries up skin moisture",
      "It is lipid-soluble (BHA) and penetrates sebum to hydrolyze intercellular desmosomes",
      "It forms a thick protective layer over the skin surface",
      "It neutralizes all bacterial enzymes with alkaline hydroxide"
    ],
    ans: 1,
    exp: "As a beta-hydroxy acid, salicylic acid is lipophilic. It penetrates lipid-rich follicles and exfoliates dead keratinocytes."
  },
  {
    q: "Why was low-shear stirring (120 RPM) utilized during SLS incorporation?",
    opts: [
      "To increase high-temperature boiling",
      "To prevent excessive air entrapment and unwanted foaming during formulation",
      "Because SLS degrades at speeds higher than 50 RPM",
      "To encourage rapid bubble cavitation"
    ],
    ans: 1,
    exp: "Vigorous agitation introduces micro-air bubbles into surfactant solutions. Low-shear mixing dissolves SLS smoothly without foaming."
  },
  {
    q: "What is the primary bioactive polysaccharide in Aloe Vera responsible for soothing?",
    opts: [
      "Cellulose acetate",
      "Acemannan mucopolysaccharide",
      "Starch glycogen",
      "Polyethylene glycol"
    ],
    ans: 1,
    exp: "Acemannan is the signature bioactive polysaccharide in aloe vera that stimulates cellular repair and calms surfactant-induced irritation."
  }
];

let quizData = [];
let currentQuestionIndex = 0;
let userAnswers = {};

async function generateQuiz() {
  const topic = document.getElementById('quiz-topic').value;
  const difficulty = document.getElementById('quiz-difficulty').value;
  const loading = document.getElementById('quiz-loading');
  const board = document.getElementById('quiz-board');
  const controls = document.getElementById('quiz-controls');

  if (controls) controls.style.display = 'none';
  if (loading) loading.style.display = 'block';

  let questions = null;

  if (typeof GROQ_API_KEY !== 'undefined' && GROQ_API_KEY && !GROQ_API_KEY.includes('your_')) {
    try {
      const prompt = `You are a chemistry professor evaluating a student Chemical Proto bodywash project (AloePure).
Chemicals used: Distilled water, Ethylene glycol, Glycerine, Citric acid, SLS, Salicylic acid, Aloe vera gel.
Target pH: 4.8-5.2.
Generate exactly 5 multiple choice questions on the topic "${topic}" at difficulty level "${difficulty}".
Output ONLY valid JSON in this exact structure with no markdown formatting:
[
  {
    "q": "Question text here?",
    "opts": ["Option A", "Option B", "Option C", "Option D"],
    "ans": 0,
    "exp": "Detailed explanation here"
  }
]`;

      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${GROQ_API_KEY}`
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [{ role: "user", content: prompt }],
          temperature: 0.5,
          max_tokens: 1500
        })
      });

      if (response.ok) {
        const json = await response.json();
        const rawContent = json.choices[0].message.content.trim();
        const cleanContent = rawContent.replace(/```json|```/g, '').trim();
        questions = JSON.parse(cleanContent);
      }
    } catch (err) {
      console.warn("Groq API fallback triggered:", err);
    }
  }

  if (!questions || !Array.isArray(questions) || questions.length === 0) {
    questions = fallbackQuestions;
  }

  quizData = questions;
  currentQuestionIndex = 0;
  userAnswers = {};

  if (loading) loading.style.display = 'none';
  if (board) board.style.display = 'block';

  renderQuestion();
}

function renderQuestion() {
  const area = document.getElementById('quiz-question-area');
  const qCurrent = document.getElementById('q-current');
  const qTotal = document.getElementById('q-total');
  const qFill = document.getElementById('qprog-fill');
  const prevBtn = document.getElementById('prev-btn');
  const nextBtn = document.getElementById('next-btn');
  const submitBtn = document.getElementById('submit-btn');

  if (!area || quizData.length === 0) return;

  const item = quizData[currentQuestionIndex];
  if (qCurrent) qCurrent.textContent = currentQuestionIndex + 1;
  if (qTotal) qTotal.textContent = quizData.length;
  if (qFill) qFill.style.width = (((currentQuestionIndex + 1) / quizData.length) * 100) + '%';

  area.innerHTML = `
    <div class="quiz-question">
      <h3>${currentQuestionIndex + 1}. ${item.q}</h3>
      <div class="quiz-options">
        ${item.opts.map((opt, i) => `
          <button class="quiz-opt ${userAnswers[currentQuestionIndex] === i ? 'selected' : ''}" onclick="selectAnswer(${i})">
            <strong>${String.fromCharCode(65 + i)}.</strong> ${opt}
          </button>
        `).join('')}
      </div>
    </div>
  `;

  if (prevBtn) prevBtn.style.display = currentQuestionIndex > 0 ? 'inline-block' : 'none';
  if (nextBtn) nextBtn.style.display = currentQuestionIndex < quizData.length - 1 ? 'inline-block' : 'none';
  if (submitBtn) submitBtn.style.display = currentQuestionIndex === quizData.length - 1 ? 'inline-block' : 'none';
}

function selectAnswer(optIdx) {
  userAnswers[currentQuestionIndex] = optIdx;
  renderQuestion();
}

function prevQuestion() {
  if (currentQuestionIndex > 0) {
    currentQuestionIndex--;
    renderQuestion();
  }
}

function nextQuestion() {
  if (currentQuestionIndex < quizData.length - 1) {
    currentQuestionIndex++;
    renderQuestion();
  }
}

function submitQuiz() {
  const board = document.getElementById('quiz-board');
  const result = document.getElementById('quiz-result');
  const scoreEl = document.getElementById('result-score');
  const totalEl = document.getElementById('result-total');
  const msgEl = document.getElementById('result-msg');
  const subEl = document.getElementById('result-sub');
  const breakdown = document.getElementById('result-breakdown');

  if (board) board.style.display = 'none';
  if (result) result.style.display = 'block';

  let score = 0;
  let breakdownHTML = '';

  quizData.forEach((item, idx) => {
    const userAns = userAnswers[idx];
    const isCorrect = userAns === item.ans;
    if (isCorrect) score++;

    breakdownHTML += `
      <div class="result-item ${isCorrect ? 'correct-ans' : 'wrong-ans'}">
        <strong>${isCorrect ? '✅ Question ' + (idx + 1) + ': Correct' : '❌ Question ' + (idx + 1) + ': Incorrect'}</strong><br/>
        <span>${item.q}</span><br/>
        <small><strong>Your Answer:</strong> ${userAns !== undefined ? item.opts[userAns] : 'Not Answered'} | <strong>Correct:</strong> ${item.opts[item.ans]}</small>
        ${item.exp ? `<br/><small style="opacity:0.85;">💡 <em>${item.exp}</em></small>` : ''}
      </div>
    `;
  });

  if (scoreEl) scoreEl.textContent = score;
  if (totalEl) totalEl.textContent = quizData.length;
  if (breakdown) breakdown.innerHTML = breakdownHTML;

  if (msgEl) {
    if (score === quizData.length) {
      msgEl.textContent = '🌟 Master Chemist! Perfect Score!';
    } else if (score >= quizData.length * 0.6) {
      msgEl.textContent = '🎉 Great Knowledge of Formulations!';
    } else {
      msgEl.textContent = '📚 Keep Studying the Formulation Lab Manual!';
    }
  }
}

function resetQuiz() {
  quizData = [];
  currentQuestionIndex = 0;
  userAnswers = {};

  ['quiz-result', 'quiz-board', 'quiz-loading'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.style.display = 'none';
  });

  const controls = document.getElementById('quiz-controls');
  if (controls) controls.style.display = 'flex';
}

// ─── BLOCK DIAGRAM VIEW SWITCHER ───
function switchBlockView(view) {
  const interactive = document.getElementById('bd-interactive-view');
  const original = document.getElementById('bd-original-view');
  const btnInteractive = document.getElementById('bvt-interactive');
  const btnOriginal = document.getElementById('bvt-original');

  if (view === 'interactive') {
    if (interactive) interactive.style.display = 'block';
    if (original) original.style.display = 'none';
    if (btnInteractive) btnInteractive.classList.add('active');
    if (btnOriginal) btnOriginal.classList.remove('active');
  } else {
    if (interactive) interactive.style.display = 'none';
    if (original) original.style.display = 'block';
    if (btnInteractive) btnInteractive.classList.remove('active');
    if (btnOriginal) btnOriginal.classList.add('active');
  }
}
