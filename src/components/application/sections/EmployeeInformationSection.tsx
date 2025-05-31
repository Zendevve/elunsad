
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface EmployeeInformationSectionProps {
  employeesInLucena: number | null;
  setEmployeesInLucena: (value: number | null) => void;
  professionalMale: number | null;
  setProfessionalMale: (value: number | null) => void;
  professionalFemale: number | null;
  setProfessionalFemale: (value: number | null) => void;
  nonProfessionalMale: number | null;
  setNonProfessionalMale: (value: number | null) => void;
  nonProfessionalFemale: number | null;
  setNonProfessionalFemale: (value: number | null) => void;
  onInputBlur: () => void;
}

const EmployeeInformationSection = ({
  employeesInLucena,
  setEmployeesInLucena,
  professionalMale,
  setProfessionalMale,
  professionalFemale,
  setProfessionalFemale,
  nonProfessionalMale,
  setNonProfessionalMale,
  nonProfessionalFemale,
  setNonProfessionalFemale,
  onInputBlur
}: EmployeeInformationSectionProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Employee Information</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="employeesInLucena">Employees from Lucena</Label>
          <Input 
            id="employeesInLucena" 
            type="number" 
            placeholder="Number of employees from Lucena" 
            value={employeesInLucena || ''}
            onChange={(e) => setEmployeesInLucena(e.target.value ? Number(e.target.value) : null)}
            onBlur={onInputBlur}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div>
          <Label htmlFor="professionalMale">Professional Male</Label>
          <Input 
            id="professionalMale" 
            type="number" 
            value={professionalMale || ''}
            onChange={(e) => setProfessionalMale(e.target.value ? Number(e.target.value) : null)}
            onBlur={onInputBlur}
          />
        </div>
        <div>
          <Label htmlFor="professionalFemale">Professional Female</Label>
          <Input 
            id="professionalFemale" 
            type="number" 
            value={professionalFemale || ''}
            onChange={(e) => setProfessionalFemale(e.target.value ? Number(e.target.value) : null)}
            onBlur={onInputBlur}
          />
        </div>
        <div>
          <Label htmlFor="nonProfessionalMale">Non-Professional Male</Label>
          <Input 
            id="nonProfessionalMale" 
            type="number" 
            value={nonProfessionalMale || ''}
            onChange={(e) => setNonProfessionalMale(e.target.value ? Number(e.target.value) : null)}
            onBlur={onInputBlur}
          />
        </div>
        <div>
          <Label htmlFor="nonProfessionalFemale">Non-Professional Female</Label>
          <Input 
            id="nonProfessionalFemale" 
            type="number" 
            value={nonProfessionalFemale || ''}
            onChange={(e) => setNonProfessionalFemale(e.target.value ? Number(e.target.value) : null)}
            onBlur={onInputBlur}
          />
        </div>
      </div>
    </div>
  );
};

export default EmployeeInformationSection;
