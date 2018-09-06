const mongoose = require('mongoose');
const DBCONNECT = 'mongodb://seb:test123@ds229552.mlab.com:29552/grrrrr';
var db = mongoose.connection;

module.exports = {
    conDb: function() {
        console.log("Hello");
        var options = {useNewUrlParser: true};
        mongoose.connect(DBCONNECT, options);
        db.on('error', console.error.bind(console, 'Erreur lors de la connexion'));
        db.once('open', function () {
            console.log("Connexion à la base OK");
            return db;
            //return "Connexion à la base OK";
        });
    }
}

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

/*module.exports = {
    hello: function() {
        console.log("Hello");
    }
}*/
