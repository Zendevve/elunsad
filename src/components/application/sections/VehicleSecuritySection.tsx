
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface VehicleSecuritySectionProps {
  vanTruck: number | null;
  setVanTruck: (value: number | null) => void;
  motorcycle: number | null;
  setMotorcycle: (value: number | null) => void;
  otherVehicles: number | null;
  setOtherVehicles: (value: number | null) => void;
  cctvCameras: number | null;
  setCctvCameras: (value: number | null) => void;
  onInputBlur: () => void;
}

const VehicleSecuritySection = ({
  vanTruck,
  setVanTruck,
  motorcycle,
  setMotorcycle,
  otherVehicles,
  setOtherVehicles,
  cctvCameras,
  setCctvCameras,
  onInputBlur
}: VehicleSecuritySectionProps) => {
  return (
    <div className="space-y-6">
      {/* Vehicle Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Vehicle Information</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="vanTruck">Van/Truck</Label>
            <Input 
              id="vanTruck" 
              type="number" 
              placeholder="Number of vans/trucks" 
              value={vanTruck || ''}
              onChange={(e) => setVanTruck(e.target.value ? Number(e.target.value) : null)}
              onBlur={onInputBlur}
            />
          </div>
          <div>
            <Label htmlFor="motorcycle">Motorcycle</Label>
            <Input 
              id="motorcycle" 
              type="number" 
              placeholder="Number of motorcycles" 
              value={motorcycle || ''}
              onChange={(e) => setMotorcycle(e.target.value ? Number(e.target.value) : null)}
              onBlur={onInputBlur}
            />
          </div>
          <div>
            <Label htmlFor="otherVehicles">Other Vehicles</Label>
            <Input 
              id="otherVehicles" 
              type="number" 
              placeholder="Number of other vehicles" 
              value={otherVehicles || ''}
              onChange={(e) => setOtherVehicles(e.target.value ? Number(e.target.value) : null)}
              onBlur={onInputBlur}
            />
          </div>
        </div>
      </div>

      {/* Security Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Security Information</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="cctvCameras">CCTV Cameras</Label>
            <Input 
              id="cctvCameras" 
              type="number" 
              placeholder="Number of CCTV cameras" 
              value={cctvCameras || ''}
              onChange={(e) => setCctvCameras(e.target.value ? Number(e.target.value) : null)}
              onBlur={onInputBlur}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default VehicleSecuritySection;
