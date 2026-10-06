// ============================================================
// UTILITAIRES
// ============================================================
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Minuscules + suppression des accents (recherche tolérante)
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
// DONNÉES — ARTICLES DE VEILLE
// ============================================================
const articles = [
    {
        date: '2026-03-15',
        titre: 'Amazon EKS Auto Mode wants to end Kubernetes toil — one node at a time',
        source: 1,
        url: 'https://thenewstack.io/eks-auto-mode-kubernetes/'
    },
    {
        date: '2026-04-30',
        titre: "Box automatise à l'IA les workflows métiers avec Automate",
        source: 3,
        // ⚠ Cette URL semble pointer vers un autre article (Nvidia Nemotron) : à vérifier
        url: 'https://www.lemondeinformatique.fr/actualites/lire-nvidia-lance-son-modele-multimodal-nemotron-3-nano-omni-100056.html'
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
        lien.textContent = `${a.date} — ${a.titre}`;
        bloc.appendChild(lien);
        artContainerV.appendChild(bloc);
    });

    if (animer && !reduceMotion && typeof gsap !== 'undefined') {
        gsap.from('#art_container-veille > div', {
            opacity: 0, x: -40, duration: 0.6,
            ease: 'power3.out', stagger: 0.1, clearProps: 'all'
        });
    }
}

if (btnArticle) btnArticle.addEventListener('click', () => afficherArticles(true));
if (srchVeille) {
    srchVeille.addEventListener('keydown', e => {
        if (e.key === 'Enter') afficherArticles(true);
    });
}
// Affichage initial (sans animation)
afficherArticles(false);

// ============================================================
// PROJETS : recherche + tri des cartes existantes
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
            // Date : l'ordre du HTML = du plus récent au plus ancien
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
// TRAILING LIGHT SUR LES CARTES
// ============================================================
document.querySelectorAll('.box').forEach(box => {
    box.addEventListener('mousemove', e => {
        const r = box.getBoundingClientRect();
        box.style.setProperty('--mx', (e.clientX - r.left) + 'px');
        box.style.setProperty('--my', (e.clientY - r.top) + 'px');
    });
});

// ============================================================
// ANIMATIONS GSAP
// ============================================================
window.addEventListener('load', () => {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
        console.warn('GSAP non chargé — animations désactivées');
        return;
    }
    if (reduceMotion) return;

    gsap.registerPlugin(ScrollTrigger);

    // 1. HERO
    const heroTl = gsap.timeline({ delay: 0.15, defaults: { ease: 'power3.out' } });

    if (document.querySelector('.badge')) {
        heroTl.from('.badge', {
            opacity: 0, y: 30, scale: 0.85,
            duration: 0.9, ease: 'back.out(1.6)'
        });
    }
    if (document.querySelector('#accueil h1')) {
        heroTl.from('#accueil h1', {
            opacity: 0, y: 70, duration: 1.1, ease: 'power4.out'
        }, '-=0.5');
    }
    if (document.querySelector('#accueil h2')) {
        heroTl.from('#accueil h2', {
            opacity: 0, y: 50, duration: 1.0, ease: 'power4.out'
        }, '-=0.8');
    }
    if (document.querySelector('.hero-rotate')) {
        heroTl.from('.hero-rotate', {
            opacity: 0, y: 30, duration: 0.8, ease: 'power3.out'
        }, '-=0.7');
    }
    if (document.querySelector('#infoSup')) {
        heroTl.from('#infoSup > *', {
            opacity: 0, y: 30, duration: 0.7,
            stagger: 0.1, ease: 'power3.out'
        }, '-=0.6');
    }
    if (document.querySelector('.scroll-indicator')) {
        heroTl.from('.scroll-indicator', {
            opacity: 0, y: -20, duration: 0.6
        }, '-=0.3');
    }

    // 2. Titres de section
    document.querySelectorAll('#projets h2, #competences h2, #stages h2, #veille h2, #contact h2')
        .forEach(h => {
            gsap.from(h, {
                opacity: 0, x: -60, duration: 1, ease: 'power3.out',
                scrollTrigger: { trigger: h, start: 'top 90%', once: true },
                clearProps: 'all'
            });
        });

    // 3. Blocs À propos
    document.querySelectorAll('.blur_div').forEach((el, i) => {
        gsap.from(el, {
            opacity: 0, y: 80, scale: 0.96,
            duration: 1.1, ease: 'power3.out', delay: i * 0.1,
            scrollTrigger: { trigger: el, start: 'top 88%', once: true },
            clearProps: 'all'
        });
    });

    // 4. Cartes
    ScrollTrigger.batch('.grid .box', {
        start: 'top 88%',
        onEnter: batch => gsap.from(batch, {
            opacity: 0, y: 80, rotation: 3, scale: 0.9,
            duration: 1, ease: 'power3.out',
            stagger: 0.15, clearProps: 'all'
        }),
        once: true
    });

    // 5. Veille
    ScrollTrigger.batch('.desc_veille', {
        start: 'top 88%',
        onEnter: batch => gsap.from(batch, {
            opacity: 0, y: 70, x: 30,
            duration: 1.1, ease: 'power3.out',
            stagger: 0.18, clearProps: 'all'
        }),
        once: true
    });

    // 6. Stage
    if (document.querySelector('#exp1')) {
        gsap.from('#exp1', {
            opacity: 0, x: -80, duration: 1.2, ease: 'power3.out',
            scrollTrigger: { trigger: '#exp1', start: 'top 85%', once: true },
            clearProps: 'all'
        });
    }

    // 7. Filtres + articles
    document.querySelectorAll('.filtre, #articles').forEach(el => {
        gsap.from(el, {
            opacity: 0, y: 50, duration: 1, ease: 'power3.out',
            scrollTrigger: { trigger: el, start: 'top 90%', once: true },
            clearProps: 'all'
        });
    });

    // 8. Contacts
    ScrollTrigger.batch('#contact .contact', {
        start: 'top 90%',
        onEnter: batch => gsap.from(batch, {
            opacity: 0, y: 40, scale: 0.9,
            duration: 0.8, ease: 'back.out(1.4)',
            stagger: 0.15, clearProps: 'all'
        }),
        once: true
    });

    // 9. Parallaxe des orbes
    const parallaxe = { start: 'top top', end: 'bottom bottom', scrub: 1.2 };
    gsap.to('.orb-1', { y: 140,  ease: 'none', scrollTrigger: { trigger: 'body', ...parallaxe } });
    gsap.to('.orb-2', { y: -180, ease: 'none', scrollTrigger: { trigger: 'body', ...parallaxe } });
    gsap.to('.orb-3', { y: 100,  ease: 'none', scrollTrigger: { trigger: 'body', ...parallaxe } });
});