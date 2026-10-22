/**
 * USPS Accurate Address & Regional Shipping Calculator
 * Calculates precise USPS shipping rates and delivery estimates based on customer State and ZIP code.
 */

export interface ShippingRateCalculation {
  zone: number;
  zoneName: string;
  groundFee: number;
  priorityFee: number;
  effectiveGroundFee: number | null; // null if address not provided and not qualified for free shipping
  effectiveFee: number | null; // null if not yet calculated
  estimatedDays: string;
  isRemoteOrIslands: boolean;
  freeShippingQualified: boolean;
  transitDescription: string;
  isCalculated: boolean;
}

// Contiguous US State Zone Mapping (relative to US Central/West Fulfillment Hubs)
const STATE_ZONE_MAP: Record<string, { zone: number; name: string; isRemote?: boolean }> = {
  // Local / Neighboring Hub States (Zone 1-2)
  TX: { zone: 2, name: 'Central US Local Zone' },
  OK: { zone: 2, name: 'Central US Local Zone' },
  LA: { zone: 2, name: 'Central US Local Zone' },
  AR: { zone: 2, name: 'Central US Local Zone' },
  NM: { zone: 2, name: 'Central US Local Zone' },

  // Mid-Range Regional States (Zone 3-5)
  FL: { zone: 4, name: 'Southeast Regional Zone' },
  GA: { zone: 4, name: 'Southeast Regional Zone' },
  AL: { zone: 3, name: 'Southeast Regional Zone' },
  MS: { zone: 3, name: 'Southeast Regional Zone' },
  TN: { zone: 3, name: 'Southeast Regional Zone' },
  SC: { zone: 4, name: 'Southeast Regional Zone' },
  NC: { zone: 4, name: 'Southeast Regional Zone' },
  KY: { zone: 4, name: 'Midwest Regional Zone' },
  OH: { zone: 4, name: 'Midwest Regional Zone' },
  IN: { zone: 4, name: 'Midwest Regional Zone' },
  IL: { zone: 4, name: 'Midwest Regional Zone' },
  MO: { zone: 3, name: 'Midwest Regional Zone' },
  KS: { zone: 3, name: 'Midwest Regional Zone' },
  IA: { zone: 4, name: 'Midwest Regional Zone' },
  NE: { zone: 4, name: 'Midwest Regional Zone' },
  WI: { zone: 4, name: 'Midwest Regional Zone' },
  MN: { zone: 5, name: 'Midwest Regional Zone' },
  MI: { zone: 5, name: 'Midwest Regional Zone' },
  CO: { zone: 4, name: 'Mountain West Zone' },
  AZ: { zone: 4, name: 'Southwest Zone' },
  UT: { zone: 5, name: 'Mountain West Zone' },
  NV: { zone: 5, name: 'West Regional Zone' },

  // Long Distance / Coast-to-Coast (Zone 6-8)
  CA: { zone: 6, name: 'West Coast Zone' },
  OR: { zone: 7, name: 'Pacific Northwest Zone' },
  WA: { zone: 7, name: 'Pacific Northwest Zone' },
  ID: { zone: 6, name: 'Northwest Regional Zone' },
  MT: { zone: 7, name: 'Northern Mountain Zone' },
  WY: { zone: 6, name: 'Northern Mountain Zone' },
  ND: { zone: 6, name: 'Northern Plains Zone' },
  SD: { zone: 6, name: 'Northern Plains Zone' },
  NY: { zone: 7, name: 'East Coast Zone' },
  PA: { zone: 6, name: 'East Coast Zone' },
  NJ: { zone: 7, name: 'East Coast Zone' },
  MA: { zone: 7, name: 'Northeast Zone' },
  CT: { zone: 7, name: 'Northeast Zone' },
  RI: { zone: 7, name: 'Northeast Zone' },
  NH: { zone: 8, name: 'Northeast Zone' },
  VT: { zone: 8, name: 'Northeast Zone' },
  ME: { zone: 8, name: 'Northeast Zone' },
  VA: { zone: 6, name: 'Mid-Atlantic Zone' },
  MD: { zone: 6, name: 'Mid-Atlantic Zone' },
  DE: { zone: 6, name: 'Mid-Atlantic Zone' },
  DC: { zone: 6, name: 'Mid-Atlantic Zone' },
  WV: { zone: 5, name: 'Mid-Atlantic Zone' },

  // Non-Contiguous & Remote Territories (Zone 9)
  AK: { zone: 9, name: 'Alaska Non-Contiguous Air', isRemote: true },
  HI: { zone: 9, name: 'Hawaii Pacific Non-Contiguous', isRemote: true },
  PR: { zone: 9, name: 'Puerto Rico Caribbean Territory', isRemote: true },
  GU: { zone: 9, name: 'Guam Pacific Territory', isRemote: true },
  VI: { zone: 9, name: 'US Virgin Islands Territory', isRemote: true },
};

/**
 * Complete map of US full state names and territories to 2-letter postal abbreviations
 */
export const US_STATE_NAME_TO_CODE: Record<string, string> = {
  ALABAMA: 'AL',
  ALASKA: 'AK',
  ARIZONA: 'AZ',
  ARKANSAS: 'AR',
  CALIFORNIA: 'CA',
  COLORADO: 'CO',
  CONNECTICUT: 'CT',
  DELAWARE: 'DE',
  'DISTRICT OF COLUMBIA': 'DC',
  FLORIDA: 'FL',
  GEORGIA: 'GA',
  HAWAII: 'HI',
  IDAHO: 'ID',
  ILLINOIS: 'IL',
  INDIANA: 'IN',
  IOWA: 'IA',
  KANSAS: 'KS',
  KENTUCKY: 'KY',
  LOUISIANA: 'LA',
  MAINE: 'ME',
  MARYLAND: 'MD',
  MASSACHUSETTS: 'MA',
  MICHIGAN: 'MI',
  MINNESOTA: 'MN',
  MISSISSIPPI: 'MS',
  MISSOURI: 'MO',
  MONTANA: 'MT',
  NEBRASKA: 'NE',
  NEVADA: 'NV',
  'NEW HAMPSHIRE': 'NH',
  'NEW JERSEY': 'NJ',
  'NEW MEXICO': 'NM',
  'NEW YORK': 'NY',
  'NORTH CAROLINA': 'NC',
  'NORTH DAKOTA': 'ND',
  OHIO: 'OH',
  OKLAHOMA: 'OK',
  OREGON: 'OR',
  PENNSYLVANIA: 'PA',
  'RHODE ISLAND': 'RI',
  'SOUTH CAROLINA': 'SC',
  'SOUTH DAKOTA': 'SD',
  TENNESSEE: 'TN',
  TEXAS: 'TX',
  UTAH: 'UT',
  VERMONT: 'VT',
  VIRGINIA: 'VA',
  WASHINGTON: 'WA',
  'WEST VIRGINIA': 'WV',
  WISCONSIN: 'WI',
  WYOMING: 'WY',
  'PUERTO RICO': 'PR',
  GUAM: 'GU',
  'VIRGIN ISLANDS': 'VI',
};

/**
 * Normalizes state input to standard 2-letter USPS postal code
 */
export function normalizeStateCode(input: string = ''): string {
  const clean = (input || '').trim().toUpperCase().replace(/[^A-Z\s]/g, '');
  if (!clean) return '';
  if (clean.length === 2 && STATE_ZONE_MAP[clean]) {
    return clean;
  }
  if (US_STATE_NAME_TO_CODE[clean]) {
    return US_STATE_NAME_TO_CODE[clean];
  }
  return clean;
}

/**
 * Infer state code from US 5-digit ZIP prefix if state is empty or needs auto-fill
 */
export function getStateFromZip(zip: string): string | null {
  const cleanZip = zip.replace(/[^0-9]/g, '').slice(0, 3);
  if (!cleanZip || cleanZip.length < 3) return null;
  const num = parseInt(cleanZip, 10);

  if (num >= 995 && num <= 999) return 'AK';
  if (num >= 967 && num <= 968) return 'HI';
  if (num >= 6 && num <= 9) return 'PR';
  if (num >= 100 && num <= 149) return 'NY';
  if (num >= 900 && num <= 961) return 'CA';
  if (num >= 750 && num <= 799) return 'TX';
  if (num >= 320 && num <= 349) return 'FL';
  if (num >= 600 && num <= 629) return 'IL';
  if (num >= 150 && num <= 196) return 'PA';
  if (num >= 430 && num <= 459) return 'OH';
  if (num >= 300 && num <= 319) return 'GA';
  if (num >= 270 && num <= 289) return 'NC';
  if (num >= 480 && num <= 499) return 'MI';
  if (num >= 70 && num <= 89) return 'NJ';
  if (num >= 220 && num <= 246) return 'VA';
  if (num >= 980 && num <= 994) return 'WA';
  if (num >= 850 && num <= 865) return 'AZ';
  if (num >= 10 && num <= 27) return 'MA';
  if (num >= 370 && num <= 385) return 'TN';
  if (num >= 460 && num <= 479) return 'IN';
  if (num >= 630 && num <= 658) return 'MO';
  if (num >= 206 && num <= 219) return 'MD';
  if (num >= 550 && num <= 567) return 'MN';
  if (num >= 800 && num <= 816) return 'CO';
  if (num >= 350 && num <= 369) return 'AL';
  if (num >= 290 && num <= 299) return 'SC';
  if (num >= 700 && num <= 714) return 'LA';
  if (num >= 400 && num <= 427) return 'KY';
  if (num >= 970 && num <= 979) return 'OR';
  if (num >= 730 && num <= 749) return 'OK';
  if (num >= 60 && num <= 69) return 'CT';
  if (num >= 530 && num <= 549) return 'WI';
  if (num >= 840 && num <= 847) return 'UT';
  if (num >= 500 && num <= 528) return 'IA';
  if (num >= 890 && num <= 898) return 'NV';
  if (num >= 716 && num <= 729) return 'AR';
  if (num >= 386 && num <= 397) return 'MS';
  if (num >= 660 && num <= 679) return 'KS';
  if (num >= 870 && num <= 884) return 'NM';
  if (num >= 680 && num <= 693) return 'NE';
  if (num >= 250 && num <= 268) return 'WV';
  if (num >= 832 && num <= 838) return 'ID';
  if (num >= 200 && num <= 205) return 'DC';
  if (num >= 40 && num <= 49) return 'ME';
  if (num >= 28 && num <= 29) return 'RI';
  if (num >= 30 && num <= 38) return 'NH';
  if (num >= 50 && num <= 59) return 'VT';
  if (num >= 590 && num <= 599) return 'MT';
  if (num >= 197 && num <= 199) return 'DE';
  if (num >= 570 && num <= 577) return 'SD';
  if (num >= 580 && num <= 588) return 'ND';
  if (num >= 820 && num <= 831) return 'WY';

  return null;
}

/**
 * Calculates exact USPS shipping rate based on customer destination address
 */
export function calculatePreciseShipping(
  stateCode: string = '',
  zipCode: string = '',
  discountedSubtotal: number = 0,
  deliveryOption: 'usps_ground' | 'usps_priority' = 'usps_ground',
  hasFreeShippingCoupon: boolean = false
): ShippingRateCalculation {
  const cleanZip = (zipCode || '').replace(/[^0-9]/g, '');
  const zipState = cleanZip.length >= 3 ? getStateFromZip(cleanZip) : null;
  const normalizedState = normalizeStateCode(stateCode);

  // Authoritative USPS destination resolution:
  // If a valid ZIP code is provided, its postal routing takes precedence.
  // Otherwise, fallback to the normalized state code.
  const effectiveState = zipState || (normalizedState && STATE_ZONE_MAP[normalizedState] ? normalizedState : normalizedState) || '';
  const isAddressProvided = Boolean(effectiveState);

  // Free shipping threshold for contiguous US is $45
  const freeThreshold = 45.0;
  const qualifiesForFreeShippingByAmount = discountedSubtotal >= freeThreshold;

  const zoneInfo = effectiveState && STATE_ZONE_MAP[effectiveState]
    ? STATE_ZONE_MAP[effectiveState]
    : { zone: 4, name: isAddressProvided ? 'Standard US Zone' : 'Standard Shipping' };
  const isRemote = Boolean(zoneInfo.isRemote);

  let groundFee = 4.95;
  let priorityFee = 9.95;
  let estimatedDays = isAddressProvided ? '3–4 Business Days' : '3–4 Business Days (Estimated)';
  let transitDescription = isAddressProvided
    ? `USPS Ground Advantage (${zoneInfo.name})`
    : 'Calculated at checkout';

  if (effectiveState) {
    switch (zoneInfo.zone) {
      case 2:
        groundFee = 3.95;
        priorityFee = 7.95;
        estimatedDays = '2–3 Business Days';
        transitDescription = `USPS Ground Advantage · ${zoneInfo.name}`;
        break;
      case 3:
      case 4:
      case 5:
        groundFee = 4.95;
        priorityFee = 9.95;
        estimatedDays = '3–4 Business Days';
        transitDescription = `USPS Ground Advantage · ${zoneInfo.name}`;
        break;
      case 6:
      case 7:
      case 8:
        groundFee = 5.95;
        priorityFee = 11.95;
        estimatedDays = '3–5 Business Days';
        transitDescription = `USPS Ground Advantage · ${zoneInfo.name}`;
        break;
      case 9:
        groundFee = 8.95;
        priorityFee = 15.95;
        estimatedDays = '4–7 Business Days';
        transitDescription = `USPS Air Freight · ${zoneInfo.name}`;
        break;
      default:
        groundFee = 4.95;
        priorityFee = 9.95;
        estimatedDays = '3–5 Business Days';
        transitDescription = `USPS Ground Advantage (${effectiveState})`;
    }
  }

  let freeShippingQualified = false;
  let effectiveGroundFee: number | null = null;
  let isCalculated = false;

  if (hasFreeShippingCoupon) {
    freeShippingQualified = true;
    effectiveGroundFee = 0;
    isCalculated = true;
    transitDescription = 'FREE (FREESHIP Coupon)';
  } else if (!isRemote && qualifiesForFreeShippingByAmount) {
    freeShippingQualified = true;
    effectiveGroundFee = 0;
    isCalculated = true;
    transitDescription = 'FREE (Orders $45+)';
  } else if (isRemote && qualifiesForFreeShippingByAmount) {
    freeShippingQualified = true;
    effectiveGroundFee = 4.95; // reduced air surcharge for remote non-contiguous
    isCalculated = true;
    transitDescription = `USPS Reduced Air · ${zoneInfo.name}`;
  } else if (isAddressProvided) {
    // Address provided and order < $45
    effectiveGroundFee = groundFee;
    isCalculated = true;
  } else {
    // No address provided and not qualified for free shipping
    effectiveGroundFee = null;
    isCalculated = false;
    transitDescription = 'Calculated at checkout';
  }

  const effectiveFee: number | null = !isCalculated
    ? null
    : deliveryOption === 'usps_priority'
    ? priorityFee
    : effectiveGroundFee;

  return {
    zone: zoneInfo.zone,
    zoneName: zoneInfo.name,
    groundFee,
    priorityFee,
    effectiveGroundFee,
    effectiveFee,
    estimatedDays: deliveryOption === 'usps_priority' ? '1–3 Business Days' : estimatedDays,
    isRemoteOrIslands: isRemote,
    freeShippingQualified,
    transitDescription:
      deliveryOption === 'usps_priority'
        ? `USPS Priority Express (1–3 Days · Tracked Air)`
        : transitDescription,
    isCalculated,
  };
}
