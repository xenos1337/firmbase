import { Category } from "./categories.js";

export const Subcategory = {
    // AUTOMOTIVE
    GAS_STATION: "GAS_STATION",
    EV_CHARGING: "EV_CHARGING",
    CAR_WASH: "CAR_WASH",
    AUTO_REPAIR: "AUTO_REPAIR",
    PARTS_AND_ACCESSORIES: "PARTS_AND_ACCESSORIES",
    PARKING: "PARKING",

    // UTILITIES
    ELECTRICITY: "ELECTRICITY",
    GAS: "GAS",
    WATER: "WATER",
    INTERNET: "INTERNET",
    PHONE: "PHONE",
    CABLE: "CABLE",

    // TRANSPORT
    RIDE_SHARING: "RIDE_SHARING",
    TAXI: "TAXI",
    BUS: "BUS",
    RAIL: "RAIL",
    AIRLINE: "AIRLINE",
    CAR_RENTAL: "CAR_RENTAL",
    PUBLIC_TRANSPORT: "PUBLIC_TRANSPORT",

    // FOOD_AND_DRINK
    CAFE: "CAFE",
    FAST_FOOD: "FAST_FOOD",
    DELIVERY: "DELIVERY",
    CASUAL_DINING: "CASUAL_DINING",
    FINE_DINING: "FINE_DINING",
    BAR: "BAR",
    BAKERY: "BAKERY",

    // SHOPPING
    E_COMMERCE: "E_COMMERCE",
    MARKETPLACE: "MARKETPLACE",
    DEPARTMENT_STORE: "DEPARTMENT_STORE",
    ELECTRONICS: "ELECTRONICS",
    CLOTHING: "CLOTHING",
    PHARMACY: "PHARMACY",

    // ENTERTAINMENT
    STREAMING: "STREAMING",
    GAMING: "GAMING",
    MOVIES: "MOVIES",
    SPORTS: "SPORTS",
    MUSIC: "MUSIC",
    LOTTERY: "LOTTERY",

    // HOME
    IMPROVEMENT: "IMPROVEMENT",
    FURNITURE: "FURNITURE",
    APPLIANCES: "APPLIANCES",
    RENT: "RENT",
    MORTGAGE: "MORTGAGE",

    // FINANCE
    BANKING: "BANKING",
    INVESTMENTS: "INVESTMENTS",
    LOANS: "LOANS",
    TRANSFERS: "TRANSFERS",

    // HEALTHCARE
    HOSPITAL: "HOSPITAL",
    DENTAL: "DENTAL",
    VISION: "VISION",
    MENTAL_HEALTH: "MENTAL_HEALTH",

    // DIGITAL_SERVICES
    SOFTWARE: "SOFTWARE",
    CLOUD: "CLOUD",

    // EDUCATION
    TUITION: "TUITION",
    COURSES: "COURSES",
    BOOKS: "BOOKS",

    // TRAVEL
    HOTELS: "HOTELS",
    FLIGHTS: "FLIGHTS",
    VACATION_RENTALS: "VACATION_RENTALS",

    // GROCERIES
    SUPERMARKET: "SUPERMARKET",
    CONVENIENCE: "CONVENIENCE",
    SPECIALTY: "SPECIALTY",

    // PERSONAL_CARE
    SALON: "SALON",
    SPA: "SPA",
    COSMETICS: "COSMETICS",

    // PET_CARE
    VET: "VET",
    PET_SUPPLIES: "PET_SUPPLIES",
    GROOMING: "GROOMING",

    // SPORTS_AND_FITNESS
    GYM: "GYM",
    EQUIPMENT: "EQUIPMENT",
    EVENTS: "EVENTS",

    // INSURANCE
    AUTO_INSURANCE: "AUTO_INSURANCE",
    HEALTH_INSURANCE: "HEALTH_INSURANCE",
    HOME_INSURANCE: "HOME_INSURANCE",
    LIFE_INSURANCE: "LIFE_INSURANCE",

    // GIFTS_AND_DONATIONS
    CHARITY: "CHARITY",
    GIFTS: "GIFTS",

    // FEES_AND_CHARGES
    BANK_FEES: "BANK_FEES",
    SERVICE_FEES: "SERVICE_FEES",
    LATE_FEES: "LATE_FEES",

    // GOVERNMENT
    TAXES: "TAXES",
    LICENSES: "LICENSES",
    FINES: "FINES",

    // SERVICES
    PROFESSIONAL: "PROFESSIONAL",
    HOUSEHOLD: "HOUSEHOLD",
    LEGAL: "LEGAL",

    // ATM
    WITHDRAWAL: "WITHDRAWAL",
    DEPOSIT: "DEPOSIT",
} as const;

export type Subcategory = (typeof Subcategory)[keyof typeof Subcategory];

export const SUBCATEGORIES = Object.values(Subcategory);

export const SUBCATEGORY_TO_CATEGORY: Record<Subcategory, Category> = {
    // AUTOMOTIVE
    [Subcategory.GAS_STATION]: Category.AUTOMOTIVE,
    [Subcategory.EV_CHARGING]: Category.AUTOMOTIVE,
    [Subcategory.CAR_WASH]: Category.AUTOMOTIVE,
    [Subcategory.AUTO_REPAIR]: Category.AUTOMOTIVE,
    [Subcategory.PARTS_AND_ACCESSORIES]: Category.AUTOMOTIVE,
    [Subcategory.PARKING]: Category.AUTOMOTIVE,

    // UTILITIES
    [Subcategory.ELECTRICITY]: Category.UTILITIES,
    [Subcategory.GAS]: Category.UTILITIES,
    [Subcategory.WATER]: Category.UTILITIES,
    [Subcategory.INTERNET]: Category.UTILITIES,
    [Subcategory.PHONE]: Category.UTILITIES,
    [Subcategory.CABLE]: Category.UTILITIES,

    // TRANSPORT
    [Subcategory.RIDE_SHARING]: Category.TRANSPORT,
    [Subcategory.TAXI]: Category.TRANSPORT,
    [Subcategory.BUS]: Category.TRANSPORT,
    [Subcategory.RAIL]: Category.TRANSPORT,
    [Subcategory.AIRLINE]: Category.TRANSPORT,
    [Subcategory.CAR_RENTAL]: Category.TRANSPORT,
    [Subcategory.PUBLIC_TRANSPORT]: Category.TRANSPORT,

    // FOOD_AND_DRINK
    [Subcategory.CAFE]: Category.FOOD_AND_DRINK,
    [Subcategory.FAST_FOOD]: Category.FOOD_AND_DRINK,
    [Subcategory.DELIVERY]: Category.FOOD_AND_DRINK,
    [Subcategory.CASUAL_DINING]: Category.FOOD_AND_DRINK,
    [Subcategory.FINE_DINING]: Category.FOOD_AND_DRINK,
    [Subcategory.BAR]: Category.FOOD_AND_DRINK,
    [Subcategory.BAKERY]: Category.FOOD_AND_DRINK,

    // SHOPPING
    [Subcategory.E_COMMERCE]: Category.SHOPPING,
    [Subcategory.MARKETPLACE]: Category.SHOPPING,
    [Subcategory.DEPARTMENT_STORE]: Category.SHOPPING,
    [Subcategory.ELECTRONICS]: Category.SHOPPING,
    [Subcategory.CLOTHING]: Category.SHOPPING,
    [Subcategory.PHARMACY]: Category.SHOPPING,

    // ENTERTAINMENT
    [Subcategory.STREAMING]: Category.ENTERTAINMENT,
    [Subcategory.GAMING]: Category.ENTERTAINMENT,
    [Subcategory.MOVIES]: Category.ENTERTAINMENT,
    [Subcategory.SPORTS]: Category.ENTERTAINMENT,
    [Subcategory.MUSIC]: Category.ENTERTAINMENT,
    [Subcategory.LOTTERY]: Category.ENTERTAINMENT,

    // HOME
    [Subcategory.IMPROVEMENT]: Category.HOME,
    [Subcategory.FURNITURE]: Category.HOME,
    [Subcategory.APPLIANCES]: Category.HOME,
    [Subcategory.RENT]: Category.HOME,
    [Subcategory.MORTGAGE]: Category.HOME,

    // FINANCE
    [Subcategory.BANKING]: Category.FINANCE,
    [Subcategory.INVESTMENTS]: Category.FINANCE,
    [Subcategory.LOANS]: Category.FINANCE,
    [Subcategory.TRANSFERS]: Category.FINANCE,

    // HEALTHCARE
    [Subcategory.HOSPITAL]: Category.HEALTHCARE,
    [Subcategory.DENTAL]: Category.HEALTHCARE,
    [Subcategory.VISION]: Category.HEALTHCARE,
    [Subcategory.MENTAL_HEALTH]: Category.HEALTHCARE,

    // DIGITAL_SERVICES
    [Subcategory.SOFTWARE]: Category.DIGITAL_SERVICES,
    [Subcategory.CLOUD]: Category.DIGITAL_SERVICES,

    // EDUCATION
    [Subcategory.TUITION]: Category.EDUCATION,
    [Subcategory.COURSES]: Category.EDUCATION,
    [Subcategory.BOOKS]: Category.EDUCATION,

    // TRAVEL
    [Subcategory.HOTELS]: Category.TRAVEL,
    [Subcategory.FLIGHTS]: Category.TRAVEL,
    [Subcategory.VACATION_RENTALS]: Category.TRAVEL,

    // GROCERIES
    [Subcategory.SUPERMARKET]: Category.GROCERIES,
    [Subcategory.CONVENIENCE]: Category.GROCERIES,
    [Subcategory.SPECIALTY]: Category.GROCERIES,

    // PERSONAL_CARE
    [Subcategory.SALON]: Category.PERSONAL_CARE,
    [Subcategory.SPA]: Category.PERSONAL_CARE,
    [Subcategory.COSMETICS]: Category.PERSONAL_CARE,

    // PET_CARE
    [Subcategory.VET]: Category.PET_CARE,
    [Subcategory.PET_SUPPLIES]: Category.PET_CARE,
    [Subcategory.GROOMING]: Category.PET_CARE,

    // SPORTS_AND_FITNESS
    [Subcategory.GYM]: Category.SPORTS_AND_FITNESS,
    [Subcategory.EQUIPMENT]: Category.SPORTS_AND_FITNESS,
    [Subcategory.EVENTS]: Category.SPORTS_AND_FITNESS,

    // INSURANCE
    [Subcategory.AUTO_INSURANCE]: Category.INSURANCE,
    [Subcategory.HEALTH_INSURANCE]: Category.INSURANCE,
    [Subcategory.HOME_INSURANCE]: Category.INSURANCE,
    [Subcategory.LIFE_INSURANCE]: Category.INSURANCE,

    // GIFTS_AND_DONATIONS
    [Subcategory.CHARITY]: Category.GIFTS_AND_DONATIONS,
    [Subcategory.GIFTS]: Category.GIFTS_AND_DONATIONS,

    // FEES_AND_CHARGES
    [Subcategory.BANK_FEES]: Category.FEES_AND_CHARGES,
    [Subcategory.SERVICE_FEES]: Category.FEES_AND_CHARGES,
    [Subcategory.LATE_FEES]: Category.FEES_AND_CHARGES,

    // GOVERNMENT
    [Subcategory.TAXES]: Category.GOVERNMENT,
    [Subcategory.LICENSES]: Category.GOVERNMENT,
    [Subcategory.FINES]: Category.GOVERNMENT,

    // SERVICES
    [Subcategory.PROFESSIONAL]: Category.SERVICES,
    [Subcategory.HOUSEHOLD]: Category.SERVICES,
    [Subcategory.LEGAL]: Category.SERVICES,

    // ATM
    [Subcategory.WITHDRAWAL]: Category.ATM,
    [Subcategory.DEPOSIT]: Category.ATM,
};
