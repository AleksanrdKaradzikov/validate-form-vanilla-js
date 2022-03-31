const controls = document.querySelectorAll('.form-control');
const submit = document.querySelector('.submit');
const form = document.querySelector('.form');

const state = {};

controls.forEach(node => {
    state[node.name] = {
        blur: false,
        error: 'Обязательное поле',
        validate: (value) => value ? undefined : 'Обязательное поле',
    };

    node.addEventListener('input', handleInput);
    node.addEventListener('blur', handleBlur);
});

submit.addEventListener('click', hadleSubmit);

function hadleSubmit() {
    Object.keys(state).forEach(key => {
        state[key] = {
            ...state[key],
            blur: true,
        }
    });

    const isError = checkErros();

    if (isError) {
        observeState();
        return;
    } else {
        const data = {};
        controls.forEach(({ value, name }) => {
            data[name] = value;

            state[name] = {
                ...state[name],
                error: 'Обязательное поле',
                blur: false,
            }
        })

        submit.disabled = true;
        submit.textContent = 'отправка...';
        submit.classList.add('disabled');

        setTimeout(() => {
            form.reset();
            alert(JSON.stringify(data), null, 2);

            submit.disabled = false;
            submit.classList.remove('disabled');
            submit.textContent = 'отправить';
        }, 1500);

    }

};

function handleInput({ target }) {
    const { value, name } = target;
    const nextElement = target.nextSibling.nextSibling;

    if (value.length > 0) {
        nextElement.classList.add('focused');
    } else {
        nextElement.classList.remove('focused');
    }

    const { validate } = state[name];
    state[name] = {
        ...state[name],
        error: validate(value),
    };

    observeState();
}

function handleBlur({ target }) {
    const { name, value } = target;

    const { validate, error } = state[name];

    state[name] = {
        ...state[name],
        blur: true,
        error: error ? error : validate(value),
    };

    observeState();
}


function observeState() {
    controls.forEach((node) => {
        const { error, blur } = state[node.name];
        const parent = node.parentNode;
        const erorrElem = parent.querySelector('.error-message');

        if (error && blur) {
            erorrElem.textContent = error;

            node.classList.add('error');
        } else {
            node.classList.remove('error');
            erorrElem.textContent = '';
        }
    });

    const isError = checkErros();

    if (isError) {
        submit.classList.add('disabled');
        submit.disabled = true;
    } else {
        submit.classList.remove('disabled');
        submit.disabled = false;
    }
}

function checkErros() {
    return Object.keys(state).some((key) => state[key].blur && state[key].error);
}
