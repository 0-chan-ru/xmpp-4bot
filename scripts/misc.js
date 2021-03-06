console.log("Скрипт разного загружен");
const xmpp = require("simple-xmpp");
const https = require('https');

const unloadCode = {
	events: [],
	intervals: []
};

/*
const SECOND = 1000;

function sampleTaskFunc() {
	console.log("Пример действия выполнен")
}

Promise.all([global.lastCheckInfo]).then(() => {
	console.log("Задание примера поставлено");
	let timeUpdate = 10 * SECOND;
	let sampleTask = setInterval(sampleTaskFunc, timeUpdate);
	unloadCode.intervals.push(sampleTask);
});*/

function getCountOnWebsocket(callback) {
	https.get("https://4.0-chan.ru/json/ip-count", (res) => {
		res.on("data", (data) => {
			if (res.statusCode === 200) {
				//process.stdout.write(data);
				callback(data);
			}
		});
	}).on("error", (error) => {
		console.error(error);
	});
}
// plurar russian func via https://gist.github.com/tomfun/830fa6d8030d16007bbab50a5b21ef97
function getNoun(number, one, two, five) {
	let n = Math.abs(number);
	n %= 100;
	if (n >= 5 && n <= 20) {
		return five;
	}
	n %= 10;
	if (n === 1) {
		return one;
	}
	if (n >= 2 && n <= 4) {
		return two;
	}
	return five;
}

const groupchatFunc = function(conference, from, message, stamp, delay) {
	if (delay && delay.stamp) { // костыль надо править библиотеку
		stamp = delay.stamp;
	}
	if (stamp == null) { // сейчас дата есть от MUC истории только, игнорим историю
		if (from !== options.main.nick) {
			if (message === "!надоске") {
				getCountOnWebsocket((anoncount) => {
					xmpp.send(conference, `${from}: сидят на вебсокетах сейчас ${anoncount} анонч${getNoun(anoncount, "ик", "ика", "иков")}`, true);
				});
			}
		}
	}
};
xmpp.on("groupchat", groupchatFunc);
unloadCode.events.push(["groupchat", groupchatFunc]);


module.exports = unloadCode;
