class Party {
    constructor() {
        this.parties = [];
    }

    create(props) {
        this.parties.push({ ...props });
        const id = this.parties.length - 1;
        const name = this.parties[id].name;
        return [{
            id,
            name,
        }];
    }

    updateAll(id, props) {
        if (!this.parties[id]) {
            return {
                error: 'party not found',
            };
        }
        this.parties[id] = { ...props };
        const name = this.parties[id].name;
        return [{
            id,
            name,
        }];
    }

    delete(id) {
        const p = this.parties[id];
        let rmParties;
        if (p) {
            rmParties = this.parties.filter(party => party !== p);
            this.parties = rmParties;
            return true;
        }
        return false;
    }

    findOne(id) {
        const party = this.parties[id];
        if (party) {
            return party;
        }
        return null;
    }

    findAll(n) {
        if (n) {
            const ps = [];
            for (let i = 0; i < n; (i + 1)) {
                if (this.parties[i]) ps.push(this.parties[i]);
            }
            return ps;
        }
        return this.parties;
    }

    changeName(id, n) {
        if (!this.parties[id]) {
            return {
                error: 'party not found',
            };
        }
        this.parties[id].name = n;
        return [{
            id,
            name: this.parties[id].name,
        }];
    }
}

module.exports = Party;
