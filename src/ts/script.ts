let boutonPrecedent: HTMLInputElement | null = null;
let boutonSuivant: HTMLInputElement | null = null;
let boutonSoumettre: HTMLInputElement | null = null;
let etape: number = 0;
let fieldsets: NodeListOf<HTMLElement>;
let donFrequent: HTMLInputElement | null = null;
let labelFrequence: HTMLElement | null = null;
let selectFrequence: HTMLSelectElement | null = null;
let etapeActuelle: HTMLElement | null = null;


//Fonctionnement des boutons
function afficherEtape(index: number): void {
    cacherFieldsets();
    
    if (index >= 0 && index < fieldsets.length) {
        fieldsets[index].classList.remove("cacher");
    }

    if (index === 0) {
        boutonPrecedent?.classList.add("cacher");
        boutonSuivant?.classList.remove("cacher");
        boutonSoumettre?.classList.add("cacher");
    } else if (index < fieldsets.length - 1) {
        boutonPrecedent?.classList.remove("cacher");
        boutonSuivant?.classList.remove("cacher");
        boutonSoumettre?.classList.add("cacher");
    } else {
        boutonPrecedent?.classList.remove("cacher");
        boutonSuivant?.classList.add("cacher");
        boutonSoumettre?.classList.remove("cacher");
    }
}

function cacherFieldsets(): void {
    fieldsets.forEach((fieldset) => {
        fieldset.classList.add("cacher");
    });
}

function navigerSuivant(): void {
    if (etape < fieldsets.length - 1) {
        etape++;
        afficherEtape(etape);
    }
}


function navigerPrecedent(): void {
    if (etape > 0) {
        etape--;
        afficherEtape(etape);
    }
}

//Faire apparaitre fréquence
function changerDonFrequent(): void {
    if (donFrequent?.checked) {
        labelFrequence?.classList.remove("cacher");
        selectFrequence?.classList.remove("cacher");
    } else {
        labelFrequence?.classList.add("cacher");
        selectFrequence?.classList.add("cacher");
    }
}


function initialiser(): void {
    const formulaire = document.querySelector("form") as HTMLFormElement;
    if (formulaire) {
        formulaire.noValidate = true;
    }

    fieldsets = document.querySelectorAll("fieldset");
    boutonPrecedent = document.getElementById("precedent") as HTMLInputElement;
    boutonSuivant = document.getElementById("suivant") as HTMLInputElement;
    boutonSoumettre = document.getElementById("soumettre") as HTMLInputElement;
    donFrequent = document.getElementById("donFrequent") as HTMLInputElement;


    labelFrequence = document.querySelector("label[for='frequence']") as HTMLElement;
    selectFrequence = document.getElementById("frequence") as HTMLSelectElement;
    const donUnique = document.getElementById("donUnique") as HTMLInputElement;

    
    labelFrequence?.classList.add("cacher");
    selectFrequence?.classList.add("cacher");

    
    donFrequent?.addEventListener("change", changerDonFrequent);
    donUnique?.addEventListener("change", changerDonFrequent);
    changerDonFrequent(); 


    fieldsets.forEach((f) => f.classList.add("cacher"));
    boutonSoumettre?.classList.add("cacher");
    boutonPrecedent?.classList.add("cacher");
    

    boutonPrecedent?.addEventListener("click", navigerPrecedent);
    boutonSuivant?.addEventListener("click", navigerSuivant);

    afficherEtape(etape);
}

document.addEventListener("DOMContentLoaded", initialiser);


//LORSUQE AUTRE MONTANT EST SELECTIONNER, LE PRIX COCHER EN BOUTON RADIO DOIT ETRE ENLEVER
