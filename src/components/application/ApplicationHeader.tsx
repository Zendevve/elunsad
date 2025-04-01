import { Badge } from "@/components/ui/badge";
interface ApplicationHeaderProps {
  currentStep: number;
  totalSteps: number;
}
const ApplicationHeader = ({
  currentStep,
  totalSteps
}: ApplicationHeaderProps) => {
  return <div className="bg-white border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
        <div className="flex justify-center mb-6">
          <img alt="Lucena City Logo" className="h-24 w-auto" src="/lovable-uploads/6ca73b05-e902-40ad-9fc1-bdd433d9e5b9.png" />
        </div>
        
        <h1 className="text-2xl font-bold text-gray-900">UNIFIED APPLICATION FORM FOR BUSINESS PERMIT</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 mt-6 gap-4">
          <div className="text-left space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <label className="text-sm font-medium">Date of Receipt:</label>
              <input type="date" className="border rounded px-2 py-1 text-sm" />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <label className="text-sm font-medium">Received by:</label>
              <input type="text" className="border rounded px-2 py-1 text-sm" />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <label className="text-sm font-medium">Tax Year:</label>
              <input type="text" className="border rounded px-2 py-1 text-sm" value={new Date().getFullYear()} readOnly />
            </div>
          </div>
          
          <div className="text-left space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <label className="text-sm font-medium">Tracking Number:</label>
              <input type="text" className="border rounded px-2 py-1 text-sm bg-gray-100" readOnly />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <label className="text-sm font-medium">Business ID Number:</label>
              <input type="text" className="border rounded px-2 py-1 text-sm bg-gray-100" readOnly />
            </div>
          </div>
        </div>
        
        <div className="mt-8 bg-gray-100 p-4 rounded">
          <h3 className="font-medium mb-2">ONLINE PAYMENT</h3>
          <p className="text-sm">
            Landbank Savings Account No. 0111-3057-54 - CITY GOVERNMENT OF LUCENA<br />
            *Kindly email a scanned copy / clear picture of your bank transaction after payment to 
            <strong>ctolucenacity@yahoo.com / bplolucena@gmail.com</strong> for verification
          </p>
        </div>
      </div>
      
      {/* Progress Indicator */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="relative">
          <div className="h-2 bg-gray-200 rounded-full">
            <div className="h-2 bg-blue-600 rounded-full transition-all duration-300" style={{
            width: `${currentStep / totalSteps * 100}%`
          }} />
          </div>
          <div className="mt-4 grid grid-cols-5 gap-4">
            {["Application Type", "Business Information", "Owner Information", "Business Operation", "Review & Submit"].map((step, index) => <div key={step} className="text-center">
                <Badge variant={currentStep > index ? "default" : "outline"} className="mb-2">
                  Step {index + 1}
                </Badge>
                <p className="text-sm font-medium text-gray-900">{step}</p>
              </div>)}
          </div>
        </div>
      </div>
    </div>;
};
export default ApplicationHeader;