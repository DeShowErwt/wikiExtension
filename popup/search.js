const outlet = document.querySelector('#page_content')
const page_link = document.querySelector('#page_link')
const error_content = document.querySelector('#error-content')
const content = document.querySelector('#basic_content')
const searchButton = document.querySelector('#searchButton')
const searchInput = document.querySelector('#query')

function listenForClick(){
    searchButton.addEventListener("click", (e) => {
        //Working function
        let query = searchInput.value
        // if(query.trim()===''){reportExecuteScriptError('No input detected');return}
        console.log(searchInput.value)
        query = query.replace(' ', '_')
        let wikiURL = "https://en.wikipedia.org/w/api.php?"
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
                console.log(tempElement.firstChild['outerText'].textContent)
                tempElement.firstChild.removeChild(tempElement.firstChild.firstChild)
                const text = tempElement.textContent 
                outlet.textContent = text.substring(0,800);
                page_link.innerHTML = '<a href="https://en.wikipedia.org/wiki/' + query + '">Continue reading...</a>'
            })  
    })
}

function reportExecuteScriptError(error){
    content.classList.add("hidden")
    error_content.classList.remove('hidden');
}

listenForClick()