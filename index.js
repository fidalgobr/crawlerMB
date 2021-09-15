const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');

async function action(d) {
    const data = d.data;
    const $ = cheerio.load(data);
    let vezes = 0;

    for (let sr of $('.box-banner img')) {
        const imgSrc = sr.attribs.src;
        if (/\/ids\//g.test(imgSrc)) {
            const dooEt = async() => {
                let errorParam = false;
                await axios.get(imgSrc, { responseType: 'stream' }).then(r => {
                    r.data.pipe(fs.createWriteStream(path.join(__dirname, 'arquivos/celebridades', `imagem${vezes}.jpg`)));
                    vezes++;
                }).catch(e => {
                    errorParam = true;
                });
                return errorParam;
            }

            let resultadoErr = await dooEt();
            while (resultadoErr) {
                resultadoErr = await dooEt();
            }
            if (!resultadoErr) {
                console.log(`Sucesso! ${vezes}`)
            }
        } else {
            continue;
        }
    }

}

axios.get('https://www.macrobaby.com/celebrities').then(d => {
        action(d)
    })
    .catch(e => console.log('Erro!'))
