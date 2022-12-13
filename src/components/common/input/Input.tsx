import React, {useState, useEffect} from 'react';

export interface IInput {
    id: string;
    defaultValue: string;
    isNumberOnly: boolean;
    onChange: (id: string, value: any) => void;
}

const Input = ({id, defaultValue, isNumberOnly = false, onChange}: IInput) => {
    const [currentValue, setCurrentValue] = useState<string>();

    const onChangeValue = (e) => {
        if(isNumberOnly){
            const re = /^[0-9\b]+$/;

            // if value is not blank, then test the regex

            if (e.target.value === '' || re.test(e.target.value)) {
                setCurrentValue(e.target.value)
                onChange(id, e);
            }  
        } else {
            setCurrentValue(e.target.value)
            onChange(id, e);
        }
    }

    useEffect(() => {
        setCurrentValue(defaultValue);
    }, []);

    return (
        <input onChange={onChangeValue} value={currentValue} />
    )
}

export default Input