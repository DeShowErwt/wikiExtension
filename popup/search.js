const outlet = document.querySelector('#page-content')
const page_link = document.querySelector('#page-link')
const error_content = document.querySelector('#error-content')
const content = document.querySelector('#basic-content')
const searchButton = document.querySelector('#searchButton')
const searchInput = document.querySelector('#query')

function handleSearch(){
    let query = searchInput.value
    // Only search if an actual query has been entered
    if(query.trim()===''){reportExecuteScriptError('No input detected');return}
    // We are handling a url so spaces are not allowed, to make the input easier for the user we allow them to fill in spaces and convert those to _
    query = query.replace(' ', '_')
    // The base of any api call
    let wikiURL = "https://en.wikipedia.org/w/api.php?"
    // We only want to search on the parse API as that provides us with the page html which we need to converse
    wikiURL += new URLSearchParams({
        origin: "*",
        action: "parse",
        page: query,
        format: "json"
    })        

    fetch(wikiURL)
        .then(res=>res.json())
        .then(data=>{
            console.log(data)
            const wiki_html = data['parse']['text']['*']
            // Use JavaScript DOM manipulation to remove html tags, also allows for getting or removing specific elements
            const tempElement = document.createElement('div')
            tempElement.innerHTML=wiki_html
            // Only get the text from the just entered html
            const text = tempElement.textContent 
            // Only display the first n chars, we dont want to place the whole page within the small extension box but mainly want to display the introduction part
            outlet.textContent = text.substring(0,800);
            // If the user wants to read more we can insert the wikipedia url in this link easily and place it under the output
            page_link.innerHTML = '<a href="https://en.wikipedia.org/wiki/' + query + '" class="accent">Continue reading...</a>'
        })  
}


function listenForSearch(){
    //Searchbutton specific click listener
    searchButton.addEventListener("click", (e) => {handleSearch()})
    // For the whole document, if the enter button is pressed, search
    document.addEventListener("keyup", (e)=>{
        if(e.key === "Enter"){handleSearch()}
    })
}

// Run if an error is detected to display the error text
function reportExecuteScriptError(error){
    content.classList.add("hidden")
    error_content.classList.remove('hidden');
}

try{
    listenForSearch()
}
//If anything goes wrong we send that error to the reportExecuteScriptError
catch(e){reportExecuteScriptError(e)}