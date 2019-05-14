let db, config
const { sortArray, nextMercredi } = require('../functions');
let Service = require('./service-class')(db, config)



module.exports = (_db, _config) => {
    db = _db
    config = _config
    return Planning
}

let Planning = class {

    static getAllTeams() {
        return new Promise((next) => {
            db.query("SELECT * FROM teams")
                .then((equipes) => {
                    next(equipes)
                })
                .catch((err) => next(err))
        })
    }

    static getNextXWeeks(nbSemaine) {
        return new Promise((next) => {
            if ((nbSemaine || nbSemaine != 0) && nbSemaine < 10) {
                var semaineTableau = new Array()
                let nextmercredi = nextMercredi(new Date, 3)
                                
                for (let semaine = 1; semaine <= nbSemaine; semaine++) {
                    var futurDate = new Date()
                    futurDate.setDate(nextmercredi.getDate() + (7 * semaine));

                   
                    semaineTableau.push(
                        {
                            "semaine": semaine,
                            "date": futurDate
                        }
                    )
                }
                //console.log(semaineTableau)
                let allServices = new Array
                let queriesSemaines = semaineTableau.reduce((promiseChain, semaine) => {
                    return promiseChain.then(() => new Promise((resolve) => {
                        this.getNextWeek(semaine.date)
                            .then((result) => {
                                //console.log(semaine)
                                result = {
                                    "mercredi": semaine,
                                    "appel": result
                                }
                                allServices.push(result)
                                resolve()
                                //console.log(result)
                            })
                            .catch((err) => next(err))

                    })).catch((err) => resolve(err));
                }, Promise.resolve());

                // Après toutes les reqêtes
                queriesSemaines.then((results) => {
                    next(allServices)
                })
                    .catch((err) => next(err))
            } else {
                next(new Error(config.errors.noWeekValue))
            }
        })
    }

    static statsConsomacteur(consomacteur) {
        return new Promise((resolve) => {
            db.query("SELECT COUNT(*) as services FROM services WHERE `member`=?", [consomacteur.id])
                .then((result) => {
                    let today = new Date
                    let nbServices = result[0].services
                    let dateArrivee = new Date(consomacteur.dateAjout)

                    if (dateArrivee == null || dateArrivee == 'Invalid Date') {
                        dateArrivee = new Date();
                        dateArrivee.setDate(today.getDate() - 30);
                    }

                    let nbDeMarches = Math.round((today - dateArrivee) / (7 * 24 * 60 * 60 * 1000))

                    // on crée la note pour chaque consomacteur
                    let note = parseInt(nbServices) / parseInt(nbDeMarches)
                    result = {
                        "idConsomacteur": consomacteur.id,
                        "nom": consomacteur.name,
                        "prenom": consomacteur.prenom,
                        "tel": consomacteur.tel,
                        "email": consomacteur.email,
                        "note": note
                    }
                    resolve(result)
                })
                .catch((err) => resolve(err))
        })
    }


    static getNextWeek(futurDate) {
        return new Promise((next) => {
            // Netoyage de toutes les entrées dasn le planning
            Service.removeAllPlanning(futurDate)
                .then((valid) => {
                    return new Promise((next) => {
                        this.getAllTeams()
                            .then((equipes) => {

                                let queries = equipes.map((equipe) => {
                                    return new Promise((next) => {
                                        db.query('SELECT * FROM members WHERE equipe=? ', [equipe.id])
                                            .then((teamMemberArray) => {

                                                // On ajoute tous les concomacteurs dans un tableau en fonction de leur note
                                                let listeConsomacteur = new Array
                                                let requests = teamMemberArray.reduce((promiseChain, consomacteur) => {
                                                    return promiseChain.then(() => new Promise((resolve) => {
                                                        Planning.statsConsomacteur(consomacteur)
                                                            .then((result) => {
                                                                listeConsomacteur.push(result)
                                                                resolve(result)
                                                            })
                                                            .catch((err) => resolve(err));
                                                    })).catch((err) => resolve(err));
                                                }, Promise.resolve());

                                                // Après tous les ajouts
                                                requests.then(() => {
                                                    // On trie les résultats en fonction de la note
                                                    listeConsomacteur.sort(sortArray("note"));

                                                    // On prends que les notes les plus basses
                                                    let max = equipe.nbPlanning
                                                    listeConsomacteur = listeConsomacteur.slice(0, max)
                                                    //console.log(listeConsomacteur)


                                                    if (!futurDate) {
                                                        futurDate = nextMercredi(new Date(), 3)
                                                    }

                                                    let queries = listeConsomacteur.map((consomacteur) => {
                                                        return Service.add(consomacteur.idConsomacteur, futurDate, "planning", "pending")
                                                            //.then(()=>console.log("Ajout : " + consomacteur.idConsomacteur + futurDate))
                                                            .catch((err) => next(err))
                                                    })
                                                    Promise.all(queries)
                                                        .then((results) => {

                                                            // Rangement dans un tableau
                                                            results = {
                                                                "equipe": equipe.nomComplet,
                                                                "equipeAbrege": equipe.abrege,
                                                                "date": futurDate,
                                                                "membres": listeConsomacteur
                                                            }
                                                            //console.log(results)
                                                            next(results)
                                                        })
                                                        .catch((err) => next(err))
                                                })
                                                    .catch((err) => next(err))
                                            })
                                            .catch((err) => next(err))
                                    })
                                })
                                Promise.all(queries)
                                    .then(results => {
                                        next(results)
                                    })
                            })
                            .catch((err) => next(err))
                    })
                })
                .then((results) => {
                    //console.log("fin")
                    next(results)
                })
                .catch((err) => next(err))
        })
    }
}