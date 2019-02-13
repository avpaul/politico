class Dropdown {
    constructor(ui) {
        this.active = false;
        this.elts = {
            ...ui
        };
    }

    init() {
        this.addListeners();
    }

    show() {
        this.elts.container.classList.add('show');
        this.elts.overlay.classList.add('show');
        this.active = true;
    }

    hide() {
        this.elts.container.classList.remove('show');
        this.elts.overlay.classList.remove('show');
        this.active = false;
    }

    addListeners() {
        this.elts.trigger.addEventListener('click', () => {
            this.show();
        });
        this.elts.overlay.addEventListener('click', () => {
            if (this.active) {
                this.hide();
            }
        });
    }
}

const ui = {
    trigger: document.getElementsByClassName('dropdown-trigger')[0],
    container: document.getElementsByClassName('dropdown')[0],
    overlay: document.getElementsByClassName('overlay-sc')[0],
};
const Drop = new Dropdown(ui);
Drop.init();