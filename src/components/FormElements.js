export const CheckboxRadio = ({ id, labelText, register, type, errors, rules, value, name }) => {
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
                <div className='invalid-feedback'>{errors[name]?.message}</div>
            )}
        </div>
    </>)
}
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
export const Select = ({ id, labelText, register, errors, rules, children, disabled = false }) => {
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
                <div className='invalid-feedback'>{errors[id]?.message}</div>
            )}
        </>
    )
}

/*啟用react-hook-form的起手式
    const App = () => {
    const {
    register,
    handleSubmit,
    watch,
    getValues,
    control,
    formState: { errors },
  } = useForm({
    mode: 'onTouched',
  });
  */

/*const onSubmit = (data) => {
    console.log(errors);
    console.log(data);
};

const [customData, setCustomData] = useState({});
const [addressData, setAddressData] = useState([]);

const watchForm = useWatch({
    control,
});
useEffect(() => {
    console.log(getValues()); // 可以使用 getValues 取得所有、特定值
    console.log('errors', errors);
    // 或是使用 setValues 寫入值
}, [watchForm]); // 將新變數傳入

// 取得地址資料
useEffect(() => {
    (async () => {
        const result = await axios.get('./assets/taiwan.json')
        console.log(result);
        setAddressData(result.data);
    })();
}, [])

return (
    <div>
        <form action='' onSubmit={handleSubmit(onSubmit)}>
            <div className='mb-3'>
                <Input
                    id='username'
                    type='text'
                    errors={errors}
                    labelText='使用者名稱'
                    register={register}
                    rules={{
                        required: '使用者名稱為必填',
                        maxLength: {
                            value: 10,
                            message: '使用者名稱長度不超過 10',
                        },
                    }}
                ></Input>
            </div>
            <div className='mb-3'>
                <Input
                    id='email'
                    labelText='Email'
                    type='email'
                    errors={errors}
                    register={register}
                    rules={{
                        required: 'Email 為必填',
                        pattern: {
                            value: /^\S+@\S+$/i,
                            message: 'Email 格式不正確',
                        },
                    }}
                ></Input>
            </div>
            <div className='mb-3'>
                <Input
                    id='tel'
                    labelText='電話'
                    type='tel'
                    errors={errors}
                    register={register}
                    rules={{
                        required: '電話為必填',
                        minLength: {
                            value: 6,
                            message: '電話不少於 6 碼'
                        },
                        maxLength: {
                            value: 12,
                            message: '電話不超過 12 碼'
                        }
                    }}
                ></Input>
            </div>
            <div className='row mb-3 g-3'>
                <div className='col-6'>
                    <Select id='city'
                        labelText='縣市'
                        errors={errors}
                        register={register}
                        rules={{
                            required: '縣市為必填'
                        }}>
                        <option value="">請選擇縣市</option>
                        {addressData.map((city) => {
                            return <option value={city.CityName} key={city.CityEngName}>{city.CityName}</option>
                        })}
                    </Select>
                </div>
                <div className='col-6'>
                    <Select id='district'
                        labelText='鄉鎮市區'
                        errors={errors}
                        register={register}
                        disabled={!getValues().city}
                        rules={{
                            required: '鄉鎮市區為必填'
                        }}>
                        <option value="">請選擇鄉鎮市區</option>
                        {
                            addressData.find((city) => city.CityName === getValues().city)
                                ?.AreaList?.map((area) => {
                                    return <option value={area} key={area.AreaName}>{area.AreaName}</option>
                                })
                        }
                    </Select>
                </div>
            </div>
            <div className='mb-3'>
                <Input
                    id='address'
                    labelText='地址'
                    type='address'
                    errors={errors}
                    register={register}
                    rules={{
                        required: '地址為必填',
                    }}
                ></Input>
            </div>
            <div className='mb-3'>
                <div className='form-label'>素食者</div>
                <CheckboxRadio
                    type='radio'
                    name='isVegetarian'
                    id='vegetarian'
                    value={true}
                    register={register}
                    errors={errors}
                    rules={{ required: '請選擇是否吃素' }}
                    labelText="是"
                ></CheckboxRadio>
                <CheckboxRadio
                    type='radio'
                    name='isVegetarian'
                    id='non-vegetaria'
                    value={false}
                    register={register}
                    errors={errors}
                    rules={{ required: '請選擇是否吃素' }}
                    labelText="否"
                ></CheckboxRadio>
            </div>
            <div className='mb-3'>
                <CheckboxRadio
                    type='checkbox'
                    name='isCheckForm'
                    id='isCheckForm'
                    value={true}
                    register={register}
                    errors={errors}
                    rules={{ required: true }}
                    labelText="確認同意本文件"
                ></CheckboxRadio>
            </div>

            <button type='submit' className='btn btn-primary'>
                註冊
            </button>
        </form>
    </div>
);
  };*/