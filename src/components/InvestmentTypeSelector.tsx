import { Dropdown, Checkbox, Label } from "flowbite-react";
import type { Option } from "../hooks/useConfigurations";


interface InvestmentTypeSelectorProps {
    selectedTypes: string[];
    setSelectedTypes: (types: string[]) => void;
    investmentTypes: Option[];
}

export default function InvestmentTypeSelector({
    selectedTypes,
    setSelectedTypes,
    investmentTypes,
}: InvestmentTypeSelectorProps) {
    const toggleType = (type: string) => {
        if (selectedTypes.includes(type)) {
            setSelectedTypes(selectedTypes.filter((t) => t !== type));
        } else {
            setSelectedTypes([...selectedTypes, type]);
        }
    };

    return (
        <div className="border border-gray-300 rounded-md px-2 py-1">
            <Dropdown label="Investment Types" inline>
                {investmentTypes.map((t) => (
                    <div key={t.value} className="flex items-center gap-2 px-2 py-1">
                        <Checkbox
                            id={`type-${t.value}`}
                            checked={selectedTypes.includes(t.label)}
                            onChange={() => toggleType(t.label)}
                        />
                        <Label htmlFor={`type-${t.value}`}>{t.label}</Label>
                    </div>
                ))}
            </Dropdown>
        </div>
    );
}