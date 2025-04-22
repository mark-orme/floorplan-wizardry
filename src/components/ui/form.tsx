
import * as React from "react";
import * as LabelPrimitive from "@radix-ui/react-label";
import { Slot } from "@radix-ui/react-slot";
import { Controller, useForm as useReactHookForm } from "react-hook-form";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";

const Form = React.forwardRef<
  HTMLFormElement,
  React.ComponentPropsWithoutRef<"form">
>(({ className, children, ...props }, ref) => {
  return (
    <form
      ref={ref}
      className={cn("space-y-8", className)}
      {...props}
    >
      {children}
    </form>
  );
});
Form.displayName = "Form";

type FormFieldContextValue = {
  name: string;
};

const FormFieldContext = React.createContext<FormFieldContextValue>(
  {} as FormFieldContextValue
);

const FormField = ({
  control,
  name,
  render,
}: {
  control: any;
  name: string;
  render: any;
}) => {
  return (
    <FormFieldContext.Provider value={{ name }}>
      <Controller
        control={control}
        name={name}
        render={render}
      />
    </FormFieldContext.Provider>
  );
};

type FormItemContextValue = {
  id: string;
};

const FormItemContext = React.createContext<FormItemContextValue>(
  {} as FormItemContextValue
);

const FormItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const id = React.useId();

  return (
    <FormItemContext.Provider value={{ id }}>
      <div ref={ref} className={cn("space-y-2", className)} {...props} />
    </FormItemContext.Provider>
  );
});
FormItem.displayName = "FormItem";

const FormLabel = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>
>(({ className, ...props }, ref) => {
  const { id } = React.useContext(FormItemContext);

  return (
    <Label
      ref={ref}
      className={cn(className)}
      htmlFor={id}
      {...props}
    />
  );
});
FormLabel.displayName = "FormLabel";

const FormControl = React.forwardRef<
  React.ElementRef<typeof Slot>,
  React.ComponentPropsWithoutRef<typeof Slot>
>(({ ...props }, ref) => {
  const { id } = React.useContext(FormItemContext);

  return <Slot ref={ref} id={id} {...props} />;
});
FormControl.displayName = "FormControl";

const FormDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => {
  const { id } = React.useContext(FormItemContext);

  return (
    <p
      ref={ref}
      id={`${id}-description`}
      className={cn("text-[0.8rem] text-muted-foreground", className)}
      {...props}
    />
  );
});
FormDescription.displayName = "FormDescription";

const FormMessage = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, children, ...props }, ref) => {
  const { id } = React.useContext(FormItemContext);

  return (
    <p
      ref={ref}
      id={`${id}-message`}
      className={cn("text-[0.8rem] font-medium text-destructive", className)}
      {...props}
    >
      {children}
    </p>
  );
});
FormMessage.displayName = "FormMessage";

// Since we need to handle React Hook Form v8 compatibility,
// we need to either upgrade or provide a compatibility layer.
// For backward compatibility, we'll export the same interface:

const useFormField = () => {
  const fieldContext = React.useContext(FormFieldContext);
  const itemContext = React.useContext(FormItemContext);
  
  // Using local context instead of react-hook-form v7's useFormContext
  const formContext = React.useContext(FormContextAdapter);

  if (!fieldContext) {
    throw new Error("useFormField should be used within <FormField>");
  }

  const { id } = itemContext;
  
  // Fallback for getFieldState if not provided by context
  const getFieldState = formContext?.getFieldState || (() => ({}));
  const formState = formContext?.formState || {};
  
  const fieldState = getFieldState(fieldContext.name, formState);

  return {
    id,
    name: fieldContext.name,
    formItemId: `${id}-form-item`,
    formDescriptionId: `${id}-form-item-description`,
    formMessageId: `${id}-form-item-message`,
    ...fieldState,
  };
};

// Create a context for form adapter
const FormContextAdapter = React.createContext<{
  getFieldState?: (name: string, formState: any) => any;
  formState?: any;
} | null>(null);

// Simple FormProvider adapter
const FormProvider = ({ children, ...props }: { children: React.ReactNode, [key: string]: any }) => {
  return (
    <FormContextAdapter.Provider value={props}>
      {children}
    </FormContextAdapter.Provider>
  );
};

// Re-export
export {
  useFormField,
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
  FormField,
  FormContextAdapter as useFormContext,
  FormProvider,
  useReactHookForm as useForm
};
