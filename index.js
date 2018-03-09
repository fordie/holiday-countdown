/*
* @Author: mark
* @Date:   2018-03-02 16:10:28
* @Last Modified by:   Mark Ford
* @Last Modified time: 2018-03-09 10:37:40
*/
const DateDiff = require('date-diff');
const MongoClient = require('mongodb').MongoClient;
const dbConnection = require('./dbConnection.js');
const url = 'mongodb://'+ dbConnection.user +':'+ dbConnection.password + '@' + dbConnection.url ;

const holidays = function(db, callback) {
  // list the holidays from mongo
    var collection = db.collection('holidays');

    collection.find().toArray(function(err,holidayList){
        if (err) throw err;
        // call the getHolidays method 
        getHolidays(holidayList[0]);
    });

};

MongoClient.connect(url, function(err, client){
    if (err) throw err;
    holidays(client.db('holidays'), function(){
        db.close();
    });
});


const today = new Date();

const getHolidays =  function(holidayList){
  // create empty array to store upcoming trips
	let holidayCountdowns = [];
	for (var h in holidayList.holidays){
    // loop over the array returned from mongo
		if(holidayList.holidays.hasOwnProperty(h)){
      // work out the difference in days between now and departure
      let diff = new DateDiff(new Date(holidayList.holidays[h].departure), today);
      let daysToGo = Math.floor(diff.days());
      // ignore past trips
      if (daysToGo > -1){
        // add upcoming trips to the holidayContdowns array
        holidayCountdowns.push(
          {destination: holidayList.holidays[h].destination, 
          days: Math.floor(diff.days())
          });
      }
    }
	}
	console.log('You have ' + holidayCountdowns.length + ' upcoming trips');
	holidayCountdowns.sort(function(a, b){
	    return a.days-b.days;
	});
	console.log(holidayCountdowns.sort());
};


