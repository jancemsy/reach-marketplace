import React, { useContext, useState } from "react";
import AppContext from "../../AppContext";
import { D365BaseUrl } from "../../helpers/request";

const Upload = () => {
  const GlobalStore: any = useContext(AppContext);
  const { prodService, Navigate, MSFTToken } = GlobalStore;
  const [file, setFile] = useState();

  function makeRequest(
    method,
    fileName,
    url,
    bytes,
    firstRequest,
    offset,
    count,
    fileBytes
  ) {
    return new Promise(function (resolve, reject) {
      var request = new XMLHttpRequest();
      request.open(method, url);
      if (firstRequest)
        request.setRequestHeader("x-ms-transfer-mode", "chunked");
      request.setRequestHeader("x-ms-file-name", fileName);

      if (!firstRequest) {
        request.setRequestHeader(
          "Content-Range",
          "bytes " +
            offset +
            "-" +
            (offset + count - 1) +
            "/" +
            fileBytes.length
        );
        request.setRequestHeader("Content-Type", "application/octet-stream");
      }
      request.setRequestHeader("Authorization", `Bearer ${MSFTToken}`);
      request.onload = resolve;
      request.onerror = reject;
      if (!firstRequest) request.send(bytes);
      else request.send();
    });
  }
  function uploadFile() {
    var fileControl: any = document.getElementById("file_input");
    var reader = new FileReader();
    var fileName = fileControl.files[0].name;
    reader.onload = function () {
      var arrayBuffer = this.result;
      var array = new Uint8Array(arrayBuffer as ArrayBuffer);
      var url =
        D365BaseUrl() +
        "/api/data/v9.2/lvt_shoppingbaskets(86b352b7-8d32-ed11-9db1-002248933c9b)/lvt_quotepdf";
      //console.log(fileName);
      makeRequest("PATCH", fileName, url, null, true, null, null, null).then(
        function (s) {
          fileChunckUpload(s, fileName, array);
        }
      );
    };
    reader.readAsArrayBuffer(fileControl.files[0]);
  }

  async function fileChunckUpload(response, fileName, fileBytes) {
    var req = response.target;
    var url = req.getResponseHeader("location");
    var chunkSize = parseInt(req.getResponseHeader("x-ms-chunk-size"));
    var offset = 0;
    while (offset <= fileBytes.length) {
      var count =
        offset + chunkSize > fileBytes.length
          ? fileBytes.length % chunkSize
          : chunkSize;
      var content = new Uint8Array(count);
      for (var i = 0; i < count; i++) {
        content[i] = fileBytes[offset + i];
      }
      response = await makeRequest(
        "PATCH",
        fileName,
        url,
        content,
        false,
        offset,
        count,
        fileBytes
      );
      req = response.target;
      if (req.status === 206) {
        // partial content, so please continue.
        offset += chunkSize;
      } else if (req.status === 204) {
        // request complete.
        break;
      } else {
        // error happened.
        // log error and take necessary action.
        break;
      }
    }
  }

  const onRetrieveFile = () => {};

  return (
    <div>
      <h1>Upload here</h1>
      <input type="file" id="file_input" />
      <button onClick={uploadFile}>Submit</button>
      <button onClick={onRetrieveFile}>Retrieve</button>
    </div>
  );
};

export default Upload;
