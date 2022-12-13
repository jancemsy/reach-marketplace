import React, { Fragment, useState, useEffect, useCallback } from "react";
import styled from "styled-components";
import Dropzone, { useDropzone, FileWithPath } from "React-dropzone";
import { Icon } from "office-ui-fabric-react";

const Upload = ({ open, maxFiles, maxSize, type, onFileChange }) => {
  const [errorTxt, setErrorTxt] = useState<string>("");

  const onDrop = useCallback((acceptedFiles) => {
    setErrorTxt("");
  }, []);

  const onDropRejected = useCallback((fileRejections) => {
    setErrorTxt(fileRejections[0].errors[0].message);
    //console.log(fileRejections);
  }, []);

  const { getRootProps, getInputProps, acceptedFiles } = useDropzone({
    onDrop,
    onDropRejected,
    minSize: 0,
    maxSize: maxSize,
    maxFiles: maxFiles,
  });

  useEffect(() => {
    if (acceptedFiles) {
      onFileChange(acceptedFiles);
    }
  }, [acceptedFiles]);

  return (
    <div className="upload-container">
      <div {...getRootProps({ className: "dropzone" })}>
        <input {...getInputProps()} id="uploadfile" />
        {type === "small" ? (
          <button className="primary btn" onClick={open}>
            Upload
          </button>
        ) : (
          <Fragment>
            <h1 className="title">Please Upload your quote here</h1>
            <p className="description">
              Desecription of upload process At vero eos et accusamue et iusto
              odio dignissimos ducimus qui blanditiis praesentium voluptatum
              deleniti atque corrupti quos dolores et
            </p>
            <div className="upload-icon-container">
              <Icon iconName="OpenInNewTab" />
              <p>DRAG AND DROP</p>
            </div>
            <div className="upload-import-container">
              <div>Or</div>
              <div className="import-link" onClick={open}>
                Import
              </div>
            </div>
          </Fragment>
        )}
        {errorTxt && <div className="error">{errorTxt}</div>}
      </div>
    </div>
  );
};

export default Upload;
