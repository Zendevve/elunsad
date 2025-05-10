import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import FormSectionWrapper from "@/components/application/FormSectionWrapper";
import { useApplication } from "@/contexts/ApplicationContext";
import { businessInformationService } from "@/services/application";
import { OwnershipType } from "@/services/application/types";

// Define the schema for Business Information using Zod
const businessInformationSchema = z.object({
  business_name: z.string().min(3, { message: "Business name must be at least 3 characters." }),
  tin_number: z.string().min(9, { message: "TIN number must be at least 9 characters." }).max(12, { message: "TIN number must be at most 12 characters." }),
  ownership_type: z.string().min(2, { message: "Ownership type must be selected." }),
  street: z.string().min(3, { message: "Street address must be at least 3 characters." }),
  barangay: z.string().min(3, { message: "Barangay must be at least 3 characters." }),
  city_municipality: z.string().min(3, { message: "City/Municipality must be at least 3 characters." }),
  province: z.string().min(3, { message: "Province must be at least 3 characters." }),
  zip_code: z.string().min(4, { message: "Zip code must be at least 4 characters." }).max(4, { message: "Zip code must be at most 4 characters." }),
  mobile_no: z.string().min(11, { message: "Mobile number must be at least 11 characters." }).max(11, { message: "Mobile number must be at most 11 characters." }),
  email_address: z.string().email({ message: "Invalid email address." }),
  website_url: z.string().url({ message: "Invalid website URL." }).optional().or(z.literal('')),
  fb_page_url: z.string().url({ message: "Invalid Facebook page URL." }).optional().or(z.literal('')),
  business_description: z.string().optional(),
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
      tin_number: "",
      ownership_type: "",
      street: "",
      barangay: "",
      city_municipality: "",
      province: "",
      zip_code: "",
      mobile_no: "",
      email_address: "",
      website_url: "",
      fb_page_url: "",
      business_description: "",
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
              tin_number: data.tin_number || "",
              ownership_type: data.ownership_type || "",
              street: data.street || "",
              barangay: data.barangay || "",
              city_municipality: data.city_municipality || "",
              province: data.province || "",
              zip_code: data.zip_code || "",
              mobile_no: data.mobile_no || "",
              email_address: data.email_address || "",
              website_url: "",  // Default empty as may not exist in database
              fb_page_url: "",  // Default empty as may not exist in database
              business_description: "", // Default empty as may not exist in database
            };
            
            // Set the default values for the form
            form.reset(formValues);
            setInitialValues(formValues);
          }
        } catch (error) {
          console.error("Error loading business information:", error);
          toast("Failed to load business information", {
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
        tin_number: values.tin_number,
        ownership_type: values.ownership_type as OwnershipType,
        street: values.street,
        barangay: values.barangay,
        city_municipality: values.city_municipality,
        province: values.province,
        zip_code: values.zip_code,
        mobile_no: values.mobile_no,
        email_address: values.email_address,
        website_url: values.website_url,
        fb_page_url: values.fb_page_url,
        business_description: values.business_description,
        trade_name: undefined, // Add any other required or optional fields
        registration_number: undefined,
        sss_number: undefined,
        ctc_number: undefined,
        ctc_date_issue: undefined,
        ctc_place_issue: undefined,
        house_bldg_no: undefined,
        building_name: undefined,
        block_no: undefined,
        lot_no: undefined,
        subdivision: undefined,
        telephone_no: undefined,
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
  }, [form, onSubmit]);
  
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
                    <SelectItem value="partnership">Partnership</SelectItem>
                    <SelectItem value="corporation">Corporation</SelectItem>
                    <SelectItem value="cooperative">Cooperative</SelectItem>
                    <SelectItem value="onePersonCorp">One Person Corporation</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

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
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Website URL */}
            <FormField
              control={form.control}
              name="website_url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Website URL (Optional)</FormLabel>
                  <FormControl>
                    <Input type="url" placeholder="Enter website URL" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Facebook Page URL */}
            <FormField
              control={form.control}
              name="fb_page_url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Facebook Page URL (Optional)</FormLabel>
                  <FormControl>
                    <Input type="url" placeholder="Enter Facebook page URL" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Business Description */}
          <FormField
            control={form.control}
            name="business_description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Business Description (Optional)</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Describe your business"
                    className="resize-none"
                    {...field}
                  />
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
