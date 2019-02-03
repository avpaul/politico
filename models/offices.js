class Office {
    constructor() {
        this.offices = [];
    }

    create(props) {
        this.offices.push({ ...props });
        const id = this.offices.length - 1;
        const n = this.offices[id].name;
        const t = this.offices[id].type;
        return [{
            id,
            name: n,
            type: t,
        }];
    }
}

module.exports = Office;
