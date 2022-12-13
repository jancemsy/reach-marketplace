import React, {useState, useEffect} from 'react';
import styled from "styled-components";

export interface ICheckBox {
    isChecked: boolean;
    text: string;
    textChecked?: string;
    id: string;
    value: string;
    onChecked?: (id: string, value: string, isChecked: boolean) => void;
}

const CheckBox = ({id, text, textChecked, isChecked, value, onChecked}: ICheckBox) => {
    const [checked, setChecked] = useState<boolean>(false);

    const onCheckedChange = () =>{
        //setChecked(!checked);
        onChecked(id, value, !checked);
    }

    useEffect(() => {
        setChecked(isChecked);
    }, [isChecked]);

    return (
        <CheckBoxContainer className={checked ? "selected" : ""} onClick={onCheckedChange}>{checked ? textChecked : text}
            <Input type="radio" value={value} checked={checked}/>
            <Checkmark className='checkmark' onClick={onCheckedChange}></Checkmark>
        </CheckBoxContainer>
    );
};

const CheckBoxContainer = styled.div`
    display: block;
    position: relative;
    padding-left: 35px;
    margin-right: 16px;
    cursor: pointer;
    font-size: 16px;
    font-weight: 600;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;

    &.selected{
        color: #3376CD;
    }

    &:hover input ~ .checkmark {
        background-color: #ccc;
    }

    input:checked ~ .checkmark{
        background-color: #3376CD;
        border-color: #3376CD;
    }

    input:checked ~ .checkmark:after {
        display: block;
    }

    .checkmark:after {
        left: 7px;
        top: 3px;
        width: 3px;
        height: 8px;
        border: solid white;
        border-width: 0 3px 3px 0;
        -webkit-transform: rotate(45deg);
        -ms-transform: rotate(45deg);
        transform: rotate(45deg);
    }
`;

const Input = styled.input`
    position: absolute;
    opacity: 0;
    cursor: pointer;
    height: 0;
    width: 0;
`;

const Checkmark = styled.span`
    position: absolute;
    top: 0px;
    left: 0px;
    height: 20px;
    width: 20px;
    border: 2px solid #3376CD;
    &:after {
        content: "";
        position: absolute;
        display: none;
    }
`;

export default CheckBox;