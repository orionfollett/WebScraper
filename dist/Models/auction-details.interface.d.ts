export interface AuctionDetails {
    county: string;
    status: string;
    date: string;
    caseId: string;
    parcelId: string;
    address: string;
    appraisedValue: string;
    openingBid: string;
    requiredDeposit: string;
    amountSoldFor: string;
    soldTo: string;
}
export interface AuctionDetailsList {
    auctionDetailsList: AuctionDetails[];
}
export declare function EmptyAuctionDetails(): AuctionDetails;
