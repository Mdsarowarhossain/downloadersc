const { default: axios } = require("axios");
const cheerio = require("cheerio");
const fs = require("fs");
const { dirname } = require("path");
const path = require("path");

async function main(url) {
    const dirPath = 'output';

  const respnse = await axios.get(url);

  const $ = cheerio.load(respnse.data);
  const hrefs = $("a")
    .map((i, el) => $(el).attr("href"))
    .get();

  const data = hrefs
    .filter((link) => {
      return link.endsWith(".txt");
    })
    .map((item) => url + item);
    console.log(data);

    //downloadin the file
    data.forEach(iurl=>{
        const fileName = path.basename(iurl);
    
        axios({
            url:iurl ,
            method: 'GET',
            responseType: 'stream'
          }).then(response => {
            const writer = fs.createWriteStream(path.resolve(__dirname,dirPath,fileName));
            response.data.pipe(writer);
            writer.on('finish', () => {
              console.log('File downloaded successfully!', fileName);
            });
          }).catch(error => {
            console.error(error);
          });
    })


    


    

}
main("https://cran.r-project.org/bin/macos/");
