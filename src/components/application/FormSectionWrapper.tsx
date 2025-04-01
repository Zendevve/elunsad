
import { ReactNode } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface FormSectionWrapperProps {
  title: string;
  description?: string;
  children: ReactNode;
  stepNumber?: number;
}

const FormSectionWrapper = ({ 
  title, 
  description, 
  children,
  stepNumber
}: FormSectionWrapperProps) => {
  return (
    <Card className="mb-6 overflow-hidden">
      <div className="bg-gradient-to-r from-slate-50 to-slate-100 border-b">
        <CardHeader className="py-4">
          <div className="flex items-center">
            {stepNumber && (
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground mr-3 font-medium text-sm">
                {stepNumber}
              </div>
            )}
            <div>
              <CardTitle className="text-lg font-medium">{title}</CardTitle>
              {description && (
                <p className="text-sm text-muted-foreground mt-1">{description}</p>
              )}
            </div>
          </div>
        </CardHeader>
      </div>
      <CardContent className="pt-6">{children}</CardContent>
    </Card>
  );
};

export default FormSectionWrapper;
