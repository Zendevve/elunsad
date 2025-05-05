export type ApplicationType = 'newApplication' | 'renewalApplication' | 'amendmentApplication';
export type ApplicationStatus = 'draft' | 'submitted' | 'processing' | 'approved' | 'rejected';

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
  business_address: string;
  nature_of_business: string;
  date_established?: string;
  email_address?: string;
  telephone_number?: string;
  mobile_number?: string;
  dti_sec_registration_number?: string;
  barangay_micro_business_permit_number?: string;
  gross_annual_income?: number;
  number_of_employees?: number;
  business_activities?: string;
  created_at?: string;
  updated_at?: string;
}

export interface OwnerInformationData {
  id?: string;
  application_id: string;
  owner_name: string;
  owner_address: string;
  owner_phone: string;
  owner_email: string;
  owner_nationality: string;
  owner_type: string;
  created_at?: string;
  updated_at?: string;
}

export interface BusinessOperationsData {
  id?: string;
  application_id: string;
  business_activity?: string;
  business_area?: number;
  capitalization?: number;
  total_employees?: number;  
  employees_in_lucena?: number;
  employees_male?: number;  // Replacing employees_male_count
  employees_female?: number;  // Replacing employees_female_count
  has_tax_incentives?: boolean;
  car?: number;
  van_truck?: number;
  motorcycle?: number;
  cctv_cameras?: number;
  security_guards?: number;
  created_at?: string;
  updated_at?: string;
}

export interface BusinessLinesData {
  id?: string;
  application_id: string;
  line_of_business: string;
  description?: string;
  units?: number;
  created_at?: string;
  updated_at?: string;
}

export interface DeclarationData {
  id?: string;
  application_id: string;
  signature: string | null;
  is_agreed: boolean;
  designation: string;  // Field for the person's name
  declaration_place: string;  // Field for the position/title
  verified_by?: string;
  created_at?: string;
  updated_at?: string;
}
