
import { supabase } from "@/integrations/supabase/client";

// Types for application data
export type ApplicationType = 'newApplication' | 'renewalApplication' | 'amendmentApplication';
export type ApplicationStatus = 'draft' | 'submitted' | 'under_review' | 'approved' | 'rejected' | 'requires_additional_info';
export type OwnershipType = 'soleProprietorship' | 'onePersonCorp' | 'partnership' | 'corporation' | 'cooperative';
export type CivilStatus = 'single' | 'married' | 'widowed' | 'divorced' | 'separated';
export type Sex = 'male' | 'female';

export interface ApplicationData {
  id?: string;
  application_type: ApplicationType;
}

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
}

export interface OwnerInformationData {
  application_id: string;
  surname: string;
  given_name: string;
  middle_name?: string;
  suffix?: string;
  civil_status: CivilStatus;
  age: number;
  sex: Sex;
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
}

export interface BusinessLinesData {
  application_id: string;
  line_of_business: string;
  psic_code?: string;
  products_services: string;
  units?: string;
  gross_sales?: string;
}

export interface BusinessOperationsData {
  application_id: string;
  business_area?: number;
  cctv_cameras?: number;
  professional_male?: number;
  professional_female?: number;
  non_professional_male?: number;
  non_professional_female?: number;
  employees_in_lucena?: number;
  van_truck?: number;
  motorcycle?: number;
  other_vehicles?: number;
  capitalization?: number;
  has_tax_incentives?: boolean;
  property_owned?: boolean;
  tax_declaration_no?: string;
  business_activity?: string;
  other_activity?: string;
  main_block_no?: string;
  main_lot_no?: string;
  main_house_bldg_no?: string;
  main_building_name?: string;
  main_street?: string;
  main_subdivision?: string;
  main_barangay?: string;
  main_city_municipality?: string;
  main_province?: string;
  main_zip_code?: string;
  lessor_full_name?: string;
  lessor_business_name?: string;
  lessor_address?: string;
  lessor_contact_number?: string;
  lessor_email_address?: string;
  monthly_rental?: number;
}

export interface DeclarationData {
  application_id: string;
  is_agreed: boolean;
  signature: string;
  designation?: string;
  verified_by?: string;
  declaration_place?: string;
}
