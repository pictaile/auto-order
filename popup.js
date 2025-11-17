const FIELDS = ['email', 'name', 'password'];

async function callExtension() {
    const data = collectData();

    await sendToExt(data);
}

async function sendToExt(data) {
    const [tab] = await chrome.tabs.query({active: true, currentWindow: true});

    chrome.tabs.sendMessage(tab.id, {action: "runAutoFill", data: data }, (response) => {
        console.log("Ответ от content.js:", response);
    });
}

function collectData() {
    const strId = document.getElementById('json');
    validator(strId.value);
    return JSON.parse(strId.value);
}

function validator(value) {
    debugger
    try {
        if(isEmpty(value)) {
            this.sendError('Заповніть форму');
            throw new Error('Заповніть форму');
        }
        else if(isNotJSON(value)) {
            this.sendError('Не є json формат');
            throw new Error('Не є json формат');
        }
        else if(isNotValidData(value)) {
            this.sendError('json не у тому форматі');
            throw new Error('json не у тому форматі');
        }

    } catch  (e) {
        console.error(e.message);
    }
}

function isEmpty(value) {
    return value === '';
}

function isNotJSON(value) {
    try {
        JSON.parse(value);
        return false;
    } catch  (e) {
        return true;
    }
}

function isNotValidData(value) {
    const jsonArr = JSON.parse(value);
    const col = 0;
    for (let i = 0; i < jsonArr.length; i++) {
        const keys = Object.keys(jsonArr[i]);
        if(JSON.stringify(keys) !== JSON.stringify(FIELDS)) {
            return true;
        }
    }

    return false;
}

function toggleValidator() {
    document.getElementById('errors').innerHTML = '';
}

function sendError(str) {
    document.getElementById('errors').innerHTML = str;
}





document.getElementById("fill").addEventListener("click", async () => {
    toggleValidator();
    await callExtension();
});