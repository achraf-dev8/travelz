import React, { useEffect, useRef, useState } from 'react'
import { HotelsTable } from '../../components/home/hotels/HotelsTable'
import { ConfrimDialog } from '../../components/home/main/ConfirmDialog'
import { HandleRequest } from './HandleRequest'
import { apiDelete, fetchItems } from '../../functions/api'
import { faTrash, faEye } from '@fortawesome/free-solid-svg-icons'
import { buildSortFunction, checkViewState, compareAdded, compareExpenses, compareStates } from '../../functions/tableOperations'
import { SimpleStateHolder } from '../../components/home/main/SimpleStateHolder'
import { useAppStore } from '../../store'
import { useNavigate } from 'react-router-dom'

export const Hotels = () => {
  const { agency, setPages } = useAppStore()
  const [reqState, setReqState] = useState('success')
  const [hotels, setHotels] = useState([])
  const [searchedHotels, setSearchedHotels] = useState([])
  const [searchVal, setSearchVal] = useState('')

  const refDialog = useRef(null)
  const [operation, setOperation] = useState('Delete')
  const [length, setlength] = useState(0)
  const [operationOnClick, setOperationOnClick] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    setPages(['Hotels'])
    fetchHotels()
  }, [])

  async function fetchHotels() {
    await fetchItems('/hotels', setHotels, setReqState, agency)
  }

  useEffect(() => {
    if (searchVal.trim() !== '') {
      search(hotels)
    }
  }, [searchVal])

  function search(hotels) {
    if (searchVal.trim() !== '') {
      const lower = searchVal.toLowerCase()
      const filtered = hotels.filter((itm) =>
        itm.name.toLowerCase().includes(lower)
      )
      setSearchedHotels(filtered)
    } else {
      setSearchedHotels(hotels)
    }
  }

  // Sorting area
  const compareName = (a, b) => a.name.localeCompare(b.name)

  const sortFunctions = {
    byName: (reverse = false) =>
      buildSortFunction(compareName, compareStates, reverse),
    byState: (reverse = false) =>
      buildSortFunction(compareStates, compareName, reverse),
    byExpenses: (reverse = false) =>
      buildSortFunction(compareExpenses, compareStates, reverse),
    byAdded: (reverse = false) =>
      buildSortFunction(compareAdded, compareStates, reverse),
  }

  // Operations
  const delet = async (id) => {
    const isArray = Array.isArray(id)
    const url = isArray ? `/hotels` : `/hotels/${id}`
    const config = isArray ? { data: { ids: id } } : {}
    const res = await apiDelete(url, config)
    if (!res.error) {
      setHotels((prev) =>
        isArray
          ? prev.filter((tour) => !id.includes(tour.id))
          : prev.filter((tour) => tour.id !== id)
      )
      console.log(res.data)
    } else {
      console.log(res)
      setReqState(res.error.source)
    }
  }

  const enabled = (id) => true

  // 👇 Add a "View" operation just like airports/travelers
  const view = (id) => {
    navigate(`/hotel-info/${id}`)
  }

  const operations = [
    {
      name: 'View',
      onClick: (id) => view(id),
      icon: faEye,
      enabledFun: checkViewState,
    },
    {
      name: 'Delete',
      onClick: (id) => openDialg(id, 'Delete', () => delet(id, 'hotels')),
      icon: faTrash,
      enabledFun: enabled,
    },
  ]

  // Dialog
  const openDialg = (id, operation, onClick) => {
    setOperation(operation)
    setOperationOnClick(() => onClick)
    const ids = Array.isArray(id) ? id : [id]
    setlength(ids.length)
    refDialog.current?.showModal()
  }

  const onCancelDialog = () => {
    refDialog.current?.close()
  }

  return (
    <HandleRequest
      reqState={reqState}
      retry={fetchHotels}
      add={null}
      subject={'Hotel'}
      layout={
        <>
          <SimpleStateHolder
            setSearch={setSearchVal}
            searchVal={searchVal}
            subject={'Hotel'}
            route={'/add-hotel'}
          />
          <hr className='divider' />
          <HotelsTable
            operations={operations}
            hotels={!searchVal.trim() ? hotels : searchedHotels}
            sortFunctions={sortFunctions}
          />
          <ConfrimDialog
            sub={'hotels'}
            refDialog={refDialog}
            operation={operation}
            onConfirm={operationOnClick}
            length={length}
            onCancel={onCancelDialog}
            onCancelDialog={onCancelDialog}
          />
        </>
      }
    />
  )
}
