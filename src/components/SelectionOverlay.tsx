
import { useState, useRef } from 'react';
import { OverlayPanel } from 'primereact/overlaypanel';
import { Button } from 'primereact/button';
import { InputNumber } from 'primereact/inputnumber';

interface SelectionOverlayProps {
    onSubmit: (count: number) => void;
}

export const SelectionOverlay = ({ onSubmit }: SelectionOverlayProps) => {
    const [value, setValue] = useState<number | null>(null);
    const op = useRef<OverlayPanel>(null);

    const handleSubmit = () => {
        if (value !== null && value >= 0) {
            onSubmit(value);
            op.current?.hide();
            setValue(null);
        }
    };

    return (
        <>
            <Button
                type="button"
                icon="pi pi-chevron-down"
                onClick={(e) => op.current?.toggle(e)}
                className="p-button-secondary p-button-sm w-3rem h-3rem p-0 ml-2"
                aria-label="Select Options"
            />

            <OverlayPanel ref={op} style={{ backgroundColor: '#1e293b', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)' }}>
                <div className="flex flex-column gap-3" style={{ minWidth: '300px' }}>
                    <div>
                        <span className="font-semibold block mb-2 text-xl text-white">Select Rows</span>
                        <p className="text-gray-400 mb-3">Enter number of rows to select across all pages</p>
                    </div>
                    <div className="flex gap-2">
                        <InputNumber
                            value={value}
                            onValueChange={(e) => setValue(e.value ?? null)}
                            placeholder="e.g. 50"
                            min={0}
                            className="w-full"
                            inputClassName="bg-gray-900 border-gray-700 text-white"
                        />
                        <Button label="Submit" onClick={handleSubmit} className="bg-teal-500 border-teal-500 hover:bg-teal-600 text-white font-bold" />
                    </div>
                </div>
            </OverlayPanel>
        </>
    );
};
