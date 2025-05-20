
import { ApplicationStatus, ApplicationType } from "./types";

export interface ApplicationListItem {
  id: string;
  application_type: ApplicationType;
  application_status: ApplicationStatus;
  submission_date: string | null;
  created_at: string;
  user_id: string;
  admin_notes?: string | null;
  business_information?: {
    business_name: string;
  } | null;
  owner_information?: {
    surname: string;
    given_name: string;
  } | null;
}

export interface ApplicationCounts {
  total: number;
  draft: number;
  submitted: number;
  under_review: number;
  approved: number;
  rejected: number;
  requires_additional_info: number;
  [key: string]: number;
}
