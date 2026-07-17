"use client";

import React, { useRef, useEffect } from "react";

export function EditableElement({
    value,
    onChange,
    className = "",
    as: Component = "div",
    placeholder = "Type here...",
    readOnly = false,
    style = {},
}) {
    const contentRef = useRef(null);
    const prevValue = useRef(value);

    // Update innerText if value changes externally
    useEffect(() => {
        if (!readOnly && contentRef.current && value !== prevValue.current) {
            // Only update if it's not currently focused to avoid messing with cursor position
            if (document.activeElement !== contentRef.current) {
                contentRef.current.innerText = value || "";
            }
            prevValue.current = value;
        }
    }, [value, readOnly]);

    if (readOnly) {
        return (
            <Component 
                className={`${
                    !value
                        ? "empty:before:content-[attr(data-placeholder)] empty:before:text-muted-foreground/50 empty:before:pointer-events-none empty:before:block"
                        : ""
                } ${className}`}
                style={style}
                data-placeholder={placeholder}
            >
                {value}
            </Component>
        );
    }

    const handleBlur = (e) => {
        const newValue = e.currentTarget.innerText;
        if (newValue !== prevValue.current) {
            onChange(newValue);
            prevValue.current = newValue;
        }
    };

    const handlePaste = (e) => {
        e.preventDefault();
        const text = e.clipboardData.getData("text/plain");
        document.execCommand("insertText", false, text);
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            // Let the layout handle newlines, or prevent if it's a single-line item.
            // For now, allow basic Shift+Enter for new line, prevent default for normal Enter
            // to avoid inserting rich HTML div wrappers that execCommand might do.
            if (!e.shiftKey) {
                e.preventDefault();
                contentRef.current.blur();
            }
        }
    };

    return (
        <Component
            ref={contentRef}
            contentEditable={!readOnly}
            suppressContentEditableWarning={true}
            onBlur={handleBlur}
            onPaste={handlePaste}
            onKeyDown={handleKeyDown}
            className={` outline-none transition-all ${
                !value
                    ? "empty:before:content-[attr(data-placeholder)] empty:before:text-muted-foreground/50 empty:before:pointer-events-none empty:before:block"
                    : ""
            } ${className}`}
            style={style}
            data-placeholder={placeholder}
        >
            {value}
        </Component>
    );
}
