import React from 'react'
import { ItemAddedCard } from './ItemAddedCard'
import { FixedInputContainer } from '../../inputs/FIxedInputContainer';
import { faFile } from '@fortawesome/free-solid-svg-icons';
import { formatApiDate } from '../../../functions/dates';

export const ItemsGrid = ({
  openVisaDialog,
  openDocumentDialog,
  pair,
  selectEdit,
  selected,
  deleteItem,
  sub,
  subCondition,
  i,
  tour,
  last
}) => {

  const selectedItem =
    selected == i * 2 ? pair[0] :
    selected == i * 2 + 1 ? pair[1] : null;

  return (
    <div style={{ display: 'block', marginBottom: selectedItem ? '5px' : '20px' }}>
      <div style={{ display: 'flex', gap: '15px' }}>
        {pair.map((item, index) => (
          <ItemAddedCard
            simple
            item={item}
            i={index === 0 ? i * 2 : i * 2 + 1}
            selectEdit={selectEdit}
            selected={selected}
            deleteItem={deleteItem}
            sub={sub}
            subCondition={subCondition}
          />
        ))}
      </div>

      {selectedItem && (
        <div style={{ flex: '1 1 100%', width: '100%' }}>
          <div style={{ height: '10px' }} />
          <div className="documents-holder">

            <FixedInputContainer
              flex="3 3 200px"
              display="First Name"
              value={selectedItem.first_name}
            />

            <FixedInputContainer
              flex="3 3 200px"
              display="Last Name"
              value={selectedItem.last_name}
            />

            <FixedInputContainer
              flex="1"
              display="Age"
              value={selectedItem.age}
            />

            {selectedItem.birth_date && (
              <FixedInputContainer
                flex="3 3 200px"
                display="Birth Date"
                value={formatApiDate(selectedItem.birth_date)}
              />
            )}

            {selectedItem.phone_number && (
              <FixedInputContainer
                flex="3 3 200px"
                display="Phone Number"
                value={selectedItem.phone_number}
              />
            )}

            {selectedItem.address && (
              <FixedInputContainer
                flex="3 3 200px"
                display="Address"
                value={selectedItem.address}
              />
            )}
          </div>

          {(selectedItem.documents.length > 0 || selectedItem.visas.length > 0) && (
            <>
              <p>Documents</p>
              <div className="documents-holder">
                {selectedItem.documents.map((item, i) => (
                  <FixedInputContainer
                    key={`doc-${i}`}
                    icon={faFile}
                    flex="1 1 135px"
                    display=""
                    value={item.type}
                    onClick={() => openDocumentDialog(item)}
                  />
                ))}

                {selectedItem.visas.map((item, i) => (
                  <FixedInputContainer
                    key={`visa-${i}`}
                    icon={faFile}
                    flex="1 1 135px"
                    display=""
                    value={`${item.country} (visa)`}
                    onClick={() => openVisaDialog(item)}
                  />
                ))}
              </div>
            </>
          )}

          <div className="inputs-holder">
            {tour.hotel && (
              <FixedInputContainer
                flex="4"
                display="Room Price"
                value={`${selectedItem.roomPrice || 0} ${selectedItem.roomPriceCurr || 'DA'}`}
              />
            )}

            {(tour.departure_airport || tour.departure_bus) && (
              <FixedInputContainer
                flex="4"
                display="Departure Ticket Price"
                value={`${selectedItem.depTicketPrice || 0} ${selectedItem.depTicketPriceCurr || 'DA'}`}
              />
            )}

            {(tour.return_airport || tour.return_bus) && (
              <FixedInputContainer
                flex="4"
                display="Return Ticket Price"
                value={`${selectedItem.retTicketPrice || 0} ${selectedItem.retTicketPriceCurr || 'DA'}`}
              />
            )}

            <FixedInputContainer
              flex="4"
              display="Price"
              value={`${selectedItem.price || 0} ${selectedItem.priceCurr || 'DA'}`}
            />
          </div>

          {!last && <div style={{ height: '10px' }} />}
        </div>
      )}
    </div>
  );
};
