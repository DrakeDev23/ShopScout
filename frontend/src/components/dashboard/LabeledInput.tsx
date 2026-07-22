interface LabeledInputProps {
    label: string;
    value: string;
    onChange: (v: string) => void;
}

export function LabeledInput({ label, value, onChange }: LabeledInputProps) {
    return (
        <div>
            <label className="text-xs font-medium text-[#5B6472]">{label}</label>
            <input
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="mt-1.5 w-full rounded-lg border border-[#D7DCE3] px-3 py-2.5 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#E2542D]"
            />
        </div>
    );
}