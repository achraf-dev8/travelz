// utils/documentFunctions.js
export const globalOpenDocumentDialog = (doc, i, setDocument, setDocumentIndex, setReOpen, refDocumentDialog) => {
  setDocument(doc);
  setDocumentIndex(i);
  setReOpen(p => p + 1);
  setTimeout(() => {
    refDocumentDialog.current?.showModal();
  }, 100);
};


export const globalRemoveDocument = (index, setter, setReOpen) => {
    setter(index)
  setReOpen(p => p + 1);
};

export const globalSetFile = (updatedFile, type, documentIndex, setter, setReOpen, setDocument) => {
  const newDoc = {
    file_path: updatedFile.file_path,
    file_type: updatedFile.file_type,
    file: updatedFile.localFile,
    type: type,
    visa: updatedFile.visa,
  };
  setter(documentIndex, newDoc)
  if(documentIndex === -1){
    setDocument(null)
  }else{
    setDocument(newDoc)
  }
  
  
  setReOpen(p => p + 1);
};

//Visas
export const globalOpenVisaDialog = (visa, i, setVisa, setVisaIndex, setReOpen, refVisaDialog) => {

  setVisa(visa);
  setVisaIndex(i);
  setReOpen(p => p + 1);
  setTimeout(() => {
    refVisaDialog.current?.showModal();
  }, 0);
};


export const globalRemoveVisa = (index, setter, setReOpen) => {
  setter(index)
  setReOpen(p => p + 1);
};


export const globalSetVisa = (updatedVisa, setter, setReOpen, setVisa) => {
  const newVisa = {
    ...updatedVisa
  };

  setter(newVisa)
  setVisa(newVisa)
  setReOpen(p => p + 1);
};