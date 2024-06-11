const axios = require('axios');
const config = require('../../../Config');


async function tiktokdl(link){
    const apiUrl = config.api_Url+'/api/json';
    const options = {
        url: link,
        isTTFullAudio: false,
    };

    const response = await axios.post(apiUrl, options, {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
    });

    const json = response.data;

    const resultUrl = json.url;
    return resultUrl;
}

module.exports = tiktokdl;




