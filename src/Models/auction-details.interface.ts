export interface AuctionDetails{
    county : string;
    status : string;
    date : string;
    caseId: string;
    parcelId : string;
    address : string;
    appraisedValue : string;
    openingBid : string;
    requiredDeposit : string;
    amountSoldFor : string;
    soldTo : string;
    link : string;
};

export interface AuctionDetailsList{
    auctionDetailsList : AuctionDetails[];
};

export function EmptyAuctionDetails() : AuctionDetails{
    return {
        county: "",
        status :"",
        date : "",
        caseId: "",
        parcelId : "",
        address : "",
        appraisedValue : "",
        openingBid : "",
        requiredDeposit : "",
        amountSoldFor : "",
        soldTo : "",
        link : ""
    };
}