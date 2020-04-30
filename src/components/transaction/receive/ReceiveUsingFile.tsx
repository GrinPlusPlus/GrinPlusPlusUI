import React from "react";
import { Dropper, HorizontallyCenter } from "../../styled";
import { useDropzone } from "react-dropzone";

type ReceiveUsingFileProps = {
  onResponseFilesDroppedCb: (files: File[]) => void;
};
export const ReceiveUsingFileComponent = ({
  onResponseFilesDroppedCb,
}: ReceiveUsingFileProps) => {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: onResponseFilesDroppedCb,
  });

  return (
    <div {...getRootProps()}>
      <input {...getInputProps()} />
      <Dropper>
        <HorizontallyCenter>
          {isDragActive
            ? "Drop the .tx files here..."
            : "Drag 'n' drop the .tx files here or click to select files."}
        </HorizontallyCenter>
      </Dropper>
    </div>
  );
};
