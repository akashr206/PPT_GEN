import React from "react";
import { Minus, Plus } from "lucide-react";

export function FontSizeControl({ valueCqw, onChangeCqw, min = 0.5, max = 15, step = 0.2, label }) {
    // Convert cqw to px for display (1cqw = 19.2px assuming 1920px width)
    const displayValuePx = Math.round(valueCqw * 19.2);

    const [inputValue, setInputValue] = React.useState(displayValuePx.toString());

    React.useEffect(() => {
        setInputValue(displayValuePx.toString());
    }, [displayValuePx]);

    const handleDecrease = () => {
        onChangeCqw(Math.max(min, valueCqw - step));
    };

    const handleIncrease = () => {
        onChangeCqw(Math.min(max, valueCqw + step));
    };

    const handleInputChange = (e) => {
        setInputValue(e.target.value);
    };

    const handleInputBlur = () => {
        let val = parseInt(inputValue, 10);
        if (isNaN(val)) {
            setInputValue(displayValuePx.toString());
            return;
        }
        // Convert px back to cqw
        let newCqw = val / 19.2;
        // Enforce bounds
        newCqw = Math.max(min, Math.min(max, newCqw));
        onChangeCqw(newCqw);
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            handleInputBlur();
        }
    };

    return (
        <div className="flex items-center justify-between gap-1 sm:gap-2">
            {label && <span className="text-[10px] sm:text-xs font-medium text-muted-foreground w-6 sm:w-8">{label}</span>}
            <div className="flex items-center bg-muted/50 rounded border border-border/50 overflow-hidden">
                <button 
                    onClick={handleDecrease} 
                    className="p-1 sm:p-1.5 hover:bg-muted-foreground/10 text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
                    title="Decrease font size"
                >
                    <Minus className="w-3 h-3 sm:w-4 sm:h-4" />
                </button>
                <input
                    type="text"
                    value={inputValue}
                    onChange={handleInputChange}
                    onBlur={handleInputBlur}
                    onKeyDown={handleKeyDown}
                    className="text-[10px] sm:text-xs w-8 sm:w-10 text-center text-foreground border-x border-border/50 font-mono bg-transparent outline-none focus:bg-background"
                    title={`${valueCqw.toFixed(1)}cqw`}
                />
                <button 
                    onClick={handleIncrease} 
                    className="p-1 sm:p-1.5 hover:bg-muted-foreground/10 text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
                    title="Increase font size"
                >
                    <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
                </button>
            </div>
        </div>
    );
}
