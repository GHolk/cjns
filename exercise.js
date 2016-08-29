

function mapCharacterTable (characterUse){

	var characterArray = characterUse.textContent.split('\n');

	for (var i=0, l=characterArray.length; i<l; i++)
		if(characterArray[i])
			this[characterArray[i].substr(1)] = characterArray[i].charAt(0);
}

mapCharacterTable.prototype = {

	findAlphabet: function(character){
		for(var i in this)
			if(this[i] === character) return i;
	},

	getCharacterAndAlphabet: function(oldAlphabet){

		this[oldAlphabet] = undefined;
		for (var i in this)
			if(
				typeof(this[i]) == 'string' && 
				this[i].length == 1
			)
				return [this[i], i];

		return false;
	},

	findAlphabet: function(character){
		for(var i in this)
			if(this[i] === character) return i;
	},
};

var alphabetTable = { a:'日', b:'月', c:'金', d:'木', e:'水', f:'火', g:'土', h:'竹', i:'戈', j:'十', k:'大', l:'中', m:'一', n:'弓', o:'人', p:'心', q:'手', r:'口', s:'尸', t:'廿', u:'山', v:'女', w:'田', x:'難', y:'卜', z:'重' }; 


/*
function createTabler(hash){

	this.currentId = Math.abs(Math.floor(
		Number(hash.substr(1))
	)%32) || 0;

	this.setTable = function(){

		var allCharacterTable = document.getElementsByClassName('character');

		this.currentId = Math.abs(
			Math.floor(
				Number(window.location.hash.substr(1))
			)%32
		) || 0;

		for (var i=0, l=allCharacterTable.length; i<l; i++)
			allCharacterTable[i].className = 'character';

		allCharacterTable[this.currentId].className += ' characterUse';
	};
}

var tabler = new createTabler(window.location.hash);
*/

var tabler = {

	getCurrentId: function(){
		return Math.abs(Math.floor( Number(
			window.location.hash.substr(1)
		) )%32) || 0;
	},

	setTable: function(){
		document.getElementById('characterUse').textContent = 
			document.getElementById( 
				this.getCurrentId() 
			).textContent.replace(/[a-z]*\n/g,' ');
	},
};

var characterTable;

var respondWindow = document.getElementById('respond');

respondWindow.say = function(sentence,type){
	if( /^[ \t\n]*$/.test(sentence) ) return false;

	var paragraph = document.createElement('p');
	paragraph.textContent = sentence ;
	paragraph.className = type || '';

	this.appendChild(paragraph);
	this.scrollTop += 150;

	return true;
};

respondWindow.show = function(node){
	if(
		node && 
		this.appendChild(node)
	) {
		this.scrollTop += 150;
		return true;
	}

	return false;
};


var visualBar = document.getElementById('visual');
var inputBar = document.getElementById('input');
var questCharacter = document.getElementById('quest');
var hintBar = document.getElementById('hint');

hintBar.newHintState = function(){
	var answerAlphabetLength = questCharacter.title.length; 
	var hintState = [];
	for(var i=0, l=answerAlphabetLength; i<l; i++)
		hintState.push('＊');
	this.textContent = hintState.join(' ');
};

hintBar.hintCharacter = function(){

	var answerAlphabet = questCharacter.title;
	var hintState = this.textContent.split(' ');

	if(hintState.indexOf('＊') == -1) return true;

	var newIndex;
	do newIndex = Math.floor( Math.random()*answerAlphabet.length );
	while( hintState[newIndex] != '＊' );

	hintState[newIndex] = alphabetTable[answerAlphabet.charAt(newIndex)];

	this.textContent = hintState.join(' ');
};

questCharacter.nextCharacter = function(){
	var characterAndAlphabet = 
		characterTable.getCharacterAndAlphabet(this.title) ;

	if( Array.isArray(characterAndAlphabet) ){ 
		this.textContent = characterAndAlphabet[0];
		this.title = characterAndAlphabet[1];
		hintBar.newHintState();

	} else
		respondRobot.endStage();

};

visualBar.generateCharacter = function (allAlphabet){

	var allAlphabetArray = allAlphabet.split('');
	var visualString = "";

	for (var i=0, l=allAlphabetArray.length; i<l; i++)
			visualString += (
				alphabetTable[ allAlphabetArray[i] ] || 
				allAlphabetArray[i] 
			) + ' ';

	this.textContent = visualString + '_' ;
};

visualBar.verifyCharacter = function(){
	switch(this.textContent){
	case'_':
		respondRobot.inputRespond(2);
		return false;
		break;
	case questCharacter.textContent:
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

// 幫我撐十秒！
	current: undefined,
	inputTimes: 0,
	cumulateTimes: 0,
	doCumulate: function(){
		var current = this.current, cumulateTimes = this.cumulateTimes;

		if(current === 0){
			if(cumulateTimes >= 0) this.cumulateTimes++;
			else {
				if(cumulateTimes <= -3) respondWindow.say("耶！對了！",'good');
				else respondWindow.say("對。",'good');
				this.cumulateTimes = 0;
			}
		} else {
			if(cumulateTimes <= 0) this.cumulateTimes--;
			else {
				if(cumulateTimes >= 5) respondWindow.say("啊，錯了？",'bad');
				else respondWindow.say("錯了。",'bad');
				this.cumulateTimes = 0;
			}
		}
	},

	/*
	tableIntro: function(){
		respondWindow.say(characterTable.title, 'system');
	},
	*/

	chatBack: function(){

		function chatBackLater(){
			var respond = document.getElementById('chatBack').children[0]
			respond.className = 'gm';
			respondWindow.show(respond);
		}

		setTimeout(chatBackLater, 1000 + 2000*Math.random());
	},

	cumulateRespond: function(){

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

		sentence && respondWindow.say(sentence,point);
	},

	hintRespond: function(){

		if(this.inputTimes%7 == 6 && this.current === 0){

			function sayHint(){
				var paragraph = 
					document.getElementById('respondMaterial').children[0] || 
					false ;
				paragraph.className = 'gm';

				respondWindow.show(paragraph);
			}

			window.setTimeout(sayHint, 3 + Math.random()*3);
		}
	},

	endStage: function(){
		var currentStage = tabler.getCurrentId(), paragraph = [];

		for(var i=0; i<3; i++){
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

		for(i=0; i<3; i++) respondWindow.show(paragraph[i]);
	},

	inputRespond: function(state){
		this.current = state;
		this.inputTimes++;
		this.hintRespond();
		this.doCumulate();
		this.cumulateRespond();
	},
};


var fontPx = document.getElementById('fontPx').children[1];

fontPx.onchange = function(){
	document.body.style.fontSize = this.value + 'pt';
}


inputBar.oninput = function(){

	var allAlphabet = this.value;

	if(allAlphabet.substr(-1) === '\n') {

		if( respondWindow.say(allAlphabet) )
			respondRobot.chatBack();

		this.value = '';

	} else if(allAlphabet.charAt(0) == ':') ;

	else if(allAlphabet.substr(-1) === ' ') {
		this.value = '';
		visualBar.textContent = characterTable[
			allAlphabet.substr(0,allAlphabet.length-1) 
		] || '_';

		if( visualBar.verifyCharacter() ) questCharacter.nextCharacter();
		else hintBar.hintCharacter();

	} else 
		visualBar.generateCharacter(allAlphabet);

};


function init(){
	tabler.setTable();
	characterTable = new mapCharacterTable(
			document.getElementById( tabler.getCurrentId() )
	);

	if(!characterTable[questCharacter.title])
		questCharacter.nextCharacter();
	//respondRobot.tableIntro();
	hintBar.newHintState();
	inputBar.focus();
	inputBar.select();
}

window.onhashchange = init;

document.body.onload = init;

