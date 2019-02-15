class Office {
    constructor() {
        this.offices = [];
    }

    create(props) {
        const duplicate = this.offices.some(office => office.name === props.name);
        if (duplicate) {
            return {
                error: 'office with the same name exists',
            };
        }
        const numberOfParties = (this.offices.length);
        const id = (numberOfParties === 0) ? 1 : (this.offices[(numberOfParties - 1)].id + 1);
        this.offices.push({ id, ...props });
        const office = this.offices.find(el => el.id === id);
        return [{
            id,
            name: office.name,
        }];
    }

    findOne(id) {
        const officeIndex = this.offices.findIndex(office => office.id === Number(id));
        if (officeIndex >= 0) {
            return this.offices[officeIndex];
        }
        return null;
    }

    findAll() {
        return this.offices;
    }
}

module.exports = Office;
