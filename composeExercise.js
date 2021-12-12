

function MapCharacterTable(characterUse) {
	var characterArray = characterUse.textContent.split('\n');
	var table = this.table = {};
	for (var i=0, l=characterArray.length; i<l; i++) {
		if (characterArray[i]) {
			table[characterArray[i].substr(1)] = characterArray[i].charAt(0);
		}
	}
}

MapCharacterTable.prototype = {
	constructor: MapCharacterTable,
	findAlphabet: function (character) {
		var table = this.table
		for (var i in table) if (table[i] === character) return i;
		return undefined;
	},
	getCharacterAndAlphabet: function (oldAlphabet) {
		var table = this.table;
		table[oldAlphabet] = undefined;
		for (var i in table) {
			if (typeof(table[i]) == 'string' && table[i].length == 1) {
				return [table[i], i];
			}
		}
		return false;
	},
	findCharacter: function (alphabet) {
		return this.table[alphabet]
	},
};

var alphabetTable = { a:'日', b:'月', c:'金', d:'木', e:'水', f:'火', g:'土', h:'竹', i:'戈', j:'十', k:'大', l:'中', m:'一', n:'弓', o:'人', p:'心', q:'手', r:'口', s:'尸', t:'廿', u:'山', v:'女', w:'田', x:'難', y:'卜', z:'重' }; 

var tabler = {
	getCurrentId: function () {
		var hash = window.location.hash.substr(1);
		var id = Number(hash);
		if (0 <= id && id < 32) return id;
		else return 0;
	},
	setTable: function () {
		document.getElementById('characterUse').textContent = 
			document.getElementById(this.getCurrentId())
			.textContent.replace(/[a-z]*\n/g,' ');
	},
};

var characterTable;

var respondWindow = {
	node: document.getElementById('respond'),
	say: function (sentence, type) {
		if ( /^[ \t\n]*$/.test(sentence) ) return false;

		var paragraph = document.createElement('p');
		paragraph.textContent = sentence ;
		paragraph.className = type || '';

		this.node.appendChild(paragraph);
		this.node.scrollTop += 150;

		return true;
	},
	show: function (node) {
		if (node && this.node.appendChild(node)) {
			this.node.scrollTop += 150;
			return true;
		}

		return false;
	}
};


var visualBar = {node: document.getElementById('visual')};
var inputBar = document.getElementById('input');
var questCharacter = {node: document.getElementById('quest')};
var hintBar = {node: document.getElementById('hint')};

hintBar.newHintState = function() {
	var answerAlphabetLength = questCharacter.node.title.length;
	var hintState = [];
	for (var i=0, l=answerAlphabetLength; i<l; i++) hintState.push('＊');
	this.node.textContent = hintState.join(' ');
};

hintBar.hintCharacter = function(){

	var answerAlphabet = questCharacter.node.title;
	var hintState = this.node.textContent.split(' ');

	if (hintState.indexOf('＊') == -1) return true;

	var hideState = [];
	for (var i=0; i<hintState.length; i++) {
		if (hintState[i] == '＊') hideState.push(i);
	}
	var newIndex = hideState[Math.floor(Math.random() * hideState.length)];

	hintState[newIndex] = alphabetTable[answerAlphabet.charAt(newIndex)];

	this.node.textContent = hintState.join(' ');
	return false
};

questCharacter.nextCharacter = function () {
	var characterAndAlphabet = 
		characterTable.getCharacterAndAlphabet(this.node.title);

	if (characterAndAlphabet) {
		this.node.textContent = characterAndAlphabet[0];
		this.node.title = characterAndAlphabet[1];
		hintBar.newHintState();
	}
	else respondRobot.endStage();

};

visualBar.generateCharacter = function (allAlphabet) {
	var allAlphabetArray = allAlphabet.split('');
	var visualString = '';

	for (var i=0, l=allAlphabetArray.length; i<l; i++) {
		visualString += (
			alphabetTable[ allAlphabetArray[i] ] ||
				allAlphabetArray[i] 
		) + ' ';
	}

	this.node.textContent = visualString + '_' ;
};

visualBar.verifyCharacter = function () {
	switch (this.node.textContent) {
	case '_':
		respondRobot.inputRespond(2);
		return false;
		break;
	case questCharacter.node.textContent:
		respondRobot.inputRespond(0);
		return true;
		break;
	default:
		respondRobot.inputRespond(1);
		return false;
		break;
	}
};

var respondRobot = {
	current: 0,
	inputTimes: 0,
	cumulateTimes: 0,
	doCumulate: function () {
		var current = this.current, cumulateTimes = this.cumulateTimes;
		if (current == 0) {
			if (cumulateTimes >= 0) this.cumulateTimes++;
			else {
				if (cumulateTimes <= -3) respondWindow.say("耶！對了！",'good');
				else respondWindow.say("對。",'good');
				this.cumulateTimes = 0;
			}
		}
		else {
			if (cumulateTimes <= 0) this.cumulateTimes--;
			else {
				if (cumulateTimes >= 5) respondWindow.say("啊，錯了？",'bad');
				else respondWindow.say("錯了。",'bad');
				this.cumulateTimes = 0;
			}
		}
	},
	chatBack: function () {
		function chatBackLater(){
			var respond = document.getElementById('chatBack').children[0]
			respond.className = 'gm';
			respondWindow.show(respond);
		}
		setTimeout(chatBackLater, 1000 + 2000*Math.random());
	},
	cumulateRespond: function () {
		var sentence, point, cumulateTimes = this.cumulateTimes;
		if(cumulateTimes > 0) {
			sentence = '對！';
			point = 'good';
		} else if(cumulateTimes < 0){
			sentence = '錯。';
			point = 'bad';
		}

		switch(cumulateTimes){
		case 3: sentence = '不錯喔！';
		break;
		case 5: sentence = '欸唷，這個屌！';
		break;
		case -2: sentence = '又錯了。';
		break;
		case -3: sentence = '還是錯……';
		break;
		}
		if (Math.random() < 0.07) sentence = '幫我撐十秒！';

		sentence && respondWindow.say(sentence,point);
	},
	hintRespond: function () {
		if (this.inputTimes%7 == 6 && this.current == 0) {
			function sayHint(){
				var paragraph = document.getElementById('respondMaterial').children[0] ||
					false;
				paragraph.className = 'gm';
				respondWindow.show(paragraph);
			}
			window.setTimeout(sayHint, 3 + Math.random()*3);
		}
	},
	endStage: function () {
		var currentStage = tabler.getCurrentId(), paragraph = [];
		for (var i=0; i<3; i++) {
			paragraph[i] = document.getElementById(
				'nextStage'
			).children[i].cloneNode(true);

			paragraph[i].className = 'system';
		}

		var paragraphText = paragraph[1].textContent;
		paragraphText = paragraphText.replace('tableId',currentStage);
		paragraphText = paragraphText.replace('leftTable',31-currentStage);
		paragraph[1].textContent = paragraphText;

		var anchor = paragraph[2].children[0];
		anchor.href = '#' + (currentStage + 1) ;

		var anchorText = anchor.textContent;
		anchorText = anchorText.replace('nextTableId',currentStage+1);
		anchor.textContent = anchorText;

		for (i=0; i<3; i++) respondWindow.show(paragraph[i]);
	},
	inputRespond: function (state) {
		this.current = state;
		this.inputTimes++;
		this.hintRespond();
		this.doCumulate();
		this.cumulateRespond();
	},
};


var fontPx = document.getElementById('fontPx').children[1];

fontPx.oninput = function () {
	document.body.style.fontSize = this.value + 'pt';
}


inputBar.oninput = function(){
	var allAlphabet = this.value;
	if (allAlphabet.substr(-1) === '\n') {
		if (respondWindow.say(allAlphabet)) respondRobot.chatBack();
		this.value = '';
	}
	else if (allAlphabet.charAt(0) == ':') ;
	else if (allAlphabet.substr(-1) === ' ') {
		this.value = '';
		visualBar.node.textContent = characterTable.findCharacter(
			allAlphabet.substr(0, allAlphabet.length-1)
		) || '_';

		if (visualBar.verifyCharacter()) questCharacter.nextCharacter();
		else hintBar.hintCharacter();
	}
	else visualBar.generateCharacter(allAlphabet);

};


function init() {
	tabler.setTable();
	characterTable = new MapCharacterTable(
			document.getElementById( tabler.getCurrentId() )
	);

	if (!characterTable.findCharacter(questCharacter.node.title)) {
		questCharacter.nextCharacter();
	}
	hintBar.newHintState();
	inputBar.focus();
	inputBar.select();
}

window.onhashchange = init;

document.body.onload = init;

