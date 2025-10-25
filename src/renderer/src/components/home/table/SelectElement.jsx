import React, { useRef, useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircle, faCircleInfo, faEllipsis, faHourglassEnd, faInfo, faPen, faPlaneSlash, faTrash } from '@fortawesome/free-solid-svg-icons';
import '../../../styles/Table.css'; // Or keep styles in Table.css
import { SelectElementItem } from './SelectElementItem';

export const SelectElement = ({operations, id=null}) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

useEffect(() => {
  const handleClickOutside = (e) => {
    if (ref.current && !ref.current.contains(e.target)) {
      setOpen(false); // Close only if clicked outside
    }
  };

  document.addEventListener('mousedown', handleClickOutside);
  return () => {
    document.removeEventListener('mousedown', handleClickOutside);
  };
}, []);


  return   (
     <div className={`select-element ${(Array.isArray(id) && id.length == 0) ? "disactive" : ""}`} ref={ref}>
      <div
        className='icon-container ellipsis'
        onClick={() => setOpen(prev => !prev)}
      >
        <FontAwesomeIcon icon={faEllipsis} />
      </div>

      {open && (
        <div className="select-dropdown">
            {operations.map((item, i)=>(<SelectElementItem key={i} {...item} enabled={item.enabledFun(id)} onClick = {()=>item.onClick(id)}
            />))}          
        </div>
      )}
    </div>
  );
};

            /*
            <SelectElementItem icon ={faPlaneSlash} name = {"Cancel"} enabled={true} />
            <SelectElementItem icon ={faHourglassEnd} name = {"End"} enabled={true} />
            <SelectElementItem icon ={faTrash} name = {"Delete"} enabled={false} />
*/

/*
          <div className="select-item" onClick={() => alert('Edit')}>
            ✏️ Edit
          </div>
          <div className="select-item" onClick={() => alert('Delete')}>
            🗑️ Delete
          </div>
          <div className="select-item" onClick={() => alert('Duplicate')}>
            📋 Duplicate
          </div>*/