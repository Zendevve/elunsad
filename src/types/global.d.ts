
// Global type definitions

// Define the proper type for setTimeout returns
declare type TimeoutId = ReturnType<typeof setTimeout>;

// Types for declaration data coming from database
interface DeclarationData {
  application_id: string;
  is_agreed: boolean;
  signature: string;
  designation?: string;
  verified_by?: string;
  declaration_place?: string;
}

// Types for business information data coming from database
interface BusinessInformationData {
  application_id: string;
  business_name: string;
  trade_name?: string;
  registration_number?: string;
  tin_number: string;
  sss_number?: string;
  ctc_number?: string;
  ctc_date_issue?: string;
  ctc_place_issue?: string;
  ownership_type: string;
  house_bldg_no?: string;
  building_name?: string;
  block_no?: string;
  lot_no?: string;
  street: string;
  subdivision?: string;
  barangay: string;
  city_municipality: string;
  province: string;
  zip_code: string;
  telephone_no?: string;
  mobile_no: string;
  email_address: string;
}
