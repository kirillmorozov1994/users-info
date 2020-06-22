const initialState = {
    persons: null,
    loading: true,
    error: null,
    editPerson: null,
    filter: ''
}


const reducer = (state = initialState, action) => {
    switch(action.type) {
        case 'FETCH_PERSONS_REQUEST':
            return {
                ...state,
                loading: true
            }
        case 'FETCH_PERSONS_SUCCESS':
            return {
                ...state,
                loading: false,
                persons: action.payload
            }
        case 'FETCH_PERSONS_FAILURE':
            return {
                ...state,
                loading: false,
                error: action.payload
            }
        case 'UPDATE_PERSONS':
            return {
                ...state,
                persons: action.payload
            }
        case 'PERSONS_FILTER':
            return {
                ...state,
                filter: action.payload
            }
        case 'EDIT_PERSON':
            return {
                ...state,
                editPerson: action.payload
            }
        default:
            return state;
    }
}

export default reducer;