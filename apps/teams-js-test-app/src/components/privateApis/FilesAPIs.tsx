import { FilePreviewParameters, files } from '@microsoft/teams-js';
import React, { ReactElement } from 'react';

import { generateJsonParseErrorMsg, noHubSdkMsg } from '../../App';
import BoxAndButton from '../BoxAndButton';

interface DeleteCloudStorageParams {
  channelId: string;
  folderToDelete: files.CloudStorageFolder;
}

const FilesAPIs = (): ReactElement => {
  const [openFilePreviewRes, setOpenFilePreviewRes] = React.useState('');
  const [getCloudStorageFoldersRes, setGetCloudStorageFoldersRes] = React.useState('');
  const [addCloudStorageFolderRes, setAddCloudStorageFolderRes] = React.useState('');
  const [deleteCloudStorageFolderRes, setDeleteCloudStorageFolderRes] = React.useState('');
  const [getCloudStorageFolderContentsRes, setGetCloudStorageFolderContentsRes] = React.useState('');
  const [openCloudStorageFileRes, setOpenCloudStorageFileRes] = React.useState('');
  const [capabilityCheckRes, setCapabilityCheckRes] = React.useState('');

  const returnOpenFilePreview = (filePreviewParamsInput: string): void => {
    const filePreviewParams: FilePreviewParameters = JSON.parse(filePreviewParamsInput);
    setOpenFilePreviewRes('openFilePreview()' + noHubSdkMsg);
    files.openFilePreview(filePreviewParams);
  };

  const returnGetCloudStorageFolders = (channelId: string): void => {
    setGetCloudStorageFoldersRes('getCloudStorageFolders()' + noHubSdkMsg);
    files
      .getCloudStorageFolders(channelId)
      .then(folders => setGetCloudStorageFoldersRes(JSON.stringify(folders)))
      .catch(err => setGetCloudStorageFoldersRes(err.errorCode.toString + ' ' + err.message));
  };

  const returnAddCloudStorageFolder = (channelId: string): void => {
    setAddCloudStorageFolderRes('addCloudStorageFolder()' + noHubSdkMsg);
    files
      .addCloudStorageFolder(channelId)
      .then(([isFolderAdded, folders]) => setAddCloudStorageFolderRes(JSON.stringify({ isFolderAdded, folders })))
      .catch(err => setAddCloudStorageFolderRes(err.errorCode.toString + ' ' + err.message));
  };

  const returnDeleteCloudStorageFolder = (input: string): void => {
    const deleteCloudStorageParams: DeleteCloudStorageParams = JSON.parse(input);
    setDeleteCloudStorageFolderRes('deleteCloudStorageFolder()' + noHubSdkMsg);
    files
      .deleteCloudStorageFolder(deleteCloudStorageParams.channelId, deleteCloudStorageParams.folderToDelete)
      .then(isFolderDeleted => setDeleteCloudStorageFolderRes(JSON.stringify(isFolderDeleted)))
      .catch(err => setDeleteCloudStorageFolderRes(err.errorCode.toString + ' ' + err.message));
  };

  const getCloudStorageFolderContents = (input: string): void => {
    try {
      const parsedInput = JSON.parse(input);
      setGetCloudStorageFolderContentsRes('getCloudStorageFolderContents()' + noHubSdkMsg);
      files
        .getCloudStorageFolderContents(parsedInput.folder, parsedInput.providerCode)
        .then(items => setGetCloudStorageFolderContentsRes(JSON.stringify(items)))
        .catch(error => setGetCloudStorageFolderContentsRes(JSON.stringify(error)));
    } catch (e) {
      if (e instanceof SyntaxError) {
        setGetCloudStorageFolderContentsRes(generateJsonParseErrorMsg());
      } else if (e instanceof Error) {
        setGetCloudStorageFolderContentsRes(e.toString());
      } else {
        setGetCloudStorageFolderContentsRes(JSON.stringify(e));
      }
    }
  };

  const openCloudStorageFile = (input: string): void => {
    try {
      const parsedInput = JSON.parse(input);
      files.openCloudStorageFile(parsedInput.file, parsedInput.providerCode, parsedInput.fileOpenPreference);
      setOpenCloudStorageFileRes('openCloudStorageFile() called.');
    } catch (e) {
      if (e instanceof SyntaxError) {
        setOpenCloudStorageFileRes(generateJsonParseErrorMsg());
      } else if (e instanceof Error) {
        setOpenCloudStorageFileRes(e.toString());
      } else {
        setOpenCloudStorageFileRes(JSON.stringify(e));
      }
    }
  };

  const checkFilesCapability = (): void => {
    if (files.isSupported()) {
      setCapabilityCheckRes('Files module is supported');
    } else {
      setCapabilityCheckRes('Files module is not supported');
    }
  };

  return (
    <>
      <h1>files</h1>
      <BoxAndButton
        handleClickWithInput={returnOpenFilePreview}
        output={openFilePreviewRes}
        hasInput={true}
        title="Open File Preview"
        name="openFilePreview"
      />
      <BoxAndButton
        handleClickWithInput={returnGetCloudStorageFolders}
        output={getCloudStorageFoldersRes}
        hasInput={true}
        title="Get Cloud Storage Folders"
        name="getCloudStorageFolders"
      />
      <BoxAndButton
        handleClickWithInput={returnAddCloudStorageFolder}
        output={addCloudStorageFolderRes}
        hasInput={true}
        title="Add Cloud Storage Folder"
        name="addCloudStorageFolder"
      />
      <BoxAndButton
        handleClickWithInput={returnDeleteCloudStorageFolder}
        output={deleteCloudStorageFolderRes}
        hasInput={true}
        title="Delete Cloud Storage Folder"
        name="deleteCloudStorageFolder"
      />
      <BoxAndButton
        handleClickWithInput={getCloudStorageFolderContents}
        output={getCloudStorageFolderContentsRes}
        hasInput={true}
        title="Get Cloud Storage Folder Contents"
        name="getCloudStorageFolderContents"
      />
      <BoxAndButton
        handleClickWithInput={openCloudStorageFile}
        output={openCloudStorageFileRes}
        hasInput={true}
        title="Open Cloud Storage File"
        name="openCloudStorageFile"
      />
      <BoxAndButton
        handleClick={checkFilesCapability}
        output={capabilityCheckRes}
        hasInput={false}
        title="Check Capability Files"
        name="checkCapabilityFiles"
      />
    </>
  );
};

export default FilesAPIs;
