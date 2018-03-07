/*
* @Author: mark
* @Date:   2018-03-02 16:10:28
* @Last Modified by:   Mark Ford
* @Last Modified time: 2018-03-07 15:56:10
*/
const DateDiff = require('date-diff');
const MongoClient = require('mongodb').MongoClient;
const dbConnection = require('./dbConnection.js');
const url = 'mongodb://'+ dbConnection.user +':'+ dbConnection.password + '@' + dbConnection.url ;
const holidays = function(db, callback) {
    var collection = db.collection('holidays');

    collection.find().toArray(function(err,holidayList){
        if (err) throw err;
        getHolidays(holidayList[0]);
    })

}

MongoClient.connect(url, function(err, client){
    if (err) throw err;
    // console.log("it is working");
    // db.close();
    holidays(client.db('holidays'), function(){
        db.close();
    });
})


const today = new Date()
getHolidays =  function(holidayList){
	let holidayCountdowns = []
	for (var h in holidayList.holidays){
		let diff = new DateDiff(new Date(holidayList.holidays[h].departure), today);
		let daysToGo = Math.floor(diff.days())
		if (daysToGo > -1){
			holidayCountdowns.push(
				{destination: holidayList.holidays[h].destination, 
				days: Math.floor(diff.days())
				})
		}
	}
	console.log('You have ' + holidayCountdowns.length + ' upcoming trips')
	holidayCountdowns.sort(function(a, b){
	    return a.days-b.days
	})
	console.log(holidayCountdowns.sort())
}


