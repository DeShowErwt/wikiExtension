// Use this file to make calls to the Wikipedia API
var outlet = document.querySelector('#search_outlet');
var header = document.getElementById('help');
var errorContent = document.querySelector('error-content');

function run(){
    errorContent.classList.remove('hidden');
    console.log("i ran")
}

// Anything outside of a function is ran when the button is clicked