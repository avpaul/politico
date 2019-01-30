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

  delete(id) {
    const p = this.parties[id];
    let rmParties;
    if (p) {
      rmParties = this.parties.filter(party => party !== p);
      this.parties = rmParties;
      return true;
    } else {
      return null;
    }
  }

  findOne(id) {
    const party = this.parties[id];
    if (party) {
      return party;
    } else {
      return null;
    }
    // (party) ? return party : null;
  }
}

module.exports = Party;
