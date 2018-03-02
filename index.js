/*
* @Author: mark
* @Date:   2018-03-02 16:10:28
* @Last Modified by:   Mark Ford
* @Last Modified time: 2018-03-02 16:37:34
*/
var DateDiff = require('date-diff');

var today = new Date(); // 2015-12-1
var holiday = new Date(2018, 4, 22); // 2014-01-1
 
var diff = new DateDiff(holiday, today);

console.log(Math.floor(diff.days()))