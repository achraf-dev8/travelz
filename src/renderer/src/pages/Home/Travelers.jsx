import React, { useEffect, useRef, useState } from 'react'
import { TravelersStatesHolder } from '../../components/home/travelers/TravelersStatesHolder'
import { apiDelete, fetchItems } from '../../functions/api';
import { TravelersTable } from '../../components/home/travelers/TravelersTable';
import { getFullName } from '../../functions/traveler';
import { buildSortFunction, checkViewState, compareAdded, compareExpenses, comparePrices, compareStates, makeCompare } from '../../functions/tableOperations';
import { faTrash, faEye } from '@fortawesome/free-solid-svg-icons';
import { ConfrimDialog } from '../../components/home/main/ConfirmDialog';
import { HandleRequest } from './HandleRequest';
import { useAppStore } from '../../store';
import { useNavigate } from 'react-router-dom';

export const Travelers = () => {
    const { agency, setPages } = useAppStore();
    const navigate = useNavigate();

    const [reqState, setReqState] = useState("success");
    const [travelers, setTravelers] = useState([]);
    const [searchedTravelers, setSearchedTravelers] = useState([]);
    const [searchVal, setSearchVal] = useState('');

    const refDialog = useRef(null);
    const [operation, setOperation] = useState('Delete');
    const [length, setlength] = useState(0);
    const [operationOnClick, setOperationOnClick] = useState(null);

    useEffect(() => {
        setPages(['Travelers']);
        fetchTravelers();
    }, []);

    async function fetchTravelers() {
        await fetchItems("/travelers", setTravelers, setReqState, agency);
    }

    useEffect(() => {
        if (searchVal.trim() !== '') {
            search(travelers);
        } else {
            setSearchedTravelers(travelers);
        }
    }, [searchVal, travelers]);

    function search(travelers) {
        if (searchVal.trim() !== '') {
            const lower = searchVal.toLowerCase();
            const filtered = travelers.filter(itm =>
                getFullName(itm).toLowerCase().includes(lower)
            );
            setSearchedTravelers(filtered);
        } else {
            setSearchedTravelers(travelers);
        }
    }

    // Sorting Area 
    const compareAge = makeCompare(a => a.age, (a, b) => a - b);

    const compareName = makeCompare(
        a => getFullName(a),
        (a, b) => a.localeCompare(b)
    );

    const sortFunctions = {
        byName: (reverse = false) => buildSortFunction(compareName, compareStates, reverse),
        byAge: (reverse = false) => buildSortFunction(compareAge, compareStates, reverse),
        byState: (reverse = false) => buildSortFunction(compareStates, compareName, reverse),
        byExpenses: (reverse = false) => buildSortFunction(compareExpenses, compareStates, reverse),
        byPayements: (reverse = false) => buildSortFunction(comparePrices, compareStates, reverse),
        byAdded: (reverse = false) => buildSortFunction(compareAdded, compareStates, reverse),
    };

    // 🧩 Operations
    const delet = async (id) => {
        const isArray = Array.isArray(id);
        const url = isArray ? `/travelers` : `/travelers/${id}`;
        const config = isArray ? { data: { ids: id } } : {};
        const res = await apiDelete(url, config);

        if (!res.error) {
            setTravelers(prev =>
                isArray
                    ? prev.filter(traveler => !id.includes(traveler.id))
                    : prev.filter(traveler => traveler.id !== id)
            );
        } else {
            setReqState(res.error.source);
        }
    };

    const enabled = () => true;

    // 🧭 View traveler details
    const onViewTraveler = (id) => {
        navigate('/traveler-info' + `/${id}`);
    };

    const openDialg = (id, operation, onClick) => {
        setOperation(operation);
        setOperationOnClick(() => onClick);
        const ids = Array.isArray(id) ? id : [id];
        setlength(ids.length);
        refDialog.current?.showModal();
    };

    const onCancelDialog = () => {
        refDialog.current?.close();
    };

    const operations = [
        {
            name: "View",
            onClick: onViewTraveler,
            icon: faEye,
            enabledFun: checkViewState
        },
        {
            name: "Delete",
            onClick: (id) => openDialg(id, "Delete", () => delet(id)),
            icon: faTrash,
            enabledFun: enabled
        }
    ];

    return (
        <HandleRequest
            reqState={reqState}
            retry={fetchTravelers}
            add={null}
            subject={"Traveler"}
            layout={
                <>
                    <TravelersStatesHolder
                        setSearch={setSearchVal}
                        searchVal={searchVal}
                        state={"Traveler"}
                    />
                    <hr className='divider' />
                    <TravelersTable
                        operations={operations}
                        travelers={searchVal.trim() ? searchedTravelers : travelers}
                        sortFunctions={sortFunctions}
                    />
                    <ConfrimDialog
                        sub={"travelers"}
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
    );
};
