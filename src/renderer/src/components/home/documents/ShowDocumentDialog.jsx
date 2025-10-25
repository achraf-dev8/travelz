import { faDownload, faHotel, faPassport, faUpload } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useRef, useState } from 'react';
import { ConfirmButton } from '../add/ConfirmButton';
import { acceptedFiles, getDocumentLink } from '../../../functions/document';
import { apiGet, apiPatch } from '../../../functions/api';
import { AutoCompleteField } from '../../inputs/AutoCompleteField';
import { Formik, isString, useFormik } from 'formik';
import { globalOpenDocumentDialog } from '../../../functions/handleDocuments';
import { FixedInputContainer } from '../../inputs/FIxedInputContainer';

export const ShowDocumentDialog = ({ showOnly, onCancel, refDialog, doc, reOpen, setFile, soft = false, visa}) => {
  
  const skipRef = useRef(false);
  const [newDoc, setNewDoc] = useState(false);
  const [newType, setNewType] = useState(false);
  const [currentDoc, setCurrentDoc] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  const formik = useFormik({
    initialValues: {documentType: '' },
    onSubmit: (values) => {},
    validateOnBlur: false,
    validateOnChange: false,
  });


  const fileInputRef = useRef(null);

  useEffect(() => {
    console.log("djodp", visa, "kj^pjfjofdojdfjop")
    console.log("Document +++ ", doc)
    skipRef.current = true
    setNewDoc(false);
    setNewType(false);
    if(doc === undefined) return
    if (doc) {
      setCurrentDoc(doc)
      formik.setFieldValue('documentType', doc.type || '');
      if(confirmed) {
        setConfirmed(false);
      }
      
    }else{
      setCurrentDoc(doc)
      formik.setFieldValue('documentType', '');
    }

  }, [doc, reOpen]);

  const fileType = currentDoc?.file_type?.toLowerCase() || currentDoc?.name?.split('.').pop()?.toLowerCase() || '';
  const isImage = acceptedFiles.includes(fileType);
  const isPDF = fileType === 'pdf';

  const onCancelDialog = () => {

    refDialog.current?.close();
    onCancel?.();
  };

  function download() {
    
  if (!currentDoc?.file_path) return;

  const fileUrl = (soft || newDoc)
    ? currentDoc.file_path
    : `http://localhost:3001/download/documents/${currentDoc.file_path}`;

  const link = document.createElement('a');
  link.href = fileUrl;
  link.download = currentDoc.name || 'document';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

  function upload() {
    fileInputRef.current?.click();
  }

  function handleFileChange(event) {
    const file = event.target.files[0];
    console.log(file)
    if (!file) return;

    const url = URL.createObjectURL(file);
    const ext = file.name.split('.').pop().toLowerCase();

    const updated = {
      ...currentDoc,
      file_type: ext,
      file_path: url,
      name: file.name,
      localFile: file,
    };

    setCurrentDoc(updated);
    setNewDoc(true);
  }

async function confirm() {
  console.log("confirm", doc)
  const typeFromFormik = formik.values.documentType;
  const updatedDoc = { ...currentDoc, type: typeFromFormik};
    
  setUploading(true);

  const formData = new FormData();
  formData.append('document', updatedDoc.localFile);
  formData.append('type', updatedDoc.type); // ✅ always use fresh type

  const res = await apiPatch(`/documents/${updatedDoc.id}`, formData);

  setUploading(false);

  if (!res.error) {
    const updatedFile = res.data.updated;
    const type = formik.values.documentType || updatedDoc.type;
    setFile(updatedFile, type);    setNewDoc(false);
    setConfirmed(true);
    
  } else { 
    console.error("Upload failed", res.error);
    alert("Upload failed: " + res.error.message);
  }
}

function softConfirm(){
  const typeFromFormik = formik.values.documentType;
  const updatedDoc = { ...currentDoc, type: typeFromFormik, visa : visa };
  console.log("jodjdjodjo", updatedDoc.localFile)
  setFile(updatedDoc, updatedDoc.type);
  setNewDoc(false);
  setConfirmed(true);
}


    const fetchDocTypesData = async (query) => {
      try {
        const res = await apiGet(`/documents/search-types?query=${encodeURIComponent(query)}`, {
          cache: { ttl: 1000 * 60 * 5 },
        });
        return res.data.map(type => ({
          ...type,
          display_name: type.type,
        }));
        
      } catch (err) {
        console.error("❌ Failed to fetch types:", err.message);
        return [];
      }
    };

  return (
    <dialog
      ref={refDialog}
      onClick={(e) => {
        if (e.currentTarget === e.target) onCancelDialog();
      }}
    >
      <div className="show-doc-dialog">
        <h3>Document Preview</h3>
       { !showOnly ? (<AutoCompleteField
        value={formik.values.documentType}
        name="documentType"
        onChange={(e) => {
        const nType = e.target.value;
        formik.setFieldValue("documentType", nType);
        setNewType(nType !== currentDoc?.type)
      }}
        onBlur={formik.handleBlur}
        touched={formik.touched.documentType}
        display = {"Document Type"}
        error={formik.errors.documentType}
        icon={faPassport}
        fetchData={{ fetch: fetchDocTypesData, skipRef: skipRef }}
        onSelect={(item) => {
            //formik.setFieldValue("documentType", item.display_name);
        setNewType(item.display_name !== currentDoc?.type)
        console.log(item.display_name, "selected type", currentDoc?.type);
        }} 
      />) : <FixedInputContainer
                                             flex={'1'} 
                                                display={""} 
                                                value={doc?.type}
                                              />}
      <div style={{height:"20px"}}></div>
        <div className="buttons-holder">
          {   currentDoc && (
          <button type='button' className="download" onClick={download}>
            <FontAwesomeIcon icon={faDownload} />
            <p>Download</p>
          </button>)
          }
          {!showOnly && <button type='button' onClick={upload}>
            <FontAwesomeIcon icon={faUpload} />
            <p>Upload</p>
          </button>}

          {!showOnly && (newDoc || newType) && currentDoc && formik.values.documentType != '' 
          && <ConfirmButton extra={uploading ? 'disactive' : ''} onClick={soft ? softConfirm : confirm} />}
        </div>

        <div className="dialog-body scrollable-content">
          {!currentDoc && <p>Upload Document</p>}
          {currentDoc && isImage && (
            <img
              src={
    currentDoc?.file_path?.trim().startsWith('blob')
    ? currentDoc.file_path
    : getDocumentLink(currentDoc)
}
              alt="Document Preview"
              className="preview-image"
            />
          )}
          {currentDoc && isPDF && !isImage && (
            <iframe
              src={
  currentDoc?.file_path?.trim().startsWith('blob')
    ? currentDoc.file_path
    : getDocumentLink(currentDoc)
}
              title="PDF Viewer"
              className="pdf-viewer"
            />
          )
          }
          {currentDoc && !isImage && !isPDF && <p>Preview not supported for this file type.</p>}
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept=".png,.jpg,.jpeg,.pdf"
          style={{ display: 'none' }}
          onChange={handleFileChange}
        />
      </div>
    </dialog>
  );
};
