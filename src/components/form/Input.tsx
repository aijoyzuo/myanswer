import type {
  FieldErrors,
  FieldValues,
  Path,
  RegisterOptions,
  UseFormRegister,
} from "react-hook-form";

type InputProps<TFieldValues extends FieldValues> = {
  id: Path<TFieldValues>;
  labelText: string;
  type?: React.HTMLInputTypeAttribute;
  placeholder?: string;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];

  register: UseFormRegister<TFieldValues>;
  errors: FieldErrors<TFieldValues>;
  rules?: RegisterOptions<TFieldValues, Path<TFieldValues>>;
};

export function Input<TFieldValues extends FieldValues>({
  id,
  labelText,
  type = "text",
  placeholder,
  inputMode,
  register,
  errors,
  rules,
}: InputProps<TFieldValues>): JSX.Element {
  const errorMsg = errors?.[id]?.message as string | undefined;

  return (
    <div>
      <label htmlFor={id} className="form-label">
        {labelText}
      </label>

      <input
        id={id}
        type={type}
        placeholder={placeholder}
        inputMode={inputMode}
        className={`form-control ${errorMsg ? "is-invalid" : ""}`}
        {...register(id, rules)}
      />

      {errorMsg && <div className="invalid-feedback">{errorMsg}</div>}
    </div>
  );
}
