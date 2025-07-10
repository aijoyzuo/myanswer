export const Input = ({ id, labelText, register, type, errors, rules }) => {
  return (
    <>
      <label htmlFor={id} className='form-label'>
        {labelText}
      </label>
      <input
        id={id}
        type={type}
        className={`form-control ${errors[id] && 'is-invalid'}`}
        {...register(id, rules)}
      />
      {errors[id] && (
        <div className='invalid-feedback'>{errors[id]?.message}</div>
      )}
    </>
  );
};


