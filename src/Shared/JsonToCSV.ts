const { writeFile, readFile } = require('fs').promises;
const { json2csvAsync } = require('json-2-csv');

export async function writeCSV(fileName, data) {
    const csv = await json2csvAsync(data);
    await writeFile(fileName, csv, 'utf8');
}

//does not append data already within the csv
export async function appendCSV(fileName, data) {
    translateFile('../auctionData.csv');
}

async function translateFile(fileName : string) : Promise<string>{
    const fileContents = await readFile(
        fileName,
        { encoding: 'utf-8' },
    );
    console.log(fileContents);
    return fileContents;
}