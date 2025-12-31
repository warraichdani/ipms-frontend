import { Dropdown, Checkbox, Label } from "flowbite-react";
import {  useInvestmentTypeOptions, type Option } from "../hooks/useConfigurations";

interface InvestmentTypeSelectorProps {
  selectedTypes: string[];
  setSelectedTypes: (types: string[]) => void;
}

export default function InvestmentTypeSelector({
  selectedTypes,
  setSelectedTypes,
}: InvestmentTypeSelectorProps) {
  // ✅ Pull investment types from configurations hook
  const investmentTypes = useInvestmentTypeOptions(); 

  const toggleType = (id: string) => {
    if (selectedTypes.includes(id)) {
      setSelectedTypes(selectedTypes.filter((t) => t !== id));
    } else {
      setSelectedTypes([...selectedTypes, id]);
    }
  };

  return (
    <div className="border border-gray-300 rounded-md px-2 py-1">
      <Dropdown label="Investment Types" inline>
        {investmentTypes.map((t) => (
          <div key={t.value} className="flex items-center gap-2 px-2 py-1">
            <Checkbox
              id={`type-${t.value}`}
              checked={selectedTypes.includes(t.value)}
              onChange={() => toggleType(t.value)}
            />
            <Label htmlFor={`type-${t.value}`}>{t.label}</Label>
          </div>
        ))}
      </Dropdown>
    </div>
  );
}