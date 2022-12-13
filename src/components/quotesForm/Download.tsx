import React, { useState, useEffect } from "react";

const Download = (props) => {
  const [myUrl, setMyUrl] = useState<string>();

  useEffect(() => {
    setMyUrl(props.iframeSrc);
  }, [props.iframeSrc]);
  return (
    <div>
      <iframe width={"100%"} height={"800px"} src={myUrl} />
    </div>
  );
};

export default Download;
