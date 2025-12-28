"use client";

import React, { useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface CustomDropdownProps {
  value: string | string[];
  placeholder: string;
  options: { id: string; name: string }[];
  onChange: (value: string | string[]) => void;
  multiple?: boolean;
  className?: string;
  displayValue?: string; // thêm dòng này
}

export const CustomDropdown: React.FC<CustomDropdownProps> = ({
  value,
  placeholder,
  options,
  onChange,
  className = "",
  displayValue,
  multiple,
}) => {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredOptions = options.filter((option) =>
    option.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Xác định các option đã chọn (cho cả single và multiple)
  const selectedIds = Array.isArray(value) ? value : value ? [value] : [];
  const selectedOptions = options.filter((option) =>
    selectedIds.includes(option.id)
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={`w-full justify-between font-normal ${className}`}
        >
          {/* Nếu có displayValue thì ưu tiên, nếu multiple thì hiển thị các tên đã chọn, nếu không thì như cũ */}
          {displayValue ||
            (multiple
              ? selectedOptions.length
                ? selectedOptions.map((o) => o.name).join(", ")
                : placeholder
              : selectedOptions[0]?.name || placeholder)}
          <ChevronsUpDown className="size-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput
            placeholder="Tìm kiếm..."
            className="h-9"
            value={searchQuery}
            onValueChange={setSearchQuery}
          />
          <CommandList className="max-h-[240px] overflow-y-auto">
            <CommandEmpty>Không tìm thấy mục nào.</CommandEmpty>
            <CommandGroup>
              <CommandItem
                value=""
                className="cursor-pointer hover:bg-gray-100"
                onSelect={() => {
                  if (multiple) {
                    onChange([]);
                  } else {
                    onChange("");
                  }
                  setOpen(false);
                }}
              >
                Tất cả
                {(!value || (Array.isArray(value) && value.length === 0)) && (
                  <Check className="ml-auto opacity-100" />
                )}
              </CommandItem>
              {filteredOptions.map((option) => (
                <CommandItem
                  key={option.id}
                  value={option.name}
                  onSelect={() => {
                    if (multiple) {
                      let newValue: string[] = Array.isArray(value)
                        ? [...value]
                        : [];
                      if (newValue.includes(option.id)) {
                        newValue = newValue.filter((id) => id !== option.id);
                      } else {
                        newValue.push(option.id);
                      }
                      onChange(newValue);
                      // Không đóng popover khi chọn nhiều
                    } else {
                      onChange(option.id);
                      setOpen(false);
                    }
                  }}
                  className="cursor-pointer"
                >
                  {option.name}
                  {multiple
                    ? Array.isArray(value) &&
                      value.includes(option.id) && (
                        <Check className="ml-auto opacity-100" />
                      )
                    : value === option.id && (
                        <Check className="ml-auto opacity-100" />
                      )}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
