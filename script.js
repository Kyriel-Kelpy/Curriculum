// ============================================================
// CURRICULUM — script.js
// IA via API Anthropic directe (browser) + PDF via print
// ============================================================

// ------- STATE -------
let cvData = {
  title: '',
  summary: '',
  personalInfo: { firstName:'', lastName:'', email:'', phone:'', city:'', country:'', linkedin:'', website:'', photoUrl:'' },
  educations: [],
  experiences: [],
  skills: [],
  languages: [],
  certifications: [],
  projects: []
};

let currentStep = 1;
const TOTAL_STEPS = 15;
let currentTemplate = 'classic';

// ------- DEMO DATA -------
const DEMO_CV_DATA = {
  title: 'Développeur Web Full-Stack',
  summary: 'Ingénieur logiciel passionné avec 3 ans d\'expérience dans la conception de plateformes web scalables et d\'APIs REST robustes. Maîtrise confirmée des architectures React/Node.js et des méthodologies Agile. Orienté résultats, je cherche à rejoindre une équipe dynamique pour relever de nouveaux défis techniques.',
  personalInfo: { firstName:'Sophie', lastName:'Martin', email:'sophie.martin@email.com', phone:'06 99 88 77 66', city:'Lyon', country:'France', linkedin:'linkedin.com/in/sophie-martin-dev', website:'sophie-martin.io', photoUrl:'' },
  educations: [{ id:'d-edu-1', degree:'Master Ingénierie Logicielle', school:'Université Claude Bernard', city:'Lyon', startDate:'2021', endDate:'2023', description:'Mention Très Bien · Spécialité Web & Mobilité' }],
  experiences: [{ id:'d-exp-1', role:'Développeuse Full-Stack', company:'TechCorp SA', startDate:'10/2023', endDate:'Présent', description:'Conception d\'une plateforme SaaS de gestion de fret.\nMise en place d\'APIs REST sécurisées et d\'architectures temps réel.\nOptimisation des performances SQL sur grands volumes de données.', achievements:'Amélioration de 30% des performances système.' }],
  skills: ['React', 'Node.js', 'TypeScript', 'Tailwind CSS', 'PostgreSQL', 'Docker', 'Agile Scrum', 'Git'],
  languages: [{ id:'d-lang-1', name:'Français', level:'bilingue' }, { id:'d-lang-2', name:'Anglais', level:'avancé' }],
  certifications: [{ id:'d-cert-1', name:'AWS Certified Cloud Practitioner', issuer:'Amazon Web Services', year:'2024' }],
  projects: [{ id:'d-proj-1', name:'Portfolio Interactif', description:'Vitrine personnelle présentant mes projets et livrables.', technologies:'React, Tailwind CSS, Motion', link:'github.com/sophie/portfolio' }]
};

const STEP_TITLES = {
  1:'Prénom', 2:'Nom de famille', 3:'Titre professionnel', 4:'Adresse e-mail',
  5:'Téléphone', 6:'Ville & Pays', 7:'LinkedIn & Portfolio', 8:'Photo de profil',
  9:'Résumé professionnel', 10:'Compétences', 11:'Expériences professionnelles',
  12:'Formations', 13:'Langues', 14:'Certifications', 15:'Projets'
};

const STEP_ICONS = {
  1: `<path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"/>`,
  2: `<path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"/>`,
  3: `<path stroke-linecap="round" stroke-linejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0M12 12.75h.008v.008H12v-.008z"/>`,
  4: `<path stroke-linecap="round" stroke-linejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"/>`,
  5: `<path stroke-linecap="round" stroke-linejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z"/>`,
  6: `<path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"/>`,
  7: `<path stroke-linecap="round" stroke-linejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244"/>`,
  8: `<path stroke-linecap="round" stroke-linejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z"/><path stroke-linecap="round" stroke-linejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z"/>`,
  9: `<path stroke-linecap="round" stroke-linejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z"/>`,
  10: `<path stroke-linecap="round" stroke-linejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"/>`,
  11: `<path stroke-linecap="round" stroke-linejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0M12 12.75h.008v.008H12v-.008z"/>`,
  12: `<path stroke-linecap="round" stroke-linejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5"/>`,
  13: `<path stroke-linecap="round" stroke-linejoin="round" d="M10.5 21l5.25-11.25L21 21m-9-3h7.5M3 5.621a48.474 48.474 0 016-.371m0 0c1.12 0 2.233.038 3.334.114M9 5.25V3m3.334 2.364C11.176 10.658 7.69 15.08 3 17.502m9.334-12.138c.896.061 1.785.147 2.666.257m-4.589 8.495a18.023 18.023 0 01-3.827-5.802"/>`,
  14: `<path stroke-linecap="round" stroke-linejoin="round" d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z"/>`,
  15: `<path stroke-linecap="round" stroke-linejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5"/>`
};

// ------- ANTHROPIC API (direct browser) -------
const ANTHROPIC_API_URL = 'https://api.anthropic.com/v1/messages';

async function callClaude(systemPrompt, userContent, maxTokens = 1000) {
  const response = await fetch(ANTHROPIC_API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: maxTokens,
      system: systemPrompt,
      messages: [{ role: 'user', content: userContent }]
    })
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error?.message || 'Erreur API Claude');
  const text = data.content.map(b => b.type === 'text' ? b.text : '').join('');
  return text;
}

function parseJSON(raw) {
  // Retire éventuels blocs markdown ```json ... ```
  return JSON.parse(raw.replace(/```json\s*/gi, '').replace(/```/g, '').trim());
}

// ------- INIT -------
document.addEventListener('DOMContentLoaded', () => {
  const saved = localStorage.getItem('curriculum_v2_draft');
  if (saved) {
    try { cvData = JSON.parse(saved); } catch { cvData = JSON.parse(JSON.stringify(DEMO_CV_DATA)); }
  } else {
    cvData = JSON.parse(JSON.stringify(DEMO_CV_DATA));
  }
  syncFormFromState();
  renderCVPreview();
  updateStepperUI();
  setupEventListeners();
  applyTheme('classic');
});

// ------- PERSISTENCE -------
function persist() {
  localStorage.setItem('curriculum_v2_draft', JSON.stringify(cvData));
}

function saveAndRender() {
  persist();
  renderCVPreview();
}

// ------- SYNC FORM ↔ STATE -------
function syncFormFromState() {
  setVal('in-firstname', cvData.personalInfo.firstName);
  setVal('in-lastname', cvData.personalInfo.lastName);
  setVal('in-title', cvData.title);
  setVal('in-email', cvData.personalInfo.email);
  setVal('in-phone', cvData.personalInfo.phone);
  setVal('in-city', cvData.personalInfo.city);
  setVal('in-country', cvData.personalInfo.country);
  setVal('in-linkedin', cvData.personalInfo.linkedin);
  setVal('in-website', cvData.personalInfo.website);
  setVal('in-summary', cvData.summary);

  const photo = cvData.personalInfo.photoUrl;
  const prev = id('guided-photo-preview');
  const placeholder = id('guided-photo-placeholder');
  const btnDel = id('btn-delete-photo');
  if (photo) { prev.src = photo; prev.classList.remove('hidden'); placeholder.classList.add('hidden'); btnDel.classList.remove('hidden'); }
  else { prev.classList.add('hidden'); placeholder.classList.remove('hidden'); btnDel.classList.add('hidden'); }

  renderFormLists();
}

function renderFormLists() {
  renderSkillsForm();
  renderExperiencesForm();
  renderEducationsForm();
  renderLanguagesForm();
  renderCertsForm();
  renderProjectsForm();
}

function setVal(elId, val) {
  const el = id(elId);
  if (el) el.value = val || '';
}

function id(elId) { return document.getElementById(elId); }
function escHTML(s) {
  if (!s) return '';
  return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#039;');
}

// ------- CV PREVIEW RENDER -------
function renderCVPreview() {
  // Nom, titre
  id('cv-display-firstname').textContent = cvData.personalInfo.firstName || 'Votre';
  id('cv-display-lastname').textContent = cvData.personalInfo.lastName || 'Nom';
  id('cv-display-title').textContent = cvData.title || 'Titre professionnel';

  // Photo
  const photo = cvData.personalInfo.photoUrl;
  const img = id('cv-preview-img'), avatar = id('cv-preview-avatar');
  if (photo) { img.src = photo; img.classList.remove('hidden'); avatar.classList.add('hidden'); }
  else { img.classList.add('hidden'); avatar.classList.remove('hidden'); }

  // Contact
  showLine('cv-line-email', 'cv-display-email', cvData.personalInfo.email);
  showLine('cv-line-phone', 'cv-display-phone', cvData.personalInfo.phone);
  const loc = [cvData.personalInfo.city, cvData.personalInfo.country].filter(Boolean).join(', ');
  showLine('cv-line-location', 'cv-display-location', loc);
  showLine('cv-line-linkedin', 'cv-display-linkedin', cvData.personalInfo.linkedin);
  showLine('cv-line-website', 'cv-display-website', cvData.personalInfo.website);

  // Résumé
  const summaryEl = id('cv-section-summary');
  if (cvData.summary) { summaryEl.classList.remove('hidden'); id('cv-display-summary').textContent = cvData.summary; }
  else { summaryEl.classList.add('hidden'); }

  // Expériences
  renderCVSection('cv-section-experiences-wrapper', 'cv-experiences-list', cvData.experiences, renderExpItem);

  // Formations
  renderCVSection('cv-section-educations-wrapper', 'cv-educations-list', cvData.educations, renderEduItem);

  // Compétences
  const skillsW = id('cv-section-skills-wrapper');
  if (cvData.skills && cvData.skills.length > 0) {
    skillsW.classList.remove('hidden');
    id('cv-skills-list').innerHTML = cvData.skills.map(s => `<span class="cv-skill-tag">${escHTML(s)}</span>`).join('');
  } else { skillsW.classList.add('hidden'); }

  // Langues
  renderCVSection('cv-section-languages-wrapper', 'cv-languages-list', cvData.languages, renderLangItem);

  // Certifications
  renderCVSection('cv-section-certifications-wrapper', 'cv-certifications-list', cvData.certifications, renderCertItem);

  // Projets
  renderCVSection('cv-section-projects-wrapper', 'cv-projects-list', cvData.projects, renderProjItem);

  applyTheme(currentTemplate);
}

function showLine(lineId, spanId, val) {
  const line = id(lineId), span = id(spanId);
  if (!line) return;
  if (val) { line.classList.remove('hidden'); if (span) span.textContent = val; }
  else { line.classList.add('hidden'); }
}

function renderCVSection(wrapperId, listId, arr, renderFn) {
  const wrapper = id(wrapperId), list = id(listId);
  if (!wrapper || !list) return;
  if (arr && arr.length > 0) { wrapper.classList.remove('hidden'); list.innerHTML = arr.map(renderFn).join(''); }
  else { wrapper.classList.add('hidden'); }
}

function renderExpItem(exp) {
  return `<div class="cv-exp-item">
    <div class="cv-exp-header">
      <div>
        <span class="cv-exp-role">${escHTML(exp.role)}</span>
        <span class="text-stone-300 mx-2">·</span>
        <span class="cv-exp-company">${escHTML(exp.company)}</span>
      </div>
      <span class="cv-exp-dates">${escHTML(exp.startDate)} – ${escHTML(exp.endDate || 'Présent')}</span>
    </div>
    ${exp.description ? `<p class="cv-exp-desc">${escHTML(exp.description)}</p>` : ''}
    ${exp.achievements ? `<span class="cv-exp-achievement">▸ ${escHTML(exp.achievements)}</span>` : ''}
  </div>`;
}

function renderEduItem(edu) {
  return `<div class="cv-edu-item">
    <div class="cv-edu-header">
      <div>
        <span class="cv-edu-degree">${escHTML(edu.degree)}</span>
        <span class="text-stone-300 mx-2">·</span>
        <span class="cv-edu-school">${escHTML(edu.school)}</span>
        ${edu.city ? `<span class="cv-edu-meta">, ${escHTML(edu.city)}</span>` : ''}
        ${edu.description ? `<p class="text-[8pt] text-stone-400 italic mt-0.5">${escHTML(edu.description)}</p>` : ''}
      </div>
      <span class="cv-edu-dates">${escHTML(edu.startDate)} – ${escHTML(edu.endDate || 'Présent')}</span>
    </div>
  </div>`;
}

function renderLangItem(l) {
  return `<div class="cv-lang-item">
    <span class="font-semibold">${escHTML(l.name)}</span>
    <span class="cv-lang-level">${escHTML(l.level)}</span>
  </div>`;
}

function renderCertItem(c) {
  return `<div class="cv-cert-item">
    <div>
      <span class="font-semibold text-stone-800">${escHTML(c.name)}</span>
      <span class="text-stone-400 text-[8pt] block">${escHTML(c.issuer)}</span>
    </div>
    <span class="cv-lang-level">${escHTML(c.year)}</span>
  </div>`;
}

function renderProjItem(p) {
  return `<div class="cv-proj-item">
    <div style="display:flex;justify-content:space-between;align-items:baseline;gap:0.5rem">
      <span class="font-bold text-[9.5pt] text-stone-900">${escHTML(p.name)}</span>
      ${p.link ? `<span class="text-[8pt] text-stone-400">${escHTML(p.link)}</span>` : ''}
    </div>
    ${p.description ? `<p class="text-[8.5pt] text-stone-600 leading-relaxed">${escHTML(p.description)}</p>` : ''}
    ${p.technologies ? `<span class="text-[8pt] text-stone-400 font-mono">Stack : ${escHTML(p.technologies)}</span>` : ''}
  </div>`;
}

// ------- THÈMES -------
function applyTheme(theme) {
  currentTemplate = theme;
  const doc = id('cv-printable-document');
  doc.className = doc.className
    .replace(/theme-\w+/g, '')
    .trim();
  doc.classList.add(`theme-${theme}`);
}

// ------- STEPPER UI -------
function updateStepperUI() {
  id('step-index-badge').textContent = `Étape ${currentStep} / ${TOTAL_STEPS}`;
  const pct = Math.round(((currentStep - 1) / (TOTAL_STEPS - 1)) * 100);
  id('step-progress-percent').textContent = `${pct}% complété`;
  id('step-progress-bar').style.width = `${Math.max(pct, 4)}%`;
  id('step-title').textContent = STEP_TITLES[currentStep];

  const svgPath = STEP_ICONS[currentStep] || STEP_ICONS[1];
  id('step-icon-container').innerHTML = `<svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">${svgPath}</svg>`;

  document.querySelectorAll('.step-card').forEach(card => {
    const s = parseInt(card.getAttribute('data-step-id'));
    card.classList.toggle('hidden', s !== currentStep);
  });

  id('btn-step-prev').disabled = (currentStep === 1);

  const btnNext = id('btn-step-next');
  if (currentStep === TOTAL_STEPS) {
    btnNext.innerHTML = `Terminer <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5"/></svg>`;
  } else {
    btnNext.innerHTML = `Suivant <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"/></svg>`;
  }
  id('guided-form-error').classList.add('hidden');
}

function validateStep() {
  if (currentStep === 1 && !id('in-firstname').value.trim()) { showError('Le prénom est requis.'); return false; }
  if (currentStep === 2 && !id('in-lastname').value.trim()) { showError('Le nom de famille est requis.'); return false; }
  if (currentStep === 3 && !id('in-title').value.trim()) { showError('Le titre professionnel est requis pour l\'optimisation ATS.'); return false; }
  if (currentStep === 4) {
    const em = id('in-email').value.trim();
    if (!em) { showError('L\'adresse e-mail est requise.'); return false; }
    if (!/\S+@\S+\.\S+/.test(em)) { showError('Format d\'e-mail invalide.'); return false; }
  }
  return true;
}

function showError(msg) {
  id('guided-error-text').textContent = msg;
  id('guided-form-error').classList.remove('hidden');
}

// ------- FORM LISTS -------

function renderSkillsForm() {
  const c = id('skills-list-badges');
  if (!cvData.skills.length) { c.innerHTML = '<span class="text-xs text-stone-300 italic">Aucune compétence ajoutée</span>'; return; }
  c.innerHTML = cvData.skills.map((s, i) => `
    <span class="inline-flex items-center gap-1 text-xs font-medium bg-stone-100 text-stone-700 border border-stone-200 px-2.5 py-1 rounded-lg">
      ${escHTML(s)}
      <button onclick="deleteSkill(${i})" class="text-stone-300 hover:text-red-500 transition-colors ml-0.5 cursor-pointer">✕</button>
    </span>`).join('');
}

window.deleteSkill = i => { cvData.skills.splice(i, 1); saveAndRender(); renderSkillsForm(); };

function renderExperiencesForm() {
  const c = id('experiences-list-items');
  if (!cvData.experiences.length) { c.innerHTML = '<div class="text-xs text-stone-300 italic py-1">Aucune expérience ajoutée.</div>'; return; }
  c.innerHTML = cvData.experiences.map((e, i) => `
    <div class="flex items-center justify-between p-2.5 bg-stone-50 border border-stone-100 rounded-xl text-xs">
      <div><span class="font-semibold text-stone-800">${escHTML(e.role)}</span><p class="text-stone-400 text-[10px]">${escHTML(e.company)} · ${escHTML(e.startDate)} – ${escHTML(e.endDate||'Présent')}</p></div>
      <button onclick="deleteExp(${i})" class="text-stone-300 hover:text-red-500 cursor-pointer p-1">✕</button>
    </div>`).join('');
}
window.deleteExp = i => { cvData.experiences.splice(i, 1); saveAndRender(); renderExperiencesForm(); };

function renderEducationsForm() {
  const c = id('educations-list-items');
  if (!cvData.educations.length) { c.innerHTML = '<div class="text-xs text-stone-300 italic py-1">Aucune formation ajoutée.</div>'; return; }
  c.innerHTML = cvData.educations.map((e, i) => `
    <div class="flex items-center justify-between p-2.5 bg-stone-50 border border-stone-100 rounded-xl text-xs">
      <div><span class="font-semibold text-stone-800">${escHTML(e.degree)}</span><p class="text-stone-400 text-[10px]">${escHTML(e.school)} · ${escHTML(e.startDate)} – ${escHTML(e.endDate||'Présent')}</p></div>
      <button onclick="deleteEdu(${i})" class="text-stone-300 hover:text-red-500 cursor-pointer p-1">✕</button>
    </div>`).join('');
}
window.deleteEdu = i => { cvData.educations.splice(i, 1); saveAndRender(); renderEducationsForm(); };

function renderLanguagesForm() {
  const c = id('languages-list-items');
  if (!cvData.languages.length) { c.innerHTML = '<span class="text-xs text-stone-300 italic">Aucune langue.</span>'; return; }
  c.innerHTML = cvData.languages.map((l, i) => `
    <span class="inline-flex items-center gap-1.5 text-xs font-medium bg-stone-50 border border-stone-200 text-stone-700 px-2.5 py-1.5 rounded-lg">
      <strong>${escHTML(l.name)}</strong> · ${escHTML(l.level)}
      <button onclick="deleteLang(${i})" class="text-stone-300 hover:text-red-500 cursor-pointer">✕</button>
    </span>`).join('');
}
window.deleteLang = i => { cvData.languages.splice(i, 1); saveAndRender(); renderLanguagesForm(); };

function renderCertsForm() {
  const c = id('certifications-list-items');
  if (!cvData.certifications.length) { c.innerHTML = '<span class="text-xs text-stone-300 italic">Aucune certification.</span>'; return; }
  c.innerHTML = cvData.certifications.map((c_, i) => `
    <div class="flex justify-between items-center bg-stone-50 px-3 py-2 rounded-xl border border-stone-100 text-xs">
      <div><strong class="text-stone-800">${escHTML(c_.name)}</strong><span class="text-stone-400"> · ${escHTML(c_.issuer)}</span></div>
      <button onclick="deleteCert(${i})" class="text-stone-300 hover:text-red-500 cursor-pointer p-1">✕</button>
    </div>`).join('');
}
window.deleteCert = i => { cvData.certifications.splice(i, 1); saveAndRender(); renderCertsForm(); };

function renderProjectsForm() {
  const c = id('projects-list-items');
  if (!cvData.projects.length) { c.innerHTML = '<span class="text-xs text-stone-300 italic">Aucun projet.</span>'; return; }
  c.innerHTML = cvData.projects.map((p, i) => `
    <div class="flex justify-between items-center bg-stone-50 px-3 py-2 rounded-xl border border-stone-100 text-xs">
      <div><strong class="text-stone-800">${escHTML(p.name)}</strong><span class="text-stone-400 text-[10px] block truncate max-w-[200px]">${escHTML(p.description)}</span></div>
      <button onclick="deleteProj(${i})" class="text-stone-300 hover:text-red-500 cursor-pointer p-1">✕</button>
    </div>`).join('');
}
window.deleteProj = i => { cvData.projects.splice(i, 1); saveAndRender(); renderProjectsForm(); };

// ------- PHOTO -------
function handlePhoto(file) {
  if (!file) return;
  if (file.size > 2 * 1024 * 1024) { showError('Image trop lourde (max 2 Mo).'); return; }
  const reader = new FileReader();
  reader.onloadend = () => {
    cvData.personalInfo.photoUrl = reader.result;
    saveAndRender();
    const prev = id('guided-photo-preview'), placeholder = id('guided-photo-placeholder'), btnD = id('btn-delete-photo');
    prev.src = reader.result; prev.classList.remove('hidden'); placeholder.classList.add('hidden'); btnD.classList.remove('hidden');
  };
  reader.readAsDataURL(file);
}

function deletePhoto() {
  cvData.personalInfo.photoUrl = '';
  saveAndRender();
  id('guided-photo-preview').classList.add('hidden');
  id('guided-photo-placeholder').classList.remove('hidden');
  id('btn-delete-photo').classList.add('hidden');
}

// ------- PDF EXPORT via Print -------
function exportPDF() {
  // On force l'impression qui produit un PDF fidèle via le dialogue système
  // Contrairement à html2canvas, cela respecte exactement le rendu CSS
  const btn = id('btn-export-pdf'), txt = id('pdf-download-text'), icon = id('pdf-icon');
  txt.textContent = 'Ouverture...';
  icon.innerHTML = `<svg class="w-3.5 h-3.5 spin" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" opacity="0.25"></circle><path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" opacity="0.75"></path></svg>`;
  btn.disabled = true;

  setTimeout(() => {
    window.print();
    setTimeout(() => {
      txt.textContent = 'Télécharger PDF';
      icon.innerHTML = `<svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"/></svg>`;
      btn.disabled = false;
    }, 1500);
  }, 150);
}

// ------- IA : GÉNÉRATION RÉSUMÉ -------
async function generateSummary() {
  const btn = id('btn-ai-gen-summary');
  btn.textContent = 'Génération...';
  btn.disabled = true;
  try {
    const context = {
      title: cvData.title || id('in-title').value,
      skills: cvData.skills,
      experiences: cvData.experiences.map(e => `${e.role} chez ${e.company} (${e.startDate}-${e.endDate})`),
      educations: cvData.educations.map(e => `${e.degree} — ${e.school}`)
    };
    const raw = await callClaude(
      'Tu es un expert RH et rédacteur de CV ATS. Réponds UNIQUEMENT avec le texte du résumé professionnel, sans introduction ni ponctuation décorative. 3 à 5 lignes percutantes, langage professionnel, orienté résultats, adapté ATS.',
      `Génère un résumé professionnel percutant et ATS-optimisé pour ce profil :\n${JSON.stringify(context, null, 2)}`
    );
    id('in-summary').value = raw.trim();
    cvData.summary = raw.trim();
    saveAndRender();
  } catch (e) {
    alert('Erreur IA : ' + e.message);
  } finally {
    btn.innerHTML = `<svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z"/></svg> Générer avec l'IA`;
    btn.disabled = false;
  }
}

// ------- IA : SUGGESTION COMPÉTENCES -------
async function suggestSkills() {
  const title = cvData.title || id('in-title').value.trim();
  if (!title) { alert('Saisissez d\'abord votre titre professionnel (étape 3).'); return; }
  const btn = id('btn-ai-suggest-skills');
  btn.textContent = 'Analyse...';
  btn.disabled = true;
  try {
    const raw = await callClaude(
      'Tu es un expert RH. Réponds UNIQUEMENT avec un objet JSON {"skills":["skill1","skill2",...]} — 8 à 12 compétences ATS-pertinentes pour ce poste, sans explication.',
      `Quelles sont les compétences clés les plus recherchées par les recruteurs pour ce poste : "${title}" ?`
    );
    const parsed = parseJSON(raw);
    if (parsed.skills) {
      parsed.skills.forEach(s => { if (!cvData.skills.includes(s)) cvData.skills.push(s); });
      saveAndRender(); renderSkillsForm();
    }
  } catch (e) {
    alert('Erreur IA : ' + e.message);
  } finally {
    btn.innerHTML = `<svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z"/></svg> Suggestions IA`;
    btn.disabled = false;
  }
}

// ------- IA : AUDIT CV -------
async function runAudit() {
  const rawText = id('ai-raw-cv-text').value.trim();
  if (!rawText) { alert('Collez le texte de votre CV existant.'); return; }

  const btn = id('btn-run-audit'), errBox = id('ai-dashboard-error');
  errBox.classList.add('hidden');
  btn.textContent = 'Analyse en cours...';
  btn.disabled = true;

  try {
    const raw = await callClaude(
      `Tu es un expert ATS et recruteur senior. Analyse le CV fourni et réponds UNIQUEMENT avec ce JSON exact (sans markdown, sans explication) :
{
  "score": <0-100>,
  "weaknesses": ["<point faible 1>","<point faible 2>",...],
  "missingSections": ["<section manquante>",...],
  "improvementSuggestions": ["<suggestion 1>","<suggestion 2>",...],
  "cvData": {
    "title": "<titre professionnel>",
    "summary": "<résumé extrait>",
    "personalInfo": { "firstName":"", "lastName":"", "email":"", "phone":"", "city":"", "country":"", "linkedin":"", "website":"" },
    "skills": ["<skill>"],
    "experiences": [{ "id":"x", "role":"", "company":"", "startDate":"", "endDate":"", "description":"", "achievements":"" }],
    "educations": [{ "id":"x", "degree":"", "school":"", "city":"", "startDate":"", "endDate":"", "description":"" }],
    "languages": [{ "id":"x", "name":"", "level":"" }],
    "certifications": [{ "id":"x", "name":"", "issuer":"", "year":"" }],
    "projects": [{ "id":"x", "name":"", "technologies":"", "link":"", "description":"" }]
  }
}`,
      `Voici le CV à analyser :\n\n${rawText}`,
      2000
    );

    const res = parseJSON(raw);
    id('ai-audit-output-wrapper').classList.remove('hidden');

    // Score
    animateScore(res.score || 0);

    // Lacunes
    id('audit-weakness-list').innerHTML = (res.weaknesses || []).map(w =>
      `<li class="flex items-start gap-1.5 text-[11px] leading-relaxed"><span class="text-amber-500 shrink-0 mt-0.5">•</span>${escHTML(w)}</li>`
    ).join('') || '<li class="text-stone-300 italic text-[11px]">Aucune lacune majeure détectée.</li>';

    // Rubriques absentes
    const mb = id('audit-missing-badges');
    mb.innerHTML = (res.missingSections || []).map(s =>
      `<span class="text-[10px] font-medium text-stone-600 bg-stone-100 border border-stone-200 px-2 py-0.5 rounded-md">${escHTML(s)}</span>`
    ).join('') || '<span class="text-stone-300 italic text-[10px]">Toutes les rubriques principales sont présentes.</span>';

    // Suggestions
    id('audit-suggestions-list').innerHTML = (res.improvementSuggestions || []).map(s =>
      `<li class="flex items-start gap-1.5 text-[11px] leading-relaxed border-b border-stone-100 pb-1 last:border-0"><span class="text-stone-500 shrink-0">✦</span>${escHTML(s)}</li>`
    ).join('') || '<li class="text-stone-300 italic text-[11px]">Aucune suggestion.</li>';

    // Bouton import
    id('btn-import-audit-data').onclick = () => {
      if (res.cvData) {
        cvData = {
          title: res.cvData.title || cvData.title,
          summary: res.cvData.summary || cvData.summary,
          personalInfo: { ...cvData.personalInfo, ...res.cvData.personalInfo, photoUrl: cvData.personalInfo.photoUrl },
          educations: res.cvData.educations || [],
          experiences: res.cvData.experiences || [],
          skills: res.cvData.skills || [],
          languages: res.cvData.languages || [],
          certifications: res.cvData.certifications || [],
          projects: res.cvData.projects || []
        };
        saveAndRender(); syncFormFromState();
        const a = id('alert-import-success');
        a.classList.remove('hidden');
        setTimeout(() => a.classList.add('hidden'), 4000);
      }
    };

  } catch (e) {
    errBox.classList.remove('hidden');
    id('ai-dashboard-error-text').textContent = 'Erreur : ' + e.message;
  } finally {
    btn.innerHTML = `<svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z"/></svg> Analyser avec l'IA`;
    btn.disabled = false;
  }
}

// ------- IA : MATCH OFFRE -------
async function runMatch() {
  const jobText = id('ai-job-text').value.trim();
  if (!jobText) { alert('Collez le texte de l\'offre d\'emploi.'); return; }

  const btn = id('btn-run-match'), errBox = id('ai-dashboard-error');
  errBox.classList.add('hidden');
  btn.textContent = 'Analyse en cours...';
  btn.disabled = true;

  const cvSummary = `
Titre : ${cvData.title}
Compétences : ${cvData.skills.join(', ')}
Expériences : ${cvData.experiences.map(e => `${e.role} chez ${e.company}`).join(' | ')}
Résumé : ${cvData.summary}
  `.trim();

  try {
    const raw = await callClaude(
      `Tu es un expert ATS. Compare le profil CV à l'offre d'emploi et réponds UNIQUEMENT avec ce JSON exact (sans markdown) :
{
  "score": <0-100>,
  "matchedKeywords": ["<mot clé présent>"],
  "missingKeywords": ["<mot clé absent>"],
  "gaps": ["<écart important>"],
  "suggestions": ["<suggestion de reformulation>"]
}`,
      `PROFIL CV :\n${cvSummary}\n\nOFFRE D'EMPLOI :\n${jobText}`,
      1500
    );

    const res = parseJSON(raw);
    id('ai-match-output-wrapper').classList.remove('hidden');

    // Score
    const badge = id('match-score-badge');
    const sc = res.score || 0;
    badge.textContent = `${sc}%`;
    badge.className = badge.className.replace(/bg-\w+-\d+|border-\w+-\d+|text-\w+-\d+/g, '');
    if (sc >= 75) badge.className = 'w-12 h-12 bg-emerald-50 border-2 border-emerald-300 rounded-full flex items-center justify-center font-black font-mono text-emerald-800 text-sm shadow-sm';
    else if (sc >= 50) badge.className = 'w-12 h-12 bg-amber-50 border-2 border-amber-300 rounded-full flex items-center justify-center font-black font-mono text-amber-700 text-sm shadow-sm';
    else badge.className = 'w-12 h-12 bg-red-50 border-2 border-red-300 rounded-full flex items-center justify-center font-black font-mono text-red-700 text-sm shadow-sm';

    id('match-keywords-validated').innerHTML = (res.matchedKeywords || []).map(k =>
      `<span class="text-[10px] font-medium text-emerald-800 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-lg">${escHTML(k)}</span>`
    ).join('') || '<span class="text-stone-300 italic text-[10px]">Aucun mot-clé commun.</span>';

    id('match-keywords-missing').innerHTML = (res.missingKeywords || []).map(k =>
      `<span class="text-[10px] font-medium text-amber-800 bg-amber-50 border border-amber-100 px-2 py-0.5 rounded-lg">${escHTML(k)}</span>`
    ).join('') || '<span class="text-stone-300 italic text-[10px]">Aucun mot-clé manquant !</span>';

    id('match-suggestions-list').innerHTML = (res.suggestions || []).map(s =>
      `<li class="flex items-start gap-1.5 text-[11px] border-b border-stone-100 pb-1 last:border-0"><span class="text-stone-400 shrink-0">↗</span>${escHTML(s)}</li>`
    ).join('') || '<li class="text-stone-300 italic text-[11px]">Aucune suggestion.</li>';

  } catch (e) {
    errBox.classList.remove('hidden');
    id('ai-dashboard-error-text').textContent = 'Erreur : ' + e.message;
  } finally {
    btn.innerHTML = `<svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"/></svg> Analyser l'adéquation`;
    btn.disabled = false;
  }
}

// ------- ANIMATION SCORE -------
function animateScore(target) {
  const circle = id('audit-score-circle'), txt = id('audit-score-text');
  const total = 150.8; // 2π × 24
  let cur = 0;
  const timer = setInterval(() => {
    if (cur >= target) { clearInterval(timer); return; }
    cur++;
    txt.textContent = cur;
    circle.style.strokeDashoffset = total - (cur / 100) * total;
  }, 10);
}

// ------- EVENTS -------
function setupEventListeners() {

  // Tabs switch
  const navCreate = id('tab-nav-create'), navAnalyze = id('tab-nav-analyze');
  const panelForm = id('panel-form-stepper'), panelAI = id('panel-ai-dashboard');

  navCreate.addEventListener('click', () => {
    panelForm.classList.remove('hidden'); panelForm.classList.add('flex');
    panelAI.classList.add('hidden'); panelAI.classList.remove('flex');
    navCreate.className = 'tab-btn active flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer bg-white text-stone-900 shadow-sm';
    navAnalyze.className = 'tab-btn flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer text-stone-500 hover:text-stone-800';
  });

  navAnalyze.addEventListener('click', () => {
    panelAI.classList.remove('hidden'); panelAI.classList.add('flex');
    panelForm.classList.add('hidden'); panelForm.classList.remove('flex');
    navAnalyze.className = 'tab-btn active flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer bg-white text-stone-900 shadow-sm';
    navCreate.className = 'tab-btn flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer text-stone-500 hover:text-stone-800';
  });

  // AI sub tabs
  const subAudit = id('ai-sub-tab-audit'), subMatch = id('ai-sub-tab-match');
  const secAudit = id('ai-section-audit'), secMatch = id('ai-section-match');

  subAudit.addEventListener('click', () => {
    secAudit.classList.remove('hidden'); secMatch.classList.add('hidden');
    subAudit.className = 'ai-sub-tab active pb-3 text-xs font-semibold text-stone-900 border-b-2 border-stone-900';
    subMatch.className = 'ai-sub-tab pb-3 text-xs font-semibold text-stone-400 border-b-2 border-transparent hover:text-stone-700 transition-colors';
  });

  subMatch.addEventListener('click', () => {
    secMatch.classList.remove('hidden'); secAudit.classList.add('hidden');
    subMatch.className = 'ai-sub-tab active pb-3 text-xs font-semibold text-stone-900 border-b-2 border-stone-900';
    subAudit.className = 'ai-sub-tab pb-3 text-xs font-semibold text-stone-400 border-b-2 border-transparent hover:text-stone-700 transition-colors';
  });

  // Inputs live binding
  const bindings = [
    ['in-firstname', v => { cvData.personalInfo.firstName = v; }],
    ['in-lastname',  v => { cvData.personalInfo.lastName = v; }],
    ['in-title',     v => { cvData.title = v; }],
    ['in-email',     v => { cvData.personalInfo.email = v; }],
    ['in-phone',     v => { cvData.personalInfo.phone = v; }],
    ['in-city',      v => { cvData.personalInfo.city = v; }],
    ['in-country',   v => { cvData.personalInfo.country = v; }],
    ['in-linkedin',  v => { cvData.personalInfo.linkedin = v; }],
    ['in-website',   v => { cvData.personalInfo.website = v; }],
    ['in-summary',   v => { cvData.summary = v; }],
  ];
  bindings.forEach(([elId, setter]) => {
    id(elId)?.addEventListener('input', e => { setter(e.target.value); saveAndRender(); });
  });

  // Stepper
  id('btn-step-prev').addEventListener('click', () => {
    if (currentStep > 1) { currentStep--; updateStepperUI(); id('step-fields-scroll').scrollTop = 0; }
  });
  id('btn-step-next').addEventListener('click', () => {
    if (!validateStep()) return;
    if (currentStep < TOTAL_STEPS) { currentStep++; updateStepperUI(); id('step-fields-scroll').scrollTop = 0; }
    else { id('right-preview-container').scrollIntoView({ behavior:'smooth' }); }
  });

  // Seed / Clear
  id('btn-seed-data').addEventListener('click', () => {
    if (confirm('Remplacer par un profil exemple ?')) {
      cvData = JSON.parse(JSON.stringify(DEMO_CV_DATA)); saveAndRender(); syncFormFromState(); currentStep = 1; updateStepperUI();
    }
  });
  id('btn-clear-data').addEventListener('click', () => {
    if (confirm('Vider entièrement le formulaire ?')) {
      cvData = { title:'', summary:'', personalInfo:{ firstName:'',lastName:'',email:'',phone:'',city:'',country:'',linkedin:'',website:'',photoUrl:'' }, educations:[], experiences:[], skills:[], languages:[], certifications:[], projects:[] };
      saveAndRender(); syncFormFromState(); currentStep = 1; updateStepperUI();
    }
  });

  // Photo
  id('in-photo-file').addEventListener('change', e => handlePhoto(e.target.files?.[0]));
  id('btn-delete-photo').addEventListener('click', deletePhoto);
  const drag = id('photo-drag-area');
  drag.addEventListener('dragover', e => { e.preventDefault(); drag.classList.add('border-stone-400','bg-stone-100'); });
  drag.addEventListener('dragleave', () => drag.classList.remove('border-stone-400','bg-stone-100'));
  drag.addEventListener('drop', e => { e.preventDefault(); drag.classList.remove('border-stone-400','bg-stone-100'); handlePhoto(e.dataTransfer.files?.[0]); });

  // Skills
  const inSkill = id('in-temp-skill');
  id('btn-add-skill').addEventListener('click', () => {
    const s = inSkill.value.trim();
    if (s && !cvData.skills.includes(s)) { cvData.skills.push(s); saveAndRender(); renderSkillsForm(); }
    inSkill.value = '';
  });
  inSkill.addEventListener('keypress', e => { if (e.key === 'Enter') id('btn-add-skill').click(); });

  // Experience
  id('btn-add-experience').addEventListener('click', () => {
    const role = id('exp-role').value.trim(), company = id('exp-company').value.trim(), start = id('exp-start').value.trim();
    if (!role || !company || !start) { alert('Poste, entreprise et date de début sont obligatoires.'); return; }
    cvData.experiences.push({ id: Date.now().toString(), role, company, startDate:start, endDate:id('exp-end').value.trim()||'Présent', description:id('exp-desc').value.trim(), achievements:id('exp-achievements').value.trim() });
    saveAndRender(); renderExperiencesForm();
    ['exp-role','exp-company','exp-start','exp-end','exp-desc','exp-achievements'].forEach(i => { id(i).value = ''; });
  });

  // Education
  id('btn-add-education').addEventListener('click', () => {
    const degree = id('edu-degree').value.trim(), school = id('edu-school').value.trim(), start = id('edu-start').value.trim();
    if (!degree || !school || !start) { alert('Diplôme, établissement et date de début sont obligatoires.'); return; }
    cvData.educations.push({ id:Date.now().toString(), degree, school, city:id('edu-city').value.trim(), startDate:start, endDate:id('edu-end').value.trim()||'Présent', description:id('edu-desc').value.trim() });
    saveAndRender(); renderEducationsForm();
    ['edu-degree','edu-school','edu-city','edu-start','edu-end','edu-desc'].forEach(i => { id(i).value = ''; });
  });

  // Language
  id('btn-add-lang').addEventListener('click', () => {
    const name = id('lang-name').value.trim();
    if (!name) return;
    cvData.languages.push({ id:Date.now().toString(), name, level:id('lang-level').value });
    saveAndRender(); renderLanguagesForm(); id('lang-name').value = '';
  });

  // Certification
  id('btn-add-cert').addEventListener('click', () => {
    const name = id('cert-name').value.trim(), issuer = id('cert-issuer').value.trim(), year = id('cert-year').value.trim();
    if (!name || !issuer || !year) { alert('Remplissez tous les champs de la certification.'); return; }
    cvData.certifications.push({ id:Date.now().toString(), name, issuer, year });
    saveAndRender(); renderCertsForm();
    ['cert-name','cert-issuer','cert-year'].forEach(i => { id(i).value = ''; });
  });

  // Project
  id('btn-add-project').addEventListener('click', () => {
    const name = id('proj-name').value.trim();
    if (!name) { alert('Le titre du projet est obligatoire.'); return; }
    cvData.projects.push({ id:Date.now().toString(), name, technologies:id('proj-tech').value.trim(), link:id('proj-link').value.trim(), description:id('proj-desc').value.trim() });
    saveAndRender(); renderProjectsForm();
    ['proj-name','proj-tech','proj-link','proj-desc'].forEach(i => { id(i).value = ''; });
  });

  // Themes
  const themes = [
    { btn:'tpl-classic', theme:'classic' },
    { btn:'tpl-navy',    theme:'navy' },
    { btn:'tpl-green',   theme:'green' },
    { btn:'tpl-orange',  theme:'orange' }
  ];
  themes.forEach(({ btn, theme }) => {
    id(btn).addEventListener('click', () => {
      // Mettre à jour styles des boutons
      themes.forEach(t => {
        id(t.btn).className = 'theme-btn px-3 py-1.5 rounded-lg border text-[11px] font-semibold cursor-pointer transition-all border-stone-200 bg-white text-stone-600 hover:border-stone-300';
      });
      id(btn).className = 'theme-btn active px-3 py-1.5 rounded-lg border text-[11px] font-semibold cursor-pointer transition-all border-stone-900 bg-stone-900 text-white';
      applyTheme(theme);
    });
  });

  // Print / PDF
  id('btn-print-cv').addEventListener('click', () => window.print());
  id('btn-export-pdf').addEventListener('click', exportPDF);

  // AI Buttons
  id('btn-ai-gen-summary').addEventListener('click', generateSummary);
  id('btn-ai-suggest-skills').addEventListener('click', suggestSkills);
  id('btn-run-audit').addEventListener('click', runAudit);
  id('btn-run-match').addEventListener('click', runMatch);
}
