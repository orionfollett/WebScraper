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
exports.__esModule = true;
//Command to run
//npm --date=11/18/2022 --county=summit run start
var puppeteer = require('puppeteer');
//get args
var county = process.env.npm_config_county; //process.argv[2];//"summit";
var date = process.env.npm_config_date; //process.argv[3];//"11/18/2022";
if (!county) {
    console.log("missing county arg!");
    process.exit(1);
}
if (!date) {
    console.log("missing date arg!");
    process.exit(1);
}
//format url
var url = "https://{county}.sheriffsaleauction.ohio.gov/index.cfm?zaction=AUCTION&zmethod=PREVIEW&AuctionDate={date}";
url = url.replace("{county}", county);
url = url.replace("{date}", date);
console.log("URL: " + url);
//load page
(function () { return __awaiter(void 0, void 0, void 0, function () {
    var browser, page, auctionDetails;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, puppeteer.launch()];
            case 1:
                browser = _a.sent();
                return [4 /*yield*/, browser.newPage()];
            case 2:
                page = _a.sent();
                return [4 /*yield*/, page.goto(url, { waitUntil: 'networkidle2' })];
            case 3:
                _a.sent();
                return [4 /*yield*/, page.$$('[aria-label="Auction Details"]')];
            case 4:
                auctionDetails = _a.sent();
                auctionDetails.forEach(function (details) {
                    ParseAuctionDetails(details).then(function (value) {
                        console.log("Amout: " + value);
                    });
                });
                return [4 /*yield*/, browser.close()];
            case 5:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); })();
function ParseAuctionDetails(auctionDetail) {
    return __awaiter(this, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = divToText;
                    return [4 /*yield*/, auctionDetail.$("div.ASTAT_MSGD.Astat_DATA")];
                case 1: return [2 /*return*/, _a.apply(void 0, [_b.sent()])]; //sold amount        
            }
        });
    });
}
function divToText(element) {
    if (element) {
        return element.jsonValue.toString();
    }
    return "";
}
