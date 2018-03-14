/*
* @Author: mark
* @Date:   2018-03-02 16:10:28
* @Last Modified by:   Mark Ford
* @Last Modified time: 2018-03-14 12:31:02
*/
const DateDiff = require('date-diff');
const MongoClient = require('mongodb').MongoClient;
const dbConnection = require('./dbConnection.js');
const url = 'mongodb://'+ dbConnection.user +':'+ dbConnection.password + '@' + dbConnection.url ;
const today = new Date();

const Alexa = require('alexa-sdk');

const holidays = {
  init: function(){
    MongoClient.connect(url, function(err, client){
      if (err) throw err;
        holidays.retrieve(client.db('holidays'), function(){
            db.close();
        });
    });
  },
  retrieve: function(db, callback) {
  // list the holidays from mongo
    var collection = db.collection('holidays');

    collection.find().toArray(function(err, holidayList){
        if (err) throw err;
        // call the getHolidays method 
        holidays.compose(holidayList[0]);
        console.log(tellCountdowns)
    });
  },
  compose: function(holidayList){
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
  holidayCountdowns.sort(function(a, b){
      return a.days-b.days;
  });
  holidayCountdowns = holidayCountdowns.sort();

  let descriptions = ''
    for (var h in holidayCountdowns){
      if(holidayCountdowns.hasOwnProperty(h)){
        let separator = ' '
        if(h < holidayCountdowns.length){
          separator = ', '
        }
        if(h == holidayCountdowns.length - 2){
          separator = ' and '
        }
        descriptions = descriptions + holidayCountdowns[h].destination + ' in ' + holidayCountdowns[h].days + ' days' + separator
    }
  }
  tellCountdowns = 'You have ' + holidayCountdowns.length + ' upcoming trips. You\'re going to ' + descriptions;
}

}



exports.handler = function(event, context, callback){
  let alexa = Alexa.handler(event, context);
  alexa.registerHandlers(handlers);
  alexa.execute()
};


let handlers = {
  'LaunchRequest': function(){
    this.emit(':ask', 'Welcome to Holiday Countdown, try saying when is my holiday?')
  },
  'howLongIntent': function(){
    returnHolidays()
    this.emit(':tell', tellCountdowns)
  },

}

holidays.init()
