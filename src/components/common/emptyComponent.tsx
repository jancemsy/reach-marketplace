import React from "react";
import { Icon } from "office-ui-fabric-react";

export interface IEmptyComponent {
  componentName: string;
  linkText: string;
  linkUrl: string;
}

const emptyComponent = ({
  componentName,
  linkText,
  linkUrl,
}: IEmptyComponent) => {
  return (
    <div className="empty-items-section">
      <div className="empty-items-container">
        <Icon iconName="AlertSolid"></Icon>
        <span>
          Your {componentName} is currently empty.{" "}
          {linkUrl && linkText && <a href={linkUrl}>{linkText}</a>}
          <a></a>
        </span>
      </div>
    </div>
  );
};

export default emptyComponent;
