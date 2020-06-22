const fetchPersonsRequest = () => {
    return {
        type: 'FETCH_PERSONS_REQUEST',
    }
}

const fetchPersonsSuccess = (persons) => {
    return {
        type: 'FETCH_PERSONS_SUCCESS',
        payload: persons
    }
}

const fetchPersonsFailure = (error) => {
    return {
        type: 'FETCH_PERSONS_FAILURE',
        payload: error
    }
}

const personsFilter = (term) => {
    return {
        type: 'PERSONS_FILTER',
        payload: term
    }
}

const updatePersons = (persons) => {
    return {
        type: 'UPDATE_PERSONS',
        payload: persons
    }
}

const foundEditPerson = (id) => {
    return {
        type: 'EDIT_PERSON',
        payload: id
    }
}

export {
    fetchPersonsRequest,
    fetchPersonsSuccess,
    fetchPersonsFailure,
    personsFilter,
    updatePersons,
    foundEditPerson
}