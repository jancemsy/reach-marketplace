import React from "react";
import { Icon } from "office-ui-fabric-react";

export interface LoadingProps {
  loading?: boolean;
}

function Loading({ loading = true }: LoadingProps) {
  if (loading)
    return (
      <div className="loading">
        <Icon iconName="ProgressRingDots" className="rotating" />
      </div>
    );

  return null;
}

export default Loading;
