const page_title = document.querySelector('#page-title')
const outlet = document.querySelector('#search_outlet')
const outlet_content = document.querySelector('#page-content')
const page_link = document.querySelector('#page-link')
const error_content = document.querySelector('#error-content')
const error_message = document.querySelector('#error-message')
const searchButton = document.querySelector('#searchButton')
const searchInput = document.querySelector('#query')
const modeToggleButton = document.querySelector('#modeToggleButton')
// We only have one body element so doing the elements by tag and getting the first item works
const body = document.getElementsByTagName('body').item(0)

// Function that takes care of removing any non-informative classes from the response
function cleanupResponse(htmlElement, removalClasses){
    for(i=0;i < removalClasses.length;i++){
        // Get all elements from the given html
        removalList = htmlElement.getElementsByClassName(removalClasses[i])
        // Everytime we remove an element from the list its length gets 1 shorter, until the list is empty (length = 0), keep removing until this is the case
        while(0<removalList.length){removalList.item(0).remove()}
    }
    return htmlElement.textContent
}

function handleSearch(){
    let query = searchInput.value
    // Only search if an actual query has been entered
    if(query.trim()===''){reportError('No input detected');return}
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
            try{
                // The wikipedia response for an existing page will have this structure
                wiki_html = data['parse']['text']['*']
            }catch{
                // If the error is that the article does not exist the code will be missingtitle, in that case we want to give some extra information about how to search the correct way
                if(data['error']['code'] == 'missingtitle'){
                    reportError('There is no article with that name. Did you use the correct capitalization? For common nouns capitalize only the first word.')
                }
                // If the error message is different we want to display the error info the API itself gives us  
                else {
                    reportError(data['error']['info'])
                }
            }
            // Use JavaScript DOM manipulation to remove html tags, also allows for getting or removing specific elements
            tempElement = document.createElement('div')
            tempElement.innerHTML=wiki_html

            // Let the short description be the title as it is most likely part of the answer the user is looking for
            title = tempElement.getElementsByClassName('shortdescription').item(0)
            page_title.textContent = title.textContent
            //Since we make this element a header we dont want it displayed in the further text
            title.remove()

            // Style elements contain non-readable text but it gets recognized by JS as such
            styleItemsList = tempElement.getElementsByTagName('style')
            while(0 < styleItemsList.length){styleItemsList.item(0).remove()}

            // Create a list with the classname of items that need to be removed for information on what all these classes are check REMOVALCLASSES.md
            classesToRemove = ['infobox', 'hatnote', 'reference', 'ext-phonos','ambox']
            // Remove the classes just entered in the function, the function returns the text we want only, this will be saved in a text variable
            text = cleanupResponse(tempElement, classesToRemove)
            // Only display the first n chars, we dont want to place the whole page within the small extension box but mainly want to display the introduction part
            outlet_content.textContent = text.substring(0,800) + '...';
            // If the user wants to read more we can insert the wikipedia url in this link easily and place it under the output
            page_link.innerHTML = '<a href="https://en.wikipedia.org/wiki/' + query + '" class="accent">Continue reading</a>'
        }).catch(reportError('Trouble getting the Wikipedia page, are you connected to the internet?'))  
}


function listenForSearch(){
    //Searchbutton specific click listener
    searchButton.addEventListener("click", (e) => {handleSearch()})
    // For the whole document, if the enter button is pressed, search
    document.addEventListener("keyup", (e)=>{
        if(e.key === "Enter"){handleSearch()}
    })
}

function listenForModeToggle(){
    modeToggleButton.addEventListener("click", (e)=>{
        let classes = body.classList
        if(classes.contains('lightmode')){
            classes.remove('lightmode')
            classes.add('darkmode')
            modeToggleButton.textContent = 'Lightmode'
            return
        }
        classes.remove('darkmode')
        classes.add('lightmode')
        modeToggleButton.textContent = 'Darkmode'
        return
    })
}

// Run if an error is detected to display the error text
function reportError(errorMessage){
    // Dont disable all content on error, only disable the outlet, showing the issue and allowing the user to continue
    outlet.classList.add("hidden")
    error_content.classList.remove('hidden');
    error_message.textContent = errorMessage;
}

try{
    listenForSearch()
    listenForModeToggle()
}
//If anything goes wrong we send that error to the reportExecuteScriptError
catch(e){reportError(e)}