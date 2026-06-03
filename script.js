// State Management
let cvData = {
  title: '',
  summary: '',
  personalInfo: {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    city: '',
    country: '',
    linkedin: '',
    website: '',
    photoUrl: ''
  },
  educations: [],
  experiences: [],
  skills: [],
  languages: [],
  certifications: [],
  projects: []
};

let currentStep = 1;
const totalSteps = 15;
let currentTemplate = 'classic'; // 'classic' | 'navy' | 'green' | 'orange'
let activeMainTab = 'create'; // 'create' | 'analyze'
let activeAiSubTab = 'audit'; // 'audit' | 'match'

// Initial Demo/Example profile type
const DEMO_CV_DATA = {
  title: 'Développeur Web Full-Stack',
  summary: 'Passionné par l\'ingénierie logicielle et l\'intégration de systèmes performants. Expérience confirmée dans la conception de plateformes web interactives et d\'APIs robustes. Motivé à relever de nouveaux défis au sein d\'une équipe agile et dynamique.',
  personalInfo: {
    firstName: 'Sophie',
    lastName: 'Martin',
    email: 'sophie.martin@email.com',
    phone: '06 99 88 77 66',
    city: 'Lyon',
    country: 'France',
    linkedin: 'linkedin.com/in/sophie-martin-dev',
    website: 'sophie-martin.io',
    photoUrl: '' // Empty by default to test default avatar, can be uploaded easily
  },
  educations: [
    {
      id: 'demo-edu-1',
      degree: 'Master Ingénierie Logicielle',
      school: 'Université Claude Bernard',
      city: 'Lyon',
      startDate: '2021',
      endDate: '2023',
      description: 'Mention Très Bien. Spécialité Web et Mobilité.'
    }
  ],
  experiences: [
    {
      id: 'demo-exp-1',
      role: 'Développeuse Full-Stack',
      company: 'TechCorp SA',
      startDate: '10/2023',
      endDate: 'Présent',
      description: 'Conception et développement d\'une plateforme SaaS de gestion de fret.\nMise en place d\'APIs REST sécurisées et défilements d\'architectures temps réel.\nOptimisation des temps de réponse SQL pour de grands ensembles de données.',
      achievements: 'Amélioration de 30% des performances du système global.'
    }
  ],
  skills: ['React', 'Node.js', 'TypeScript', 'Tailwind CSS', 'PostgreSQL', 'Docker', 'Agile Scrum', 'Git'],
  languages: [
    { id: 'demo-lang-1', name: 'Français', level: 'bilingue' },
    { id: 'demo-lang-2', name: 'Anglais', level: 'avancé' }
  ],
  certifications: [
    { id: 'demo-cert-1', name: 'AWS Certified Cloud Practitioner', issuer: 'Amazon Web Services', year: '2024' }
  ],
  projects: [
    {
      id: 'demo-proj-1',
      name: 'Portfolio Personnel Interactif',
      description: 'Développement d\'une vitrine interactive présentant mes différents livrables.',
      technologies: 'React, Tailwind CSS, Motion',
      link: 'github.com/sophie/portfolio'
    }
  ]
};

// Step descriptions & icons mapping for UI update
const stepTitles = {
  1: 'Prénom',
  2: 'Nom de famille',
  3: 'Titre professionnel',
  4: 'Adresse e-mail',
  5: 'Téléphone',
  6: 'Ville & Pays',
  7: 'LinkedIn & Portfolio',
  8: 'Photo de profil',
  9: 'Résumé professionnel',
  10: 'Compétences',
  11: 'Expériences professionnelles',
  12: 'Formations',
  13: 'Langues',
  14: 'Certifications',
  15: 'Projets'
};

const stepIcons = {
  1: 'user',
  2: 'user',
  3: 'briefcase',
  4: 'mail',
  5: 'phone',
  6: 'map-pin',
  7: 'link',
  8: 'camera',
  9: 'sparkles',
  10: 'award',
  11: 'briefcase',
  12: 'graduation-cap',
  13: 'globe',
  14: 'award',
  15: 'briefcase'
};

// Initialize Application
document.addEventListener('DOMContentLoaded', () => {
  // Load local draft if exists, else seed example
  const saved = localStorage.getItem('curriculum_draft_cv');
  if (saved) {
    try {
      cvData = JSON.parse(saved);
    } catch (e) {
      cvData = { ...DEMO_CV_DATA };
    }
  } else {
    cvData = { ...DEMO_CV_DATA };
  }

  // Render initial page elements
  syncStateToForm();
  renderCVPreviewSheet();
  updateStepperUI();
  setupEventListeners();

  // Initialize Lucide CDN Icons
  if (window.lucide) {
    window.lucide.createIcons();
  }
});

// Sync the local state to form inputs
function syncStateToForm() {
  document.getElementById('in-firstname').value = cvData.personalInfo.firstName || '';
  document.getElementById('in-lastname').value = cvData.personalInfo.lastName || '';
  document.getElementById('in-title').value = cvData.title || '';
  document.getElementById('in-email').value = cvData.personalInfo.email || '';
  document.getElementById('in-phone').value = cvData.personalInfo.phone || '';
  document.getElementById('in-city').value = cvData.personalInfo.city || '';
  document.getElementById('in-country').value = cvData.personalInfo.country || '';
  document.getElementById('in-linkedin').value = cvData.personalInfo.linkedin || '';
  document.getElementById('in-website').value = cvData.personalInfo.website || '';
  document.getElementById('in-summary').value = cvData.summary || '';

  // Photo
  const photoUrl = cvData.personalInfo.photoUrl;
  const guidedPhotoPreview = document.getElementById('guided-photo-preview');
  const guidedPhotoPlaceholder = document.getElementById('guided-photo-placeholder');
  const btnDeletePhoto = document.getElementById('btn-delete-photo');

  if (photoUrl) {
    guidedPhotoPreview.src = photoUrl;
    guidedPhotoPreview.classList.remove('hidden');
    guidedPhotoPlaceholder.classList.add('hidden');
    btnDeletePhoto.classList.remove('hidden');
  } else {
    guidedPhotoPreview.classList.add('hidden');
    guidedPhotoPlaceholder.classList.remove('hidden');
    btnDeletePhoto.classList.add('hidden');
  }

  // Render arrays/lists in form
  renderSkillsBadgesInForm();
  renderExperiencesListInForm();
  renderEducationsListInForm();
  renderLanguagesListInForm();
  renderCertificationsListInForm();
  renderProjectsListInForm();
}

// Global persistence & sheet updates
function saveAndRender() {
  localStorage.setItem('curriculum_draft_cv', JSON.stringify(cvData));
  renderCVPreviewSheet();
}

// ---------------- GLOBAL DESIGN STYLING & SHEETS ----------------

// Render dynamic CV on the Paper sheet
function renderCVPreviewSheet() {
  // Personal inputs
  const firstName = cvData.personalInfo.firstName || 'Votre';
  const lastName = cvData.personalInfo.lastName || 'Nom';
  document.getElementById('cv-display-firstname').innerText = firstName;
  document.getElementById('cv-display-lastname').innerText = lastName;
  document.getElementById('cv-display-title').innerText = cvData.title || 'Titre professionnel';

  // Photo
  const photoUrl = cvData.personalInfo.photoUrl;
  const cvPreviewImg = document.getElementById('cv-preview-img');
  const cvPreviewAvatar = document.getElementById('cv-preview-avatar');

  if (photoUrl) {
    cvPreviewImg.src = photoUrl;
    cvPreviewImg.classList.remove('hidden');
    cvPreviewAvatar.classList.add('hidden');
  } else {
    cvPreviewImg.classList.add('hidden');
    cvPreviewAvatar.classList.remove('hidden');
  }

  // Coordinates
  const email = cvData.personalInfo.email;
  const phone = cvData.personalInfo.phone;
  const city = cvData.personalInfo.city;
  const country = cvData.personalInfo.country;
  const linkedin = cvData.personalInfo.linkedin;
  const website = cvData.personalInfo.website;

  toggleElement('cv-line-email', email);
  if (email) document.getElementById('cv-display-email').innerText = email;

  toggleElement('cv-line-phone', phone);
  if (phone) document.getElementById('cv-display-phone').innerText = phone;

  const hasLocation = city || country;
  toggleElement('cv-line-location', hasLocation);
  if (hasLocation) {
    const locText = [city, country].filter(Boolean).join(', ');
    document.getElementById('cv-display-location').innerText = locText;
  }

  toggleElement('cv-line-linkedin', linkedin);
  if (linkedin) document.getElementById('cv-display-linkedin').innerText = linkedin;

  toggleElement('cv-line-website', website);
  if (website) document.getElementById('cv-display-website').innerText = website;

  // Summary section
  toggleElement('cv-section-summary', cvData.summary);
  if (cvData.summary) {
    document.getElementById('cv-display-summary').innerText = cvData.summary;
  }

  // Experiences sheet list
  const expWrapper = document.getElementById('cv-section-experiences-wrapper');
  if (cvData.experiences && cvData.experiences.length > 0) {
    expWrapper.classList.remove('hidden');
    const listHtml = cvData.experiences.map(exp => `
      <div class="mb-4 break-inside-avoid">
        <div class="flex justify-between items-baseline gap-3">
          <h4 class="text-xs sm:text-sm font-bold text-zinc-900">
            ${escapeHTML(exp.role)} <span class="font-normal text-zinc-300">|</span> <span class="text-teal-700 font-semibold cv-accent-text-node">${escapeHTML(exp.company)}</span>
          </h4>
          <span class="text-[10px] font-mono text-zinc-500 font-semibold shrink-0">${escapeHTML(exp.startDate)} – ${escapeHTML(exp.endDate || 'Présent')}</span>
        </div>
        ${exp.description ? `<p class="mt-1 text-xs text-zinc-600 leading-relaxed text-justify whitespace-pre-line">${escapeHTML(exp.description)}</p>` : ''}
        ${exp.achievements ? `
          <div class="mt-1.5 flex items-start gap-1">
            <span class="text-[9px] font-bold text-zinc-400 uppercase tracking-wider shrink-0 mt-0.5">Réalisation:</span>
            <span class="text-[10px] text-emerald-700 bg-emerald-50 border border-emerald-100 font-semibold px-2 py-0.5 rounded-md leading-tight">${escapeHTML(exp.achievements)}</span>
          </div>
        ` : ''}
      </div>
    `).join('');
    document.getElementById('cv-experiences-list').innerHTML = listHtml;
  } else {
    expWrapper.classList.add('hidden');
  }

  // Education sheet list
  const eduWrapper = document.getElementById('cv-section-educations-wrapper');
  if (cvData.educations && cvData.educations.length > 0) {
    eduWrapper.classList.remove('hidden');
    const listHtml = cvData.educations.map(edu => `
      <div class="flex justify-between items-baseline gap-3 break-inside-avoid">
        <div class="text-xs text-zinc-800">
          <span class="font-bold text-zinc-900">${escapeHTML(edu.degree)}</span>
          <span class="font-normal text-zinc-300 mx-1.5">|</span>
          <span class="font-semibold text-teal-700 cv-accent-text-node">${escapeHTML(edu.school)}</span>
          ${edu.city ? `, <span class="text-zinc-500">${escapeHTML(edu.city)}</span>` : ''}
          ${edu.description ? `<p class="mt-0.5 text-[11px] text-zinc-500 italic">${escapeHTML(edu.description)}</p>` : ''}
        </div>
        <span class="text-[10px] font-mono text-zinc-500 font-semibold shrink-0">${escapeHTML(edu.startDate)} – ${escapeHTML(edu.endDate || 'Présent')}</span>
      </div>
    `).join('');
    document.getElementById('cv-educations-list').innerHTML = listHtml;
  } else {
    eduWrapper.classList.add('hidden');
  }

  // Skills sheet tags
  const skillsWrapper = document.getElementById('cv-section-skills-wrapper');
  if (cvData.skills && cvData.skills.length > 0) {
    skillsWrapper.classList.remove('hidden');
    const listHtml = cvData.skills.map(skill => `
      <span class="cv-skill-badge text-[11px] font-semibold bg-zinc-100 border border-zinc-200/60 text-zinc-800 px-2.5 py-1 rounded-md transition-all">
        ${escapeHTML(skill)}
      </span>
    `).join('');
    document.getElementById('cv-skills-list').innerHTML = listHtml;
  } else {
    skillsWrapper.classList.add('hidden');
  }

  // Languages sheet tags
  const langWrapper = document.getElementById('cv-section-languages-wrapper');
  if (cvData.languages && cvData.languages.length > 0) {
    langWrapper.classList.remove('hidden');
    const listHtml = cvData.languages.map(l => `
      <div class="flex justify-between items-center text-xs text-zinc-800 py-1 border-b border-zinc-100/50">
        <span class="font-semibold text-zinc-900">${escapeHTML(l.name)}</span>
        <span class="text-[10px] font-mono text-zinc-500 font-bold bg-zinc-100/70 py-0.5 px-2 rounded uppercase">${escapeHTML(l.level)}</span>
      </div>
    `).join('');
    document.getElementById('cv-languages-list').innerHTML = listHtml;
  } else {
    langWrapper.classList.add('hidden');
  }

  // Certifications sheet list
  const certWrapper = document.getElementById('cv-section-certifications-wrapper');
  if (cvData.certifications && cvData.certifications.length > 0) {
    certWrapper.classList.remove('hidden');
    const listHtml = cvData.certifications.map(c => `
      <div class="flex justify-between items-center text-xs py-1 border-b border-zinc-100/50">
        <div>
          <span class="font-semibold text-zinc-900">${escapeHTML(c.name)}</span>
          <p class="text-[10px] text-zinc-400 font-medium leading-none">${escapeHTML(c.issuer)}</p>
        </div>
        <span class="text-[10px] font-mono text-zinc-500 font-bold shrink-0">${escapeHTML(c.year)}</span>
      </div>
    `).join('');
    document.getElementById('cv-certifications-list').innerHTML = listHtml;
  } else {
    certWrapper.classList.add('hidden');
  }

  // Projects sheet list
  const projWrapper = document.getElementById('cv-section-projects-wrapper');
  if (cvData.projects && cvData.projects.length > 0) {
    projWrapper.classList.remove('hidden');
    const listHtml = cvData.projects.map(p => `
      <div class="mb-3 break-inside-avoid">
        <div class="flex justify-between items-baseline gap-2">
          <span class="font-bold text-xs sm:text-sm text-zinc-900">${escapeHTML(p.name)}</span>
          ${p.link ? `<a href="${p.link.startsWith('http') ? escapeHTML(p.link) : `https://${escapeHTML(p.link)}`}" target="_blank" class="text-[10px] font-bold text-teal-600 hover:underline">Voir le projet</a>` : ''}
        </div>
        <p class="text-xs text-zinc-650 leading-relaxed text-justify mt-0.5">${escapeHTML(p.description)}</p>
        ${p.technologies ? `
          <div class="mt-1 text-[10px] text-zinc-400 font-semibold space-x-1.5 flex items-center">
            <span class="uppercase text-[9px] font-bold text-zinc-400/80">Tech Stack:</span>
            <span class="font-mono text-zinc-600 bg-zinc-50/50 border border-zinc-100 px-1.5 py-0.5 rounded-sm">${escapeHTML(p.technologies)}</span>
          </div>
        ` : ''}
      </div>
    `).join('');
    document.getElementById('cv-projects-list').innerHTML = listHtml;
  } else {
    projWrapper.classList.add('hidden');
  }

  // Re-apply colour theme class transformations
  applyActiveColourTheme();
}

// Apply active theme configurations to standard elements
function applyActiveColourTheme() {
  const headerPanel = document.getElementById('cv-header-panel');
  const accentTexts = document.querySelectorAll('.cv-accent-text-node');
  const titleHeader = document.getElementById('cv-display-title');
  const skillBadges = document.querySelectorAll('.cv-skill-badge');
  const sectionTitleBars = document.querySelectorAll('.cv-section-title-bar');

  // Clear previous template styles
  headerPanel.className = 'p-6 md:p-8 rounded-t-xl transition-all -mx-6 -mt-6 md:-mx-8 md:-mt-8 ';
  titleHeader.className = 'text-sm sm:text-base font-bold uppercase tracking-wide font-display mt-1.5 ';

  sectionTitleBars.forEach(bar => {
    bar.className = 'cv-section-title-bar mt-6 mb-3 pb-1 border-b flex items-center gap-2 ';
  });

  if (currentTemplate === 'classic') {
    headerPanel.classList.add('bg-zinc-100', 'border-b', 'border-zinc-200');
    titleHeader.classList.add('text-zinc-600');
    sectionTitleBars.forEach(bar => bar.classList.add('border-zinc-300'));
    accentTexts.forEach(el => {
      el.classList.add('text-zinc-800');
      el.classList.remove('text-indigo-800', 'text-emerald-800', 'text-amber-700');
    });
  } 
  else if (currentTemplate === 'navy') {
    headerPanel.classList.add('bg-indigo-50/75', 'border-b-2', 'border-indigo-100');
    titleHeader.classList.add('text-indigo-900');
    sectionTitleBars.forEach(bar => bar.classList.add('border-indigo-200/70'));
    accentTexts.forEach(el => {
      el.classList.add('text-indigo-800');
      el.classList.remove('text-zinc-855', 'text-emerald-800', 'text-amber-700');
    });
    skillBadges.forEach(badge => {
      badge.className = 'cv-skill-badge text-[11px] font-semibold bg-indigo-50/50 border border-indigo-100/60 text-indigo-900 px-2.5 py-1 rounded-md transition-all';
    });
  } 
  else if (currentTemplate === 'green') {
    headerPanel.classList.add('bg-emerald-50/60', 'border-b-2', 'border-emerald-100');
    titleHeader.classList.add('text-emerald-800');
    sectionTitleBars.forEach(bar => bar.classList.add('border-emerald-200/70'));
    accentTexts.forEach(el => {
      el.classList.add('text-emerald-800');
      el.classList.remove('text-zinc-855', 'text-indigo-800', 'text-amber-700');
    });
    skillBadges.forEach(badge => {
      badge.className = 'cv-skill-badge text-[11px] font-semibold bg-emerald-50/50 border border-emerald-100/60 text-emerald-900 px-2.5 py-1 rounded-md transition-all';
    });
  } 
  else if (currentTemplate === 'orange') {
    headerPanel.classList.add('bg-amber-50/60', 'border-b-2', 'border-amber-100');
    titleHeader.classList.add('text-amber-800');
    sectionTitleBars.forEach(bar => bar.classList.add('border-amber-200/70'));
    accentTexts.forEach(el => {
      el.classList.add('text-amber-700');
      el.classList.remove('text-zinc-855', 'text-indigo-800', 'text-emerald-800');
    });
    skillBadges.forEach(badge => {
      badge.className = 'cv-skill-badge text-[11px] font-semibold bg-amber-50/50 border border-amber-100/60 text-amber-900 px-2.5 py-1 rounded-md transition-all';
    });
  }
}

// Toggle helper
function toggleElement(id, condition) {
  const el = document.getElementById(id);
  if (el) {
    if (condition) el.classList.remove('hidden');
    else el.classList.add('hidden');
  }
}

// ---------------- STEPPER INTERACTION ----------------

// Update viewable stepper card & header counters
function updateStepperUI() {
  document.getElementById('step-index-badge').innerText = `Étape ${currentStep} / ${totalSteps}`;
  
  // Progress calculations
  const percentPrct = Math.round(((currentStep - 1) / (totalSteps - 1)) * 100);
  document.getElementById('step-progress-percent').innerText = `${percentPrct}% complété`;
  document.getElementById('step-progress-bar').style.width = `${percentPrct}%`;

  // Step Header texts
  document.getElementById('step-title').innerText = stepTitles[currentStep];

  // Sync Lucide Icon matching step
  const iconName = stepIcons[currentStep] || 'user';
  const container = document.getElementById('step-icon-container');
  container.innerHTML = `<i data-lucide="${iconName}" class="w-5 h-5"></i>`;
  if (window.lucide) {
    window.lucide.createIcons();
  }

  // Card items active switch
  const cards = document.querySelectorAll('.step-card');
  cards.forEach(card => {
    const id = parseInt(card.getAttribute('data-step-id'));
    if (id === currentStep) {
      card.classList.remove('hidden');
    } else {
      card.classList.add('hidden');
    }
  });

  // Previous button check
  const btnPrev = document.getElementById('btn-step-prev');
  if (currentStep === 1) {
    btnPrev.setAttribute('disabled', 'true');
  } else {
    btnPrev.removeAttribute('disabled');
  }

  // Next/Finish button switch
  const btnNext = document.getElementById('btn-step-next');
  if (currentStep === totalSteps) {
    btnNext.innerHTML = `<span>Terminer</span> <i data-lucide="check" class="w-3.5 h-3.5"></i>`;
  } else {
    btnNext.innerHTML = `<span>Suivant</span> <i data-lucide="arrow-right" class="w-3.5 h-3.5"></i>`;
  }
  if (window.lucide) {
    window.lucide.createIcons();
  }

  // Clean error banner when changing steps
  document.getElementById('guided-form-error').classList.add('hidden');
}

// Validate field entry requirements before stepping forward
function validateCurrentStep() {
  if (currentStep === 1) {
    const fn = document.getElementById('in-firstname').value.trim();
    if (!fn) {
      showStepError("Le prénom est requis pour entamer la mise en forme.");
      return false;
    }
  }
  if (currentStep === 2) {
    const ln = document.getElementById('in-lastname').value.trim();
    if (!ln) {
      showStepError("Le nom de famille est requis pour élaborer le fichier.");
      return false;
    }
  }
  if (currentStep === 3) {
    const t = document.getElementById('in-title').value.trim();
    if (!t) {
      showStepError("Le titre professionnel cible est indispensable pour l'optimisation ATS.");
      return false;
    }
  }
  if (currentStep === 4) {
    const em = document.getElementById('in-email').value.trim();
    if (!em) {
      showStepError("L'adresse e-mail de contact est requise.");
      return false;
    }
    // Simple email validator regex
    const re = /\S+@\S+\.\S+/;
    if (!re.test(em)) {
      showStepError("Veuillez saisir une adresse e-mail conforme.");
      return false;
    }
  }
  return true;
}

function showStepError(msg) {
  const errorBanner = document.getElementById('guided-form-error');
  const errorText = document.getElementById('guided-error-text');
  errorText.innerText = msg;
  errorBanner.classList.remove('hidden');
}

// ---------------- ARRAY CONTROLLER RENDERERS FOR FORM ----------------

// Form: Skills Badges
function renderSkillsBadgesInForm() {
  const container = document.getElementById('skills-list-badges');
  if (cvData.skills.length === 0) {
    container.innerHTML = '<span class="text-[10px] text-zinc-400 font-medium italic">Aucune compétence insérée pour le moment</span>';
    return;
  }
  const badgesHtml = cvData.skills.map((skill, index) => `
    <span class="inline-flex items-center gap-1.5 text-[10px] sm:text-xs font-semibold bg-zinc-100 hover:bg-zinc-200 text-zinc-800 transition-colors px-2.5 py-1.5 rounded-lg border border-zinc-200 font-mono">
      ${escapeHTML(skill)}
      <button type="button" onclick="deleteSkill(${index})" class="text-zinc-400 hover:text-red-600 transition-colors focus:outline-none cursor-pointer">
        ✕
      </button>
    </span>
  `).join('');
  container.innerHTML = badgesHtml;
}

window.deleteSkill = function(idx) {
  cvData.skills.splice(idx, 1);
  saveAndRender();
  renderSkillsBadgesInForm();
};

// Form: Experiences List
function renderExperiencesListInForm() {
  const container = document.getElementById('experiences-list-items');
  if (cvData.experiences.length === 0) {
    container.innerHTML = '<div class="text-[10px] text-zinc-400 italic py-2">Aucune expérience répertoriée.</div>';
    return;
  }
  const listHtml = cvData.experiences.map((exp, index) => `
    <div class="flex items-center justify-between p-2.5 bg-zinc-50 hover:bg-zinc-100 border border-zinc-100 rounded-lg text-xs transition-colors">
      <div class="space-y-0.5">
        <span class="font-bold text-zinc-800">${escapeHTML(exp.role)}</span>
        <p class="text-[10px] text-zinc-500 font-medium leading-none">${escapeHTML(exp.company)} (${escapeHTML(exp.startDate)} – ${escapeHTML(exp.endDate || 'Présent')})</p>
      </div>
      <button type="button" onclick="deleteExperience(${index})" class="text-zinc-400 hover:text-red-500 p-1 cursor-pointer">
        ✕
      </button>
    </div>
  `).join('');
  container.innerHTML = listHtml;
}

window.deleteExperience = function(idx) {
  cvData.experiences.splice(idx, 1);
  saveAndRender();
  renderExperiencesListInForm();
};

// Form: Educations List
function renderEducationsListInForm() {
  const container = document.getElementById('educations-list-items');
  if (cvData.educations.length === 0) {
    container.innerHTML = '<div class="text-[10px] text-zinc-400 italic py-2">Aucune formation répertoriée.</div>';
    return;
  }
  const listHtml = cvData.educations.map((edu, index) => `
    <div class="flex items-center justify-between p-2.5 bg-zinc-50 hover:bg-zinc-100 border border-zinc-100 rounded-lg text-xs transition-colors">
      <div class="space-y-0.5">
        <span class="font-bold text-zinc-800">${escapeHTML(edu.degree)}</span>
        <p class="text-[10px] text-zinc-500 font-medium leading-none">${escapeHTML(edu.school)} (${escapeHTML(edu.startDate)} – ${escapeHTML(edu.endDate)})</p>
      </div>
      <button type="button" onclick="deleteEducation(${index})" class="text-zinc-400 hover:text-red-500 p-1 cursor-pointer">
        ✕
      </button>
    </div>
  `).join('');
  container.innerHTML = listHtml;
}

window.deleteEducation = function(idx) {
  cvData.educations.splice(idx, 1);
  saveAndRender();
  renderEducationsListInForm();
};

// Form: Languages Badges
function renderLanguagesListInForm() {
  const container = document.getElementById('languages-list-items');
  if (cvData.languages.length === 0) {
    container.innerHTML = '<span class="text-[10px] text-zinc-400 italic py-2">Aucune langue.</span>';
    return;
  }
  const listHtml = cvData.languages.map((l, index) => `
    <span class="inline-flex items-center gap-1 text-[10px] sm:text-xs font-semibold bg-zinc-50 border border-zinc-200 text-zinc-800 px-2 py-1.5 rounded-lg">
      <strong class="text-zinc-900">${escapeHTML(l.name)}</strong>: ${escapeHTML(l.level)}
      <button type="button" onclick="deleteLanguage(${index})" class="text-zinc-400 hover:text-red-500 px-1 cursor-pointer">✕</button>
    </span>
  `).join('');
  container.innerHTML = listHtml;
}

window.deleteLanguage = function(idx) {
  cvData.languages.splice(idx, 1);
  saveAndRender();
  renderLanguagesListInForm();
};

// Form: Certifications List
function renderCertificationsListInForm() {
  const container = document.getElementById('certifications-list-items');
  if (cvData.certifications.length === 0) {
    container.innerHTML = '<span class="text-[10px] text-zinc-400 italic py-2">Aucune certification.</span>';
    return;
  }
  const listHtml = cvData.certifications.map((c, idx) => `
    <div class="flex justify-between items-center bg-zinc-50 px-2.5 py-1.5 rounded-md border border-zinc-100 text-xs">
      <div>
        <strong class="text-zinc-800">${escapeHTML(c.name)}</strong>
        <span class="text-[10px] text-zinc-400"> - ${escapeHTML(c.issuer)}</span>
      </div>
      <button type="button" onclick="deleteCert(${idx})" class="text-zinc-400 hover:text-red-500 font-bold p-0.5 cursor-pointer">✕</button>
    </div>
  `).join('');
  container.innerHTML = listHtml;
}

window.deleteCert = function(idx) {
  cvData.certifications.splice(idx, 1);
  saveAndRender();
  renderCertificationsListInForm();
};

// Form: Projects List
function renderProjectsListInForm() {
  const container = document.getElementById('projects-list-items');
  if (cvData.projects.length === 0) {
    container.innerHTML = '<span class="text-[10px] text-zinc-400 italic py-2">Aucun projet répertorié.</span>';
    return;
  }
  const listHtml = cvData.projects.map((p, idx) => `
    <div class="flex justify-between items-center bg-zinc-50 px-2.5 py-1.5 rounded-md border border-zinc-100 text-xs">
      <div>
        <strong class="text-zinc-800">${escapeHTML(p.name)}</strong>
        <span class="text-[10px] text-zinc-500 block leading-tight truncate max-w-[200px]">${p.description ? escapeHTML(p.description) : ''}</span>
      </div>
      <button type="button" onclick="deleteProject(${idx})" class="text-zinc-400 hover:text-red-500 font-bold p-0.5 cursor-pointer font-sans">✕</button>
    </div>
  `).join('');
  container.innerHTML = listHtml;
}

window.deleteProject = function(idx) {
  cvData.projects.splice(idx, 1);
  saveAndRender();
  renderProjectsListInForm();
};

// ---------------- PHOTO LOADER UTILITIES ----------------

// Base64 Reader on photo loaded to dodge CORS and compile directly to pdf
function handleProfilePhotoFile(file) {
  if (!file) return;
  if (file.size > 2 * 1024 * 1024) {
    showStepError("La taille de l'image est limitée à 2 Mo.");
    return;
  }
  const reader = new FileReader();
  reader.onloadend = () => {
    if (typeof reader.result === 'string') {
      cvData.personalInfo.photoUrl = reader.result;
      saveAndRender();
      
      // Update form preview
      const guidedPhotoPreview = document.getElementById('guided-photo-preview');
      const guidedPhotoPlaceholder = document.getElementById('guided-photo-placeholder');
      const btnDeletePhoto = document.getElementById('btn-delete-photo');

      guidedPhotoPreview.src = reader.result;
      guidedPhotoPreview.classList.remove('hidden');
      guidedPhotoPlaceholder.classList.add('hidden');
      btnDeletePhoto.classList.remove('hidden');
    }
  };
  reader.readAsDataURL(file);
}

// Remove photo and back to generic avatar SVG
function deleteProfilePhoto() {
  cvData.personalInfo.photoUrl = '';
  saveAndRender();

  const guidedPhotoPreview = document.getElementById('guided-photo-preview');
  const guidedPhotoPlaceholder = document.getElementById('guided-photo-placeholder');
  const btnDeletePhoto = document.getElementById('btn-delete-photo');

  guidedPhotoPreview.src = '';
  guidedPhotoPreview.classList.add('hidden');
  guidedPhotoPlaceholder.classList.remove('hidden');
  btnDeletePhoto.classList.add('hidden');
}

// ---------------- EVENTS & INTERACTION TRIGGERING ----------------

function setupEventListeners() {
  // Navigation Tabs Switch
  const navCreate = document.getElementById('tab-nav-create');
  const navAnalyze = document.getElementById('tab-nav-analyze');
  const panelForm = document.getElementById('panel-form-stepper');
  const panelAi = document.getElementById('panel-ai-dashboard');

  navCreate.addEventListener('click', () => {
    activeMainTab = 'create';
    panelForm.classList.remove('hidden');
    panelForm.classList.add('flex');
    panelAi.classList.add('hidden');
    panelAi.classList.remove('flex');

    navCreate.className = 'flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold text-xs tracking-wide uppercase transition-all cursor-pointer font-display bg-gradient-to-r from-teal-600 to-emerald-600 text-white shadow-md shadow-teal-600/10';
    navAnalyze.className = 'flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold text-xs tracking-wide uppercase transition-all cursor-pointer font-display text-zinc-500 hover:text-zinc-950';
  });

  navAnalyze.addEventListener('click', () => {
    activeMainTab = 'analyze';
    panelForm.classList.add('hidden');
    panelForm.classList.remove('flex');
    panelAi.classList.remove('hidden');
    panelAi.classList.add('flex');

    navAnalyze.className = 'flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold text-xs tracking-wide uppercase transition-all cursor-pointer font-display bg-gradient-to-r from-teal-600 to-emerald-600 text-white shadow-md shadow-teal-600/10';
    navCreate.className = 'flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold text-xs tracking-wide uppercase transition-all cursor-pointer font-display text-zinc-500 hover:text-zinc-950';
  });

  // AI Sub tabs toggles
  const subAudit = document.getElementById('ai-sub-tab-audit');
  const subMatch = document.getElementById('ai-sub-tab-match');
  const sectionAudit = document.getElementById('ai-section-audit');
  const sectionMatch = document.getElementById('ai-section-match');

  subAudit.addEventListener('click', () => {
    activeAiSubTab = 'audit';
    sectionAudit.classList.remove('hidden');
    sectionMatch.classList.add('hidden');
    subAudit.className = 'flex-1 sm:flex-none flex items-center justify-center gap-2 pb-3 px-4 font-semibold text-sm cursor-pointer border-b-2 transition-all font-display border-teal-600 text-teal-700';
    subMatch.className = 'flex-1 sm:flex-none flex items-center justify-center gap-2 pb-3 px-4 font-semibold text-sm cursor-pointer border-b-2 transition-all font-display border-transparent text-zinc-500 hover:text-zinc-800';
  });

  subMatch.addEventListener('click', () => {
    activeAiSubTab = 'match';
    sectionAudit.classList.add('hidden');
    sectionMatch.classList.remove('hidden');
    subMatch.className = 'flex-1 sm:flex-none flex items-center justify-center gap-2 pb-3 px-4 font-semibold text-sm cursor-pointer border-b-2 transition-all font-display border-teal-600 text-teal-700';
    subAudit.className = 'flex-1 sm:flex-none flex items-center justify-center gap-2 pb-3 px-4 font-semibold text-sm cursor-pointer border-b-2 transition-all font-display border-transparent text-zinc-500 hover:text-zinc-800';
  });

  // Dynamic values binding
  document.getElementById('in-firstname').addEventListener('input', (e) => {
    cvData.personalInfo.firstName = e.target.value;
    saveAndRender();
  });
  document.getElementById('in-lastname').addEventListener('input', (e) => {
    cvData.personalInfo.lastName = e.target.value;
    saveAndRender();
  });
  document.getElementById('in-title').addEventListener('input', (e) => {
    cvData.title = e.target.value;
    saveAndRender();
  });
  document.getElementById('in-email').addEventListener('input', (e) => {
    cvData.personalInfo.email = e.target.value;
    saveAndRender();
  });
  document.getElementById('in-phone').addEventListener('input', (e) => {
    cvData.personalInfo.phone = e.target.value;
    saveAndRender();
  });
  document.getElementById('in-city').addEventListener('input', (e) => {
    cvData.personalInfo.city = e.target.value;
    saveAndRender();
  });
  document.getElementById('in-country').addEventListener('input', (e) => {
    cvData.personalInfo.country = e.target.value;
    saveAndRender();
  });
  document.getElementById('in-linkedin').addEventListener('input', (e) => {
    cvData.personalInfo.linkedin = e.target.value;
    saveAndRender();
  });
  document.getElementById('in-website').addEventListener('input', (e) => {
    cvData.personalInfo.website = e.target.value;
    saveAndRender();
  });
  document.getElementById('in-summary').addEventListener('input', (e) => {
    cvData.summary = e.target.value;
    saveAndRender();
  });

  // Stepper buttons
  document.getElementById('btn-step-prev').addEventListener('click', () => {
    if (currentStep > 1) {
      currentStep--;
      updateStepperUI();
      document.getElementById('step-fields-scroll').scrollTop = 0;
    }
  });

  document.getElementById('btn-step-next').addEventListener('click', () => {
    if (validateCurrentStep()) {
      if (currentStep < totalSteps) {
        currentStep++;
        updateStepperUI();
        document.getElementById('step-fields-scroll').scrollTop = 0;
      } else {
        // Scrolling directly to view preview when finishing
        document.getElementById('right-preview-container').scrollIntoView({ behavior: 'smooth' });
      }
    }
  });

  // Seed / Clear profile data globally
  document.getElementById('btn-seed-data').addEventListener('click', () => {
    if (confirm("Voulez-vous réinitialiser l'éditeur avec un profil type exemple ? Vos modifications éventuelles seront écrasées.")) {
      cvData = JSON.parse(JSON.stringify(DEMO_CV_DATA));
      saveAndRender();
      syncStateToForm();
      currentStep = 1;
      updateStepperUI();
    }
  });

  document.getElementById('btn-clear-data').addEventListener('click', () => {
    if (confirm("Voulez-vous vider entièrement le formulaire pour partir d'un document blanc ?")) {
      cvData = {
        title: '',
        summary: '',
        personalInfo: { firstName: '', lastName: '', email: '', phone: '', city: '', country: '', linkedin: '', website: '', photoUrl: '' },
        educations: [],
        experiences: [],
        skills: [],
        languages: [],
        certifications: [],
        projects: []
      };
      saveAndRender();
      syncStateToForm();
      currentStep = 1;
      updateStepperUI();
    }
  });

  // Photo Input bindings
  const photoFile = document.getElementById('in-photo-file');
  photoFile.addEventListener('change', (e) => {
    const file = e.target.files?.[0];
    handleProfilePhotoFile(file);
  });

  document.getElementById('btn-delete-photo').addEventListener('click', deleteProfilePhoto);

  // Drag and drop events
  const dragArea = document.getElementById('photo-drag-area');
  dragArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    dragArea.classList.add('border-teal-500', 'bg-teal-50/20');
  });
  dragArea.addEventListener('dragleave', () => {
    dragArea.classList.remove('border-teal-500', 'bg-teal-50/20');
  });
  dragArea.addEventListener('drop', (e) => {
    e.preventDefault();
    dragArea.classList.remove('border-teal-500', 'bg-teal-50/20');
    const file = e.dataTransfer.files?.[0];
    handleProfilePhotoFile(file);
  });

  // Skills additions list
  const inSkill = document.getElementById('in-temp-skill');
  const btnAddSkill = document.getElementById('btn-add-skill');
  btnAddSkill.addEventListener('click', () => {
    const skill = inSkill.value.trim();
    if (skill) {
      if (!cvData.skills.includes(skill)) {
        cvData.skills.push(skill);
        saveAndRender();
        renderSkillsBadgesInForm();
      }
      inSkill.value = '';
    }
  });
  inSkill.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      btnAddSkill.click();
    }
  });

  // Experiences entries additions
  document.getElementById('btn-add-experience').addEventListener('click', () => {
    const roleVal = document.getElementById('exp-role').value.trim();
    const companyVal = document.getElementById('exp-company').value.trim();
    const startVal = document.getElementById('exp-start').value.trim();
    const endVal = document.getElementById('exp-end').value.trim();
    const descVal = document.getElementById('exp-desc').value.trim();
    const achVal = document.getElementById('exp-achievements').value.trim();

    if (!roleVal || !companyVal || !startVal) {
      alert("Veuillez remplir les informations obligatoires marquées par une étoile.");
      return;
    }

    const exp = {
      id: Date.now().toString(),
      role: roleVal,
      company: companyVal,
      startDate: startVal,
      endDate: endVal || 'Présent',
      description: descVal,
      achievements: achVal
    };

    cvData.experiences.push(exp);
    saveAndRender();
    renderExperiencesListInForm();

    // Clear inputs
    document.getElementById('exp-role').value = '';
    document.getElementById('exp-company').value = '';
    document.getElementById('exp-start').value = '';
    document.getElementById('exp-end').value = '';
    document.getElementById('exp-desc').value = '';
    document.getElementById('exp-achievements').value = '';
  });

  // Educations additions
  document.getElementById('btn-add-education').addEventListener('click', () => {
    const degVal = document.getElementById('edu-degree').value.trim();
    const schVal = document.getElementById('edu-school').value.trim();
    const cityVal = document.getElementById('edu-city').value.trim();
    const startVal = document.getElementById('edu-start').value.trim();
    const endVal = document.getElementById('edu-end').value.trim();
    const descVal = document.getElementById('edu-desc').value.trim();

    if (!degVal || !schVal || !startVal) {
      alert("Veuillez remplir les rubriques obligatoires.");
      return;
    }

    const edu = {
      id: Date.now().toString(),
      degree: degVal,
      school: schVal,
      city: cityVal,
      startDate: startVal,
      endDate: endVal || 'Présent',
      description: descVal
    };

    cvData.educations.push(edu);
    saveAndRender();
    renderEducationsListInForm();

    // Clear inputs
    document.getElementById('edu-degree').value = '';
    document.getElementById('edu-school').value = '';
    document.getElementById('edu-city').value = '';
    document.getElementById('edu-start').value = '';
    document.getElementById('edu-end').value = '';
    document.getElementById('edu-desc').value = '';
  });

  // Languages additions
  document.getElementById('btn-add-lang').addEventListener('click', () => {
    const nameVal = document.getElementById('lang-name').value.trim();
    const levelVal = document.getElementById('lang-level').value;

    if (!nameVal) return;

    const lang = {
      id: Date.now().toString(),
      name: nameVal,
      level: levelVal
    };

    cvData.languages.push(lang);
    saveAndRender();
    renderLanguagesListInForm();

    document.getElementById('lang-name').value = '';
  });

  // Certifications additions
  document.getElementById('btn-add-cert').addEventListener('click', () => {
    const nameVal = document.getElementById('cert-name').value.trim();
    const issuerVal = document.getElementById('cert-issuer').value.trim();
    const yearVal = document.getElementById('cert-year').value.trim();

    if (!nameVal || !issuerVal || !yearVal) {
      alert("Veuillez renseigner les champs requis.");
      return;
    }

    const cert = {
      id: Date.now().toString(),
      name: nameVal,
      issuer: issuerVal,
      year: yearVal
    };

    cvData.certifications.push(cert);
    saveAndRender();
    renderCertificationsListInForm();

    document.getElementById('cert-name').value = '';
    document.getElementById('cert-issuer').value = '';
    document.getElementById('cert-year').value = '';
  });

  // Projects additions
  document.getElementById('btn-add-project').addEventListener('click', () => {
    const nameVal = document.getElementById('proj-name').value.trim();
    const techVal = document.getElementById('proj-tech').value.trim();
    const linkVal = document.getElementById('proj-link').value.trim();
    const descVal = document.getElementById('proj-desc').value.trim();

    if (!nameVal) {
      alert("Le titre du projet est obligatoire.");
      return;
    }

    const proj = {
      id: Date.now().toString(),
      name: nameVal,
      technologies: techVal,
      link: linkVal,
      description: descVal
    };

    cvData.projects.push(proj);
    saveAndRender();
    renderProjectsListInForm();

    document.getElementById('proj-name').value = '';
    document.getElementById('proj-tech').value = '';
    document.getElementById('proj-link').value = '';
    document.getElementById('proj-desc').value = '';
  });

  // Style Pickers theme activation
  const themesList = [
    { id: 'classic', node: document.getElementById('tpl-classic') },
    { id: 'navy', node: document.getElementById('tpl-navy') },
    { id: 'green', node: document.getElementById('tpl-green') },
    { id: 'orange', node: document.getElementById('tpl-orange') }
  ];

  themesList.forEach(item => {
    item.node.addEventListener('click', () => {
      // Toggle button states
      themesList.forEach(t => {
        t.node.className = 'btn-template-styled flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-[11px] font-bold cursor-pointer transition-all border-zinc-200 bg-white text-zinc-650';
      });

      // Highlight active design option
      item.node.className = 'btn-template-styled active flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-[11px] font-bold cursor-pointer transition-all border-zinc-800 bg-zinc-800 text-white font-black';
      currentTemplate = item.id;
      renderCVPreviewSheet();
    });
  });

  // Printer Direct Trigger
  document.getElementById('btn-print-cv').addEventListener('click', () => {
    window.print();
  });

  // Direct High-fidelity PDF Download Action
  document.getElementById('btn-export-pdf').addEventListener('click', exportPDFDirectly);

  // AI ACTIONS LOGICS
  setupAIActions();
}

// ---------------- HIGH-FIDELITY PDF EXPORT ENGINE ----------------

async function exportPDFDirectly() {
  const element = document.getElementById('cv-printable-document');
  if (!element) return;

  const btnText = document.getElementById('pdf-download-text');
  const btnIcon = document.getElementById('pdf-download-icon');
  const btnExport = document.getElementById('btn-export-pdf');

  // Disable buttons while capturing layout
  btnExport.setAttribute('disabled', 'true');
  btnText.innerText = 'Génération...';
  btnIcon.innerHTML = `<svg class="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path></svg>`;

  try {
    // Generate snapshot canvas of the print block using html2canvas
    const canvas = await html2canvas(element, {
      scale: 2.2, // Boosts resolution for perfectly crisp, non-pixelated texts
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
      windowWidth: element.scrollWidth,
      windowHeight: element.scrollHeight
    });

    const imgData = canvas.toDataURL('image/png');
    
    // Create direct high definition PDF page layout in A4 sizes
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    
    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;
    
    const imgHeight = (canvasHeight * pdfWidth) / canvasWidth;
    
    let heightLeft = imgHeight;
    let position = 0;

    // Load first A4 sheet
    pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeight, undefined, 'FAST');
    heightLeft -= pdfHeight;

    // Split automatically over multiple A4 sheets if overflowing vertically
    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeight, undefined, 'FAST');
      heightLeft -= pdfHeight;
    }

    const firstName = cvData.personalInfo.firstName || 'Candidat';
    const lastName = cvData.personalInfo.lastName || '';
    const fileOutputName = `CV_${firstName}_${lastName}.pdf`;
    pdf.save(fileOutputName);

  } catch (error) {
    console.error("PDF Export processing failed: ", error);
    alert("Un problème est survenu lors du traçage du PDF. Veuillez utiliser le raccourci d'impression standard si l'incident persiste.");
  } finally {
    btnExport.removeAttribute('disabled');
    btnText.innerText = 'Exporter en PDF';
    btnIcon.innerHTML = `<i data-lucide="download" class="w-3.5 h-3.5"></i>`;
    if (window.lucide) {
      window.lucide.createIcons();
    }
  }
}

// ---------------- AI CHANNELS BINDINGS ----------------

function setupAIActions() {
  // Description Gen
  const btnGenSummary = document.getElementById('btn-ai-gen-summary');
  btnGenSummary.addEventListener('click', async () => {
    btnGenSummary.setAttribute('disabled', 'true');
    btnGenSummary.innerHTML = `Génération...`;

    try {
      const response = await fetch('/api/cv/generate-summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: cvData.title || document.getElementById('in-title').value,
          skills: cvData.skills,
          experiences: cvData.experiences,
          educations: cvData.educations
        })
      });

      const resData = await response.json();
      if (resData && resData.summary) {
        document.getElementById('in-summary').value = resData.summary;
        cvData.summary = resData.summary;
        saveAndRender();
      } else if (resData && resData.error) {
        alert(resData.error);
      }
    } catch (e) {
      console.error(e);
      alert("Service d'intelligence artificielle momentanément injoignable.");
    } finally {
      btnGenSummary.removeAttribute('disabled');
      btnGenSummary.innerHTML = `<i data-lucide="wand-2" class="w-3 h-3"></i> Générer via l'IA`;
      if (window.lucide) window.lucide.createIcons();
    }
  });

  // Suggest skills
  const btnSuggestSkills = document.getElementById('btn-ai-suggest-skills');
  btnSuggestSkills.addEventListener('click', async () => {
    const jobTitle = cvData.title || document.getElementById('in-title').value.trim();
    if (!jobTitle) {
      alert("Saisissez d'abord votre Titre Professionnel à l'étape 3 pour obtenir des compétences adaptées.");
      return;
    }

    btnSuggestSkills.setAttribute('disabled', 'true');
    btnSuggestSkills.innerHTML = 'Analyse...';

    try {
      const response = await fetch('/api/cv/suggest-skills', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: jobTitle })
      });

      const resData = await response.json();
      if (resData && resData.skills) {
        // Overlay new proposed skills
        resData.skills.forEach(skill => {
          if (!cvData.skills.includes(skill)) {
            cvData.skills.push(skill);
          }
        });
        saveAndRender();
        renderSkillsBadgesInForm();
      }
    } catch (e) {
      console.error(e);
    } finally {
      btnSuggestSkills.removeAttribute('disabled');
      btnSuggestSkills.innerHTML = `<i data-lucide="sparkles" class="w-3 h-3"></i> Suggestions IA`;
      if (window.lucide) window.lucide.createIcons();
    }
  });

  // Audit CV Form Submit Action
  const btnRunAudit = document.getElementById('btn-run-audit');
  btnRunAudit.addEventListener('click', async () => {
    const rawText = document.getElementById('ai-raw-cv-text').value.trim();
    if (!rawText) {
      alert("Veuillez coller le texte de votre curriculum vitae existant à analyser.");
      return;
    }

    const aiError = document.getElementById('ai-dashboard-error');
    aiError.classList.add('hidden');

    btnRunAudit.setAttribute('disabled', 'true');
    btnRunAudit.innerHTML = 'Analyse & En cours de décryptage...';

    try {
      const response = await fetch('/api/cv/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: rawText })
      });

      const resData = await response.json();
      if (resData && !response.ok) {
        throw new Error(resData.error || "Une erreur s'est produite lors de l'analyse.");
      }

      // Load results in DOM
      document.getElementById('ai-audit-output-wrapper').classList.remove('hidden');

      // Score counter animations
      const targetScore = resData.score || 0;
      animateAuditScoreCircle(targetScore);

      // Render weakpoints list
      const weakList = document.getElementById('audit-weakness-list');
      weakList.innerHTML = (resData.weaknesses || []).map(w => `
        <li class="flex items-start gap-1 text-[11px] leading-relaxed">
          <span class="text-amber-500 font-bold shrink-0">•</span><span>${escapeHTML(w)}</span>
        </li>
      `).join('');

      // Render absent parts badges
      const missingContainer = document.getElementById('audit-missing-badges');
      if (resData.missingSections && resData.missingSections.length > 0) {
        missingContainer.innerHTML = resData.missingSections.map(v => `
          <span class="text-[10px] font-bold text-zinc-650 bg-zinc-100 hover:bg-zinc-200 border border-zinc-200 px-2.5 py-1 rounded-md text-center">
            ${escapeHTML(v)}
          </span>
        `).join('');
      } else {
        missingContainer.innerHTML = '<span class="text-[10px] text-zinc-400 italic">Aucune rubrique importante absente !</span>';
      }

      // Render suggestions
      const suggestList = document.getElementById('audit-suggestions-list');
      suggestList.innerHTML = (resData.improvementSuggestions || []).map(s => `
        <li class="flex items-start gap-1 pb-1 text-[11px] leading-relaxed border-b border-zinc-100 last:border-0">
          <span class="text-teal-600 font-bold shrink-0">✔</span><span>${escapeHTML(s)}</span>
        </li>
      `).join('');

      // Store successfully extracted data dynamically on matching button key
      const importedButton = document.getElementById('btn-import-audit-data');
      importedButton.onclick = () => {
        if (resData.cvData) {
          // Fill CV State
          cvData = {
            title: resData.cvData.title || cvData.title,
            summary: resData.cvData.summary || cvData.summary,
            personalInfo: {
              firstName: resData.cvData.personalInfo?.firstName || cvData.personalInfo.firstName,
              lastName: resData.cvData.personalInfo?.lastName || cvData.personalInfo.lastName,
              email: resData.cvData.personalInfo?.email || cvData.personalInfo.email,
              phone: resData.cvData.personalInfo?.phone || cvData.personalInfo.phone,
              city: resData.cvData.personalInfo?.city || cvData.personalInfo.city,
              country: resData.cvData.personalInfo?.country || cvData.personalInfo.country,
              linkedin: resData.cvData.personalInfo?.linkedin || cvData.personalInfo.linkedin,
              website: resData.cvData.personalInfo?.website || cvData.personalInfo.website,
              photoUrl: cvData.personalInfo.photoUrl // preserve photo
            },
            educations: resData.cvData.educations || [],
            experiences: resData.cvData.experiences || [],
            skills: resData.cvData.skills || [],
            languages: resData.cvData.languages || [],
            certifications: resData.cvData.certifications || [],
            projects: resData.cvData.projects || []
          };

          saveAndRender();
          syncStateToForm();

          const alertBox = document.getElementById('alert-import-success');
          alertBox.classList.remove('hidden');
          setTimeout(() => {
            alertBox.classList.add('hidden');
          }, 4500);
        }
      };

    } catch (e) {
      console.error(e);
      aiError.classList.remove('hidden');
      document.getElementById('ai-dashboard-error-text').innerText = e.message;
    } finally {
      btnRunAudit.removeAttribute('disabled');
      btnRunAudit.innerText = 'Diagnostiquer & Extraire';
    }
  });

  // Run Job Offer Match / Adaptation
  const btnRunMatch = document.getElementById('btn-run-match');
  btnRunMatch.addEventListener('click', async () => {
    const jobText = document.getElementById('ai-job-text').value.trim();
    if (!jobText) {
      alert("Veuillez d'abord coller l'offre d'emploi ou annonce de poste cible.");
      return;
    }

    const aiError = document.getElementById('ai-dashboard-error');
    aiError.classList.add('hidden');

    btnRunMatch.setAttribute('disabled', 'true');
    btnRunMatch.innerHTML = 'Vérification de l\'adéquation en cours...';

    try {
      const response = await fetch('/api/cv/optimize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cvData, jobDescription: jobText })
      });

      const resData = await response.json();
      if (resData && !response.ok) {
        throw new Error(resData.error || "Impossible d'établir une correspondance.");
      }

      document.getElementById('ai-match-output-wrapper').classList.remove('hidden');

      // Update matching score text badge
      const mScore = resData.score || 0;
      const matchBadge = document.getElementById('match-score-badge');
      matchBadge.innerText = `${mScore}%`;
      
      // Color matching score
      if (mScore >= 80) matchBadge.className = 'w-14 h-14 bg-emerald-50 border-2 border-emerald-300 rounded-full flex items-center justify-center font-black font-mono text-emerald-800 font-display text-base shadow-sm animate-pulse';
      else if (mScore >= 50) matchBadge.className = 'w-14 h-14 bg-amber-50 border-2 border-amber-300 rounded-full flex items-center justify-center font-black font-mono text-amber-700 font-display text-base shadow-sm';
      else matchBadge.className = 'w-14 h-14 bg-rose-50 border-2 border-rose-300 rounded-full flex items-center justify-center font-black font-mono text-rose-700 font-display text-base shadow-sm';

      // Render matching keywords list
      const validatedContainer = document.getElementById('match-keywords-validated');
      if (resData.matchedKeywords && resData.matchedKeywords.length > 0) {
        validatedContainer.innerHTML = resData.matchedKeywords.map(k => `
          <span class="text-[10px] font-semibold text-emerald-800 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-lg">
            ${escapeHTML(k)}
          </span>
        `).join('');
      } else {
        validatedContainer.innerHTML = '<span class="text-[10px] text-zinc-400 italic">Aucun mot-clé détecté en commun.</span>';
      }

      // Render missing keywords list
      const missingContainer = document.getElementById('match-keywords-missing');
      if (resData.missingKeywords && resData.missingKeywords.length > 0) {
        missingContainer.innerHTML = resData.missingKeywords.map(k => `
          <span class="text-[10px] font-semibold text-amber-900 bg-amber-50/70 border border-amber-100/50 px-2 py-0.5 rounded-lg">
            ${escapeHTML(k)}
          </span>
        `).join('');
      } else {
        missingContainer.innerHTML = '<span class="text-[10px] text-zinc-400 italic">Aucun mot-clé important manquant ! Excellent.</span>';
      }

      // Render gaps listed
      const gapsList = document.getElementById('match-gaps-list');
      if (resData.gaps && resData.gaps.length > 0) {
        gapsList.innerHTML = resData.gaps.map(g => `
          <li class="flex items-start gap-1 text-[11px] leading-relaxed text-zinc-700">
            <span class="text-amber-500 font-bold shrink-0">•</span><span>${escapeHTML(g)}</span>
          </li>
        `).join('');
      } else {
        gapsList.innerHTML = '<li class="text-[10px] text-zinc-400 italic list-none">Aucun écart notable relevé.</li>';
      }

      // Render suggestions
      const suggestList = document.getElementById('match-suggestions-list');
      if (resData.suggestions && resData.suggestions.length > 0) {
        suggestList.innerHTML = resData.suggestions.map(s => `
          <li class="flex items-start gap-1 pb-1 text-[11px] leading-relaxed border-b border-zinc-100 last:border-0">
            <span class="text-teal-600 font-bold shrink-0">✔</span><span>${escapeHTML(s)}</span>
          </li>
        `).join('');
      } else {
        suggestList.innerHTML = '<li class="text-[10px] text-zinc-400 italic list-none">Aucune suggestion additionnelle pour l\'instant.</li>';
      }

    } catch (e) {
      console.error(e);
      aiError.classList.remove('hidden');
      document.getElementById('ai-dashboard-error-text').innerText = e.message;
    } finally {
      btnRunMatch.removeAttribute('disabled');
      btnRunMatch.innerText = "Analyser l'adéquation";
    }
  });
}

function animateAuditScoreCircle(target) {
  const scoreTxt = document.getElementById('audit-score-text');
  const circle = document.getElementById('audit-score-circle');
  let currentVal = 0;

  const totalDash = 175.9; // 2 * pi * r (r=28)
  
  const timer = setInterval(() => {
    if (currentVal >= target) {
      clearInterval(timer);
    } else {
      currentVal++;
      scoreTxt.innerText = `${currentVal}/100`;
      
      const offset = totalDash - (currentVal / 100) * totalDash;
      circle.style.strokeDashoffset = offset;
    }
  }, 12);
}

// ---------------- ESCAPE HTML UTILS ----------------

function escapeHTML(str) {
  if (!str) return '';
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
