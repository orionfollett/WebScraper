import { ElementHandle, Browser, Page } from "puppeteer";
import { AuctionDetails, AuctionDetailsList, EmptyAuctionDetails } from "./Models/auction-details.interface";
import { convertCSV } from "./Shared/JsonToCSV";
import * as countiesJson from "../Counties/counties.json";
import { resourceLimits } from "worker_threads";

//Command to run
//npm --date=11/18/2022 --county=summit --count=3 run start

const puppeteer = require('puppeteer');

//define selector constants:
const selectors = {
    AUCTION_DETAILS : '[aria-label="Auction Details"]', 
    STATUS : 'div.ASTAT_MSGB.Astat_DATA',
    AMOUNT_SOLD_FOR : 'div.ASTAT_MSGD.Astat_DATA', 
    SOLD_TO : 'div.ASTAT_MSG_SOLDTO_MSG.Astat_DATA',
    TABLE : 'table tr td',
    TABLE_HEADER : 'table tr th',
    NEXT_AUCTION : 'Next Auction'
};

const tableSelectors = {
    CASE_STATUS : 'Case Status:',
    CASE_NUM : 'Case #:',
    PARCEL_ID : 'Parcel ID:',
    ADDRESS : 'Property Address:',
    APPRAISED_VALUE : 'Appraised Value:',
    OPENING_BID : 'Opening Bid:',
    DEPOSIT : 'Deposit Requirement:',
    CITY : ''
};

//get args
let county: string | undefined = process.env.npm_config_county; // if it's all, will get from config file
let date: string | undefined = process.env.npm_config_date; // starting date
let auctionCount: number | undefined = parseInt(process.env.npm_config_count); // number of auctions past starting date
//let auctionCount = 3;

if(!county){
    console.log("missing county arg!");
    process.exit(1);
}

if(!date){
    console.log("missing date arg!");
    process.exit(1);
}

if(!auctionCount){
    console.log("Missing arg: auction count, defaulting to 1");
    auctionCount = 1;
}

//file to write too
const fileName : string = "auctionData.csv";
let finalResult : AuctionDetails[] = [];

//format url
const startingUrl : string = "https://{county}.sheriffsaleauction.ohio.gov/index.cfm?zaction=AUCTION&zmethod=PREVIEW&AuctionDate={date}";
let counties = [];

//main scraping function, returns url to next auction when done, adds data to global finalResult variable
async function scrape(url : string) : Promise<string>{
  console.log("URL: " + url);
  const browser : Browser = await puppeteer.launch();
  const page : Page = await browser.newPage();
  try{
    await page.goto(url, {waitUntil: "networkidle2"});
  }
  catch(error){
    console.log(error);
    return "";
  }
  
  const auctionDetails : ElementHandle[] = await page.$$(selectors.AUCTION_DETAILS);
  const data : AuctionDetailsList = await ParseAuctionDetails(auctionDetails, url);
  
  finalResult = [...finalResult, ...data.auctionDetailsList];
  
  const nextAuction : string = await GetNextAuction(page);
  await browser.close();
  return nextAuction;
}

async function GetNextAuction(page : Page) : Promise<string>{
    let nextAuctionUrl = "";
    const allLinks = await page.$$('a');//get all links
    await Promise.all(allLinks.map(async (val) => {
    let text : string = await (await val.getProperty('textContent')).jsonValue();
    if(text.indexOf(selectors.NEXT_AUCTION) != -1){ //check the text content
        console.log(text);
        nextAuctionUrl = await (await val.getProperty('href')).jsonValue();
    }
  }));
    return nextAuctionUrl;
}

async function ParseAuctionDetails(auctionDetails : ElementHandle[], url : string): Promise<AuctionDetailsList>{
    let result : AuctionDetailsList = {auctionDetailsList : []};

    await Promise.all(auctionDetails.map(async (auctionDetail : ElementHandle) => {

        let auctionDetails : AuctionDetails = EmptyAuctionDetails();

        let amount = await elementToText(auctionDetail, selectors.AMOUNT_SOLD_FOR);
        let soldTo = await elementToText(auctionDetail, selectors.SOLD_TO);
        auctionDetails.status = await elementToText(auctionDetail, selectors.STATUS);

        const tableHeaders = await auctionDetail.$$eval(selectors.TABLE_HEADER, ths => ths.map((th) => {
            return th.textContent;
        }));

        const tableValues = await auctionDetail.$$eval(selectors.TABLE, tds => tds.map((td) => {
            return td.textContent;
        }));

        auctionDetails.amountSoldFor = amount;
        auctionDetails.soldTo = soldTo;

        const tablePairs: {[key: string]: string} = translateHeadersToData(tableHeaders, tableValues);

        // console.log("TABLE HEADERS: " + tableHeaders);
        // console.log("TABLE DATA: " + tableValues);
        // console.log(tablePairs);

        auctionDetails.caseId = tablePairs[tableSelectors.CASE_NUM].trim();
        auctionDetails.parcelId = tablePairs[tableSelectors.PARCEL_ID].trim();
        auctionDetails.address = tablePairs[tableSelectors.ADDRESS].trim()
        auctionDetails.county = tablePairs[tableSelectors.CITY].trim()
        auctionDetails.appraisedValue = tablePairs[tableSelectors.APPRAISED_VALUE].trim()
        auctionDetails.openingBid = tablePairs[tableSelectors.OPENING_BID].trim()
        auctionDetails.requiredDeposit = tablePairs[tableSelectors.DEPOSIT].trim()
        auctionDetails.date = getDateFromUrl(url);
        auctionDetails.link = url;
        result.auctionDetailsList.push(auctionDetails);
    }));

    return result;
}

function translateHeadersToData(keys : string[], values : string[]) : {[key: string]: string} {
    let result : {[key: string]: string} = {};

    keys.map((val, index) => {
        result[val] = values[index];
    });

    return result;
}

async function elementToText(element : ElementHandle, dataSelector : string) : Promise<string>{
    let amount = await element.$(dataSelector);
    return await amount.evaluate(el => el.textContent)
}

function getDateFromUrl(url : string) : string{
    return url.slice(url.indexOf("AuctionDate") + 12, url.indexOf("AuctionDate") + 22);
}

function formatUrl(date : string, county : string){
    let res : string = startingUrl.replace("{county}", county);
    return res.replace("{date}", date);
}

async function main() : Promise<void>{
    console.log("STARTING SCRAPE:");
    console.log("Num Auctions: " + auctionCount);
  
    if(county == "all"){
        counties = countiesJson["all-counties"];
    }
    else if(county == "close"){
        counties = countiesJson.closeCounties;
    }
    else{
        counties.push(county);
    }
    console.log("Counties being checked: " + counties);

    for(let i = 0; i < counties.length; i++){
        let nextUrl = formatUrl(date, counties[i]);
        for(let j = 0; j < auctionCount; j++){
            if(nextUrl != ""){
                nextUrl = await scrape(nextUrl);
            }
        }
    }
    //write all the data to a file
    convertCSV(fileName, finalResult);
}

main();
console.log("DONE");

//BUG LOG:
/*
- data table can have fewer rows in some cases: see case id: CV2019062353, url: https://summit.sheriffsaleauction.ohio.gov/index.cfm?zaction=AUCTION&zmethod=PREVIEW&AuctionDate=07/22/2022
- another example: https://logan.sheriffsaleauction.ohio.gov/index.cfm?zaction=AUCTION&zmethod=PREVIEW&AuctionDate=07/20/2022
- summit county is searched twice
- some posts have multiple pages
- add timer to check performance
- check date
*/