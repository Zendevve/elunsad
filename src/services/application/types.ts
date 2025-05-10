
// Application type definitions
export type ApplicationType = 'newApplication' | 'renewalApplication' | 'amendmentApplication';
export type ApplicationStatus = 'draft' | 'submitted' | 'under_review' | 'approved' | 'rejected' | 'requires_additional_info';
export type OwnershipType = 'sole_proprietorship' | 'partnership' | 'corporation' | 'cooperative';

export interface BusinessInformationData {
  application_id: string;
  business_name: string;
  trade_name?: string;
  registration_number?: string;
  tin_number: string;
  sss_number?: string;
  ctc_number?: string;
  ctc_date_issue?: string;
  ctc_place_issue?: string;
  ownership_type: OwnershipType; 
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
  website_url?: string;
  fb_page_url?: string;
  business_description?: string;
}

export interface OwnerInformationData {
  application_id: string;
  surname: string;
  given_name: string;
  middle_name?: string;
  suffix?: string;
  age: number;
  sex: 'male' | 'female' | 'other';
  civil_status: 'single' | 'married' | 'widowed' | 'divorced' | 'separated';
  nationality: string;
  owner_street: string;
  owner_barangay: string;
  owner_city_municipality: string;
  owner_province: string;
  owner_zip_code: string;
  owner_house_bldg_no?: string;
  owner_building_name?: string;
  owner_block_no?: string;
  owner_lot_no?: string;
  owner_subdivision?: string;
  owner_address_remarks?: string;
}

export interface BusinessLinesData {
  application_id: string;
  id?: string;
  line_of_business: string;
  psic_code?: string;
  products_services: string;
  units?: string;
  gross_sales?: string;
  no_of_employees?: number;
}

export interface BusinessOperationsData {
  application_id: string;
  business_area?: number;
  employees_in_lucena?: number;
  capitalization?: number;
  property_owned?: boolean;
  monthly_rental?: number;
  lessor_full_name?: string;
  has_tax_incentives?: boolean;
}

export interface DeclarationData {
  application_id: string;
  is_agreed: boolean;
  signature: string;
  designation?: string;
  verified_by?: string;
  declaration_place?: string;
  declaration_text?: string;
}
