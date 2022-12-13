import React, {} from 'react';

export interface IConfigStep {
    step: number;
}

const configStep = ({step=1}: IConfigStep) => {
  return (
    <div className="msft-config-steps">
        <div className={"starting-line-step" + (step > 0 ? " active": "")}></div>
        <div className={"first-line" + (step > 0 ? " active": "")}></div>
            <div className={"first-circle"+ (step > 0 ? " active": "")}>
                <div className="specifics">
                    Specification
                </div>
            </div>
            <div className={"second-line"+ (step > 1 ? " active": "")}></div>
                <div className={"second-circle"+ (step > 1 ? " active": "")}>
                    <div className="specifics">
                        Add-Ons
                    </div>
                </div>
            <div className={"third-line"+ (step > 2 ? " active": "")}></div>
                <div className={"third-circle"+ (step > 2 ? " active": "")}>
                    <div className="specifics">
                        Accessories
                    </div>
                </div>
            <div className={"last-line"+ (step > 2 ? " active": "")}></div>
        <div className={"ending-line-step"+ (step > 2 ? " active": "")}></div>
    </div>
  )
}

export default configStep;