var express = require('express');
var app = express();
var connectDb = require('../mongo')
const mongoose = require('mongoose');
const DBCONNECT = 'mongodb://seb:test123@ds229552.mlab.com:29552/grrrrr';
const db = connectDb.conDb();


app.get('/ligue1', (req, res) => {
	//console.log(req.params.team);
	var db = mongoose.connection;
	var query = Games.find({'teams.home_team': /metz/i});
	//var query = Games.find({home_team: /metz/i});
	/*var query = Games.find(
		{
			teams: { home_team: /metz/i }
		}
	);*/


	query.exec(function(err, results){
		//return results;	
		res.json(results);
	});
	
	//res.json(promise);	
	
	/*Games.find(function (error, results) {
        res.json(results);
    })*/
});



app.listen(3000);


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
//app.close();