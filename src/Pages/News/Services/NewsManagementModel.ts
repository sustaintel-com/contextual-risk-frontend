// --- Master / Lookup Tables ---
export interface State {
    id: number;
    name: string;
}

export interface District {
    id: number;
    stateId: number;
    name: string;
}

export interface GeographicalLocation {
    id: number;
    districtId: number;
    name: string;
    pincode?: string;
}

export interface MasterOption {
    id: number;
    name: string;
}

// --- Main News Record Entity ---
export interface NewsArticle {
    id: number;
    
    // Parent-Child Geographic foreign keys
    stateId: number;
    districtId: number;
    geographicalLocationId: number;

    // Master Table foreign keys
    themeId: number;
    infoTypeId: number;
    industryId: number;
    sectorId: number;

    // Direct input fields
    topics: string;      
    caseId: string;      
    dateYear: string;     
    newsTitle: string;   
    newsUrl: string;    
}