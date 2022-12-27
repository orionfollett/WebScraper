const { writeFile, appendFile } = require('fs').promises;
const { json2csvAsync } = require('json-2-csv');

export async function writeCSV(fileName, data) {
    const csv = await json2csvAsync(data);
    await writeFile(fileName, csv, 'utf8');
}

//does not delete data already within the csv
export async function appendCSV(fileName : string, data, skipFirstLine : boolean) {
    let csv = await json2csvAsync(data);

    if(skipFirstLine){
        let newCsv = [];
        let lines = csv.split("\n");
        lines.forEach(function(item, i) {
            if(i !== 0){
                newCsv.push(item);
            } 
        })
  
        csv = newCsv.join("\n");
    }

    await appendFile(fileName, csv + "\n", 'utf8');
}