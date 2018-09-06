const puppeteer = require('puppeteer');
var url = require('url');
var connectDb = require('./mongo')
const mongoose = require('mongoose');
const DBCONNECT = 'mongodb://seb:test123@ds229552.mlab.com:29552/grrrrr';
//var db = mongoose.connection;

const getIds = async (browser) =>
{
	// 1 - Créer une instance de navigateur
	const page = await browser.newPage();
	// 2 - Naviguer jusqu'à l'URL cible
	await page.goto('https://www.ligue1.com/ligue1/calendrier_resultat');
	await page.setViewport({ width: 1000, height: 900 });
	await page.waitFor(1000) // fait une pause d'une seconde

	const seasons = await
	page.evaluate(function () {
		var values = [];
		var optionsSelect = document.querySelectorAll("#saison_resultats option");
		for (var season of optionsSelect) {
			var value = season.getAttribute('value');
			values.push(value);
		}

		return values;
	})
	// 4 - Retourner les données (et fermer le navigateur)
	//browser.close()
	return seasons;
}
//3 - Récupérer les données
const getGames = async (browser, season) =>
{
	const page = await browser.newPage();

	var journey = 0;
	journey++

	await page.goto('https://www.ligue1.com/ligue1/calendrier_resultat#sai=' + season + '&jour=' + journey);

	await page.waitFor(1000);
	
	//console.log(connect)
	const result = await page.evaluate(function () {
		var dateMatch = document.querySelector("h4").innerText;
		var games = [];
		teams = document.querySelectorAll("table > tbody > tr");
		for (var match of teams) {
			var homeTeam = match.querySelector("td.domicile").innerText;
			var scoreMatch = match.querySelector("td.stats").innerText;
			var awayTeam = match.querySelector("td.exterieur").innerText;

			var game = {
				idDocument: homeTeam + ' - ' + awayTeam + ' - ' + dateMatch,
				competition: 'ligue1',
				competition_year: "2017-2018",
				date: dateMatch,
				teams: {
					home_team: homeTeam,
					home_game_goals: 4,
					away_team: awayTeam,
					away_team_goals: 2,
					match_result : homeTeam + ' ' + scoreMatch + ' ' + awayTeam,
				}
			}
			
			games.push(game);
		}

		return games;
	})

	return result;
}

const allMatches = async () => {
	const browser = await puppeteer.launch({headless: false})//
	var idseasons = await getIds(browser);
	//idseasons = [100, 101];
	const db = await connectDb.conDb();
	const results = await Promise.all(
		idseasons.map(season => getGames(browser, season))
	)

	const tset = await Promise.all(
		results.map(gamesTab => saveDocument(gamesTab))
	)

	//return results
	//const results = await getGames(browser, 100);
	
	// for(game of results){
	// 	console.log(game);
	// 	//await saveDocument(game)
	// }

	browser.close()
	//return tset;
	return 'insert ok';
}

allMatches().then(value => {
	console.log(value);
})

function matchResult(match, date) {
	var homeTeam = match.querySelector("td.domicile").innerText;
	var scoreMatch = match.querySelector("td.stats").innerText;
	var awayTeam = match.querySelector("td.exterieur").innerText;

	var game = {
		idDocument: homeTeam + ' - ' + awayTeam + ' - ' + date,
		competition: competition_name,
		competition_year: "2017-2018",
		date: date,
		teams: {
			home_team: homeTeam,
			home_game_goals: 4,
			away_team: awayTeam,
			away_team_goals: 2,
			match_result : homeTeam + ' ' + scoreMatch + ' ' + awayTeam,
		}
	}

	return game;
}

saveDocument = async (games) => {
    var db = mongoose.connection;

	for(var i= 0; i < games.length; i++) {
		if (await db.collection("games").findOne({idDocument: games[i].idDocument}) === null) {
			db.collection("games").insertOne(games[i], null, function (error, results) {
				if (error) throw error;

				console.log("Le document a bien été inséré idDocument");
			});
			//console.log(doc);
		} else {
			console.log("Le document est déjà en base idDocument: " + games[i].idDocument);
		}
	}
}




