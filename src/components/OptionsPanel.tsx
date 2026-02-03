import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { ChevronDown, Settings2 } from 'lucide-react';
import type { ExtraField } from '@/types/fileTypes';
import { extraFieldLabels } from '@/types/fileTypes';

interface OptionsPanelProps {
  includeSubfolders: boolean;
  onIncludeSubfoldersChange: (value: boolean) => void;
  extraFields: ExtraField[];
  onExtraFieldsChange: (fields: ExtraField[]) => void;
}

const allExtraFields: ExtraField[] = ['createdDate', 'isHidden', 'extension', 'path'];

export function OptionsPanel({
  includeSubfolders,
  onIncludeSubfoldersChange,
  extraFields,
  onExtraFieldsChange,
}: OptionsPanelProps) {
  const toggleExtraField = (field: ExtraField) => {
    if (extraFields.includes(field)) {
      onExtraFieldsChange(extraFields.filter(f => f !== field));
    } else {
      onExtraFieldsChange([...extraFields, field]);
    }
  };

  return (
    <div className="w-full card-elevated space-y-4">
      <h3 className="font-semibold text-foreground flex items-center gap-2">
        <Settings2 className="w-5 h-5 text-primary" />
        Opciones
      </h3>
      
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        {/* Include subfolders checkbox */}
        <div className="flex items-center space-x-3">
          <Checkbox
            id="subfolders"
            checked={includeSubfolders}
            onCheckedChange={(checked) => onIncludeSubfoldersChange(checked === true)}
          />
          <Label 
            htmlFor="subfolders" 
            className="text-sm font-medium cursor-pointer select-none"
          >
            Incluir subcarpetas
          </Label>
        </div>

        {/* Extra fields dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="w-full sm:w-auto justify-between gap-2">
              <span>Campos adicionales</span>
              {extraFields.length > 0 && (
                <span className="bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded-full">
                  {extraFields.length}
                </span>
              )}
              <ChevronDown className="w-4 h-4 opacity-50" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 bg-popover border border-border shadow-lg z-50">
            <DropdownMenuLabel>Seleccionar campos</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {allExtraFields.map(field => (
              <DropdownMenuCheckboxItem
                key={field}
                checked={extraFields.includes(field)}
                onCheckedChange={() => toggleExtraField(field)}
              >
                {extraFieldLabels[field]}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Selected extra fields display */}
      {extraFields.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {extraFields.map(field => (
            <span 
              key={field}
              className="inline-flex items-center px-3 py-1 text-xs font-medium bg-secondary text-secondary-foreground rounded-full"
            >
              {extraFieldLabels[field]}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
