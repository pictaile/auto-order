const SELECTORS = {
    enter: 'a[href="/login"]',
    enterEmail:'main button[aria-label="Увійти за допомогою електронної пошти"]',
    inputEmail:'input[type="email"]',
    next1: 'button[type="submit"]',
    name: '#full-name',
    password: '#password',
    submit: 'button[type="submit"]',
}

function autoFill(data) {
    debugger
    data.forEach((item) => {

        sel(SELECTORS.enter)?.click();

        timerCall(() =>  sel(SELECTORS.enterEmail)?.click())
        .then(result => {
            return timerCall(() =>  {
                simulateTyping( sel(SELECTORS.inputEmail), item.email.trim(), 150);
            }, 100);
        })
        .then(result => {
            return timerCall(() =>  {
            }, 4000);
        })
        .then(result => {
            return timerCall(() =>  {
                sel(SELECTORS.next1)?.click()
            });
        })
        .then(result => {
            return timerCall(() =>  {
                simulateTyping( sel(SELECTORS.name), item.name.trim(), 100);
            });
        })
        .then(result => {
            return timerCall(() =>  {
                simulateTyping( sel(SELECTORS.password), item.password.trim(), 150);
            });
        })
        .then(result => {
            return timerCall(() =>  {
            }, 4000);
        })
        .then(result => {
            return timerCall(() =>  {
                sel(SELECTORS.submit)?.click()
            });
        })
    });


    console.log(`${data}`);
}

function sel(selector) {
    return  document.querySelector(selector);
}

function timerCall(callback, time = 1000) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            callback();
            resolve();
        }, time);
    });

}

function simulateTyping(input, text, delay = 100) {
    let i = 0;

    function typeChar() {
        if (i < text.length) {
            // добавляем следующий символ
            input.value += text[i];

            // триггерим событие input
            input.dispatchEvent(new Event('input', { bubbles: true }));

            i++;
            setTimeout(typeChar, delay);
        } else {
            // по завершению можно триггерить change
            input.dispatchEvent(new Event('change', { bubbles: true }));
        }
    }

    typeChar();
}

// Слушаем сообщения
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    debugger
    if (msg.action === "runAutoFill") {
        autoFill(msg.data);
        sendResponse({status: "done"});
    }
});

