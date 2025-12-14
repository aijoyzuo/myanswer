import { FieldErrors, FieldValues, UseFormRegister } from 'react-hook-form'

type SelectProps = {
  id: string;
  labelText: string;
  type?: string;
  rules?: object;
  register: UseFormRegister<FieldValues>;
  errors: FieldErrors;
   children: React.ReactNode;
   disabled?:boolean;
};



export const Select:React.FC<SelectProps> = ({ id, labelText, register, errors, rules, children, disabled = false }) => {
  return (
    <>
      <label htmlFor={id} className='form-label'>
        {labelText}
      </label>
      <select
        id={id}
        className={`form-select ${errors[id] && 'is-invalid'}`}
        {...register(id, rules)}
        disabled={disabled}
      >
        {children}
      </select>
      {errors[id] && (
        <div className='invalid-feedback'>{errors[id]?.message as string}</div>
      )}
    </>
  )
}

