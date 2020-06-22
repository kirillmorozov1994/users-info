class ServiceData {

    _baseURLPerson = 'https://test-project-fab09.firebaseio.com'

    _optionsRequest = (method, body) => {
        return {
            method,
            headers: {
                'Content-type': 'application/json; charset=UTF-8' // Indicates the content 
            },
            body: JSON.stringify(body)
        }
    }

    getRequest = async () => {
        const res = await fetch(`${this._baseURLPerson}/persons.json`);
        const body = await res.json();
        return body;
    }

    getPersons = async () => {
        return this.getRequest();
    }

    updatePersons = async (persons) => {
        return await fetch(`${this._baseURLPerson}/persons.json`, this._optionsRequest('PUT', persons))
    }

}

export default ServiceData;