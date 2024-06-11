const form = document.querySelector("form");
const inputs = document.querySelectorAll(
  'input[type="text"], input[type="password"]'
); // Pointer ttes les inputs en même temps

// Pointer la progress-bar :
const progressBar = document.getElementById("progress-bar");

//Stocker les infos dans des variables :
let pseudo, email, password, confirmPass; // (confirmPass sera juste un boolean, car je stock déjà le mdp ds password)

// CODER  UNE FONCTION QUI PREND TOUTE LA LOGIQUE D'ERREUR:
const AffichageErreur = (tag, message, valid) => {
  const container = document.querySelector("." + tag + "-container"); // Tag = pseudo,email,password ou confirm
  const span = document.querySelector("." + tag + "-container > span"); // utilisation du tag est appelé "tag dynamique" pour pointer le span

  if (!valid) {
    //!valid = le contraire de si c'est valid dc: Si conditions suivantes pas respecter, afficher message d'erreur, rendre le contenu et les contours rouges
    container.classList.add("error"); //Add class error css des inputs au container
    span.textContent = message; //Message = message d'erreur
  } else {
    //Dc si c'est valid:
    container.classList.remove("error");
    span.textContent = message;
  }
};

// CREATION D'UNE FONCTION POUR CHAQUE INPUT POUR GERER LA BONNE SAISIE DES DATA USER
const pseudoChecker = (valufffe) => {
  console.log(valufffe); //  "valufffe" = "e.target.value", ce que l'user tape. e.target.value est dans le switch dans l'addEventListener juste en dessous

  if (valufffe.length > 0 && (valufffe.length < 3 || valufffe.length > 20)) {
    //Si longueur pseudo tapé est > 0 et moins de 3 lettre ou plus de 20 alors injecter class error et signaler à l'user la marche à suivre dans le span via text.content. Oui on peut injecter du text ds un span
    AffichageErreur(
      "pseudo",
      "Le pseudo doit faire entre 3 et 20 caractères",
      false
    );
    pseudo = null; //Si mot de passe pas valide il ne faut pas l'enregistrer dans pseudo
  } else if (!valufffe.match(/^[a-zA-Z0-9_.-]*$/)) {
    //pseudoContainer.classList.add("error");
    // errorDisplay.textContent = "Le pseudo ne doit pas contenir de caractères spéciaux";
    //si la regex est vraie ("!"en début de regex indique : si on obtient le contraire de ce qui suit:
    //lettres de a-z en majuscule et minuscule, chiffres et certains caractères spéciaux comme _.- si on a autre chose que tout ça alors on injecte class error et indique dans le span la marche à suivre à l'user
    AffichageErreur(
      "pseudo",
      "Le pseudo ne doit pas contenir de caractères spéciaux"
    );
    pseudo = null;
  } else {
    AffichageErreur("pseudo", "", true); // Enleve le message et enleve la class error de .pseudo-container
    pseudo = valufffe; // e.target.value Stock dans pseudo le mot de passe que si c'est bon
  }
  //Si tout est bon(pas de caractères spéciaux sauf ceux autorisés, pseudo entre 3 et 20caractères) alors on retire la class error et on vide le span
};
const emailChecker = (valufffe) => {
  console.log(valufffe);
  if (!valufffe.match(/^[\w_-]+@[\w-]+\.[a-z]{2,4}$/i)) {
    //regex qui vérifie que l'email est correctement écrite
    AffichageErreur("email", "Le mail n'est pas valide", false);
    email = null;
  } else {
    AffichageErreur("email", "", true); // Retire la class error de .email-container et efface le message d'erreur ("")
    email = valufffe;
  }
};
const passwordChecker = (valufffe) => {
  progressBar.classList = ""; // réinitialise les classes appliquées à progressBar.Evite que dans <p id les class progressRed Blue et Green ne s'acccumulent et ne disparaissent pas. (visible ds le DOM) grace à cette ligne elles s'écrasent à chaque fois en fonction de si le mdp est bon et sécurisé ou pas. = "" : Assigner une chaîne vide à classList retire toutes les classes actuellement appliquées à l'élément.
  // REGEX : 8 caractères | 1 Majuscule | 1 Caractère spéciale  | 1 Chiffre
  if (
    !valufffe.match(
      /^(?=.*?[A-Z])(?=(.*[a-z]){1,})(?=(.*[\d]){1,})(?=(.*[\W]){1,})(?!.*\s).{8,}$/
    )
  ) {
    // console.log("test"); //En écrivant 1 chiffre , 1 caractere spéciale et une Majuscule et 8 caracteres il ne log plus test. Dc + d'erreur
    AffichageErreur(
      "password",
      "minimum de 8 caractères, une majuscule, un chiffre et un caractère spécial",
      false
    );
    progressBar.classList.add("progressRed");
    password = null;
  } else if (valufffe.length < 12) {
    progressBar.classList.add("progressBlue"); // Si c'est bn mais que mdp < 12 caractères
    AffichageErreur("password", "", true);
    password = valufffe;
  } else {
    progressBar.classList.add("progressGreen"); // Si c'est bon et que mdp > 12 caractères du coup
    AffichageErreur("password", "", true);
    password = valufffe; // j'enregistre le mdp correct dans la variable password
  }
  if (confirmPass) confirmChecker(confirmPass); // Permet d'éviter que si les mdp correspondent mais qu'après je modifie le mdp alr il ne corresponde plus à nouveau. Il faut jouer confirmChecker avant que passwordChecker ne se termine
};
//progressRed : Mot de passe faible.
//progressBlue : Mot de passe moyen.
//progressGreen : Mot de passe fort.

const confirmChecker = (valufffe) => {
  //console.log(valufffe); // On controle/affiche les données users pour la confirmation du password
  if (valufffe !== password) {
    AffichageErreur(
      "confirm", //"." + confirm + "container"
      "Les mots de passe de sont pas identiques",
      false
    );
    confirmPass = false;
  } else {
    AffichageErreur("confirm", "", true);
    confirmPass = true;
  }
};

// Déterminer sur quel input on travaille avec un forEach
inputs.forEach((input) => {
  input.addEventListener("input", (e) => {
    // console.log(e.target.value); //Si je mets e.target.value : ça me renvoie ce qui écrit ds les inputs par l'user
    // console.log(e.target); // si j'écris ds input pseudo, me log: <input type="text" id="pseudo">. dc e.target me montre l'input ds lequel j'écris
    // console.log(e.target.id); // si j'écris ds input pseudo, me log l'id de l'input pseudo. Ca récupère juste l'endroit ou l'user se trouve/tape , ici l'id des inputs
    switch (e.target.id) {
      case "pseudo":
        pseudoChecker(e.target.value);
        break;
      case "email":
        emailChecker(e.target.value); // Si l'user écrit ds input email : fonction emailChecker appliquée et récupération de la data
        break;
      case "password":
        passwordChecker(e.target.value);
        break;
      case "confirm":
        confirmChecker(e.target.value);
        break;
      default:
        null;
    } //Si le switch tombe sur l'un des 4 id dans case, alors il exécutera la fonction correspondante
  });
});

form.addEventListener("submit", (e) => {
  //L'event sur les form s'appelle "submit" quand on click sur boutton submit
  e.preventDefault();
  console.log("test"); // On aperçoit 1/2 seconde le test ds console car quand on valide un form le navigateur par défaut change de page. Il faut dire: e.preventDefault() pr contrer ça
  if (pseudo && email && password && confirmPass) {
    // équivaut à dire: if (pseudo === true && email === true && password === true && confirmPass === true) {alors dans console je veux que tu m'envoies ce que l'user à taper})
    const data = {
      // on crée un objet qui stocke les données. Quand on veut envoyer data à un SERVER ou une API on regroupe tout ds un objet et on envoie
      // pseudo: pseudo,
      // email: email,
      // password: password,
      // En Javascript moderne on a pas besoin d'écrire l'index, il va comprendre que la variable a comme index le même nom:
      pseudo,
      email,
      password,
    };
    alert("Inscription Validée !");
    console.log(data);

    progressBar.classList = ""; // Réinitialise la progressBar, la retire

    inputs.forEach((input) => {
      // Permet de vider les inputs quand le formulaire est validé. C'est plus professionnel
      input.value = "";
    });

    pseudo = null; // On vide toutes les variables qui contiennent e.target.value de l'user une fois formulaire validé pour éviter qu'il ne soumette une deuxieme fois la même chose
    email = null;
    password = null;
    confirmPass = null;
  } else {
    alert("Veuillez remplir correctement les champs");
  }
});
