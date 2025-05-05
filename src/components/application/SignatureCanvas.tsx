
import { useRef, useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Pen, Trash2, Save } from "lucide-react";

interface SignatureCanvasProps {
  onSave: (signature: string) => void;
  initialSignature?: string | null;
}

export const SignatureCanvas = ({ onSave, initialSignature }: SignatureCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSignature, setHasSignature] = useState(false);

  // Initialize canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Set canvas to fill parent
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set the context settings for better signature experience
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#000';

    // Load existing signature if provided
    if (initialSignature) {
      const img = new Image();
      img.onload = () => {
        ctx.drawImage(img, 0, 0);
        setHasSignature(true);
      };
      img.src = initialSignature;
    }
  }, [initialSignature]);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    setIsDrawing(true);
    setHasSignature(true);

    // Get the position
    let clientX, clientY;
    
    if ('touches' in e) {
      // It's a touch event
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      // It's a mouse event
      clientX = e.clientX;
      clientY = e.clientY;
    }

    const rect = canvas.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Get the position
    let clientX, clientY;
    
    if ('touches' in e) {
      // It's a touch event
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
      
      // Prevent scrolling when drawing
      e.preventDefault();
    } else {
      // It's a mouse event
      clientX = e.clientX;
      clientY = e.clientY;
    }

    const rect = canvas.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const endDrawing = () => {
    setIsDrawing(false);
  };

  const handleSaveSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    // Convert canvas to data URL
    const dataUrl = canvas.toDataURL('image/png');
    onSave(dataUrl);
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasSignature(false);
    
    // Save empty signature
    onSave('');
  };

  return (
    <div className="space-y-4">
      <div className="border-2 border-gray-200 rounded-md p-2">
        <div className="bg-gray-50 text-center text-xs uppercase tracking-wider text-gray-500 py-1 mb-2">
          <Pen className="inline-block h-3 w-3 mr-1" /> Sign Here
        </div>
        <canvas
          ref={canvasRef}
          width={560}
          height={200}
          className="w-full bg-white border border-gray-100 touch-none"
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={endDrawing}
          onMouseLeave={endDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={endDrawing}
        />
      </div>
      <div className="flex justify-end gap-2">
        <Button 
          variant="outline" 
          size="sm"
          onClick={clearSignature}
          className="space-x-1"
          type="button"
        >
          <Trash2 className="h-4 w-4" />
          <span>Clear</span>
        </Button>
        <Button 
          variant="default" 
          size="sm"
          onClick={handleSaveSignature}
          disabled={!hasSignature}
          className="space-x-1"
          type="button"
        >
          <Save className="h-4 w-4" />
          <span>Save Signature</span>
        </Button>
      </div>
    </div>
  );
};
