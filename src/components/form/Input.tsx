import { FieldErrors, FieldValues, UseFormRegister } from 'react-hook-form'

type InputProps = {
  id: string;
  labelText: string;
  type?: string;
  rules?: object;
  register: UseFormRegister<FieldValues>;
  errors: FieldErrors;
  placeholder: string;
};

export const Input:React.FC<InputProps> = ({ id, labelText, register, type, errors, rules, placeholder }) => {
  return (
    <>
      <label htmlFor={id} className='form-label'>
        {labelText}
      </label>
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        className={`form-control ${errors[id] && 'is-invalid'}`}
        {...register(id, rules)}
      />
      {errors[id] && (
        <div className='invalid-feedback'>{errors[id]?.message as string}</div>
      )}
    </>
  );
};


