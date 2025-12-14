import { FieldErrors, FieldValues, UseFormRegister } from 'react-hook-form'

type CheckboxRadioProps = {
  id: string;
  labelText: string;
  type: 'checkbox' | 'radio';
  name: string;
  value?: string;
  rules?: object;
  register: UseFormRegister<FieldValues>;
  errors: FieldErrors;
};

export const CheckboxRadio: React.FC<CheckboxRadioProps> = ({ id, labelText, type,name, value, rules, register, errors }) => {
  return (<>
    <div className='form-check'>
      <input
        className={`form-check-input ${errors[name] && 'is-invalid'}`}
        type={type}
        name={name}
        id={id}
        value={value}
        {...register(name, rules)}
      />
      {/* Radio 使用 Name 欄位 */}
      <label className='form-check-label' htmlFor={id}>
        {labelText}
      </label>
      {errors[name] && (
        <div className='invalid-feedback'>{errors[name]?.message as string}</div>
      )}
    </div>
  </>)
}


