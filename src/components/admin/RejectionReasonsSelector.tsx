
import React from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { 
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { ChevronDown, X } from 'lucide-react';
import { COMMON_REJECTION_REASONS } from '@/utils/rejectionReasons';

interface RejectionReasonsSelectorProps {
  selectedReasons: string[];
  feedback: string;
  isReasonDropdownOpen: boolean;
  onReasonToggle: (reason: string) => void;
  onFeedbackChange: (feedback: string) => void;
  onDropdownOpenChange: (open: boolean) => void;
  onRemoveReason: (reason: string) => void;
}

const RejectionReasonsSelector: React.FC<RejectionReasonsSelectorProps> = ({
  selectedReasons,
  feedback,
  isReasonDropdownOpen,
  onReasonToggle,
  onFeedbackChange,
  onDropdownOpenChange,
  onRemoveReason,
}) => {
  return (
    <div className="space-y-3">
      <div className="space-y-2">
        <label className="text-sm font-medium">
          Select rejection reasons (select multiple if applicable):
        </label>
        
        <Popover open={isReasonDropdownOpen} onOpenChange={onDropdownOpenChange}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={isReasonDropdownOpen}
              className="w-full justify-between"
            >
              {selectedReasons.length === 0 
                ? "Select rejection reasons..."
                : `${selectedReasons.length} reason${selectedReasons.length > 1 ? 's' : ''} selected`
              }
              <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full p-0" align="start">
            <Command>
              <CommandInput placeholder="Search rejection reasons..." />
              <CommandEmpty>No reasons found.</CommandEmpty>
              <CommandList>
                <CommandGroup>
                  {COMMON_REJECTION_REASONS.map((reason) => (
                    <CommandItem
                      key={reason}
                      onSelect={() => onReasonToggle(reason)}
                      className="cursor-pointer"
                    >
                      <Checkbox
                        checked={selectedReasons.includes(reason)}
                        onChange={() => onReasonToggle(reason)}
                        className="mr-2"
                      />
                      <span className="text-sm">{reason}</span>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>

        {selectedReasons.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {selectedReasons.map((reason) => (
              <Badge key={reason} variant="secondary" className="text-xs">
                {reason.length > 50 ? `${reason.substring(0, 47)}...` : reason}
                <button
                  onClick={() => onRemoveReason(reason)}
                  className="ml-1 hover:bg-gray-300 rounded-full p-0.5"
                >
                  <X className="h-2 w-2" />
                </button>
              </Badge>
            ))}
          </div>
        )}
      </div>
      
      <div className="space-y-2">
        <label className="text-sm font-medium">
          Additional feedback or custom reason:
        </label>
        <Textarea
          placeholder={selectedReasons.includes("Other (specify in the text area below)") 
            ? "Please specify the rejection reason..." 
            : "Add additional feedback (optional for approval, modify/add reasons for rejection)"}
          value={feedback}
          onChange={(e) => onFeedbackChange(e.target.value)}
          rows={4}
        />
      </div>
    </div>
  );
};

export default RejectionReasonsSelector;
