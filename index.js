const axios = require('axios').default;
fs = require('fs');


async function main(){

    let tokenURL = "https://opentdb.com/api_token.php?command=request";
    let categoryURL = "https://opentdb.com/api_category.php";
    let questionURL = `https://opentdb.com/api.php?amount=50&category=${c.id}&token=${token}`;

    let data = (await axios.get(tokenURL)).data;
    if (data.response_code != 0) return "could not get api key";
    let token = data.token;

    data = (await axios.get(categoryURL)).data;
    let categories = data.trivia_categories;

    let questionNumber = 0;
    for(let c of categories){
        let data;
        do { //rely on token to generate unique questions
            data = (await axios.get(questionURL)).data;
            c.questions = c.questions ? [...c.questions, ...data.results] : []; 
            console.log(`Pulling from category ${c.name}:${c.id} question# ${questionNumber+=50}`);    
        } while (data.response_code == 0);
    }

    fs.writeFileSync("categories.json", JSON.stringify(categories));
    console.log("wrote file, categories.json");

    return "Done!"
}

main().then(console.log);