import axios from 'axios';

export default class Search {
    constructor(query) {
        this.query = query;
    }

    async getResults() {
        try {
            // res will contain the JSON response 
            const res = await axios(`https://forkify-api.herokuapp.com/api/search?&q=${this.query}`);
            // data.recipes is an object in the JSON response
            this.result = res.data.recipes;
            // console.log(this.result);
        } catch (error) {
            alert(error);
        }

    }
}