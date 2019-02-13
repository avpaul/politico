class Office {
    constructor() {
        this.offices = [];
    }

    create(props) {
        const id = this.offices.length;
        this.offices.push({ id, ...props });
        const n = this.offices[id].name;
        const t = this.offices[id].type;
        return [{
            id,
            name: n,
            type: t,
        }];
    }

    findOne(id) {
        const office = this.offices[id];
        if (office) {
            return office;
        }
        return null;
    }

    findAll(n) {
        if (!n) {
            return this.offices;
        }
        const nOffices = (n > this.offices.length) ? this.offices.length : n;
        const of = [];
        for (let i = 0; i < nOffices; (i += 1)) {
            if (this.offices[i]) of.push(this.offices[i]);
        }
        return of;
    }
}

module.exports = Office;
