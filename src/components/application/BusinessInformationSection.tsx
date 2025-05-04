import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/components/ui/use-toast";
import { useApplication } from "@/contexts/ApplicationContext";
import { applicationService, BusinessInformationData } from "@/services/applicationService";
import FormSectionWrapper from "./FormSectionWrapper";

const BusinessInformationSection = () => {
  const { applicationId, isLoading, setIsLoading } = useApplication();
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);

  const [businessInfo, setBusinessInfo] = useState<Partial<BusinessInformationData>>({
    application_id: applicationId || "",
    business_name: "",
    trade_name: "",
    registration_number: "",
    tin_number: "",
    sss_number: "",
    ctc_number: "", // Add CTC number field
    ctc_issue_date: "", // Add CTC issue date field
    ctc_issue_place: "", // Add CTC issue place field
    ownership_type: "soleProprietorship",
    house_bldg_no: "",
    building_name: "",
    block_no: "",
    lot_no: "",
    street: "",
    subdivision: "",
    barangay: "",
    city_municipality: "Lucena City",
    province: "Quezon",
    zip_code: "",
    telephone_no: "",
    mobile_no: "",
    email_address: ""
  });

  useEffect(() => {
    const fetchBusinessInfo = async () => {
      if (applicationId) {
        try {
          const data = await applicationService.getBusinessInformation(applicationId);
          if (data) {
            setBusinessInfo(data);
          }
        } catch (error) {
          console.error("Error fetching business information:", error);
          toast({
            title: "Failed to Load",
            description: "Could not load business information. Please try again.",
            variant: "destructive",
          });
        }
      }
    };

    fetchBusinessInfo();
  }, [applicationId, toast]);

  const handleInputChange = (field: string, value: any) => {
    setBusinessInfo(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    if (!applicationId) {
      toast({
        title: "Application Error",
        description: "Could not find application to save. Please try again.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setSaving(true);

    try {
      // Ensure application_id is correctly set
      const dataToSave = { ...businessInfo, application_id: applicationId };
      await applicationService.saveBusinessInformation(dataToSave as BusinessInformationData);

      toast({
        title: "Business Information Saved",
        description: "Your business information has been saved successfully.",
      });
    } catch (error) {
      console.error("Error saving business information:", error);
      toast({
        title: "Save Failed",
        description: "There was an error saving your business information. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setSaving(false);
    }
  };

  useEffect(() => {
    // Autosave when businessInfo changes
    const autoSave = async () => {
      if (!applicationId || saving) return;

      setSaving(true);
      try {
        // Ensure application_id is correctly set
        const dataToSave = { ...businessInfo, application_id: applicationId };
        await applicationService.saveBusinessInformation(dataToSave as BusinessInformationData);
      } catch (error) {
        console.error("Error autosaving business information:", error);
      } finally {
        setSaving(false);
      }
    };

    if (applicationId && !isLoading) {
      // Debounce the save
      clearTimeout(window.autoSaveTimeout);
      window.autoSaveTimeout = setTimeout(autoSave, 1000);
    }

    return () => {
      clearTimeout(window.autoSaveTimeout);
    };
  }, [businessInfo, applicationId, isLoading, saving]);

  return (
    <FormSectionWrapper 
      title="Business Information" 
      description="Provide details about your business"
      stepNumber={2}
    >
      <form 
        onSubmit={(e) => {
          e.preventDefault();
          handleSave();
        }}
        className="space-y-6"
      >
        {/* Business Name */}
        <div className="space-y-4">
          <div>
            <Label htmlFor="business_name" className="text-base font-medium">Business Name <span className="text-red-500">*</span></Label>
            <Input 
              id="business_name" 
              placeholder="Enter registered business name"
              value={businessInfo.business_name || ""} 
              onChange={(e) => handleInputChange("business_name", e.target.value)}
              className="mt-1.5"
              required
            />
          </div>

          <div>
            <Label htmlFor="trade_name" className="text-base font-medium">Trade Name / Franchise (if applicable)</Label>
            <Input 
              id="trade_name" 
              placeholder="Enter trade name or franchise"
              value={businessInfo.trade_name || ""} 
              onChange={(e) => handleInputChange("trade_name", e.target.value)}
              className="mt-1.5"
            />
          </div>
        </div>

        {/* Registration Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <Label htmlFor="registration_number" className="text-base font-medium">DTI/SEC/CDA Registration Number <span className="text-red-500">*</span></Label>
            <Input 
              id="registration_number" 
              placeholder="Enter registration number"
              value={businessInfo.registration_number || ""} 
              onChange={(e) => handleInputChange("registration_number", e.target.value)}
              className="mt-1.5"
              required
            />
          </div>
          <div>
            <Label htmlFor="tin_number" className="text-base font-medium">TIN Number <span className="text-red-500">*</span></Label>
            <Input 
              id="tin_number" 
              placeholder="000-000-000-000"
              value={businessInfo.tin_number || ""} 
              onChange={(e) => handleInputChange("tin_number", e.target.value)}
              className="mt-1.5"
              required
            />
          </div>
          <div>
            <Label htmlFor="sss_number" className="text-base font-medium">SSS Number</Label>
            <Input 
              id="sss_number" 
              placeholder="00-0000000-0"
              value={businessInfo.sss_number || ""} 
              onChange={(e) => handleInputChange("sss_number", e.target.value)}
              className="mt-1.5"
            />
          </div>
          <div>
            <Label htmlFor="ctc_number" className="text-base font-medium">CTC Number</Label>
            <Input 
              id="ctc_number" 
              placeholder="Enter CTC Number"
              value={businessInfo.ctc_number || ""} 
              onChange={(e) => handleInputChange("ctc_number", e.target.value)}
              className="mt-1.5"
            />
          </div>
        </div>

        {/* CTC Issue Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="ctc_issue_date" className="text-base font-medium">CTC Issue Date</Label>
            <Input 
              id="ctc_issue_date" 
              type="date"
              value={businessInfo.ctc_issue_date || ""} 
              onChange={(e) => handleInputChange("ctc_issue_date", e.target.value)}
              className="mt-1.5"
            />
          </div>
          <div>
            <Label htmlFor="ctc_issue_place" className="text-base font-medium">CTC Issue Place</Label>
            <Input 
              id="ctc_issue_place" 
              placeholder="Enter place of issuance"
              value={businessInfo.ctc_issue_place || ""} 
              onChange={(e) => handleInputChange("ctc_issue_place", e.target.value)}
              className="mt-1.5"
            />
          </div>
        </div>

        {/* Ownership Type */}
        <div>
          <Label className="text-base font-medium block mb-2">Kind of Ownership <span className="text-red-500">*</span></Label>
          <RadioGroup 
            value={businessInfo.ownership_type || "soleProprietorship"} 
            onValueChange={(value) => handleInputChange("ownership_type", value)}
            className="flex flex-wrap gap-4"
            required
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="soleProprietorship" id="soleProprietorship" />
              <Label htmlFor="soleProprietorship" className="font-normal">Sole Proprietorship</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="onePersonCorp" id="onePersonCorp" />
              <Label htmlFor="onePersonCorp" className="font-normal">One Person Corporation</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="partnership" id="partnership" />
              <Label htmlFor="partnership" className="font-normal">Partnership</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="corporation" id="corporation" />
              <Label htmlFor="corporation" className="font-normal">Corporation</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="cooperative" id="cooperative" />
              <Label htmlFor="cooperative" className="font-normal">Cooperative</Label>
            </div>
          </RadioGroup>
        </div>

        {/* Business Address */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Business Address</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="house_bldg_no" className="text-base font-medium">House/Bldg. No.</Label>
              <Input 
                id="house_bldg_no" 
                placeholder="Enter house or building number"
                value={businessInfo.house_bldg_no || ""} 
                onChange={(e) => handleInputChange("house_bldg_no", e.target.value)}
                className="mt-1.5"
              />
            </div>
            <div>
              <Label htmlFor="building_name" className="text-base font-medium">Building Name</Label>
              <Input 
                id="building_name" 
                placeholder="Enter building name"
                value={businessInfo.building_name || ""} 
                onChange={(e) => handleInputChange("building_name", e.target.value)}
                className="mt-1.5"
              />
            </div>
            <div>
              <Label htmlFor="block_no" className="text-base font-medium">Block No.</Label>
              <Input 
                id="block_no" 
                placeholder="Enter block number"
                value={businessInfo.block_no || ""} 
                onChange={(e) => handleInputChange("block_no", e.target.value)}
                className="mt-1.5"
              />
            </div>
            <div>
              <Label htmlFor="lot_no" className="text-base font-medium">Lot No.</Label>
              <Input 
                id="lot_no" 
                placeholder="Enter lot number"
                value={businessInfo.lot_no || ""} 
                onChange={(e) => handleInputChange("lot_no", e.target.value)}
                className="mt-1.5"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="street" className="text-base font-medium">Street <span className="text-red-500">*</span></Label>
              <Input 
                id="street" 
                placeholder="Enter street"
                value={businessInfo.street || ""} 
                onChange={(e) => handleInputChange("street", e.target.value)}
                className="mt-1.5"
                required
              />
            </div>
            <div>
              <Label htmlFor="subdivision" className="text-base font-medium">Subdivision</Label>
              <Input 
                id="subdivision" 
                placeholder="Enter subdivision"
                value={businessInfo.subdivision || ""} 
                onChange={(e) => handleInputChange("subdivision", e.target.value)}
                className="mt-1.5"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="barangay" className="text-base font-medium">Barangay <span className="text-red-500">*</span></Label>
              <Input 
                id="barangay" 
                placeholder="Enter barangay"
                value={businessInfo.barangay || ""} 
                onChange={(e) => handleInputChange("barangay", e.target.value)}
                className="mt-1.5"
                required
              />
            </div>
            <div>
              <Label htmlFor="city_municipality" className="text-base font-medium">City/Municipality <span className="text-red-500">*</span></Label>
              <Input 
                id="city_municipality" 
                placeholder="Enter city/municipality"
                value={businessInfo.city_municipality || "Lucena City"} 
                onChange={(e) => handleInputChange("city_municipality", e.target.value)}
                className="mt-1.5"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="province" className="text-base font-medium">Province <span className="text-red-500">*</span></Label>
              <Input 
                id="province" 
                placeholder="Enter province"
                value={businessInfo.province || "Quezon"} 
                onChange={(e) => handleInputChange("province", e.target.value)}
                className="mt-1.5"
                required
              />
            </div>
            <div>
              <Label htmlFor="zip_code" className="text-base font-medium">Zip Code <span className="text-red-500">*</span></Label>
              <Input 
                id="zip_code" 
                placeholder="Enter zip code"
                value={businessInfo.zip_code || ""} 
                onChange={(e) => handleInputChange("zip_code", e.target.value)}
                className="mt-1.5"
                required
              />
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Contact Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="telephone_no" className="text-base font-medium">Telephone No.</Label>
              <Input 
                id="telephone_no" 
                placeholder="Enter telephone number"
                value={businessInfo.telephone_no || ""} 
                onChange={(e) => handleInputChange("telephone_no", e.target.value)}
                className="mt-1.5"
              />
            </div>
            <div>
              <Label htmlFor="mobile_no" className="text-base font-medium">Mobile No. <span className="text-red-500">*</span></Label>
              <Input 
                id="mobile_no" 
                placeholder="Enter mobile number"
                value={businessInfo.mobile_no || ""} 
                onChange={(e) => handleInputChange("mobile_no", e.target.value)}
                className="mt-1.5"
                required
              />
            </div>
          </div>
          <div>
            <Label htmlFor="email_address" className="text-base font-medium">Email Address <span className="text-red-500">*</span></Label>
            <Input 
              id="email_address" 
              type="email"
              placeholder="Enter email address"
              value={businessInfo.email_address || ""} 
              onChange={(e) => handleInputChange("email_address", e.target.value)}
              className="mt-1.5"
              required
            />
          </div>
        </div>

        <div className="flex justify-end mt-8">
          <button 
            type="submit" 
            className="bg-primary text-primary-foreground hover:bg-primary/90 font-medium rounded-md text-sm px-5 py-2.5"
            disabled={isLoading}
          >
            {isLoading ? "Saving..." : "Save Information"}
          </button>
        </div>
      </form>
    </FormSectionWrapper>
  );
};

export default BusinessInformationSection;
