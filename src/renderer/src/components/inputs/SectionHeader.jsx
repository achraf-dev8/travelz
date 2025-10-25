import React from 'react'

export const SectionHeader = ({extra = "", test = null, header, changed, checked, setChecked}) => {
  return (
          <div className={`form-section-header-full-container ${extra}`}>
            <h4 className='form-section-header'>{header}</h4>
            
{changed && (<>
     <label>
              <input type="radio" name={test ?? header} value="add"  checked={checked == "Add"} onChange={()=>setChecked("Add")}/>
              Add
            </label>
            
            <label>
              <input type="radio" name={header} value="edit" checked={checked == "Edit"} onChange={()=>setChecked("Edit")}/>
              Edit
            </label>
            </>
            )}
          </div>
  )
}
