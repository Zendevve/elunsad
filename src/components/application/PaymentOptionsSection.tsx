
import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card } from "@/components/ui/card";
import { useApplication } from "@/contexts/ApplicationContext";
import { applicationService } from "@/services/applicationService";
import FormSectionWrapper from "./FormSectionWrapper";

const PaymentOptionsSection = () => {
  const { applicationId } = useApplication();
  const [paymentFrequency, setPaymentFrequency] = useState<string>("annually");
  const [paymentMode, setPaymentMode] = useState<string>("over_the_counter");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    // For now, we'll just use localStorage to persist the payment options
    // This will be replaced with proper database storage once the table is created
    const loadPaymentOptions = () => {
      if (applicationId) {
        try {
          const storedOptions = localStorage.getItem(`payment_options_${applicationId}`);
          if (storedOptions) {
            const options = JSON.parse(storedOptions);
            setPaymentFrequency(options.payment_frequency || "annually");
            setPaymentMode(options.payment_mode || "over_the_counter");
          }
        } catch (error) {
          console.error("Error loading payment options:", error);
        }
      }
    };

    loadPaymentOptions();
  }, [applicationId]);

  useEffect(() => {
    // Autosave when payment options change
    const savePaymentOptions = async () => {
      if (!applicationId || !paymentFrequency || !paymentMode) return;
      
      setSaving(true);
      try {
        // For now, we'll just use localStorage to persist the payment options
        // This will be replaced with proper database storage once the table is created
        localStorage.setItem(`payment_options_${applicationId}`, JSON.stringify({
          application_id: applicationId,
          payment_frequency: paymentFrequency,
          payment_mode: paymentMode
        }));
      } catch (error) {
        console.error("Error saving payment options:", error);
      } finally {
        setSaving(false);
      }
    };

    if (applicationId && (paymentFrequency || paymentMode)) {
      // Debounce the save
      clearTimeout(window.autoSaveTimeout);
      window.autoSaveTimeout = setTimeout(savePaymentOptions, 1000);
    }

    return () => {
      clearTimeout(window.autoSaveTimeout);
    };
  }, [applicationId, paymentFrequency, paymentMode]);

  return (
    <FormSectionWrapper title="Payment Options">
      <div className="space-y-6">
        <div>
          <Label className="text-base font-medium mb-3 block">Mode of Payment</Label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="p-4 border">
              <RadioGroup 
                value={paymentFrequency} 
                onValueChange={setPaymentFrequency}
                className="space-y-3"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="annually" id="annually" />
                  <Label htmlFor="annually" className="font-normal cursor-pointer">Annually</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="semi_annually" id="semi_annually" />
                  <Label htmlFor="semi_annually" className="font-normal cursor-pointer">Semi-annually</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="quarterly" id="quarterly" />
                  <Label htmlFor="quarterly" className="font-normal cursor-pointer">Quarterly</Label>
                </div>
              </RadioGroup>
            </Card>

            <Card className="p-4 border">
              <RadioGroup 
                value={paymentMode} 
                onValueChange={setPaymentMode}
                className="space-y-3"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="over_the_counter" id="over_the_counter" />
                  <Label htmlFor="over_the_counter" className="font-normal cursor-pointer">Over-the-counter</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="online" id="online" />
                  <Label htmlFor="online" className="font-normal cursor-pointer">Online</Label>
                </div>
              </RadioGroup>
            </Card>
          </div>
        </div>
      </div>
    </FormSectionWrapper>
  );
};

export default PaymentOptionsSection;
