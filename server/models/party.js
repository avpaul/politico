class Party {
    constructor() {
        this.parties = [];
    }

    create(props) {
        const duplicate = this.parties.some(party => party.name === props.name);
        if (duplicate) {
            return {
                error: 'party with the same name exists',
            };
        }
        const numberOfParties = (this.parties.length);
        const id = (numberOfParties === 0) ? 1 : (this.parties[(numberOfParties - 1)].id + 1);
        this.parties.push({ id, ...props });
        const name = this.parties.find(party => party.id === id).name;
        return [{
            id,
            name,
        }];
    }

    updateAll(id, props) {
        const duplicate = this.parties.some(party => party.name === props.name);
        if (duplicate) {
            return {
                error: 'party with same name exists',
            };
        }
        const partyIndex = this.parties.findIndex(party => party.id === Number(id));
        if (partyIndex <= -1) {
            return {
                status: 404,
                error: `party with id ${id} not found`,
            };
        }
        this.parties[partyIndex] = { id: Number(id), ...props };
        const name = this.parties[partyIndex].name;
        return [{
            id,
            name,
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

module.exports = Party;
