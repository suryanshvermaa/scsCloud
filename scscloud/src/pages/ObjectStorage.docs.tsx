import React from "react";
import ObjectStorageDoc from "../docs/ObjectStorageDoc";
import DocsLayout from "../components/docs/DocsLayout";

const ObjectStorageDocs: React.FC = () => {
  return (
    <DocsLayout title="Object Storage">
      <ObjectStorageDoc />
    </DocsLayout>
  );
};

export default ObjectStorageDocs;
