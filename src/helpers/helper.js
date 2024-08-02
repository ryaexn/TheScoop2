/*
    HBS Helper Functions
*/
const { format } = require('date-fns');

function times(n, block) {
    var accum = '';
    for (var i = 0; i < n; ++i) {
        accum += block.fn(i);
    }
    return accum;
}

function ifEquals(v1, v2, options) {
    if(v1 === v2) {
      return options.fn(this);
    }
    return options.inverse(this);
  }

function ifMultipleOf(v1, v2, options){
    if((v1 + 1) % v2 == 0){
        return options.fn(this);
    }
    return options.inverse(this);
}

function ifGreaterThan(v1, v2, options){
    if (v1 > v2){
        return options.fn(this);
    }
    return options.inverse(this);
}

function formatDate(dateString) {
    // Parse the date string
    const date = new Date(dateString);
    
    // Get the month, date, and year
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    const year = date.getFullYear();
    
    // Return the formatted date
    return `${month}/${day}/${year}`;
}
  
function shortenString(str, maxWords){
    
    if (!str) return '';
    const words = str.split(' ');
    return words.slice(0, maxWords).join(' ') + (words.length > maxWords ? ' ...' : '');
    
}

module.exports = { 
    times, 
    ifEquals, 
    ifMultipleOf, 
    ifGreaterThan, 
    formatDate,
    shortenString
}