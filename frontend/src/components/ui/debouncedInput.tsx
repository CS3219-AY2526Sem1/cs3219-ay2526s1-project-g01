/**
 * AI Assistance Disclosure:
 * Tool: ChatGPT (model: ChatGPT-4.1), date: 2025-09-15
 * Purpose: To implement a reusable debounced input component in React.
 * Author Review: I validated correctness, security, and performance of the code.
 */

"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";

// Custom hook: Returns a value only after 'delay' ms have passed without change
function useDebouncedValue<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = React.useState(value);

  React.useEffect(() => {
    // Set up a timer: update debounced value only after the delay
    const handler = setTimeout(() => setDebounced(value), delay);

    // If value or delay changes, clear the timer
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debounced;
}

// Extend HTML input props to include debounced callback and delay
export interface DebouncedInputProps extends React.ComponentProps<"input"> {
  onDebouncedChange?: (value: string) => void; // Called after user stops typing
  debounceMs?: number; // Debounce duration, default 300ms
}

// Forward ref so this input can be used like a normal input (with refs)
export const DebouncedInput = React.forwardRef<
  HTMLInputElement,
  DebouncedInputProps
>(({ onDebouncedChange, debounceMs = 300, ...props }, ref) => {
  // Internal state for input value
  const [value, setValue] = React.useState(props.value?.toString() || "");

  // Sync with controlled value (if parent updates value prop)
  React.useEffect(() => {
    if (typeof props.value === "string" || typeof props.value === "number") {
      setValue(props.value.toString());
    }
  }, [props.value]);

  // Debounced version of the value (only updates after debounceMs)
  const debounced = useDebouncedValue(value, debounceMs);

  // Fire debounced callback only when debounced value changes
  React.useEffect(() => {
    if (onDebouncedChange) onDebouncedChange(debounced);
    // eslint-disable-next-line
  }, [debounced]);

  return (
    <Input
      {...props} // Pass down all other props to shadcn/ui Input
      ref={ref}
      value={value}
      // When user types: update local value and also call original onChange (if given)
      onChange={(e) => {
        setValue(e.target.value);
        props.onChange?.(e); // Call parent onChange if supplied
      }}
    />
  );
});

DebouncedInput.displayName = "DebouncedInput";
