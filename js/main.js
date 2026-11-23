// ============================================================
// UTILITAIRES
// ============================================================
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const normaliser = s => s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

function formaterDateFR(dateISO) {
    const [annee, mois, jour] = dateISO.split('-');
    const dateObj = new Date(Number(annee), Number(mois) - 1, Number(jour));

    return new Intl.DateTimeFormat('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    }).format(dateObj);
}

// ============================================================
// SYNCHRONISATION DES LIBELLÉS DES FILTRES
// ============================================================
document.querySelectorAll('.filtre').forEach(bloc => {
    const f1 = bloc.querySelector('.filter1');
    const f2 = bloc.querySelector('.filter2');
    if (!f1 || !f2) return;

    f1.addEventListener('change', () => {
        if (f1.selectedIndex === 0) {
            f2.options[0].textContent = 'Les plus récents';
            f2.options[1].textContent = 'Les plus anciens';
        } else {
            f2.options[0].textContent = 'Croissant';
            f2.options[1].textContent = 'Décroissant';
        }
    });
});

// ============================================================
// DONNÉES — ARTICLES DE VEILLE INFORMATIONNELLE
// ============================================================
const articles = [
    {
        date: '2026-10-28',
        titre: 'What happens when the agent is long gone, but its access key lives',
        theme: 'Sécurité Cloud & Automatisation (IAM)',
        resume: 'Analyse des risques liés aux clés d’API et identifiants temporaires créés par des agents IA autonomes qui restent actifs dans l’infrastructure après la fin de leur tâche.',
        interet: 'En tant que futur administrateur SISR, l’automatisation doit respecter le principe du moindre privilège : cet article souligne l’importance de la rotation et de la révocation automatique des secrets.',
        url: 'https://thenewstack.io/governing-ai-agent-credentials/'
    },
    {
        date: '2026-10-27',
        titre: 'Introducing Terraform Developer Portal (Public Preview)',
        theme: 'Infrastructure as Code (IaC) & Standardisation',
        resume: 'Présentation du portail développeur de Terraform permettant aux équipes infrastructure de mettre à disposition des modules pré-configurés et sécurisés en libre-service.',
        interet: 'Illustre un cas d’usage concret de l’IaC en entreprise : encadrer les déploiements pour garantir que chaque ressource créée respecte les standards de sécurité réseau et système.',
        url: 'https://www.hashicorp.com/blog/introducing-terraform-developer-portal'
    },
    {
        date: '2026-10-26',
        titre: 'Remote DevOps Engineer II, Cloud Platform at Upstart',
        theme: 'Marché de l’emploi & Compétences SISR / DevOps',
        resume: 'Fiche de poste détaillée mettant en évidence les compétences techniques recherchées sur le terrain : Terraform, orchestration de conteneurs, CI/CD et supervision cloud.',
        interet: 'Permet de confronter ma formation BTS SIO aux attentes réelles des recruteurs et d’orienter mes apprentissages techniques vers les outils les plus demandés.',
        url: 'https://weworkremotely.com/remote-jobs/upstart-devops-engineer-ii-cloud-platform'
    },
    {
        date: '2026-10-20',
        titre: 'Remote IT Job Posts: What Engineers Read First',
        theme: 'Environnement professionnel & Culture IT',
        resume: 'Décryptage des éléments techniques et organisationnels que les profils systèmes et réseaux analysent en priorité dans une offre d’emploi (stack technique, méthodologies, autonomie).',
        interet: 'Aide à mieux comprendre les codes et le vocabulaire du recrutement informatique afin de préparer efficacement ma poursuite d’études ou mon entrée sur le marché du travail.',
        url: 'https://weworkremotely.com/blog/remote-it-job-posts-what-engineers-read-first'
    },
    {
        date: '2026-10-08',
        titre: 'The API tax: Why AI agents stall without infrastructure context',
        theme: 'Intelligence Artificielle & Exploitation IT',
        resume: 'Explique pourquoi les assistants IA peinent à automatiser des tâches complexes lorsqu’ils n’ont pas une vision claire de la topologie réseau et des dépendances entre services.',
        interet: 'Montre que l’IA est un accélérateur pour le technicien, mais qu’elle ne remplace pas la maîtrise de l’architecture globale ni l’analyse humaine lors d’un diagnostic.',
        url: 'https://thenewstack.io/autonomous-cloud-context-layer/'
    },
    {
        date: '2026-10-05',
        titre: 'Building zero trust networks with Red Hat Ansible',
        theme: 'Cybersécurité Réseau & Ansible',
        resume: 'Guide pratique sur l’automatisation des politiques de sécurité « Zero Trust » (micro-segmentation, règles de pare-feu, contrôle d’accès) à l’aide de playbooks Ansible.',
        interet: 'Relie directement deux compétences majeures de l’option SISR : la sécurisation des flux réseau et l’automatisation de la configuration des équipements et serveurs.',
        url: 'https://www.redhat.com/en/blog/building-zero-trust-networks-red-hat-ansible'
    },
    {
        date: '2026-09-08',
        titre: '6 Benefits of Sandbox Environments - Docker',
        theme: 'Conteneurisation & Environnements de test',
        resume: 'Présentation des avantages des environnements isolés (« sandboxes ») sous Docker pour tester des scripts, des services ou des correctifs sans risquer d’altérer la production.',
        interet: 'La conteneurisation complète parfaitement l’IaC en permettant de monter et détruire rapidement des maquettes reproductibles pour mes travaux pratiques et projets.',
        url: 'https://www.docker.com/blog/benefits-of-sandbox-environments/'
    },
    {
        date: '2026-09-03',
        titre: 'Kubernetes v1.37: DRA Updates',
        theme: 'Orchestration & Gestion des ressources',
        resume: 'Focus sur les améliorations du Dynamic Resource Allocation (DRA) dans Kubernetes 1.37, permettant une allocation matérielle (GPU, interfaces réseau) plus fine aux conteneurs.',
        interet: 'Permet de suivre l’évolution des orchestrateurs modernes et de comprendre comment les ressources matérielles physiques sont abstraites et distribuées dynamiquement.',
        url: 'https://kubernetes.io/blog/2026/09/03/kubernetes-v1-37-dra-updates/'
    },
    {
        date: '2026-01-22',
        titre: 'The 2026 Linux security threat landscape and strategic defense pillars',
        theme: 'Administration Linux & Cybersécurité',
        resume: 'Panorama des menaces ciblant les serveurs Linux en 2026 et présentation des piliers de défense : durcissement système, gestion des identités et automatisation des correctifs.',
        interet: 'Linux étant le socle de la majorité des serveurs d’infrastructure et des outils DevOps, cette veille est indispensable pour assurer le maintien en condition de sécurité (MCS).',
        url: 'https://www.hashicorp.com/blog/the-linux-security-threat-landscape-and-strategic-defense-pillars'
    },
    {
        date: '2025-11-25',
        titre: 'Kubernetes Configuration Good Practices',
        theme: 'Bonnes pratiques IaC & Configuration déclarative',
        resume: 'Recueil des bonnes pratiques officielles pour structurer, versionner et sécuriser les fichiers de configuration déclaratifs (YAML) sur un cluster Kubernetes.',
        interet: 'Ces principes de rigueur (code lisible, versionné sur Git, sans paramètres sensibles en dur) sont transposables à l’ensemble des outils d’Infrastructure as Code.',
        url: 'https://kubernetes.io/blog/2025/11/25/configuration-good-practices/'
    }
];

const tri_asc = (liste, cle) => liste.sort((a, b) => a[cle].localeCompare(b[cle]));
const tri_desc = (liste, cle) => liste.sort((a, b) => b[cle].localeCompare(a[cle]));

function gestion_tri(liste, f1, f2) {
    if (f1.selectedIndex === 0) {
        f2.selectedIndex === 0 ? tri_desc(liste, 'date') : tri_asc(liste, 'date');
    } else {
        f2.selectedIndex === 0 ? tri_asc(liste, 'titre') : tri_desc(liste, 'titre');
    }
}

// ============================================================
// MODALE / OVERLAY D'ARTICLE
// ============================================================
const modalOverlay = document.getElementById('article-modal');
const modalTitle = document.getElementById('modal-title');
const modalDate = document.getElementById('modal-date');
const modalTheme = document.getElementById('modal-theme');
const modalResume = document.getElementById('modal-resume');
const modalInteret = document.getElementById('modal-interet');
const modalLink = document.getElementById('modal-link');
const modalClose = document.getElementById('modal-close');
const modalCloseBtn = document.getElementById('modal-close-btn');

let dernierFocus = null;

function ouvrirModalArticle(article) {
    if (!modalOverlay) return;

    dernierFocus = document.activeElement;

    modalTitle.textContent = article.titre;
    modalDate.setAttribute('datetime', article.date);
    modalDate.textContent = formaterDateFR(article.date);
    modalTheme.textContent = article.theme;
    modalResume.textContent = article.resume;
    modalInteret.textContent = article.interet;
    modalLink.href = article.url;

    modalOverlay.hidden = false;
    requestAnimationFrame(() => {
        modalOverlay.classList.add('is-open');
    });
    document.body.style.overflow = 'hidden';
    if (modalClose) modalClose.focus();
}

function fermerModalArticle() {
    if (!modalOverlay || modalOverlay.hidden) return;

    modalOverlay.classList.remove('is-open');
    document.body.style.overflow = '';

    setTimeout(() => {
        modalOverlay.hidden = true;
        if (dernierFocus) dernierFocus.focus();
    }, reduceMotion ? 0 : 280);
}

if (modalClose) modalClose.addEventListener('click', fermerModalArticle);
if (modalCloseBtn) modalCloseBtn.addEventListener('click', fermerModalArticle);
if (modalOverlay) {
    modalOverlay.addEventListener('click', e => {
        if (e.target === modalOverlay) fermerModalArticle();
    });
}
document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && modalOverlay && !modalOverlay.hidden) {
        fermerModalArticle();
    }
});

// ============================================================
// VEILLE : recherche + tri + affichage
// ============================================================
const btnArticle = document.getElementById('btn_article');
const srchVeille = document.getElementById('srchbar-veille');
const filter1V = document.getElementById('filter1-veille');
const filter2V = document.getElementById('filter2-veille');
const artContainerV = document.getElementById('art_container-veille');

function afficherArticles(animer) {
    if (!artContainerV || !filter1V || !filter2V) return;

    const q = normaliser(srchVeille ? srchVeille.value.trim() : '');
    const liste = articles.filter(a => {
        const dateFR = formaterDateFR(a.date);
        return normaliser(`${a.titre} ${a.date} ${dateFR} ${a.theme}`).includes(q);
    });
    gestion_tri(liste, filter1V, filter2V);

    artContainerV.innerHTML = '';

    if (liste.length === 0) {
        const vide = document.createElement('p');
        vide.className = 'no-result';
        vide.textContent = 'Aucun article ne correspond à votre recherche.';
        artContainerV.appendChild(vide);
        return;
    }

    liste.forEach(a => {
        const bloc = document.createElement('div');
        bloc.className = 'article-item';
        bloc.setAttribute('role', 'button');
        bloc.setAttribute('tabindex', '0');
        bloc.setAttribute('aria-label', `Voir le récapitulatif de l'article : ${a.titre}`);

        const info = document.createElement('div');
        info.className = 'article-item-title';
        info.innerHTML = `<span class="article-date">${formaterDateFR(a.date)}</span> ${a.titre}`;

        const hint = document.createElement('span');
        hint.className = 'article-item-hint';
        hint.textContent = 'Voir la fiche →';

        bloc.appendChild(info);
        bloc.appendChild(hint);

        bloc.addEventListener('click', () => ouvrirModalArticle(a));
        bloc.addEventListener('keydown', e => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                ouvrirModalArticle(a);
            }
        });

        artContainerV.appendChild(bloc);
    });

    if (animer && !reduceMotion && typeof gsap !== 'undefined') {
        gsap.from('.articles-list > .article-item', {
            opacity: 0, x: -20, duration: 0.5,
            ease: 'power2.out', stagger: 0.08, clearProps: 'all'
        });
    }
}

if (btnArticle) btnArticle.addEventListener('click', () => afficherArticles(true));
if (srchVeille) {
    srchVeille.addEventListener('keydown', e => {
        if (e.key === 'Enter') afficherArticles(true);
    });
}
afficherArticles(false);

// ============================================================
// COMPÉTENCES : recherche instantanée + filtre par catégorie
// ============================================================
(function initCompetences() {
    const conteneur = document.getElementById('container-competences');
    const champ = document.getElementById('srchbar-competences');
    const boutons = Array.from(document.querySelectorAll('#skills-filters .filter-pill'));
    const compteur = document.getElementById('skills-count');
    if (!conteneur || boutons.length === 0) return;

    const cartes = Array.from(conteneur.querySelectorAll('.skill-card'));
    let categorieActive = 'all';

    const vide = document.createElement('p');
    vide.className = 'no-result';
    vide.textContent = 'Aucune compétence ne correspond à votre recherche.';
    vide.hidden = true;
    conteneur.appendChild(vide);

    function filtrerCompetences() {
        const q = normaliser(champ ? champ.value.trim() : '');
        let nbVisibles = 0;

        cartes.forEach(carte => {
            const cat = carte.dataset.category || '';
            const matchCat = categorieActive === 'all' || cat === categorieActive;
            const matchTexte = normaliser(carte.textContent).includes(q);
            const visible = matchCat && matchTexte;

            carte.hidden = !visible;
            if (visible) nbVisibles++;
        });

        vide.hidden = nbVisibles > 0;
        if (compteur) {
            compteur.textContent = nbVisibles > 1
                ? `${nbVisibles} compétences`
                : `${nbVisibles} compétence`;
        }
    }

    boutons.forEach(btn => {
        btn.addEventListener('click', () => {
            categorieActive = btn.dataset.cat || 'all';
            boutons.forEach(b => {
                const actif = b === btn;
                b.classList.toggle('is-active', actif);
                b.setAttribute('aria-pressed', String(actif));
            });
            filtrerCompetences();
        });
    });

    if (champ) {
        champ.addEventListener('input', filtrerCompetences);
        champ.addEventListener('keydown', e => {
            if (e.key === 'Enter') e.preventDefault();
        });
    }

    filtrerCompetences();
})();

// ============================================================
// RÉALISATIONS / PROJETS : recherche + tri
// ============================================================
(function initProjets() {
    const conteneur = document.getElementById('art_container-projets');
    const btn = document.querySelector('.btn-filtre[data-target="projets"]');
    const champ = document.getElementById('srchbar-projets');
    const f1 = document.getElementById('filter1-projets');
    const f2 = document.getElementById('filter2-projets');
    if (!conteneur || !btn || !f1 || !f2) return;

    const cartes = Array.from(conteneur.querySelectorAll('.box'));
    const ordreInitial = new Map(cartes.map((c, i) => [c, i]));

    const vide = document.createElement('p');
    vide.className = 'no-result';
    vide.textContent = 'Aucune réalisation ne correspond à votre recherche.';
    vide.hidden = true;
    conteneur.appendChild(vide);

    function appliquer() {
        const q = normaliser(champ ? champ.value.trim() : '');
        const visibles = cartes.filter(c => normaliser(c.textContent).includes(q));

        cartes.forEach(c => { c.hidden = !visibles.includes(c); });
        vide.hidden = visibles.length > 0;

        const titre = c => c.querySelector('h3').textContent;
        if (f1.selectedIndex === 0) {
            visibles.sort((a, b) => ordreInitial.get(a) - ordreInitial.get(b));
            if (f2.selectedIndex === 1) visibles.reverse();
        } else {
            visibles.sort((a, b) => titre(a).localeCompare(titre(b), 'fr'));
            if (f2.selectedIndex === 1) visibles.reverse();
        }
        visibles.forEach(c => conteneur.insertBefore(c, vide));
    }

    btn.addEventListener('click', appliquer);
    if (champ) champ.addEventListener('keydown', e => { if (e.key === 'Enter') appliquer(); });
})();

// ============================================================
// TEXTE ROTATIF DU HERO
// ============================================================
(function initRotatingText() {
    const el = document.getElementById('rotating-text');
    if (!el || reduceMotion) return;

    let mots;
    try { mots = JSON.parse(el.dataset.words); } catch { return; }
    if (!Array.isArray(mots) || mots.length < 2) return;

    let i = 0;
    setInterval(() => {
        el.classList.add('is-out');
        setTimeout(() => {
            i = (i + 1) % mots.length;
            el.textContent = mots[i];
            el.classList.remove('is-out');
            el.classList.add('is-in');
            requestAnimationFrame(() =>
                requestAnimationFrame(() => el.classList.remove('is-in'))
            );
        }, 350);
    }, 2800);
})();

// ============================================================
// ANIMATIONS GSAP
// ============================================================
window.addEventListener('load', () => {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
        return;
    }
    if (reduceMotion) return;

    gsap.registerPlugin(ScrollTrigger);

    const heroTl = gsap.timeline({ delay: 0.15, defaults: { ease: 'power3.out' } });

    if (document.querySelector('.badge')) {
        heroTl.from('.badge', { opacity: 0, y: 20, duration: 0.8 });
    }
    if (document.querySelector('#accueil h1')) {
        heroTl.from('#accueil h1', { opacity: 0, y: 40, duration: 1 }, '-=0.5');
    }
    if (document.querySelector('.hero-rotate')) {
        heroTl.from('.hero-rotate', { opacity: 0, y: 20, duration: 0.8 }, '-=0.7');
    }
    if (document.querySelector('#infoSup')) {
        heroTl.from('#infoSup', { opacity: 0, y: 20, duration: 0.8, clearProps: 'all' }, '-=0.6');
    }

    document.querySelectorAll('section h2').forEach(h => {
        gsap.from(h, {
            opacity: 0, x: -40, duration: 1, ease: 'power3.out',
            scrollTrigger: { trigger: h, start: 'top 90%', once: true },
            clearProps: 'all'
        });
    });

    document.querySelectorAll('.blur_div').forEach((el, i) => {
        gsap.from(el, {
            opacity: 0, y: 50, duration: 1, ease: 'power3.out', delay: i * 0.15,
            scrollTrigger: { trigger: el, start: 'top 85%', once: true },
            clearProps: 'all'
        });
    });

    ScrollTrigger.batch('.box, .exp-card', {
        start: 'top 85%',
        onEnter: batch => gsap.from(batch, {
            opacity: 0, y: 50, duration: 0.8, ease: 'power3.out',
            stagger: 0.1, clearProps: 'all'
        }),
        once: true
    });

    ScrollTrigger.batch('.desc_veille', {
        start: 'top 85%',
        onEnter: batch => gsap.from(batch, {
            opacity: 0, y: 40, duration: 0.8, ease: 'power3.out',
            stagger: 0.15, clearProps: 'all'
        }),
        once: true
    });

    document.querySelectorAll('.competences-doc-box, .skills-controls, .veille-intro, .filtre, .articles-list').forEach(el => {
        gsap.from(el, {
            opacity: 0, y: 30, duration: 0.8, ease: 'power3.out',
            scrollTrigger: { trigger: el, start: 'top 90%', once: true },
            clearProps: 'all'
        });
    });

    ScrollTrigger.batch('#contact a', {
        start: 'top 90%',
        onEnter: batch => gsap.from(batch, {
            opacity: 0, y: 20, duration: 0.6, ease: 'back.out(1.2)',
            stagger: 0.1, clearProps: 'all'
        }),
        once: true
    });
});