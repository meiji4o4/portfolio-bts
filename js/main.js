// ============================================================
// UTILITAIRES
// ============================================================
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const normaliser = s => s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

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
// DONNÉES — ARTICLES DE VEILLE (100% VÉRIFIÉS 2025-2026)
// ============================================================
const articles = [
    {
        date: '2026-10-28',
        titre: 'What happens when the agent is long gone, but its access key lives',
        url: 'https://thenewstack.io/governing-ai-agent-credentials/'
    },
    {
        date: '2026-10-27',
        titre: 'Introducing Terraform Developer Portal (Public Preview)',
        url: 'https://www.hashicorp.com/blog/introducing-terraform-developer-portal'
    },
    {
        date: '2026-10-26',
        titre: 'Remote DevOps Engineer II, Cloud Platform at Upstart',
        url: 'https://weworkremotely.com/remote-jobs/upstart-devops-engineer-ii-cloud-platform'
    },
    {
        date: '2026-10-20',
        titre: 'Remote IT Job Posts: What Engineers Read First',
        url: 'https://weworkremotely.com/blog/remote-it-job-posts-what-engineers-read-first'
    },
    {
        date: '2026-10-08',
        titre: 'The API tax: Why AI agents stall without infrastructure context',
        url: 'https://thenewstack.io/autonomous-cloud-context-layer/'
    },
    {
        date: '2026-10-05',
        titre: 'Building zero trust networks with Red Hat Ansible',
        url: 'https://www.redhat.com/en/blog/building-zero-trust-networks-red-hat-ansible'
    },
    {
        date: '2026-09-08',
        titre: '6 Benefits of Sandbox Environments - Docker',
        url: 'https://www.docker.com/blog/benefits-of-sandbox-environments/'
    },
    {
        date: '2026-09-03',
        titre: 'Kubernetes v1.37: DRA Updates',
        url: 'https://kubernetes.io/blog/2026/09/03/kubernetes-v1-37-dra-updates/'
    },
    {
        date: '2026-01-22',
        titre: 'The 2026 Linux security threat landscape and strategic defense pillars',
        url: 'https://www.hashicorp.com/blog/the-linux-security-threat-landscape-and-strategic-defense-pillars'
    },
    {
        date: '2025-11-25',
        titre: 'Kubernetes Configuration Good Practices',
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
    const liste = articles.filter(a => normaliser(a.titre + ' ' + a.date).includes(q));
    gestion_tri(liste, filter1V, filter2V);

    artContainerV.innerHTML = '';

    if (liste.length === 0) {
        const vide = document.createElement('p');
        vide.className = 'no-result';
        vide.style.textAlign = 'center';
        vide.style.width = '100%';
        vide.textContent = 'Aucun article ne correspond à votre recherche.';
        artContainerV.appendChild(vide);
        return;
    }

    liste.forEach(a => {
        const bloc = document.createElement('div');
        const lien = document.createElement('a');
        lien.href = a.url;
        lien.target = '_blank';
        lien.rel = 'noopener noreferrer';
        lien.innerHTML = `<span style="color: var(--accent); margin-right: 10px; font-size: 0.85em;">${a.date}</span> ${a.titre}`;
        bloc.appendChild(lien);
        artContainerV.appendChild(bloc);
    });

    if (animer && !reduceMotion && typeof gsap !== 'undefined') {
        gsap.from('.articles-list > div', {
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
// PROJETS : recherche + tri
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
    vide.style.textAlign = 'center';
    vide.style.width = '100%';
    vide.textContent = 'Aucun projet ne correspond à votre recherche.';
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
            stagger: 0.15, clearProps: 'all'
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

    document.querySelectorAll('.filtre, .articles-list-container').forEach(el => {
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