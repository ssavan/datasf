var express = require('express');
var app = express();
//var createEngine = require('node-twig').createEngine;
//var puppeteer = require('puppeteer');
/*var wget = require('node-wget');
var fs = require('fs');
var parser = require('xml2js').Parser();
const mongoose = require('mongoose');
const DBCONNECT = 'mongodb://seb:test123@ds229552.mlab.com:29552/grrrrr';
var db = mongoose.connection;*/

module.exports = {
    conDb: function () {
        var options = {useNewUrlParser: true};
        mongoose.connect(DBCONNECT, options);
        db.on('error', console.error.bind(console, 'Erreur lors de la connexion'));
        db.once('open', function () {
            return "Connexion à la base OK";
        });
    }
}
module.exports = {
    hello: function() {
        return "Hello";
    }
}

// wget({
// 		url:  'http://www.matchendirect.fr/rss/foot-ligue-1-c16.xml',
// 		dest: './xml/',
// 		timeout: 2000 // duration to wait for request fulfillment in milliseconds, default is 2 seconds
// 	},
// 	function (error, response, body) {
// 		if (error) {
// 			console.log('--- error:');
// 			console.log(error);            // error encountered
// 		} else {
// 			console.log('--- headers:');
// 			console.log(response.headers); // response headers
// 			console.log('--- body:');
// 			console.log(body);             // content of package
// 		}
// 	}
// );

// function readXmlFile(file) {
// // 	var items;
// // 	var itemss;
// 	 fs.readFile(file, function (err, data) {
// 		 var x= parser.parseString(data, function (err, result) {
//
// 			return result.rss.channel[0].item;
// 			//return result;
// 			//console.log(items);
// 			// var i = 0;
// 			// for (i; i < items; i++) {
// 			// 	console.log('lol');
// 			// }
// 			//console.log('Done');
// 		});
// 	console.log(x);
// 	})
//
// 	//console.log(datas);
// };

//var file = './xml/foot-ligue-1-c16.xml';

// function readXmlFile(file) {
// 	var content = null;
// 	fs.readFile(file, 'utf8', function (err, data) {
// 		if (err) {
// 			console.log(err)
// 		}
// 		//parse xml
// 		parser.parseString(data, function (err, result) {
// 			items = result.rss.channel[0].item;
// 			var i = 0;
// 			items.forEach(function(game) {
// 				console.log(game.title);
// 			})
// 			//console.log(items);
// 		})
// 		//content = data;
// 		//console.log(content)
// 	});
//
// 	//return content;
// };

function readXmlFile(file) {
    connectDb();
    var content = null;
    fs.readFile(file, 'utf8', function (err, data) {
        if (err) {
            console.log(err)
        }
        //parse xml
        parser.parseString(data, function (err, result) {
            var idDocument = result.SoccerFeed.SoccerDocument[0].$.uID;
            Games.find({ idDocument: idDocument }, function(err, document) {
                // console.log(document.length);process.exit();
                if(typeof document !== 'undefined' && document.length > 0)
                {
                    console.log('Le document est deja en base id: ' + idDocument);
                } else {
                    //insert document
                    var game = insertDocuments(result, idDocument);
                    //console.log(game);process.exit;
                    db.collection("games").insertOne(game, null, function (error, results) {
                        if (error) throw error;

                        console.log("Le document a bien été inséré");
                    });
                }
            });
            // //console.log(idDocument);process.exit();
        })
    });
};

/*app.engine('.twig', createEngine({
    root: __dirname + '/views',
}));

app.get('/ligue-1', function(req, res){
    //connectDb(DBCONNECT);
    Games.find(function (error, results) {
        res.json(results);
    })
});*/

function insertDocuments(result, idDocument)
{
    //console.log(result);
    var competition_name = result.SoccerFeed.SoccerDocument[0].Competition[0].Name.toString();
    var season_name = result.SoccerFeed.SoccerDocument[0].Competition[0].Stat[0];
    var home_team;
    var away_team;
    result.SoccerFeed.SoccerDocument[0].Team.forEach(function(value, key){
        if(key == 0)
        {
            home_team = value.Name.toString();
        }

        if(key == 1)
        {
            away_team = value.Name.toString();
        }
    });

    var date = result.SoccerFeed.SoccerDocument[0].MatchData[0].MatchInfo[0].Date.toString()
    var game = {
        idDocument: idDocument,
        competition: competition_name,
        competition_year: "2017-2018",
        date: date,
        teams: {
            home_team: home_team,
            home_game_goals: 4,
            away_team: away_team,
            away_team_goals: 2,
        }
    }

    return game;
}
function test() {
    db.collection("games").find(function (error, results) {
        console.log(res.json(results));
        process.exit();
        results.forEach(function (obj) {
            res.render('ligue1.twig', {
                context: {
                    games: results,
                }
            });
        });
    })
}

var gamesSchema = mongoose.Schema({
    idDocument: String,
    competition: String,
    competition_year: String,
    date: String,
    teams: {
        home_team: String,
        home_game_goals: String,
        away_team: String,
        away_team_goals: String
    }
});

var Games = mongoose.model('Games', gamesSchema);

function saveDocument(game) {
    connectDb();
    var options = { useNewUrlParser: true };
    mongoose.connect(DBCONNECT, options);
    var db = mongoose.connection;
    db.on('error', console.error.bind(console, 'Erreur lors de la connexion'));
    db.once('open', function () {
        console.log("Connexion à la base OK");
    });

    db.collection("games").insert(game, null, function (error, results) {
        if (error) throw error;

        console.log("Le document a bien été inséré");
    });
}

//test();
//saveDocument();
//console.log(readXmlFile('./xml/foot-ligue-1-c16.xml'));
//readJsonFile('./xml/test.json');
// readXmlFile('./xml/matchresult.xml');
// app.listen(3000);
//app.close();

function readJsonFile(file) {
    var content = null;
    fs.readFile(file, 'utf8', function (err, data) {
        if (err) {
            console.log(err)
        }
        //parse json
        matches = JSON.parse(data)
        matches.forEach(function (game) {
            //console.log(game.fields.home_team, game.fields.away_team)
            var game = {
                competition: "Ligue 1",
                competition_year: "2017-2018",
                date: game.fields.start_date,
                teams: {
                    home_team: game.fields.home_team,
                    home_game_goals: game.fields.home_goal,
                    away_team: game.fields.away_team,
                    away_team_goals: game.fields.away_goal,
                }
            }
            console.log(game);
            saveDocument(game);
        })
    });
    //return content;
};