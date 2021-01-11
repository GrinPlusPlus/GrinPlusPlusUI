import { Dropper, HorizontallyCenter } from "../../styled";

import React from "react";
import { useDropzone } from "react-dropzone";
import { useTranslation } from "react-i18next";

type ReceiveUsingFileProps = {
  onResponseFilesDroppedCb: (files: File[]) => void;
};
export const ReceiveUsingFileComponent = ({
  onResponseFilesDroppedCb,
}: ReceiveUsingFileProps) => {
  const { t } = useTranslation();

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: onResponseFilesDroppedCb,
  });

  return (
    <div {...getRootProps()}>
      <input {...getInputProps()} />
      <Dropper>
        <HorizontallyCenter>
          {isDragActive ? t("drop_tx_file_here") : t("drag_drop_tx_file")}
        </HorizontallyCenter>
      </Dropper>
    </div>
  );
};
