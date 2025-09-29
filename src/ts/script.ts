let boutonPrecedent: HTMLInputElement | null = null;
let boutonSuivant: HTMLInputElement | null = null;
let boutonSoumettre: HTMLInputElement | null = null;
let boutonModifier: HTMLInputElement | null = null;
let etape: number = 0;
let fieldsets: NodeListOf<HTMLElement>;
let donFrequent: HTMLInputElement | null = null;
let donUnique: HTMLInputElement | null = null;
let labelFrequence: HTMLElement | null = null;
let selectFrequence: HTMLSelectElement | null = null;
let etapeActuelle: HTMLElement | null = null;

interface ErreurJSON {
    vide: string;
    pattern: string;
    type: string;
}
let messagesJSON: Record<string, ErreurJSON> = {};


// Fonctionnement des boutons
function afficherEtape(index: number): void {
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
    } else if (index < fieldsets.length - 2) {

        fieldsets[index + 1]?.classList.remove("cacher"); 
        boutonPrecedent?.classList.remove("cacher");
        boutonSuivant?.classList.remove("cacher");
        boutonSoumettre?.classList.add("cacher");
        boutonModifier?.classList.add("cacher");
    } else {

        fieldsets[index + 1]?.classList.remove("cacher");
        donUnique?.classList.add("cacher");
        donFrequent?.classList.add("cacher");
        boutonPrecedent?.classList.remove("cacher");
        boutonSuivant?.classList.add("cacher");
        boutonSoumettre?.classList.remove("cacher");
        
        if (index === 3) {
            boutonModifier?.classList.remove("cacher");
        } else {
            boutonModifier?.classList.add("cacher");
        }
    }
}

function cacherFieldsets(): void {
    fieldsets.forEach((fieldset) => {
        fieldset.classList.add("cacher");
    });
}

// Navigation
function naviguerModifier(): void {
    etape = 1;
    afficherEtape(etape);
}

function navigerPrecedent(): void {
    if (etape > 0) {
        etape--;
        afficherEtape(etape);
    }
}

function navigerSuivant(): void {
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
function remplirResume(): void {
    const formulaire = document.querySelector("form") as HTMLFormElement;
    const typeDon = (formulaire.querySelector("input[name=donBoutons]:checked") as HTMLInputElement)?.value;
    const frequence = (formulaire.querySelector("select[name=frequence]") as HTMLSelectElement)?.value;

    let montantFinal = (formulaire.querySelector("input[name=montant]:checked") as HTMLInputElement)?.value || "";
    if (!montantFinal) {
        montantFinal = (formulaire.querySelector("input[name=autreMontant]") as HTMLInputElement)?.value || "";
    }

    const prenom = (formulaire.querySelector("input[name=prenom]") as HTMLInputElement)?.value;
    const nom = (formulaire.querySelector("input[name=nom]") as HTMLInputElement)?.value;
    const telephone = (formulaire.querySelector("input[name=telephone]") as HTMLInputElement)?.value;
    const ville = (formulaire.querySelector("input[name=ville]") as HTMLInputElement)?.value;
    const pays = (formulaire.querySelector("select[name=pays]") as HTMLSelectElement)?.value;
    const adresse = (formulaire.querySelector("input[name=adresse]") as HTMLInputElement)?.value;
    const codepostal = (formulaire.querySelector("input[name=codepostal]") as HTMLInputElement)?.value;
    const nomCarte = (formulaire.querySelector("input[name=nomCarte]") as HTMLInputElement)?.value;
    const carteCredit = (formulaire.querySelector("input[name=carteCredit]") as HTMLInputElement)?.value;

    document.getElementById("montantResume")!.textContent = montantFinal + "$";
    document.getElementById("frequenceResume")!.textContent = typeDon === "donFrequent" ? frequence : "Don unique";
    document.getElementById("prenomResume")!.textContent = prenom;
    document.getElementById("nomResume")!.textContent = nom;
    document.getElementById("telephoneResume")!.textContent = telephone;
    document.getElementById("villeResume")!.textContent = ville;
    document.getElementById("paysResume")!.textContent = pays;
    document.getElementById("adresseResume")!.textContent = adresse;
    document.getElementById("codepostalResume")!.textContent = codepostal;
    document.getElementById("nomCarteResume")!.textContent = nomCarte;
    document.getElementById("carteCreditResume")!.textContent = carteCredit ? `**** **** **** ${carteCredit.slice(-4)}` : "";
}


// Faire apparaitre fréquence
function changerDonFrequent(): void {
    if (donFrequent?.checked) {
        labelFrequence?.classList.remove("cacher");
        selectFrequence?.classList.remove("cacher");
    } else {
        labelFrequence?.classList.add("cacher");
        selectFrequence?.classList.add("cacher");
    }
}

// Message d'erreurs et validation
async function obtenirMessagesErreur(): Promise<void> {
    const reponse = await fetch('objJSONMessages.json');
    messagesJSON = await reponse.json();
}

function validerChamps(champ: HTMLInputElement): boolean {
    const id = champ.id;
    const erreurElement = document.getElementById("erreur-" + id) as HTMLElement;

    if (erreurElement) erreurElement.textContent = "";

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

function validation(etape: number): boolean {
    let etapeValide = true;

    switch (etape) {

        // information perso
        case 1: {
            const prenomElement = document.getElementById("prenom") as HTMLInputElement;
            const nomElement = document.getElementById("nom") as HTMLInputElement;
            const courrielElement = document.getElementById("courriel") as HTMLInputElement;

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
            const carteCreditElement = document.getElementById("carteCredit") as HTMLInputElement;
            const nomCarteElement = document.getElementById("nomCarte") as HTMLInputElement;
            const dateExpirationElement = document.getElementById("dateExpiration") as HTMLInputElement;
            const cvvElement = document.getElementById("codeVerification") as HTMLInputElement;

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
function initialiser(): void {
    const formulaire = document.querySelector("form") as HTMLFormElement;
    if (formulaire) {
        formulaire.noValidate = true;
    }

    fieldsets = document.querySelectorAll("fieldset");
    boutonPrecedent = document.getElementById("precedent") as HTMLInputElement;
    boutonSuivant = document.getElementById("suivant") as HTMLInputElement;
    boutonModifier = document.getElementById("modifier") as HTMLInputElement;
    boutonSoumettre = document.getElementById("soumettre") as HTMLInputElement;
    donFrequent = document.getElementById("donFrequent") as HTMLInputElement;
    donUnique = document.getElementById("donUnique") as HTMLInputElement;

    labelFrequence = document.querySelector("label[for='frequence']") as HTMLElement;
    selectFrequence = document.getElementById("frequence") as HTMLSelectElement;

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
