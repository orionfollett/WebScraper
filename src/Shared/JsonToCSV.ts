const { writeFile } = require('fs').promises;
const { json2csvAsync } = require('json-2-csv');

export async function convertCSV(fileName, data) {
    const csv = await json2csvAsync(data);
    await writeFile(fileName, csv, 'utf8');
}
