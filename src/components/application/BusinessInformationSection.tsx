
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import FormSectionWrapper from "@/components/application/FormSectionWrapper";
import { useApplication } from "@/contexts/ApplicationContext";
import { businessInformationService } from "@/services/application";
import { OwnershipType } from "@/services/application/types";

// Define the schema for Business Information using Zod
const businessInformationSchema = z.object({
  business_name: z.string().min(3, { message: "Business name must be at least 3 characters." }),
  trade_name: z.string().optional(),
  registration_number: z.string().optional(),
  tin_number: z.string().min(9, { message: "TIN number must be at least 9 characters." }).max(12, { message: "TIN number must be at most 12 characters." }),
  sss_number: z.string().optional(),
  ctc_number: z.string().optional(),
  ctc_date_issue: z.string().optional(),
  ctc_place_issue: z.string().optional(),
  ownership_type: z.string().min(2, { message: "Ownership type must be selected." }),
  block_no: z.string().optional(),
  lot_no: z.string().optional(),
  house_bldg_no: z.string().optional(),
  building_name: z.string().optional(),
  street: z.string().min(3, { message: "Street address must be at least 3 characters." }),
  subdivision: z.string().optional(),
  barangay: z.string().min(3, { message: "Barangay must be at least 3 characters." }),
  city_municipality: z.string().min(3, { message: "City/Municipality must be at least 3 characters." }),
  province: z.string().min(3, { message: "Province must be at least 3 characters." }),
  zip_code: z.string().min(4, { message: "Zip code must be at least 4 characters." }).max(4, { message: "Zip code must be at most 4 characters." }),
  telephone_no: z.string().optional(),
  mobile_no: z.string().min(11, { message: "Mobile number must be at least 11 characters." }).max(11, { message: "Mobile number must be at most 11 characters." }),
  email_address: z.string().email({ message: "Invalid email address." })
});

type BusinessInformationValues = z.infer<typeof businessInformationSchema>;

const BusinessInformationSection = () => {
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const { applicationId } = useApplication();
  const [initialValues, setInitialValues] = useState<BusinessInformationValues | null>(null);

  // Initialize react-hook-form
  const form = useForm<BusinessInformationValues>({
    resolver: zodResolver(businessInformationSchema),
    defaultValues: {
      business_name: "",
      trade_name: "",
      registration_number: "",
      tin_number: "",
      sss_number: "",
      ctc_number: "",
      ctc_date_issue: "",
      ctc_place_issue: "",
      ownership_type: "",
      block_no: "",
      lot_no: "",
      house_bldg_no: "",
      building_name: "",
      street: "",
      subdivision: "",
      barangay: "",
      city_municipality: "",
      province: "",
      zip_code: "",
      telephone_no: "",
      mobile_no: "",
      email_address: ""
    },
    mode: "onChange", // Validate on change
  });

  // Load initial values from the database
  useEffect(() => {
    const loadInitialValues = async () => {
      if (applicationId) {
        try {
          const data = await businessInformationService.getBusinessInformation(applicationId);
          if (data) {
            // Convert the loaded data into the expected form values
            const formValues: BusinessInformationValues = {
              business_name: data.business_name || "",
              trade_name: data.trade_name || "",
              registration_number: data.registration_number || "",
              tin_number: data.tin_number || "",
              sss_number: data.sss_number || "",
              ctc_number: data.ctc_number || "",
              ctc_date_issue: data.ctc_date_issue || "",
              ctc_place_issue: data.ctc_place_issue || "",
              ownership_type: data.ownership_type || "",
              block_no: data.block_no || "",
              lot_no: data.lot_no || "",
              house_bldg_no: data.house_bldg_no || "",
              building_name: data.building_name || "",
              street: data.street || "",
              subdivision: data.subdivision || "",
              barangay: data.barangay || "",
              city_municipality: data.city_municipality || "",
              province: data.province || "",
              zip_code: data.zip_code || "",
              telephone_no: data.telephone_no || "",
              mobile_no: data.mobile_no || "",
              email_address: data.email_address || ""
            };
            
            // Set the default values for the form
            form.reset(formValues);
            setInitialValues(formValues);
          }
        } catch (error) {
          console.error("Error loading business information:", error);
          toast({
            description: "There was a problem loading the business information. Please try again.",
            variant: "destructive",
          });
        }
      }
    };

    loadInitialValues();
  }, [applicationId, form, toast]);

  // Function to handle form submission
  const onSubmit = async (values: BusinessInformationValues) => {
    setIsSaving(true);
    try {
      if (!applicationId) {
        throw new Error("Application ID is missing.");
      }

      // Save the business information to the database
      await businessInformationService.saveBusinessInformation({
        application_id: applicationId,
        business_name: values.business_name,
        trade_name: values.trade_name,
        registration_number: values.registration_number,
        tin_number: values.tin_number,
        sss_number: values.sss_number,
        ctc_number: values.ctc_number,
        ctc_date_issue: values.ctc_date_issue,
        ctc_place_issue: values.ctc_place_issue,
        ownership_type: values.ownership_type as OwnershipType,
        block_no: values.block_no,
        lot_no: values.lot_no,
        house_bldg_no: values.house_bldg_no,
        building_name: values.building_name,
        street: values.street,
        subdivision: values.subdivision,
        barangay: values.barangay,
        city_municipality: values.city_municipality,
        province: values.province,
        zip_code: values.zip_code,
        telephone_no: values.telephone_no,
        mobile_no: values.mobile_no,
        email_address: values.email_address
      });

      toast({
        title: "Business Information Saved",
        description: "Your business information has been saved successfully.",
      });
    } catch (error) {
      console.error("Error saving business information:", error);
      toast({
        title: "Failed to save business information",
        description: "There was a problem saving the business information. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Expose a global function to validate and save the form
  useEffect(() => {
    window.businessInfoHelpers = {
      validateAndSave: async () => {
        try {
          // Trigger validation
          const isValid = await form.trigger();
          if (!isValid) {
            console.log("Business Info - Validation failed, form has errors");
            return false;
          }
          
          // If validation passes, submit the form
          await onSubmit(form.getValues());
          return true;
        } catch (error) {
          console.error("Business Info - Error during validation and save:", error);
          return false;
        }
      },
    };

    return () => {
      delete window.businessInfoHelpers;
    };
  }, [form]);

  return (
    <FormSectionWrapper
      title="Business Information"
      description="Provide detailed information about your business"
      stepNumber={2}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Business Name */}
            <FormField
              control={form.control}
              name="business_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Business Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter business name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Trade Name */}
            <FormField
              control={form.control}
              name="trade_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Trade Name / Franchise (if applicable)</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter trade name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Registration Number */}
            <FormField
              control={form.control}
              name="registration_number"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>DTI/SEC/CDA Registration Number</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter registration number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* TIN Number */}
            <FormField
              control={form.control}
              name="tin_number"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>TIN Number</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter TIN number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* SSS Number */}
            <FormField
              control={form.control}
              name="sss_number"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Social Security System (SSS) Number</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter SSS number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* CTC Number */}
            <FormField
              control={form.control}
              name="ctc_number"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>CTC Number</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter CTC number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* CTC Date Issue */}
            <FormField
              control={form.control}
              name="ctc_date_issue"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>CTC Date of Issue</FormLabel>
                  <FormControl>
                    <Input placeholder="YYYY-MM-DD" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* CTC Place Issue */}
            <FormField
              control={form.control}
              name="ctc_place_issue"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>CTC Place of Issue</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter place of issue" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Ownership Type */}
          <FormField
            control={form.control}
            name="ownership_type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ownership Type</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select ownership type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="soleProprietorship">Sole Proprietorship</SelectItem>
                    <SelectItem value="onePersonCorp">One Person Corporation</SelectItem>
                    <SelectItem value="partnership">Partnership</SelectItem>
                    <SelectItem value="corporation">Corporation</SelectItem>
                    <SelectItem value="cooperative">Cooperative</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Block No */}
            <FormField
              control={form.control}
              name="block_no"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Block No.</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter block number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Lot No */}
            <FormField
              control={form.control}
              name="lot_no"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Lot No.</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter lot number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* House/Bldg No */}
            <FormField
              control={form.control}
              name="house_bldg_no"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>House/Bldg. No.</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter house/building number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Building Name */}
            <FormField
              control={form.control}
              name="building_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Building Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter building name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Street */}
            <FormField
              control={form.control}
              name="street"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Street</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter street address" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Subdivision */}
            <FormField
              control={form.control}
              name="subdivision"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Subdivision</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter subdivision" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Barangay */}
            <FormField
              control={form.control}
              name="barangay"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Barangay</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter barangay" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* City/Municipality */}
            <FormField
              control={form.control}
              name="city_municipality"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>City/Municipality</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter city/municipality" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Province */}
            <FormField
              control={form.control}
              name="province"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Province</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter province" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Zip Code */}
            <FormField
              control={form.control}
              name="zip_code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Zip Code</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter zip code" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Telephone Number */}
            <FormField
              control={form.control}
              name="telephone_no"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Telephone Number</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter telephone number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Mobile Number */}
            <FormField
              control={form.control}
              name="mobile_no"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mobile Number</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter mobile number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Email Address */}
          <FormField
            control={form.control}
            name="email_address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email Address</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="Enter email address" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
    </FormSectionWrapper>
  );
};

export default BusinessInformationSection;
