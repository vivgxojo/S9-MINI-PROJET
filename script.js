class Journaliste {

    constructor(nom="", bio="", specialite="", couleur="") {
        this.nom = nom;
        this.bio = bio;
        this.specialite = specialite;
        this.couleur = couleur;
    }

    toString(){
        return "<div class='row border'><span class='col-6 float-start'>" + this.nom +
            "</span><span class='badge rounded-pill col-6 float-end' style='background-color:" +
            this.couleur + "'>" + this.specialite + "</span></div>";
    }

    // JSON.parse ne recré pas l'objet adéquatement, on doit donc passer par une méthode supplémentaire
    // Celle-ci est inspirée de :
    // A1rPun. (2014). Can we cast a generic object to a custom object type in javascript? Stack Overflow.
    // https://stackoverflow.com/questions/8736886/can-we-cast-a-generic-object-to-a-custom-object-type-in-javascript
    deserialiser(obj) {
        /**
         * Assigner les propriétés de l'objet obtenu à l'aide de JSON.parse aux propriétés d'un objet de type Journaliste.
         */
        Object.assign(this, obj);
    }
}

class Equipe {

    constructor(tabJournalistes = []) {
        this.tabJournalistes = tabJournalistes;
        this.compteur = 0;
    }

    ajouterJournaliste(journaliste){
        this.tabJournalistes[this.compteur] = journaliste;
        this.compteur++;
    }

    toString(){
        let chaine = "";
        for (let i = 0; i < this.tabJournalistes.length; i++){
            chaine += this.tabJournalistes[i].toString();
        }
        return chaine;
    }

    deserialiser(obj) {
        /**
         * Recréer un objet Equipe à partir d'un objet désérialisé à l'aide de JSON
         * obj : l'objet à désérialiser
         */
        Object.assign(this, obj); // Copier toutes les propriétés de l'objet obj dans l'objet équipe
        // Désérialiser chaque journaliste
        for(let i = 0; i < this.tabJournalistes.length; i++){
            let journaliste = new Journaliste();
            journaliste.deserialiser(this.tabJournalistes[i]);
            this.tabJournalistes[i] = journaliste;
        }
    }
}
/*
const $equipe = new Equipe();
const journaliste1 = new Journaliste("Bob", "blabla", "Intelo", "#FF0000FF");
const journaliste2 = new Journaliste("Jo", "blabla", "Geek", "#00FF00FF");
$equipe.ajouterJournaliste(journaliste1);
$equipe.ajouterJournaliste(journaliste2);

// Sérialiser : transformer l'objet en chaine de caractères, ici en format JSON
sessionStorage.setItem("equipe", JSON.stringify($equipe)); // Sérialiser et sauvegarder dans la session

// Désérialiser : reconstituer une variable objet à partir d'une chaine de caractère (JSON)
$jsonObject = JSON.parse(sessionStorage.getItem("equipe")); // JSON.parse désérialise en type Object
const $equipe2 = new Equipe();
$equipe2.deserialiser($jsonObject); // Appeler ma propre méthode de désérialisation avec l'objet créé par JSON

const journaliste3 = new Journaliste("Érika", "blabla", "Nouveliste", "#0000FFFF");
$equipe2.ajouterJournaliste(journaliste3);
$("#equipe").append($equipe2.toString());
*/
$("form").submit(function (event){
    // Validation
    let valide = true;

    // Valider la biographie
    let bio = $("#bio").val();
    let regex = new RegExp("^[A-Z].*!");
    if (!regex.test(bio)){
        $("#erreurBio").removeClass("d-none");
        valide = false;
    }
    else {
        $("#erreurBio").addClass("d-none");
    }

    //Valider spécialité
    let $specialite = $("#specialite").val();
    for (let i = 0; i < $equipe.tabJournalistes.length; i++){
        if ($specialite === $equipe.tabJournalistes[i].specialite){
            $("#erreurSpecialite").removeClass("d-none");
            valide = false;
        }
        else  {
            $("#erreurSpecialite").addClass("d-none");
        }
    }

    //Valider couleur
    let $couleur = $("#couleur").val();
    for (let i = 0; i < $equipe.tabJournalistes.length; i++){
        if ($couleur === $equipe.tabJournalistes[i].couleur){
            $("#erreurCouleur").removeClass("d-none");
            valide = false;
        }
        else  {
            $("#erreurCouleur").addClass("d-none");
        }
    }

    if (!valide){
        event.preventDefault();
    }
});

// Au chargement (pas besoin de fonction si on utilise defer)
// Créer une équipe
const $equipe = new Equipe();
// Désérialiser l'équipe contenu dans la session
const $jsonObject = JSON.parse(sessionStorage.getItem("equipe"));
$equipe.deserialiser($jsonObject);

// Récupérer les données de l'URL
let urlData = location.search.substring(1).replace('+', ' ');
let tabData = urlData.split("&");

if(urlData !== "" && tabData[0].split("=")[0] === "nom"){
    // Créer un journaliste
    const $journaliste = new Journaliste(tabData[0].split("=")[1],
        tabData[1].split("=")[1],
        tabData[2].split("=")[1],
        "#"+tabData[3].split("=")[1].substring(3));
    $equipe.ajouterJournaliste($journaliste)

    // Enregistrer l'équipe dans la session
    sessionStorage.setItem("equipe", JSON.stringify($equipe)); // Sérialiser et sauvegarder dans la session

    // Afficher l'équipe avec toString
    //$("#equipe").append($equipe.toString());

    //Afficher l'équipe dans des éléments html
    $(".nomJournalisteEquipe").text($equipe.tabJournalistes[0].nom);
    $(".specialiteJournalisteEquipe").text($equipe.tabJournalistes[0].specialite);
    $(".specialiteJournalisteEquipe").css('background-color', $equipe.tabJournalistes[0].couleur);

    //Cloner la rangée pour afficher les autres membres de l'équipe
    for (let i=1; i < $equipe.tabJournalistes.length; i++){
        $(".JournalisteEquipe:last").clone().insertAfter(".JournalisteEquipe:last");
        $(".nomJournalisteEquipe:last").text($equipe.tabJournalistes[i].nom);
        $(".specialiteJournalisteEquipe:last").text($equipe.tabJournalistes[i].specialite);
        $(".specialiteJournalisteEquipe:last").css('background-color', $equipe.tabJournalistes[i].couleur);
    }
}

