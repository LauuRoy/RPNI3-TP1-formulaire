"use strict";
let boutonPrecedent = null;
let boutonSuivant = null;
let boutonSoumettre = null;
let boutonModifier = null;
let etape = 0;
let fieldsets;
let donFrequent = null;
let donUnique = null;
let labelFrequence = null;
let selectFrequence = null;
let etapeActuelle = null;
let messagesJSON = {};
// Fonctionnement des boutons
function afficherEtape(index) {
    cacherFieldsets();
    if (index === 0) {
        fieldsets[0]?.classList.remove("cacher");
        fieldsets[1]?.classList.remove("cacher");
        donUnique?.classList.remove("cacher");
        donFrequent?.classList.remove("cacher");
        boutonPrecedent?.classList.add("cacher");
        boutonSuivant?.classList.remove("cacher");
        boutonSoumettre?.classList.add("cacher");
        boutonModifier?.classList.add("cacher");
    }
    else if (index < fieldsets.length - 2) {
        fieldsets[index + 1]?.classList.remove("cacher");
        boutonPrecedent?.classList.remove("cacher");
        boutonSuivant?.classList.remove("cacher");
        boutonSoumettre?.classList.add("cacher");
        boutonModifier?.classList.add("cacher");
    }
    else {
        fieldsets[index + 1]?.classList.remove("cacher");
        donUnique?.classList.add("cacher");
        donFrequent?.classList.add("cacher");
        boutonPrecedent?.classList.remove("cacher");
        boutonSuivant?.classList.add("cacher");
        boutonSoumettre?.classList.remove("cacher");
        if (index === 3) {
            boutonModifier?.classList.remove("cacher");
        }
        else {
            boutonModifier?.classList.add("cacher");
        }
    }
}
function cacherFieldsets() {
    fieldsets.forEach((fieldset) => {
        fieldset.classList.add("cacher");
    });
}
// Navigation
function naviguerModifier() {
    etape = 1;
    afficherEtape(etape);
}
function navigerPrecedent() {
    if (etape > 0) {
        etape--;
        afficherEtape(etape);
    }
}
function navigerSuivant() {
    const etapeValide = validation(etape);
    if (etapeValide) {
        if (etape < fieldsets.length - 2) {
            etape++;
            afficherEtape(etape);
            if (etape === 3) {
                remplirResume();
            }
        }
    }
}
// Remplir le résumé
function remplirResume() {
    const formulaire = document.querySelector("form");
    const typeDon = formulaire.querySelector("input[name=donBoutons]:checked")?.value;
    const frequence = formulaire.querySelector("select[name=frequence]")?.value;
    let montantFinal = formulaire.querySelector("input[name=montant]:checked")?.value || "";
    if (!montantFinal) {
        montantFinal = formulaire.querySelector("input[name=autreMontant]")?.value || "";
    }
    const prenom = formulaire.querySelector("input[name=prenom]")?.value;
    const nom = formulaire.querySelector("input[name=nom]")?.value;
    const telephone = formulaire.querySelector("input[name=telephone]")?.value;
    const ville = formulaire.querySelector("input[name=ville]")?.value;
    const pays = formulaire.querySelector("select[name=pays]")?.value;
    const adresse = formulaire.querySelector("input[name=adresse]")?.value;
    const codepostal = formulaire.querySelector("input[name=codepostal]")?.value;
    const nomCarte = formulaire.querySelector("input[name=nomCarte]")?.value;
    const carteCredit = formulaire.querySelector("input[name=carteCredit]")?.value;
    document.getElementById("montantResume").textContent = montantFinal + "$";
    document.getElementById("frequenceResume").textContent = typeDon === "donFrequent" ? frequence : "Don unique";
    document.getElementById("prenomResume").textContent = prenom;
    document.getElementById("nomResume").textContent = nom;
    document.getElementById("telephoneResume").textContent = telephone;
    document.getElementById("villeResume").textContent = ville;
    document.getElementById("paysResume").textContent = pays;
    document.getElementById("adresseResume").textContent = adresse;
    document.getElementById("codepostalResume").textContent = codepostal;
    document.getElementById("nomCarteResume").textContent = nomCarte;
    document.getElementById("carteCreditResume").textContent = carteCredit ? `**** **** **** ${carteCredit.slice(-4)}` : "";
}
// Faire apparaitre fréquence
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
// Message d'erreurs et validation
async function obtenirMessagesErreur() {
    const reponse = await fetch('objJSONMessages.json');
    messagesJSON = await reponse.json();
}
function validerChamps(champ) {
    const id = champ.id;
    const erreurElement = document.getElementById("erreur-" + id);
    if (erreurElement)
        erreurElement.textContent = "";
    if (champ.validity.valueMissing && messagesJSON[id]?.vide) {
        erreurElement.textContent = messagesJSON[id].vide;
        return false;
    }
    if (champ.validity.typeMismatch && messagesJSON[id]?.type) {
        erreurElement.textContent = messagesJSON[id].type;
        return false;
    }
    if (champ.validity.patternMismatch && messagesJSON[id]?.pattern) {
        erreurElement.textContent = messagesJSON[id].pattern;
        return false;
    }
    return true;
}
function validation(etape) {
    let etapeValide = true;
    switch (etape) {
        // information perso
        case 1: {
            const prenomElement = document.getElementById("prenom");
            const nomElement = document.getElementById("nom");
            const courrielElement = document.getElementById("courriel");
            const prenomValide = validerChamps(prenomElement);
            const nomValide = validerChamps(nomElement);
            const courrielValide = validerChamps(courrielElement);
            if (!prenomValide || !nomValide || !courrielValide) {
                etapeValide = false;
            }
            break;
        }
        // Information paiement -- NE RENTRE PAS DANS LA BOUCLE?
        case 2: {
            const carteCreditElement = document.getElementById("carteCredit");
            const nomCarteElement = document.getElementById("nomCarte");
            const dateExpirationElement = document.getElementById("dateExpiration");
            const cvvElement = document.getElementById("codeVerification");
            const carteCreditValide = validerChamps(carteCreditElement);
            const nomCarteValide = validerChamps(nomCarteElement);
            const dateExpirationValide = validerChamps(dateExpirationElement);
            const cvvValide = validerChamps(cvvElement);
            if (!carteCreditValide || !nomCarteValide || !dateExpirationValide || !cvvValide) {
                etapeValide = false;
            }
            break;
        }
    }
    return etapeValide;
}

// Initialisation
function initialiser() {
    const formulaire = document.querySelector("form");
    if (formulaire) {
        formulaire.noValidate = true;
    }
    fieldsets = document.querySelectorAll("fieldset");
    boutonPrecedent = document.getElementById("precedent");
    boutonSuivant = document.getElementById("suivant");
    boutonModifier = document.getElementById("modifier");
    boutonSoumettre = document.getElementById("soumettre");
    donFrequent = document.getElementById("donFrequent");
    donUnique = document.getElementById("donUnique");
    labelFrequence = document.querySelector("label[for='frequence']");
    selectFrequence = document.getElementById("frequence");
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
    boutonModifier?.addEventListener("click", naviguerModifier);
    obtenirMessagesErreur();
    afficherEtape(etape);
}
document.addEventListener("DOMContentLoaded", initialiser);
