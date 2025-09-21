"use strict";
let boutonPrecedent = null;
let boutonSuivant = null;
let boutonSoumettre = null;
let etape = 0;
let fieldsets;
let donFrequent = null;
let labelFrequence = null;
let selectFrequence = null;
let etapeActuelle = null;
//Fonctionnement des boutons
function afficherEtape(index) {
    cacherFieldsets();
    if (index >= 0 && index < fieldsets.length) {
        fieldsets[index].classList.remove("cacher");
    }
    if (index === 0) {
        boutonPrecedent?.classList.add("cacher");
        boutonSuivant?.classList.remove("cacher");
        boutonSoumettre?.classList.add("cacher");
    }
    else if (index < fieldsets.length - 1) {
        boutonPrecedent?.classList.remove("cacher");
        boutonSuivant?.classList.remove("cacher");
        boutonSoumettre?.classList.add("cacher");
    }
    else {
        boutonPrecedent?.classList.remove("cacher");
        boutonSuivant?.classList.add("cacher");
        boutonSoumettre?.classList.remove("cacher");
    }
}
function cacherFieldsets() {
    fieldsets.forEach((fieldset) => {
        fieldset.classList.add("cacher");
    });
}
function navigerSuivant() {
    if (etape < fieldsets.length - 1) {
        etape++;
        afficherEtape(etape);
    }
}
function navigerPrecedent() {
    if (etape > 0) {
        etape--;
        afficherEtape(etape);
    }
}
function changerDonFrequent() {
    if (donFrequent?.checked) {
        labelFrequence?.classList.remove("cacher");
        selectFrequence?.classList.remove("cacher");
    }
    else {
        labelFrequence?.classList.add("cacher");
        selectFrequence?.classList.add("cacher");
    }
}
function initialiser() {
    const formulaire = document.querySelector("form");
    if (formulaire) {
        formulaire.noValidate = true;
    }
    fieldsets = document.querySelectorAll("fieldset");
    boutonPrecedent = document.getElementById("precedent");
    boutonSuivant = document.getElementById("suivant");
    boutonSoumettre = document.getElementById("soumettre");
    donFrequent = document.getElementById("donFrequent");
    // Correction des bons sélecteurs
    labelFrequence = document.querySelector("label[for='frequence']");
    selectFrequence = document.getElementById("frequence");
    const donUnique = document.getElementById("donUnique");
    // Masquer la fréquence au départ
    labelFrequence?.classList.add("cacher");
    selectFrequence?.classList.add("cacher");
    // Attacher les événements sur les deux radios
    donFrequent?.addEventListener("change", changerDonFrequent);
    donUnique?.addEventListener("change", changerDonFrequent);
    changerDonFrequent(); // Appeler une fois pour initialiser l'état correct
    fieldsets.forEach((f) => f.classList.add("cacher"));
    boutonSoumettre?.classList.add("cacher");
    boutonPrecedent?.classList.add("cacher");
    boutonPrecedent?.addEventListener("click", navigerPrecedent);
    boutonSuivant?.addEventListener("click", navigerSuivant);
    afficherEtape(etape);
}
document.addEventListener("DOMContentLoaded", initialiser);
//LORSUQE AUTRE MONTANT EST SELECTIONNER, LE PRIX COCHER EN BOUTON RADIO DOIT ETRE ENLEVER
