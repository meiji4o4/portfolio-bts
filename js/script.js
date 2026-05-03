srchbar = document.getElementById('srchbar');
filter1 = document.getElementById('filter1');
filter2 = document.getElementById('filter2');
btn_article = document.getElementById('btn_article');
art_container = document.getElementById('art_container'); 

filter1.addEventListener('change', () => {
    if (filter1.selectedIndex === 0){
        filter2.options[0].textContent = "Les plus récents";
        filter2.options[1].textContent = "Les plus anciens";
    }
    else {
        filter2.options[0].textContent = "Croissant";
        filter2.options[1].textContent = "Décroissant";
    }
    
});



const articles = [

    {
        date : "2026-03-15",
        titre : "Amazon EKS Auto Mode wants to end Kubernetes toil — one node at a time",
        source : 1,
        url : "https://thenewstack.io/eks-auto-mode-kubernetes/",


    },

    {
        date : "2026-04-30",
        titre : "Box automatise à l'IA les workflows métiers avec Automate",
        source : 3,
        url : "https://www.lemondeinformatique.fr/actualites/lire-nvidia-lance-son-modele-multimodal-nemotron-3-nano-omni-100056.html",


    },
    
];

function tri_asc(liste, str_propri) {
    liste.sort((a, b) => a[str_propri].localeCompare(b[str_propri]));
}


function tri_desc(liste, str_propri) {
    liste.sort((a, b) => b[str_propri].localeCompare(a[str_propri]));
}


function gestion_tri(f1, f2){
    if (f1.selectedIndex === 0){
        if (f2.selectedIndex === 0){
            tri_desc(articles, "date");
        }
        else{
            tri_asc(articles, "date");
        }
    }
    else {
        if (f2.selectedIndex === 0){
            tri_asc(articles, "titre"); 
        }
        else {
            tri_desc(articles, "titre");
        }
    }
}



btn_article.addEventListener ('click', () => {
    gestion_tri(filter1, filter2);
    const bloc = document.createElement('div');
    const texte= document.createElement('p');
    texte.textContent = articles[0].date
    art_container.appendChild(bloc);
    bloc.appendChild(texte);
});




