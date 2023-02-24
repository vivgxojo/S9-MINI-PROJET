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
        Object.assign(this, obj);
        for(let i = 0; i < this.tabJournalistes.length; i++){
            let journaliste = new Journaliste();
            journaliste.deserialiser(this.tabJournalistes[i]);
            this.tabJournalistes[i] = journaliste;
        }
    }
}

const $equipe = new Equipe();
const journaliste1 = new Journaliste("Bob", "blabla", "Intelo", "#FF0000FF");
const journaliste2 = new Journaliste("Jo", "blabla", "Geek", "#00FF00FF");
$equipe.ajouterJournaliste(journaliste1);
$equipe.ajouterJournaliste(journaliste2);


sessionStorage.setItem("equipe", JSON.stringify($equipe));
$jsonObject = JSON.parse(sessionStorage.getItem("equipe"));
const $equipe2 = new Equipe();
$equipe2.deserialiser($jsonObject);

const journaliste3 = new Journaliste("Érika", "blabla", "Nouveliste", "#0000FFFF");
$equipe2.ajouterJournaliste(journaliste3);
$("#equipe").html($equipe2.toString());