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


// AFFICHAGE DES ÉTAPES
// Sert à afficher et cacher les fieldsets selon l'étape actuelle
function afficherEtape(index: number): void {
    cacherFieldsets();

    //Étape 1, on affiche les deux premiers fieldsets (boutons de don + montant du don) avec le bouton suivant
    if (index === 0) {

        fieldsets[0]?.classList.remove("cacher");
        fieldsets[1]?.classList.remove("cacher");
        donUnique?.classList.remove("cacher");
        donFrequent?.classList.remove("cacher");
        boutonPrecedent?.classList.add("cacher");
        boutonSuivant?.classList.remove("cacher");
        boutonSoumettre?.classList.add("cacher");
        boutonModifier?.classList.add("cacher");

        // Étape de coordonnées et paiement, on affiche le bon fieldset avec les boutons précédent et suivant
    } else if (index < fieldsets.length - 2) {

        fieldsets[index + 1]?.classList.remove("cacher");
        boutonPrecedent?.classList.remove("cacher");
        boutonSuivant?.classList.remove("cacher");
        boutonSoumettre?.classList.add("cacher");
        boutonModifier?.classList.add("cacher");

        // Étape du résumé, on cache les boutons de don et on affiche le résumé, le bouton soumettre et précédent
    } else {
        fieldsets[index + 1]?.classList.remove("cacher");
        donUnique?.classList.add("cacher");
        donFrequent?.classList.add("cacher");
        boutonPrecedent?.classList.remove("cacher");
        boutonSuivant?.classList.add("cacher");
        boutonSoumettre?.classList.remove("cacher");


        if (index === 3) {
            // Affiche le bouton modifier pour aller changer les informations personnelles
            boutonModifier?.classList.remove("cacher");

            // Déplace le bouton soumettre à la fin de son conteneur
            const zoneBoutons = document.querySelector(".formulaire__Zone-boutons-bleu") as HTMLElement;
            const boutonEnvoyer = document.getElementById("soumettre") as HTMLElement;
            zoneBoutons.appendChild(boutonEnvoyer);

        } else {
            // Si pas dans l'étape 3, on cache le bouton modifier
            boutonModifier?.classList.add("cacher");
        }
    }
}

// Cacher tous les fieldsets du formulaire
function cacherFieldsets(): void {
    fieldsets.forEach((fieldset) => {
        fieldset.classList.add("cacher");
    });
}

// NAVIGATION AVEC LES BOUTONS
// Lors du clic sur le bouton modifier, on retourne à l'étape 1 pour modifier les informations personnelles
function naviguerModifier(): void {
    etape = 1;
    afficherEtape(etape);
}

// Lors du clic sur le bouton précédent, on retourne à l'étape précédente (recule d'une étape)
function navigerPrecedent(): void {
    if (etape > 0) {
        etape--;
        afficherEtape(etape);
    }
}

// Lors du clic sur le bouton suivant, on avance à l'étape suivante (avance d'une étape)
function navigerSuivant(): void {
    const etapeValide = validation(etape);

    // Si l'étape est valide (les champs requis sont remplis), on avance à l'étape suivante
    if (etapeValide) {
        if (etape < fieldsets.length - 2) {
            etape++;
            afficherEtape(etape);
            console.log("Étape en validation :", etape);


            //Si on est à l'étape 3, on remplit le résumé d'informations
            if (etape === 3) {
                remplirResume();
            }
        }
    }
}

// REMPLIR LE RÉSUMÉ
// Remplit le résumé avec les informations entrées par l'utilisateur dans le formulaire
function remplirResume(): void {

    // Récupère les valeurs des champs dans le formulaire
    const formulaire = document.querySelector("form") as HTMLFormElement;

    // Récupère le type de don (bouton unique ou fréquent)
    const typeDon = (formulaire.querySelector("input[name=donBoutons]:checked") as HTMLInputElement)?.value;

    // Récupère les champs de fréquence lorsque le don est fréquent
    const frequence = (formulaire.querySelector("select[name=frequence]") as HTMLSelectElement)?.value;

    // Si le bouton du montant est sélectionné, on récupère cette valeur, sinon on récupère la valeur du champ autre montant (NON FONCTIONNEL - LES BOUTONS NE SE DÉCOCHENT PAS)
    let montantFinal = (formulaire.querySelector("input[name=montant]:checked") as HTMLInputElement)?.value || "";
    if (!montantFinal) {
        montantFinal = (formulaire.querySelector("input[name=autreMontant]") as HTMLInputElement)?.value || "";
    }

    // Récupère les champs de coordonnées et de paiement de l'utilisateur
    const prenom = (formulaire.querySelector("input[name=prenom]") as HTMLInputElement)?.value;
    const nom = (formulaire.querySelector("input[name=nom]") as HTMLInputElement)?.value;
    const telephone = (formulaire.querySelector("input[name=telephone]") as HTMLInputElement)?.value;
    const ville = (formulaire.querySelector("input[name=ville]") as HTMLInputElement)?.value;
    const pays = (formulaire.querySelector("select[name=pays]") as HTMLSelectElement)?.value;
    const adresse = (formulaire.querySelector("input[name=adresse]") as HTMLInputElement)?.value;
    const codepostal = (formulaire.querySelector("input[name=codepostal]") as HTMLInputElement)?.value;
    const nomCarte = (formulaire.querySelector("input[name=nomCarte]") as HTMLInputElement)?.value;
    const carteCredit = (formulaire.querySelector("input[name=carteCredit]") as HTMLInputElement)?.value;

    // Insère les informations de don dans le résumé    
    document.getElementById("montantResume")!.textContent = montantFinal + "$";
    document.getElementById("frequenceResume")!.textContent = typeDon === "donFrequent" ? frequence : "Don unique";

    // Insère les coordonnées dans le résumé
    document.getElementById("prenomResume")!.textContent = prenom;
    document.getElementById("nomResume")!.textContent = nom;
    document.getElementById("telephoneResume")!.textContent = telephone;
    document.getElementById("villeResume")!.textContent = ville;
    document.getElementById("paysResume")!.textContent = pays;
    document.getElementById("adresseResume")!.textContent = adresse;
    document.getElementById("codepostalResume")!.textContent = codepostal;

    // Insère les informations de paiement dans le résumé et affiche seulement les 4 derniers chiffres de la carte de crédit
    document.getElementById("nomCarteResume")!.textContent = nomCarte;
    document.getElementById("carteCreditResume")!.textContent = carteCredit ? `**** **** **** ${carteCredit.slice(-4)}` : "";
}

// CHANGER LE TYPE DE DON
// Affiche ou cache le champ de fréquence selon le type de don sélectionné (unique ou fréquent)
function changerDonFrequent(): void {
    if (donFrequent?.checked) {
        labelFrequence?.classList.remove("cacher");
        selectFrequence?.classList.remove("cacher");
    } else {
        labelFrequence?.classList.add("cacher");
        selectFrequence?.classList.add("cacher");
    }
}

// DÉCOCHER LES BOUTONS DE MONTANT LORSQUE L'ON ÉCRIT UN MONTANT PERSONNALISÉ
// Récupère les éléments HTML des boutons et du champs
let autreMontant = document.getElementById("autreMontant") as HTMLInputElement;
let cinquante = document.getElementById("cinquante") as HTMLInputElement;
let soixanteQuinze = document.getElementById("soixanteQuinze") as HTMLInputElement;
let cent = document.getElementById("cent") as HTMLInputElement;
let deuxCent = document.getElementById("deuxCent") as HTMLInputElement;

// Quand on écrit dans le champ "Autre montant", on décoche les boutons de montant
autreMontant.addEventListener("input", function () {
    if (autreMontant.value !== "") {
        cinquante.checked = false;
        soixanteQuinze.checked = false;
        cent.checked = false;
        deuxCent.checked = false;
    }
});

// Quand on sélectionne un des boutons de montant, on vide le champ "Autre montant"
cinquante.addEventListener("change", function () {
    autreMontant.value = "";
});
soixanteQuinze.addEventListener("change", function () {
    autreMontant.value = "";
});
cent.addEventListener("change", function () {
    autreMontant.value = "";
});
deuxCent.addEventListener("change", function () {
    autreMontant.value = "";
});


// VALIDATION DES CHAMPS
// Récupère les messages d'erreur à partir du fichier JSON et les stocke dans une variable globale
async function obtenirMessagesErreur(): Promise<void> {
    const reponse = await fetch('objJSONMessages.json');
    messagesJSON = await reponse.json();
}


// Valide un champ individuel et affiche le message d'erreur selon le id du champ dans la div d'erreur
function validerChamps(champ: HTMLInputElement): boolean {
    const id = champ.id;
    const erreurElement = document.getElementById("erreur-" + id) as HTMLElement;

    if (erreurElement) erreurElement.textContent = "";

    // si champ requis non rempli
    if (champ.validity.valueMissing && messagesJSON[id]?.vide) {
        erreurElement.textContent = messagesJSON[id].vide;
        return false;
    }

    // si ne correspond pas au type
    if (champ.validity.typeMismatch && messagesJSON[id]?.type) {
        erreurElement.textContent = messagesJSON[id].type;
        return false;
    }

    // si ne correspond pas au pattern
    if (champ.validity.patternMismatch && messagesJSON[id]?.pattern) {
        erreurElement.textContent = messagesJSON[id].pattern;
        return false;
    }

    return true;
}

// VALIDATION DE L'ÉTAPE
// Validation d'une étape précise du formulaire
function validation(etape: number): boolean {
    let etapeValide = true;


    switch (etape) {

        // informations personnelles
        case 1: {
            // Récupère les champs <Prénom>, <Nom> et <Courriel>
            const prenomElement = document.getElementById("prenom") as HTMLInputElement;
            const nomElement = document.getElementById("nom") as HTMLInputElement;
            const courrielElement = document.getElementById("courriel") as HTMLInputElement;

            // Valide les champs avec la fonction validerChamps
            const prenomValide = validerChamps(prenomElement);
            const nomValide = validerChamps(nomElement);
            const courrielValide = validerChamps(courrielElement);

            // Si un des champs n'est pas valide, l'étape n'est pas valide
            if (!prenomValide || !nomValide || !courrielValide) {
                etapeValide = false;
            }
            break;
        }

        // Informations paiement
        case 2: {
            // Récupère les champs <Carte de crédit>, <Nom sur la carte>, <Date d'expiration> et <CVV>
            const carteCreditElement = document.getElementById("carteCredit") as HTMLInputElement;
            const nomCarteElement = document.getElementById("nomCarte") as HTMLInputElement;
            const dateExpirationElement = document.getElementById("dateExpiration") as HTMLInputElement;
            const cvvElement = document.getElementById("codeVerification") as HTMLInputElement;

            // Valide les champs avec la fonction validerChamps
            const carteCreditValide = validerChamps(carteCreditElement);
            const nomCarteValide = validerChamps(nomCarteElement);
            const dateExpirationValide = validerChamps(dateExpirationElement);
            const cvvValide = validerChamps(cvvElement);

            // Si un des champs n'est pas valide, l'étape n'est pas valide
            if (!carteCreditValide || !nomCarteValide || !dateExpirationValide || !cvvValide) {
                etapeValide = false;
            }
            break;
        }
    }

    return etapeValide;
}

// INITIALISATION
// Initialise les variables globales, ajoute les écouteurs d'événements et affiche la première étape du formulaire
function initialiser(): void {
    const formulaire = document.querySelector("form") as HTMLFormElement;
    if (formulaire) {
        formulaire.noValidate = true;
    }

    // Récupère les éléments HTML 
    fieldsets = document.querySelectorAll("fieldset");
    boutonPrecedent = document.getElementById("precedent") as HTMLInputElement;
    boutonSuivant = document.getElementById("suivant") as HTMLInputElement;
    boutonModifier = document.getElementById("modifier") as HTMLInputElement;
    boutonSoumettre = document.getElementById("soumettre") as HTMLInputElement;
    donFrequent = document.getElementById("donFrequent") as HTMLInputElement;
    donUnique = document.getElementById("donUnique") as HTMLInputElement;
    autreMontant = document.getElementById("autreMontant") as HTMLInputElement;
    cinquante = document.getElementById("cinquante") as HTMLInputElement;
    soixanteQuinze = document.getElementById("soixanteQuinze") as HTMLInputElement;
    cent = document.getElementById("cent") as HTMLInputElement;
    deuxCent = document.getElementById("deuxCent") as HTMLInputElement;


    labelFrequence = document.querySelector("label[for='frequence']") as HTMLElement;
    selectFrequence = document.getElementById("frequence") as HTMLSelectElement;


    // Cacher le champ de fréquence
    labelFrequence?.classList.add("cacher");
    selectFrequence?.classList.add("cacher");

    // Evénements pour afficher ou masquer le champ de fréquence selon le type de don 
    donFrequent?.addEventListener("change", changerDonFrequent);
    donUnique?.addEventListener("change", changerDonFrequent);
    changerDonFrequent();

    // Cacher tous les fieldsets et les boutons de navigation au départ
    fieldsets.forEach((f) => f.classList.add("cacher"));
    boutonSoumettre?.classList.add("cacher");
    boutonPrecedent?.classList.add("cacher");

    // Ajoute les écouteurs d'événements aux boutons de navigation  
    boutonPrecedent?.addEventListener("click", navigerPrecedent);
    boutonSuivant?.addEventListener("click", navigerSuivant);
    boutonModifier?.addEventListener("click", naviguerModifier);

    // Récupère les messages d'erreur
    obtenirMessagesErreur();

    // Affiche l'étape
    afficherEtape(etape);

    // Redirige vers la page de remerciement lors du clic sur le bouton soumettre
    boutonSoumettre?.addEventListener("click", function (evenement) {
        evenement.preventDefault();
        window.location.href = "merci.html";
    });
}

document.addEventListener("DOMContentLoaded", initialiser);
