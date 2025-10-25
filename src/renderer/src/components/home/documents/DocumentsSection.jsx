import React from 'react'
import { FilterDropDown } from '../filters/FilterDropDown'

export const DocumentsSection = ({visas, documents, travelerExists = true, openDocumentDialog,
  openVisaDialog, removeDocument, removeVisa}) => {
  return (
              <div className={`documents-holder ${!travelerExists ? 'hidden' : ''}`}>
                {travelerExists && (documents || []).map((doc, index) => (
                  <FilterDropDown
                    key={index}
                    onClick={() => {
                      openDocumentDialog(doc, index)
                      console.log("ekzpàkàkf", doc)
                    }}
                    active={doc.type}
                    setFilterEvent={() => removeDocument(index)}
                  />
                ))}
                <FilterDropDown
                  hidden={!travelerExists}
                  document={true}
                  onClick={() => openDocumentDialog(null, -1)}
                  title="Document"
                  active={"Add Document"}
                  setFilterEvent={() => removeDocument(index)}/>

                { visas &&(
                  <>
                  <div style={{width : '10px'}}></div>
                  {travelerExists && (visas || []).map((visa, index) => (
                  <FilterDropDown
                    key={index}
                    onClick={() => openVisaDialog(visa, index)}
                    active={`Visa (${visa.country})`}
                    setFilterEvent={() => removeVisa(index)}
                  />
                ))}
                <FilterDropDown
                  hidden={!travelerExists}
                  document={true}
                  onClick={() => openVisaDialog(null, -1)}
                  title="Visa"
                  active={"Add Visa"}
                  setFilterEvent={() => removeVisa(index)}/>
                  </>
                  )}
       
    </div>
  )
}
