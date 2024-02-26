const outlet = document.querySelector('#search_outlet')
const error_content = document.querySelector('#error-content')
const content = document.querySelector('#basic_content')
const searchButton = document.querySelector('#searchButton')

function listenForClick(){
    searchButton.addEventListener("click", (e) => {
        //Working function
        outlet.textContent = "Wikipedia API not yet implemented, it will be as soon as possible!"    
    })
}

function reportExecuteScriptError(error){
    content.classList.add("hidden")
    error-content.classList.remove('hidden');
}


browser.tabs
    .executeScript({file:"/scripts/wiki.js"})
    .then(listenForClick)
    .catch(reportExecuteScriptError)