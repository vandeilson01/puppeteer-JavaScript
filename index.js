const pup = require('puppeteer')

const url = 'https://www.mercadolivre.com.br/';
const seachFor =  'macbook';

let c = 1;

const list = Array();

(async () =>{
    const browser = await pup.launch({headless: false});
    const page = await browser.newPage();
    console.log('iniciei');
    
    await page.goto(url);
    console.log('Foi para a URL');

    await page.waitForSelector('#cb1-edit');

    await page.type('#cb1-edit', seachFor);

    await  Promise.all([
        page.waitForNavigation(),
        await page.click('.nav-search-btn')
    ]);


    const links = await page.$$eval('.ui-search-result__image > a', el => el.map(link => link.href));

    //console.log(links);

    for(const link of links){

        if(c === 10) continue;
        console.log('Página', c);
        await page.goto(link);
        await page.waitForSelector('.ui-pdp-title');

        const title = await page.$eval('.ui-pdp-title', elemet => elemet.innerText);
        const price = await page.$eval('.andes-money-amount__fraction', elemet => elemet.innerText);

        const seller = await page.evaluate(()=>{
            const el = document.querySelector('.ui-pdp-seller__link-trigger');
            if(!el) return null;
            return el.innerText;
        });

        const obj = {};
        obj.title - title;
        obj.price = price;
        (seller ? obj.seller = seller : '');
        // console.log(obj);
        obj.link = link;

        list.push(obj);

        c++;
    }

    

    console.log(list);

    await page.waitForTimeout(3000);
    await browser.close();


})();