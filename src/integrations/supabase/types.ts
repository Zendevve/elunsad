export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      applications: {
        Row: {
          application_status: Database["public"]["Enums"]["application_status_enum"]
          application_type: Database["public"]["Enums"]["application_type_enum"]
          created_at: string
          id: string
          submission_date: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          application_status?: Database["public"]["Enums"]["application_status_enum"]
          application_type: Database["public"]["Enums"]["application_type_enum"]
          created_at?: string
          id?: string
          submission_date?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          application_status?: Database["public"]["Enums"]["application_status_enum"]
          application_type?: Database["public"]["Enums"]["application_type_enum"]
          created_at?: string
          id?: string
          submission_date?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      business_information: {
        Row: {
          application_id: string
          barangay: string
          block_no: string | null
          building_name: string | null
          business_name: string
          city_municipality: string
          created_at: string
          ctc_date_issue: string | null
          ctc_number: string | null
          ctc_place_issue: string | null
          email_address: string
          house_bldg_no: string | null
          id: string
          lot_no: string | null
          mobile_no: string
          ownership_type: Database["public"]["Enums"]["ownership_type_enum"]
          province: string
          registration_number: string | null
          sss_number: string | null
          street: string
          subdivision: string | null
          telephone_no: string | null
          tin_number: string
          trade_name: string | null
          updated_at: string
          zip_code: string
        }
        Insert: {
          application_id: string
          barangay: string
          block_no?: string | null
          building_name?: string | null
          business_name: string
          city_municipality: string
          created_at?: string
          ctc_date_issue?: string | null
          ctc_number?: string | null
          ctc_place_issue?: string | null
          email_address: string
          house_bldg_no?: string | null
          id?: string
          lot_no?: string | null
          mobile_no: string
          ownership_type: Database["public"]["Enums"]["ownership_type_enum"]
          province: string
          registration_number?: string | null
          sss_number?: string | null
          street: string
          subdivision?: string | null
          telephone_no?: string | null
          tin_number: string
          trade_name?: string | null
          updated_at?: string
          zip_code: string
        }
        Update: {
          application_id?: string
          barangay?: string
          block_no?: string | null
          building_name?: string | null
          business_name?: string
          city_municipality?: string
          created_at?: string
          ctc_date_issue?: string | null
          ctc_number?: string | null
          ctc_place_issue?: string | null
          email_address?: string
          house_bldg_no?: string | null
          id?: string
          lot_no?: string | null
          mobile_no?: string
          ownership_type?: Database["public"]["Enums"]["ownership_type_enum"]
          province?: string
          registration_number?: string | null
          sss_number?: string | null
          street?: string
          subdivision?: string | null
          telephone_no?: string | null
          tin_number?: string
          trade_name?: string | null
          updated_at?: string
          zip_code?: string
        }
        Relationships: [
          {
            foreignKeyName: "business_information_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: true
            referencedRelation: "applications"
            referencedColumns: ["id"]
          },
        ]
      }
      business_lines: {
        Row: {
          application_id: string
          created_at: string
          gross_sales: string | null
          id: string
          line_of_business: string
          products_services: string
          psic_code: string | null
          units: string | null
          updated_at: string
        }
        Insert: {
          application_id: string
          created_at?: string
          gross_sales?: string | null
          id?: string
          line_of_business: string
          products_services: string
          psic_code?: string | null
          units?: string | null
          updated_at?: string
        }
        Update: {
          application_id?: string
          created_at?: string
          gross_sales?: string | null
          id?: string
          line_of_business?: string
          products_services?: string
          psic_code?: string | null
          units?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "business_lines_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "applications"
            referencedColumns: ["id"]
          },
        ]
      }
      business_operations: {
        Row: {
          application_id: string
          business_activity: string | null
          business_area: number | null
          capitalization: number | null
          cctv_cameras: number | null
          created_at: string
          employees_in_lucena: number | null
          has_tax_incentives: boolean | null
          id: string
          lessor_address: string | null
          lessor_business_name: string | null
          lessor_contact_number: string | null
          lessor_email_address: string | null
          lessor_full_name: string | null
          main_barangay: string | null
          main_block_no: string | null
          main_building_name: string | null
          main_city_municipality: string | null
          main_house_bldg_no: string | null
          main_lot_no: string | null
          main_province: string | null
          main_street: string | null
          main_subdivision: string | null
          main_zip_code: string | null
          monthly_rental: number | null
          motorcycle: number | null
          non_professional_female: number | null
          non_professional_male: number | null
          other_activity: string | null
          other_vehicles: number | null
          professional_female: number | null
          professional_male: number | null
          property_owned: boolean | null
          tax_declaration_no: string | null
          updated_at: string
          van_truck: number | null
        }
        Insert: {
          application_id: string
          business_activity?: string | null
          business_area?: number | null
          capitalization?: number | null
          cctv_cameras?: number | null
          created_at?: string
          employees_in_lucena?: number | null
          has_tax_incentives?: boolean | null
          id?: string
          lessor_address?: string | null
          lessor_business_name?: string | null
          lessor_contact_number?: string | null
          lessor_email_address?: string | null
          lessor_full_name?: string | null
          main_barangay?: string | null
          main_block_no?: string | null
          main_building_name?: string | null
          main_city_municipality?: string | null
          main_house_bldg_no?: string | null
          main_lot_no?: string | null
          main_province?: string | null
          main_street?: string | null
          main_subdivision?: string | null
          main_zip_code?: string | null
          monthly_rental?: number | null
          motorcycle?: number | null
          non_professional_female?: number | null
          non_professional_male?: number | null
          other_activity?: string | null
          other_vehicles?: number | null
          professional_female?: number | null
          professional_male?: number | null
          property_owned?: boolean | null
          tax_declaration_no?: string | null
          updated_at?: string
          van_truck?: number | null
        }
        Update: {
          application_id?: string
          business_activity?: string | null
          business_area?: number | null
          capitalization?: number | null
          cctv_cameras?: number | null
          created_at?: string
          employees_in_lucena?: number | null
          has_tax_incentives?: boolean | null
          id?: string
          lessor_address?: string | null
          lessor_business_name?: string | null
          lessor_contact_number?: string | null
          lessor_email_address?: string | null
          lessor_full_name?: string | null
          main_barangay?: string | null
          main_block_no?: string | null
          main_building_name?: string | null
          main_city_municipality?: string | null
          main_house_bldg_no?: string | null
          main_lot_no?: string | null
          main_province?: string | null
          main_street?: string | null
          main_subdivision?: string | null
          main_zip_code?: string | null
          monthly_rental?: number | null
          motorcycle?: number | null
          non_professional_female?: number | null
          non_professional_male?: number | null
          other_activity?: string | null
          other_vehicles?: number | null
          professional_female?: number | null
          professional_male?: number | null
          property_owned?: boolean | null
          tax_declaration_no?: string | null
          updated_at?: string
          van_truck?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "business_operations_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: true
            referencedRelation: "applications"
            referencedColumns: ["id"]
          },
        ]
      }
      declarations: {
        Row: {
          application_id: string
          created_at: string
          declaration_place: string | null
          designation: string | null
          id: string
          is_agreed: boolean
          signature: string
          updated_at: string
          verified_by: string | null
        }
        Insert: {
          application_id: string
          created_at?: string
          declaration_place?: string | null
          designation?: string | null
          id?: string
          is_agreed?: boolean
          signature: string
          updated_at?: string
          verified_by?: string | null
        }
        Update: {
          application_id?: string
          created_at?: string
          declaration_place?: string | null
          designation?: string | null
          id?: string
          is_agreed?: boolean
          signature?: string
          updated_at?: string
          verified_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "declarations_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: true
            referencedRelation: "applications"
            referencedColumns: ["id"]
          },
        ]
      }
      owner_information: {
        Row: {
          age: number
          application_id: string
          civil_status: Database["public"]["Enums"]["civil_status_enum"]
          created_at: string
          given_name: string
          id: string
          middle_name: string | null
          nationality: string
          owner_barangay: string
          owner_block_no: string | null
          owner_building_name: string | null
          owner_city_municipality: string
          owner_house_bldg_no: string | null
          owner_lot_no: string | null
          owner_province: string
          owner_street: string
          owner_subdivision: string | null
          owner_zip_code: string
          sex: Database["public"]["Enums"]["sex_enum"]
          suffix: string | null
          surname: string
          updated_at: string
        }
        Insert: {
          age: number
          application_id: string
          civil_status: Database["public"]["Enums"]["civil_status_enum"]
          created_at?: string
          given_name: string
          id?: string
          middle_name?: string | null
          nationality: string
          owner_barangay: string
          owner_block_no?: string | null
          owner_building_name?: string | null
          owner_city_municipality: string
          owner_house_bldg_no?: string | null
          owner_lot_no?: string | null
          owner_province: string
          owner_street: string
          owner_subdivision?: string | null
          owner_zip_code: string
          sex: Database["public"]["Enums"]["sex_enum"]
          suffix?: string | null
          surname: string
          updated_at?: string
        }
        Update: {
          age?: number
          application_id?: string
          civil_status?: Database["public"]["Enums"]["civil_status_enum"]
          created_at?: string
          given_name?: string
          id?: string
          middle_name?: string | null
          nationality?: string
          owner_barangay?: string
          owner_block_no?: string | null
          owner_building_name?: string | null
          owner_city_municipality?: string
          owner_house_bldg_no?: string | null
          owner_lot_no?: string | null
          owner_province?: string
          owner_street?: string
          owner_subdivision?: string | null
          owner_zip_code?: string
          sex?: Database["public"]["Enums"]["sex_enum"]
          suffix?: string | null
          surname?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "owner_information_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: true
            referencedRelation: "applications"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          extension_name: string | null
          firstname: string
          id: string
          lastname: string
          middlename: string | null
          updated_at: string
          username: string
        }
        Insert: {
          created_at?: string
          extension_name?: string | null
          firstname: string
          id: string
          lastname: string
          middlename?: string | null
          updated_at?: string
          username: string
        }
        Update: {
          created_at?: string
          extension_name?: string | null
          firstname?: string
          id?: string
          lastname?: string
          middlename?: string | null
          updated_at?: string
          username?: string
        }
        Relationships: []
      }
      register_account: {
        Row: {
          created_at: string | null
          email: string
          extension_name: string | null
          firstname: string
          id: string
          lastname: string
          middlename: string | null
          password: string
          updated_at: string | null
          username: string
        }
        Insert: {
          created_at?: string | null
          email: string
          extension_name?: string | null
          firstname: string
          id?: string
          lastname: string
          middlename?: string | null
          password: string
          updated_at?: string | null
          username: string
        }
        Update: {
          created_at?: string | null
          email?: string
          extension_name?: string | null
          firstname?: string
          id?: string
          lastname?: string
          middlename?: string | null
          password?: string
          updated_at?: string | null
          username?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_application_user_id: {
        Args: { application_id: string }
        Returns: string
      }
      is_application_draft: {
        Args: { application_id: string }
        Returns: boolean
      }
    }
    Enums: {
      application_status_enum:
        | "draft"
        | "submitted"
        | "under_review"
        | "approved"
        | "rejected"
        | "requires_additional_info"
      application_type_enum:
        | "newApplication"
        | "renewalApplication"
        | "amendmentApplication"
      civil_status_enum:
        | "single"
        | "married"
        | "widowed"
        | "divorced"
        | "separated"
      ownership_type_enum:
        | "soleProprietorship"
        | "onePersonCorp"
        | "partnership"
        | "corporation"
        | "cooperative"
      sex_enum: "male" | "female"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      application_status_enum: [
        "draft",
        "submitted",
        "under_review",
        "approved",
        "rejected",
        "requires_additional_info",
      ],
      application_type_enum: [
        "newApplication",
        "renewalApplication",
        "amendmentApplication",
      ],
      civil_status_enum: [
        "single",
        "married",
        "widowed",
        "divorced",
        "separated",
      ],
      ownership_type_enum: [
        "soleProprietorship",
        "onePersonCorp",
        "partnership",
        "corporation",
        "cooperative",
      ],
      sex_enum: ["male", "female"],
    },
  },
} as const
