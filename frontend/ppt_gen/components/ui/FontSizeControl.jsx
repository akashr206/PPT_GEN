import React from "react";
import { Minus, Plus } from "lucide-react";

export function FontSizeControl({ valueCqw, onChangeCqw, min = 0.5, max = 15, step = 0.2, label }) {
    // Convert cqw to px for display (1cqw = 10px)
    const displayValuePx = Math.round(valueCqw * 10);

    const handleDecrease = () => {
        onChangeCqw(Math.max(min, valueCqw - step));
    };

    const handleIncrease = () => {
        onChangeCqw(Math.min(max, valueCqw + step));
    };

    return (
        <div className="flex items-center justify-between gap-[0.5cqw]">
            {label && <span className="text-[0.9cqw] font-medium text-muted-foreground w-[3cqw]">{label}</span>}
            <div className="flex items-center bg-muted/50 rounded-[0.3cqw] border border-border/50 overflow-hidden">
                <button 
                    onClick={handleDecrease} 
                    className="p-[0.3cqw] hover:bg-muted-foreground/10 text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
                    title="Decrease font size"
                >
                    <Minus className="w-[1.2cqw] h-[1.2cqw]" />
                </button>
                <span 
                    className="text-[0.9cqw] w-[3.5cqw] text-center text-foreground border-x border-border/50 font-mono select-none"
                    title={`${valueCqw.toFixed(1)}cqw`}
                >
                    {displayValuePx}px
                </span>
                <button 
                    onClick={handleIncrease} 
                    className="p-[0.3cqw] hover:bg-muted-foreground/10 text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
                    title="Increase font size"
                >
                    <Plus className="w-[1.2cqw] h-[1.2cqw]" />
                </button>
            </div>
        </div>
    );
}
