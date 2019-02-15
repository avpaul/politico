class Party {
    constructor() {
        this.parties = [];
    }

    create(properties) {
        const duplicate = this.parties.some(party => party.name === properties.name);
        if (duplicate) {
            return {
                error: 'party with the same name exists',
            };
        }
        const numberOfParties = (this.parties.length);
        const id = (numberOfParties === 0) ? 1 : (this.parties[(numberOfParties - 1)].id + 1);
        this.parties.push({ id, ...properties });
        const party = this.parties.find(element => element.id === id);
        return [{
            id,
            name: party.name,
        }];
    }

    updateAll(id, properties) {
        const partyIndex = this.parties.findIndex(party => party.id === Number(id));
        if (partyIndex <= -1) {
            return {
                status: 404,
                error: `party with id ${id} not found`,
            };
        }
        const duplicate = this.parties.some(party => party.name === properties.name);
        if (duplicate) {
            return {
                error: 'party with same name exists',
            };
        }
        this.parties[partyIndex] = { id: Number(id), ...properties };
        const party = this.parties[partyIndex];
        return [{
            id,
            name: party.name,
        }];
    }

    delete(id) {
        const partyToDelete = this.parties.findIndex(party => party.id === Number(id));
        if (partyToDelete >= 0) {
            this.parties.splice(partyToDelete, 1);
            return true;
        }
        return false;
    }

    findOne(id) {
        const partyIndex = this.parties.findIndex(party => party.id === Number(id));
        if (partyIndex >= 0) {
            return this.parties[partyIndex];
        }
        return null;
    }

    findAll() {
        return this.parties;
    }

    changeName(id, name) {
        const partyIndex = this.parties.findIndex(party => party.id === Number(id));
        if (partyIndex <= -1) {
            return false;
        }
        const duplicate = this.parties.some(party => party.name === name);
        if (duplicate) {
            return {
                error: 'party with the same name exists',
            };
        }

        this.parties[partyIndex].name = name;
        return [{
            id,
            name: this.parties[partyIndex].name,
        }];
    }
}

export default Party;
