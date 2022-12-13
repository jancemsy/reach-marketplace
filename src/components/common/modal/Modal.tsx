import React, {useState, Fragment, useEffect} from 'react';
import { Icon } from "office-ui-fabric-react";

interface ModalProps extends React.DetailedHTMLProps<
React.HTMLAttributes<HTMLElement>,
HTMLElement
> {
    isDisplay: boolean;
    onClickClose?: (bol: boolean) => void;
}

const Modal = ({isDisplay, children, onClickClose}: ModalProps) => {
    const [show, setShow] = useState<boolean>(false);
    
    const onClose = () => {
        if(onClickClose) {
            onClickClose(!show);
            setShow(!show);
        }
    }

    useEffect(() => {
        setShow(isDisplay);
    }, [isDisplay]);

    return (
        <Fragment>
            {show ? (<div className='reach-modal-section'>
                <div className='reach-modal-container'>
                    <div className='reach-inner-container'>
                        <div className="reach-modal-close-container">
                            <div className='reach-modal-close' onClick={onClose}>
                                <Icon iconName="Cancel" />
                            </div>
                        </div>
                        {children}
                    </div>
                </div>
            </div>) : null
            }
        </Fragment>
    );
};

export default Modal;
