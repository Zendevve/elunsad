
export type ApplicationType = 'newApplication' | 'renewalApplication' | 'amendmentApplication';
export type ApplicationStatus = 'draft' | 'submitted' | 'processing' | 'approved' | 'rejected';
export type OwnershipType = 'soleProprietorship' | 'onePersonCorp' | 'partnership' | 'corporation' | 'cooperative';

export interface ApplicationData {
  id: string;
  application_type: ApplicationType;
  application_status: ApplicationStatus;
  submission_date?: string;
  user_id: string;
  created_at?: string;
  updated_at?: string;
}

export interface BusinessInformationData {
  id?: string;
  application_id: string;
  business_name: string;
  trade_name?: string;
  business_address?: string;
  nature_of_business?: string;
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
  date_established?: string;
  created_at?: string;
  updated_at?: string;
}

export interface OwnerInformationData {
  id?: string;
  application_id: string;
  surname: string;
  given_name: string;
  middle_name?: string;
  suffix?: string;
  age: number;
  sex: 'male' | 'female' | 'other';
  civil_status: 'single' | 'married' | 'widowed' | 'divorced' | 'separated';
  nationality: string;
  owner_house_bldg_no?: string;
  owner_building_name?: string;
  owner_block_no?: string;
  owner_lot_no?: string;
  owner_street: string;
  owner_subdivision?: string;
  owner_barangay: string;
  owner_city_municipality: string;
  owner_province: string;
  owner_zip_code: string;
  phone_number?: string;
  email_address?: string;
  created_at?: string;
  updated_at?: string;
}

export interface BusinessOperationsData {
  id?: string;
  application_id: string;
  business_activity?: string;
  business_area?: number;
  capitalization?: number;
  professional_male?: number;
  professional_female?: number;
  non_professional_male?: number;
  non_professional_female?: number;
  employees_in_lucena?: number;
  has_tax_incentives?: boolean;
  property_owned?: boolean;
  monthly_rental?: number;
  motorcycle?: number;
  van_truck?: number;
  other_vehicles?: number;
  cctv_cameras?: number;
  main_house_bldg_no?: string;
  main_building_name?: string;
  main_block_no?: string;
  main_lot_no?: string;
  main_street?: string;
  main_subdivision?: string;
  main_barangay?: string;
  main_city_municipality?: string;
  main_province?: string;
  main_zip_code?: string;
  tax_declaration_no?: string;
  lessor_full_name?: string;
  lessor_business_name?: string;
  lessor_address?: string;
  lessor_contact_number?: string;
  lessor_email_address?: string;
  created_at?: string;
  updated_at?: string;
}

export interface BusinessLinesData {
  id?: string;
  application_id: string;
  line_of_business: string;
  psic_code?: string;
  products_services: string;
  units?: string;
  gross_sales?: string;
  created_at?: string;
  updated_at?: string;
}

export interface DeclarationData {
  id?: string;
  application_id: string;
  signature: string | null;
  is_agreed: boolean;
  designation?: string;
  declaration_place?: string;
  verified_by?: string;
  created_at?: string;
  updated_at?: string;
}
