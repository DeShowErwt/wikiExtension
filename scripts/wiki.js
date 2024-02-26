// Use this file to make calls to the Wikipedia API
// https://www.mediawiki.org/wiki/API:Main_page
const outlet = document.querySelector('#search_outlet');
const header = document.getElementById('help');
const errorContent = document.querySelector('error-content');
let wikiURL = "https://en.wikipedia.org/w/api.php?"

// Make this listen for any messages and execute this on that message
async function getWikiPage(page){
    wikiURL += new URLSearchParams({
        origin: "*",
        action: "parse",
        page: page.replace(' ', '_'),
        format: "json"
    })
    
    const req = await fetch(wikiURL)
    const json = await req.json();
    outlet.textContent = json
}