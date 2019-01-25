class Dropdown {
    constructor(ui) {
        this.elts = { ...ui
        };
    }

    show() {
        this.elts.container.classList.add('show');
    }

    addListeners() {
        this.elts.trigger.addEventlistener('click', () => {
            this.show()
        })
    }
}

module.exports = Dropdown;