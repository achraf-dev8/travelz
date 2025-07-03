import React, { useEffect, useState } from 'react'
import { AddHolder } from '../../../components/home/add/AddHolder'
import { InputElement } from '../../../components/inputs/InputElement'
import '../../../styles/Inputs.css'
import { TourFilter } from '../../../components/home/toors/TourFilter'
import { NumberInputElement } from '../../../components/inputs/NumberInputElement'
import { ItemAddedCards } from '../../../components/home/add/ItemAddedCards'
import { checkInput } from '../../../functions/input'
import { DatePickerCard } from '../../../components/inputs/DatePickerCard'
import { ItemAddedCard } from '../../../components/home/add/ItemAddedCard'

export const AddFamily = () => {
    const [state, setState] = useState(-1);
    const [isFamily, setIsFamily] = useState(true);
    const [familyName, setFamilyName] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [age, setAge] = useState('1');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [birthDate, setBirthDate] = useState('any');
    const [validConfirm, setValidConfirm] = useState('disactive');
    const [validAdd, setValidAdd] = useState('disactive');
    const [families, setFamilies] = useState([]);
    const [selected, setSelected] = useState(-1);
    const [familyNameError, setFamilyNameError] = useState('');
    const [firstNameError, setFirstNameError] = useState(null);
    const [lastNameError, setLastNameError] = useState(null);
    const [phoneNumberError, setPphoneNumberError] = useState(null);
    let mainId = -1


    useEffect(() => {
        checkAdd()
    }, [firstName, lastName, age, familyName])

    
    useEffect(() => {
        setValidConfirm(families.length == 0 ? 'disactive' : '')
    }, [families])

    function checkModeFamily(){
        return state == -1 || (state != -1 && isFamily)
    }

    function checkAddTravelerMode(){
        return (state != -1 && !isFamily && selected == -1)
    }

    function checkAdd() {
        const valid = checkModeFamily() ? familyName != '' : firstName != '' && lastName != '' && age != '' && age >= 1;
        if (valid) {
            setValidAdd('')
        } else {
            setValidAdd('disactive')
        }
    }

    function confirm() {
        if (validConfirm == 'disactive') return null
    }

    function addToFamily(mainId, familyName = null){
        emptyInputs()
        if(!familyName) familyName = families[mainId].familyName
        if(!(state == mainId && !isFamily && selected ==-1) || familyName){
        setState(mainId)
        setIsFamily(false)
        setSelected(-1)
        setLastName(familyName)
        }else{
            noAddToFamily()
        }     
    }

    function noAddToFamily(event=null){
        event ? event.preventDefault() : null
        setState(-1)
        setIsFamily(true) 
        setSelected(-1)
    }

    function addTravelerEvent() {
        if (validAdd == 'disactive') return null
        if (checkInputs()) {
            const birth = birthDate == 'any' ? '' : birthDate
            const newItem = { firstName: firstName, lastName: lastName, age: age, birthDate: birth, phoneNumber: phoneNumber}
            setFamilies(prevFamilies =>
            prevFamilies.map((family, i) =>
                i === state
                    ? {
                        ...family,
                        travelers: [...(family.travelers || []), newItem]
                      }
                    : family
            )
        );
        addToFamily(state)
        }
    }

    function addFamilyEvent() {

        if (validAdd == 'disactive') return null
        if (checkInputs()) {
            const newItem = { familyName: familyName, travelers : [] }
            setFamilies(prevItems => [...prevItems, newItem]);
            emptyInputs()
            addToFamily(families.length, familyName)
        }
    }


    function deleteItemFamily(i) {
        setFamilies(prev => prev.filter((_, index) => index != i));
        if(families.length <= 0 ){
        noAddToFamily()    
        }
        if (state == i) {
            setState(families.length-1)
            addToFamily(families.length-1)
        }
    }

    function deleteItemTraveler(i) {
        setFamilies(prevFamilies =>
            prevFamilies.map((family, index) =>
                index === mainId
                    ? {
                        ...family,
                        travelers: family.travelers.filter((_, tIndex) => tIndex !== i)
                    }
                    : family
            )
        );
    }

    function selectEditFamily(i) {
        if (!(state != i && isFamily)) {
            setState(i)
            setIsFamily(true)
            populateInputs(families[i], 'family')
        } else {
            addToFamily(state)
        } }

    function selectEditTraveler(i) {
        if(!(mainId == state && !isFamily && selected == i)){
            setState(mainId)
            setIsFamily(false)
            setSelected(i)
            populateInputs(families[mainId].travelers[i], 'traveler')
        }else{
            addToFamily(mainId)
        }

    }

    function editFamily() {
        if (validAdd == 'disactive') return null
        if (checkInputs()) {
            const travelers = families[state].travelers
            const newItem = { familyName : familyName, travelers: travelers}
            setFamilies(prevItems => prevItems.map((item, index) => index === state ? newItem : item));
            addToFamily(state);
        }
    }

function editTraveler() {
    if (validAdd === 'disactive') return null;

    if (checkInputs()) {
        const birth = birthDate === 'any' ? '' : birthDate;

        const updatedTraveler = {
            firstName,
            lastName,
            age,
            birthDate: birth,
            phoneNumber
        };

        setFamilies(prevFamilies =>
            prevFamilies.map((family, familyIndex) =>
                familyIndex === state
                    ? {
                        ...family,
                        travelers: family.travelers.map((traveler, tIndex) =>
                            tIndex === selected ? updatedTraveler : traveler
                        )
                    }
                    : family
            )
        ); addToFamily(state);
    }
}


    function populateInputs(item, state) {
        if(state != 'family'){
        setFirstName(item.firstName)
        setLastName(item.lastName)
        setAge(item.age)
        item.birthDate instanceof Date && !isNaN(item.birthDate) ? setBirthDate(item.birthDate) : setBirthDate('any')
        setPhoneNumber(item.phoneNumber)
        }else{
        setFamilyName(item.familyName)
        }

    }

    function emptyInputs() {
        setFamilyName('')
        setFirstName('')
        setLastName('')
        setAge('')
        setBirthDate('any')
        setPhoneNumber('')
    }

    function checkInputs() {
        if (checkModeFamily()) {
            const familyNameError = checkInput("name", familyName)
            setFamilyNameError(familyNameError)
            return !familyNameError
        } else {
            const firstNameError = checkInput("name", firstName)
            setFirstNameError(firstNameError)
            const lastNameError = checkInput("name", lastName)
            setLastNameError(lastNameError)
            const phoneNumberError = checkInput("phoneNumber", phoneNumber)
            setPphoneNumberError(phoneNumberError)
            const valid = !firstNameError && !lastNameError && !phoneNumberError
            return valid
        }

    }

    return (
        <>    
                {families.map((item, i)=>
                <div className={`items-added-cards ${families.length != 0 ? "not-empty" : ""}`}>
                    <ItemAddedCard add = {addToFamily} item = {item.familyName} i={i} selectEdit={selectEditFamily} selected={state} 
                    deleteItem={deleteItemFamily} subCondition = {isFamily || selected == -1}/>
                    <ItemAddedCards selectEdit = {(index)=>{mainId = i 
                    selectEditTraveler(index)}}
                    selected = {selected}  subCondition = {state == i && !isFamily} 
                    items={item.travelers.map((sitem)=>`${sitem.firstName} ${sitem.lastName}`)}
                     deleteItem = {(index)=>{mainId = i 
                        deleteItemTraveler(index)}} sub = 'sub'/>
                </div>
            )}

                {checkModeFamily() ? (
                    <div className='inputs-holder'>
                        <InputElement error={familyNameError} name="Family Name*" value={familyName} onChange={setFamilyName} />
                    </div>) :
                    (
                        <>
                            <div className='inputs-holder'>
                                <InputElement error={firstNameError} name="First Name*" value={firstName} onChange={setFirstName} />
                                <InputElement error={lastNameError} name="Last Name*" value={lastName} onChange={setLastName} />
                                <NumberInputElement name="Age*" value={age} onChange={setAge} />
                            </div>

                            <div className='inputs-holder'>
                                <DatePickerCard name="Birth Date" setDate={setBirthDate} date={birthDate} />
                                <InputElement error={phoneNumberError} name="Phone Number" type="tel" value={phoneNumber} onChange={setPhoneNumber} />
                            </div>
                        </>)
                }
                <AddHolder extraEvent={noAddToFamily} confirm={confirm} editEvent={checkModeFamily() ? editFamily : editTraveler} 
                cancelSelect={addToFamily} addFamily={checkAddTravelerMode() && families.length > 0}
                    state={state == -1 || checkAddTravelerMode() ? "Add" : "Edit"} 
                    validConfirm={validConfirm} validAdd={validAdd} addEvent={checkModeFamily() ? addFamilyEvent
                        : addTravelerEvent} />
        </>
    )
}