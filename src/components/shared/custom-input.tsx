"use client";

import { Control, FieldPath } from "react-hook-form";
import { FormControl, FormField, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { z } from "zod";
import { HTMLInputTypeAttribute } from "react";
import { userSchema } from "@/lib/schemas/user-schemas";

interface CustomFormProps {
  control: Control<z.infer<typeof userSchema>>;
  name: FieldPath<z.infer<typeof userSchema>>;
  label: string;
  placeholder: string;
  type?: HTMLInputTypeAttribute;
}

export default function CustomInput({
  control,
  name,
  label,
  placeholder,
  type = "text",
}: CustomFormProps) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <div className="form-item">
          <FormLabel className="form-label">{label}</FormLabel>

          <div className="flex w-full flex-col">
            <FormControl>
              <Input
                placeholder={placeholder}
                className="input-class"
                type={type}
                {...field}
              />
            </FormControl>
            <FormMessage className="form-message mt-2" />
          </div>
        </div>
      )}
    />
  );
}
