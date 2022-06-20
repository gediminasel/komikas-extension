'use strict';

let changeFont;
let changeCase;
let changeColor;

const update = () => {
    if (changeFont) {
        document.getElementById('status').innerHTML = 'Off'
    } else {
        document.getElementById('status').innerHTML = 'On'
    }
    if (changeCase) {
        document.getElementById('case_status').innerHTML = 'lowercase'
        document.getElementById('case_switch').setAttribute(
            'style', 'text-transform:lowercase;'
        )
    } else {
        document.getElementById('case_status').innerHTML = 'uppercase'
        document.getElementById('case_switch').setAttribute(
            'style', 'text-transform:uppercase;'
        )
    }
    if (changeColor) {
        document.getElementById('color_status').innerHTML = 'Don\'t change colors';
        document.getElementById('font_switch').style.color = 'magenta';
    } else {
        document.getElementById('color_status').innerHTML = 'Use the best color only';
        document.getElementById('font_switch').style.color = '';
    }
}

window.chrome.storage.sync.get({
    changeFont: true,
    changeCase: false,
    changeColor: false,
}, (items) => {
    changeFont = items.changeFont;
    changeCase = items.changeCase;
    changeColor = items.changeColor;
    update();
})

document.getElementById('github_button').onclick = () => {
    window.chrome.tabs.create({
        url: 'https://github.com/gediminasel/komikas-extension'
    })
}
document.getElementById('options_button').onclick = () => {
    chrome.runtime.openOptionsPage();
}
document.getElementById('font_switch').onclick = () => {
    chrome.storage.sync.set({
        changeFont: !changeFont,
    }, function () {
        changeFont = !changeFont;
        chrome.runtime.sendMessage({
            type: "OPTIONS_CHANGED"
        });
        update();
    });
}
document.getElementById('case_switch').onclick = () => {
    chrome.storage.sync.set({
        changeCase: !changeCase,
    }, function () {
        changeCase = !changeCase;
        chrome.runtime.sendMessage({
            type: "OPTIONS_CHANGED"
        });
        update();
    });
}
document.getElementById('color_switch').onclick = () => {
    chrome.storage.sync.set({
        changeColor: !changeColor,
    }, function () {
        changeColor = !changeColor;
        chrome.runtime.sendMessage({
            type: "OPTIONS_CHANGED"
        });
        update();
    });
}
