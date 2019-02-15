class Office {
    constructor() {
        this.offices = [];
    }

    create(properties) {
        const duplicate = this.offices.some(office => office.name === properties.name);
        if (duplicate) {
            return {
                error: 'office with the same name exists',
            };
        }
        const numberOfParties = (this.offices.length);
        const id = (numberOfParties === 0) ? 1 : (this.offices[(numberOfParties - 1)].id + 1);
        this.offices.push({ id, ...properties });
        const office = this.offices.find(element => element.id === id);
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

export default Office;
