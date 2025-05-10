
import React, { forwardRef, useRef, useImperativeHandle, useState, useEffect } from 'react';
import { Button } from './button';
import { Trash2, Check } from 'lucide-react';

interface SignatureCanvasProps {
  onSave: (dataUrl: string | null) => void;
  onClear: () => void;
  width?: number;
  height?: number;
}

export const SignatureCanvas = forwardRef<any, SignatureCanvasProps>(
  ({ onSave, onClear, width = 400, height = 200 }, ref) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [hasSignature, setHasSignature] = useState(false);

    useImperativeHandle(ref, () => ({
      clear: clearCanvas,
      fromDataURL: (dataUrl: string) => {
        const canvas = canvasRef.current;
        if (canvas && dataUrl) {
          const ctx = canvas.getContext('2d');
          if (ctx) {
            const img = new Image();
            img.onload = () => {
              ctx.clearRect(0, 0, canvas.width, canvas.height);
              ctx.drawImage(img, 0, 0);
              setHasSignature(true);
            };
            img.src = dataUrl;
          }
        }
      },
      isEmpty: () => !hasSignature,
      getDataURL: () => {
        const canvas = canvasRef.current;
        return canvas ? canvas.toDataURL() : null;
      },
    }));

    useEffect(() => {
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.lineWidth = 2;
          ctx.lineCap = 'round';
          ctx.strokeStyle = '#000';
        }
      }
    }, []);

    const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
      setIsDrawing(true);
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          const rect = canvas.getBoundingClientRect();
          let clientX, clientY;
          
          if ('touches' in e) {
            clientX = e.touches[0].clientX;
            clientY = e.touches[0].clientY;
          } else {
            clientX = e.clientX;
            clientY = e.clientY;
          }
          
          ctx.beginPath();
          ctx.moveTo(clientX - rect.left, clientY - rect.top);
        }
      }
    };

    const draw = (e: React.MouseEvent | React.TouchEvent) => {
      if (!isDrawing) return;
      
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          const rect = canvas.getBoundingClientRect();
          let clientX, clientY;
          
          if ('touches' in e) {
            clientX = e.touches[0].clientX;
            clientY = e.touches[0].clientY;
          } else {
            clientX = e.clientX;
            clientY = e.clientY;
          }
          
          ctx.lineTo(clientX - rect.left, clientY - rect.top);
          ctx.stroke();
          setHasSignature(true);
        }
      }
    };

    const stopDrawing = () => {
      setIsDrawing(false);
    };

    const clearCanvas = () => {
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          setHasSignature(false);
          onSave(null);
        }
      }
    };

    const saveSignature = () => {
      const canvas = canvasRef.current;
      if (canvas && hasSignature) {
        const dataUrl = canvas.toDataURL();
        onSave(dataUrl);
      }
    };

    return (
      <div className="flex flex-col space-y-2">
        <div 
          className="border-2 border-gray-300 rounded-md bg-white"
          style={{ width: width, height: height, touchAction: 'none' }}
        >
          <canvas
            ref={canvasRef}
            width={width}
            height={height}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            onTouchStart={startDrawing}
            onTouchMove={draw}
            onTouchEnd={stopDrawing}
            className="w-full h-full cursor-crosshair"
          />
        </div>
        <div className="flex space-x-2">
          <Button 
            type="button" 
            variant="outline" 
            size="sm" 
            onClick={onClear || clearCanvas}
          >
            <Trash2 className="h-4 w-4 mr-1" /> Clear
          </Button>
          <Button 
            type="button" 
            size="sm" 
            onClick={saveSignature}
            disabled={!hasSignature}
          >
            <Check className="h-4 w-4 mr-1" /> Save Signature
          </Button>
        </div>
      </div>
    );
  }
);

SignatureCanvas.displayName = 'SignatureCanvas';
