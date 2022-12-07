"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var auction_details_interface_1 = require("./Models/auction-details.interface");
var JsonToCSV_1 = require("./Shared/JsonToCSV");
var countiesJson = require("../Counties/counties.json");
var puppeteer = require('puppeteer');
var selectors = {
    AUCTION_DETAILS: '[aria-label="Auction Details"]',
    STATUS: 'div.ASTAT_MSGB.Astat_DATA',
    AMOUNT_SOLD_FOR: 'div.ASTAT_MSGD.Astat_DATA',
    SOLD_TO: 'div.ASTAT_MSG_SOLDTO_MSG.Astat_DATA',
    TABLE: 'table tr td',
    TABLE_HEADER: 'table tr th',
    NEXT_AUCTION: 'Next Auction'
};
var tableSelectors = {
    CASE_STATUS: 'Case Status:',
    CASE_NUM: 'Case #:',
    PARCEL_ID: 'Parcel ID:',
    ADDRESS: 'Property Address:',
    APPRAISED_VALUE: 'Appraised Value:',
    OPENING_BID: 'Opening Bid:',
    DEPOSIT: 'Deposit Requirement:',
    CITY: ''
};
var county = process.env.npm_config_county;
var date = process.env.npm_config_date;
var auctionCount = parseInt(process.env.npm_config_count);
if (!county) {
    console.log("missing county arg!");
    process.exit(1);
}
if (!date) {
    console.log("missing date arg!");
    process.exit(1);
}
if (!auctionCount) {
    console.log("Missing arg: auction count, defaulting to 1");
    auctionCount = 1;
}
var fileName = "auctionData.csv";
var finalResult = [];
var startingUrl = "https://{county}.sheriffsaleauction.ohio.gov/index.cfm?zaction=AUCTION&zmethod=PREVIEW&AuctionDate={date}";
var counties = [];
function scrape(url) {
    return __awaiter(this, void 0, void 0, function () {
        var browser, page, error_1, auctionDetails, data, nextAuction;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log("URL: " + url);
                    return [4, puppeteer.launch()];
                case 1:
                    browser = _a.sent();
                    return [4, browser.newPage()];
                case 2:
                    page = _a.sent();
                    _a.label = 3;
                case 3:
                    _a.trys.push([3, 5, , 6]);
                    return [4, page.goto(url, { waitUntil: "networkidle2" })];
                case 4:
                    _a.sent();
                    return [3, 6];
                case 5:
                    error_1 = _a.sent();
                    console.log(error_1);
                    return [2, ""];
                case 6: return [4, page.$$(selectors.AUCTION_DETAILS)];
                case 7:
                    auctionDetails = _a.sent();
                    return [4, ParseAuctionDetails(auctionDetails, url)];
                case 8:
                    data = _a.sent();
                    finalResult = __spreadArrays(finalResult, data.auctionDetailsList);
                    return [4, GetNextAuction(page)];
                case 9:
                    nextAuction = _a.sent();
                    return [4, browser.close()];
                case 10:
                    _a.sent();
                    return [2, nextAuction];
            }
        });
    });
}
function GetNextAuction(page) {
    return __awaiter(this, void 0, void 0, function () {
        var nextAuctionUrl, allLinks;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    nextAuctionUrl = "";
                    return [4, page.$$('a')];
                case 1:
                    allLinks = _a.sent();
                    return [4, Promise.all(allLinks.map(function (val) { return __awaiter(_this, void 0, void 0, function () {
                            var text;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4, val.getProperty('textContent')];
                                    case 1: return [4, (_a.sent()).jsonValue()];
                                    case 2:
                                        text = _a.sent();
                                        if (!(text.indexOf(selectors.NEXT_AUCTION) != -1)) return [3, 5];
                                        console.log(text);
                                        return [4, val.getProperty('href')];
                                    case 3: return [4, (_a.sent()).jsonValue()];
                                    case 4:
                                        nextAuctionUrl = _a.sent();
                                        _a.label = 5;
                                    case 5: return [2];
                                }
                            });
                        }); }))];
                case 2:
                    _a.sent();
                    return [2, nextAuctionUrl];
            }
        });
    });
}
function ParseAuctionDetails(auctionDetails, url) {
    return __awaiter(this, void 0, void 0, function () {
        var result;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    result = { auctionDetailsList: [] };
                    return [4, Promise.all(auctionDetails.map(function (auctionDetail) { return __awaiter(_this, void 0, void 0, function () {
                            var auctionDetails, amount, soldTo, _a, tableHeaders, tableValues, tablePairs;
                            return __generator(this, function (_b) {
                                switch (_b.label) {
                                    case 0:
                                        auctionDetails = auction_details_interface_1.EmptyAuctionDetails();
                                        return [4, elementToText(auctionDetail, selectors.AMOUNT_SOLD_FOR)];
                                    case 1:
                                        amount = _b.sent();
                                        return [4, elementToText(auctionDetail, selectors.SOLD_TO)];
                                    case 2:
                                        soldTo = _b.sent();
                                        _a = auctionDetails;
                                        return [4, elementToText(auctionDetail, selectors.STATUS)];
                                    case 3:
                                        _a.status = _b.sent();
                                        return [4, auctionDetail.$$eval(selectors.TABLE_HEADER, function (ths) { return ths.map(function (th) {
                                                return th.textContent;
                                            }); })];
                                    case 4:
                                        tableHeaders = _b.sent();
                                        return [4, auctionDetail.$$eval(selectors.TABLE, function (tds) { return tds.map(function (td) {
                                                return td.textContent;
                                            }); })];
                                    case 5:
                                        tableValues = _b.sent();
                                        auctionDetails.amountSoldFor = amount;
                                        auctionDetails.soldTo = soldTo;
                                        tablePairs = translateHeadersToData(tableHeaders, tableValues);
                                        auctionDetails.caseId = tablePairs[tableSelectors.CASE_NUM].trim();
                                        auctionDetails.parcelId = tablePairs[tableSelectors.PARCEL_ID].trim();
                                        auctionDetails.address = tablePairs[tableSelectors.ADDRESS].trim();
                                        auctionDetails.county = tablePairs[tableSelectors.CITY].trim();
                                        auctionDetails.appraisedValue = tablePairs[tableSelectors.APPRAISED_VALUE].trim();
                                        auctionDetails.openingBid = tablePairs[tableSelectors.OPENING_BID].trim();
                                        auctionDetails.requiredDeposit = tablePairs[tableSelectors.DEPOSIT].trim();
                                        auctionDetails.date = getDateFromUrl(url);
                                        auctionDetails.link = url;
                                        result.auctionDetailsList.push(auctionDetails);
                                        return [2];
                                }
                            });
                        }); }))];
                case 1:
                    _a.sent();
                    return [2, result];
            }
        });
    });
}
function translateHeadersToData(keys, values) {
    var result = {};
    keys.map(function (val, index) {
        result[val] = values[index];
    });
    return result;
}
function elementToText(element, dataSelector) {
    return __awaiter(this, void 0, void 0, function () {
        var amount;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4, element.$(dataSelector)];
                case 1:
                    amount = _a.sent();
                    return [4, amount.evaluate(function (el) { return el.textContent; })];
                case 2: return [2, _a.sent()];
            }
        });
    });
}
function getDateFromUrl(url) {
    return url.slice(url.indexOf("AuctionDate") + 12, url.indexOf("AuctionDate") + 22);
}
function formatUrl(date, county) {
    var res = startingUrl.replace("{county}", county);
    return res.replace("{date}", date);
}
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var i, nextUrl, j;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log("STARTING SCRAPE:");
                    console.log("Num Auctions: " + auctionCount);
                    if (county == "all") {
                        counties = countiesJson["all-counties"];
                    }
                    else if (county == "close") {
                        counties = countiesJson.closeCounties;
                    }
                    else {
                        counties.push(county);
                    }
                    console.log("Counties being checked: " + counties);
                    i = 0;
                    _a.label = 1;
                case 1:
                    if (!(i < counties.length)) return [3, 6];
                    nextUrl = formatUrl(date, counties[i]);
                    j = 0;
                    _a.label = 2;
                case 2:
                    if (!(j < auctionCount)) return [3, 5];
                    if (!(nextUrl != "")) return [3, 4];
                    return [4, scrape(nextUrl)];
                case 3:
                    nextUrl = _a.sent();
                    _a.label = 4;
                case 4:
                    j++;
                    return [3, 2];
                case 5:
                    i++;
                    return [3, 1];
                case 6:
                    JsonToCSV_1.convertCSV(fileName, finalResult);
                    return [2];
            }
        });
    });
}
main();
console.log("DONE");
//# sourceMappingURL=scraper.js.map