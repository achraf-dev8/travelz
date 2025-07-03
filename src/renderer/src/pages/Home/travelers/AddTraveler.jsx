import React, { useEffect, useState } from 'react'
import { AddHolder } from '../../../components/home/add/AddHolder'
import { InputElement } from '../../../components/inputs/InputElement'
import '../../../styles/Inputs.css'
import { TourFilter } from '../../../components/home/toors/TourFilter'
import { NumberInputElement } from '../../../components/inputs/NumberInputElement'
import { ItemAddedCards } from '../../../components/home/add/ItemAddedCards'
import { checkInput } from '../../../functions/input'
import { DatePickerCard } from '../../../components/inputs/DatePickerCard'

export const AddTraveler = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [age, setAge] = useState('1');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [birthDate, setBirthDate] = useState('any');
  const [validConfirm, setValidConfirm] = useState('disactive');
  const [validAdd, setValidAdd] = useState('disactive');
  const [travelers, setTravelers] = useState([]);
  const [selected, setSelected] = useState(-1);
  const [firstNameError, setFirstNameError] = useState(null);
  const [lastNameError, setLastNameError] = useState(null);
  const [phoneNumberError, setPphoneNumberError] = useState(null);


  useEffect(() => {
    checkAdd()
  }, [firstName, lastName, age])

  useEffect(() => {
    setValidConfirm(travelers.length == 0 ? 'disactive' : '')
  }, [travelers])

  function checkAdd() {
    if (firstName != '' && lastName != '' && age != '' && age >= 1) {
      setValidAdd('')
    } else {
      setValidAdd('disactive')
    }
  }

  function confirm() {
    if (validConfirm == 'disactive') return null
  }

  function addItem() {

    if (validAdd == 'disactive') return null
    if (checkInputs()) {
      const birth = birthDate == 'any' ? '' : birthDate
      const newItem = { firstName: firstName, lastName: lastName, age: age, birthDate: birth, phoneNumber: phoneNumber }
      setTravelers(prevItems => [...prevItems, newItem]);
      emptyInputs()
    }
  }

  function deleteItem(i) {
    setTravelers(prev => prev.filter((_, index) => index != i));
    if (selected == i) {
      cancelSelect();
    }
  }

  function selectEdit(i) {
    if (i != selected) {
      setSelected(i)
      populateInputs(travelers[i])
    } else {
      cancelSelect()
    }

  }

  function cancelSelect(event) {
    event ? event.preventDefault() : null
    setSelected(-1)
    emptyInputs()
  }

  function edit() {
    if (validAdd == 'disactive') return null
    if (checkInputs()) {
      const birth = birthDate == 'any' ? '' : birthDate
      const newItem = { firstName: firstName, lastName: lastName, age: age, birthDate: birth, phoneNumber: phoneNumber }
      setTravelers(prevItems => prevItems.map((item, index) => index === selected ? newItem : item));
      cancelSelect();
    }
  }



  function populateInputs(item) {
    setFirstName(item.firstName)
    setLastName(item.lastName)
    setAge(item.age)
    item.birthDate instanceof Date && !isNaN(item.birthDate) ? setBirthDate(item.birthDate) : setBirthDate('any')
    setPhoneNumber(item.phoneNumber)
  }

  function emptyInputs() {
    setFirstName('')
    setLastName('')
    setAge('')
    setBirthDate('any')
    setPhoneNumber('')
  }

  function checkInputs() {
    const firstNameError = checkInput("name", firstName)
    setFirstNameError(firstNameError)
    const lastNameError = checkInput("name", lastName)
    setLastNameError(lastNameError)
    const phoneNumberError = checkInput("phoneNumber", phoneNumber)
    setPphoneNumberError(phoneNumberError)
    const valid = !firstNameError && !lastNameError && !phoneNumberError
    return valid
  }

  return (
    <>
        <ItemAddedCards selectEdit={selectEdit}
          selected={selected} deleteItem={deleteItem} items={travelers.map((item) => `${item.firstName} ${item.lastName}`)} />

        <div className='inputs-holder'>
          <InputElement error={firstNameError} name="First Name*" value={firstName} onChange={setFirstName} />
          <InputElement error={lastNameError} name="Last Name*" value={lastName} onChange={setLastName} />
          <NumberInputElement name="Age*" value={age} onChange={setAge} />
        </div>

        <div className='inputs-holder'>
          <DatePickerCard name="Birth Date" setDate={setBirthDate} date={birthDate} />
          <InputElement error={phoneNumberError} name="Phone Number" type="tel" value={phoneNumber} onChange={setPhoneNumber} />
        </div>

        <AddHolder confirm={confirm} editEvent={edit} cancelSelect={cancelSelect}
          state={selected == -1 ? "Add" : "Edit"} validConfirm={validConfirm} validAdd={validAdd} addEvent={addItem} />
    </>
  )
}
