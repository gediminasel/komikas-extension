'use strict';

const foto = {
	'*://*/ui/v1/icons/mail/rfr/logo_gmail_lockup_default_1x_r2.png': chrome.runtime.getURL('images/gmail_logo.png'),
	'*://*/ui/v1/icons/mail/rfr/logo_gmail_lockup_default_2x_r2.png': chrome.runtime.getURL('images/gmail_logo.png'),
	'*://*/ui/v1/icons/mail/rfr/logo_gmail_lockup_default_1x_r4.png': chrome.runtime.getURL('images/gmail_logo.png'),
	'*://*/ui/v1/icons/mail/rfr/logo_gmail_lockup_default_2x_r4.png': chrome.runtime.getURL('images/gmail_logo.png'),
	'*://*/images/branding/googlelogo/2x/googlelogo_color_92x30dp.png': chrome.runtime.getURL('images/googlelogo_color_92x30dp.png'),
	'*://*/images/branding/googlelogo/1x/googlelogo_color_92x30dp.png': chrome.runtime.getURL('images/googlelogo_color_92x30dp.png'),
	'*://*/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png': chrome.runtime.getURL('images/googlelogo_color_272x92dp.png'),
	'*://*/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png': chrome.runtime.getURL('images/googlelogo_color_272x92dp.png'),
};

const changeFontCss = "* {font-family: 'Comic Sans MS', nf-icon, FontAwesomeExtra, 'Font Awesome 5 Free', 'fi', icomoon, 'Glyphicons Halflings', 'Material Icons Extended', FontAwesome, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji', 'Font Awesome 5 Pro', 'Google Sans',Roboto,Arial, Serif !important; }" +
	" .google-material-icons {font-family: 'Google Material Icons' !important;}" +
	" .material-icons-extended {font-family: 'Material Icons Extended' !important;}" +
	" .material-icons {font-family: 'Material Icons' !important;}";
const changeCaseCss = '* {text-transform: uppercase !important; }';
const changeColorCss = '* {color: magenta !important; }';

let ignoreUrls = {};
let changeFont = true;
let changeCase = false;
let changeColor = false;
let listeners = [];

let css;

function reload_options() {
	chrome.storage.sync.get({
		ignoreUrls: [],
		changeFont: true,
		changeCase: false,
		changeColor: false,
	}, function (items) {

		ignoreUrls = {};
		for (let x of items.ignoreUrls) {
			ignoreUrls[x] = true;
		}
		changeFont = items.changeFont;
		changeCase = items.changeCase;
		changeColor = items.changeColor;

		const _css = css;

		css = (changeFont ? changeFontCss : '');
		css += (changeCase ? changeCaseCss : '');
		css += (changeColor ? changeColorCss : '');
		const __css = css;

		chrome.tabs.query({}, function (tabs) {
			for (let t of tabs) {
				let url = t.pendingUrl;
				if (!url) {
					url = t.url;
				}

				if (url && !ignoreUrls[url.split('/')[2]]) {
					function a(x) {
						if (x <= 0 || !chrome.tabs.removeCSS) {
							chrome.tabs.insertCSS(t.id, {
								code: __css,
							}, () => chrome.runtime.lastError);
						} else {
							chrome.tabs.removeCSS(t.id, {
								code: _css,
							}, () => {
								if (chrome.runtime.lastError) {
									a(0);
								} else {
									a(x - 1);
								}
							});
						}
					}
					a(10);
				}
			}
		});

		for (const f of listeners) {
			chrome.webRequest.onBeforeRequest.removeListener(f);
		}
		listeners = [];

		if (changeFont) {
			for (const f in foto) {
				const redirectUrl = foto[f];
				const listn = function () {
					return { redirectUrl };
				};
				listeners.push(listn);
				chrome.webRequest.onBeforeRequest.addListener(
					listn, {
					urls: [
						f
					]
				}, ["blocking"]
				);
			}
		}
	});
}

reload_options();

const insertedStyles = {};

chrome.tabs.onUpdated.addListener(function (tabId, info, tab) {
	if (info.status === 'loading') {
		let url = tab.pendingUrl;
		if (!url) {
			url = tab.url;
		}

		if (url && !ignoreUrls[url.split('/')[2]]) {
			chrome.tabs.insertCSS(tab.id, {
				code: css,
				runAt: "document_start",
			}, () => chrome.runtime.lastError);
		}
	}
	return true;
});

chrome.tabs.onRemoved.addListener(function (tabId) {
	delete insertedStyles[tabId];
	return true;
});

chrome.runtime.onMessage.addListener(function (request) {
	if (request.type == "OPTIONS_CHANGED") {
		reload_options();
	}
	return true;
});
