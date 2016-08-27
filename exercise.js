

function mapCharacterTable (characterUse){

	var characterArray = characterUse.textContent.split('\n');

	for (var i=0, l=characterArray.length; i<l; i++)
		if(characterArray[i])
			this[characterArray[i].substr(1)] = characterArray[i].charAt(0);

	characterUse.textContent = 
		characterUse.textContent.replace(/[a-z]*\n/g,' ');

	this.findAlphabet = function(character){
		for(var i in this)
			if(this[i] === character) return i;
	};

	this.getCharacterAndAlphabet = function(oldAlphabet){
		this[oldAlphabet] = undefined;
		for (var i in this)
			if(
				typeof(this[i]) === 'string' && 
				this[i].length == 1
			) return [this[i], i];
	};

	this.findAlphabet = function(character){
		for(var i in this)
			if(this[i] === character) return i;
	};
}


var alphabetTable = { a:'日', b:'月', c:'金', d:'木', e:'水', f:'火', g:'土', h:'竹', i:'戈', j:'十', k:'大', l:'中', m:'一', n:'弓', o:'人', p:'心', q:'手', r:'口', s:'尸', t:'廿', u:'山', v:'女', w:'田', x:'難', y:'卜', z:'重' }; 


function createTabler(hash){

	if(hash) this.currentId = Number(hash.substr(1));
	else this.currentId = 0;

	this.setTable = function(){

		var allCharacterTable = document.getElementsByClassName('character');
		this.currentId = Number(window.location.hash.substr(1));

		for (var i=0, l=allCharacterTable.length; i<l; i++)
			allCharacterTable[i].className = 'character';

		allCharacterTable[this.currentId].className += ' characterUse';
	};
}

var tabler = new createTabler(window.location.hash);

var characterTable;

var respondWindow = document.getElementById('respond');

respondWindow.nextStageRespondText = function(tableId){

	var nextStageParagraph = document.createElement('em');

	if(tableId == 31) 
		nextStageParagraph.textContent = 
			'恭喜，你已經完成常用共 4808 字的練習了！';

	else {
		nextStageParagraph.textContent = 
			'恭喜你完成本字庫。這是第 ' + tableId + ' 個字庫，還有 ' +
			(31 - tableId) + ' 個字庫等著你。';

		var nextStageAnchor = document.createElement('a');
		nextStageAnchor.href = '#' + (tableId + 1);
		nextStageAnchor.textContent = 
			'歡迎挑戰第 ' + (tableId + 1) + ' 個字庫。';

		nextStageParagraph.appendChild(nextStageAnchor);
	}

	return nextStageParagraph;

};

respondWindow.showRespond = function (type){
	var respondParagraph = document.createElement('p');

	switch(type) {

	case 't':
		respondParagraph.textContent = '正確'
		respondParagraph.className = 'good';
		break;

	case 'f':
		respondParagraph.textContent = '不對喔';
		respondParagraph.className = 'bad';
		break;

	case 'n':
		respondParagraph.textContent = '目前的字庫沒有這個字。';
		respondParagraph.className = 'iron';
		break;

	case 'c':
		respondParagraph.textContent = '恭喜完成了一個字庫！';
		respondParagraph.className = 'good';
		respondParagraph.appendChild(
			this.nextStageRespondText(tabler.currentId)
		);
		break;
	}
	this.appendChild(respondParagraph);
	this.scrollBy(0,9999);
};



var visualBar = document.getElementById('visual');
var inputBar = document.getElementById('input');
var questCharacter = document.getElementById('quest');
var hintBar = document.getElementById('hint');

hintBar.newHintState = function(){
	var answerAlphabetLength = questCharacter.title.length; 
	this.hintState = [];
	for(var i=0, l=answerAlphabetLength; i<l; i++)
		this.hintState.push('＊');
	this.textContent = this.hintState.join(' ');
};

hintBar.hintCharacter = function(){

	var answerAlphabet = questCharacter.title;

	if(this.hintState.indexOf('＊') == -1) return true;

	var newIndex;
	do newIndex = Math.floor( Math.random()*answerAlphabet.length );
	while( this.hintState[newIndex] != '＊' );
	this.hintState[newIndex] = alphabetTable[answerAlphabet.charAt(newIndex)];

	this.textContent = this.hintState.join(' ');
};

questCharacter.nextCharacter = function(){
	var characterAndAlphabet = 
		characterTable.getCharacterAndAlphabet(this.title) ;

	if(!characterAndAlphabet){ 
		respondWindow.showRespond('c');
		return false;
	}

	this.textContent = characterAndAlphabet[0];
	this.title = characterAndAlphabet[1];
	hintBar.newHintState();
};

visualBar.generateCharacter = function (allAlphabet){

	var allAlphabetArray = allAlphabet.split('');
	var visualString = "";

	for (var i=0, l=allAlphabetArray.length; i<l; i++)
			visualString += alphabetTable[ allAlphabetArray[i] ] + ' '
				|| allAlphabetArray[i];

	this.textContent = visualString + '_' ;
};

visualBar.verifyCharacter = function(){
	switch(this.textContent){
	case'_':
		respondWindow.showRespond('n');
		return false;
		break;
	case questCharacter.textContent:
		respondWindow.showRespond('t');
		return true;
		break;
	default:
		respondWindow.showRespond('f');
		return false;
	}
};

inputBar.addEventListener("input", function(){

	var lastAlphabet = inputBar.value.charAt(inputBar.value.length - 1);
	var elseAlphabet = inputBar.value.substr(0,inputBar.value.length - 1);

	if(lastAlphabet === ' ') {
		inputBar.value = '';
		visualBar.textContent = characterTable[elseAlphabet] || '_';
		if( visualBar.verifyCharacter() ) questCharacter.nextCharacter();
		else hintBar.hintCharacter();

	} else
		visualBar.generateCharacter(elseAlphabet + lastAlphabet);

});

function init(){
	tabler.setTable();
	characterTable = 
		new mapCharacterTable(document.getElementById(tabler.currentId));
	if(!characterTable[questCharacter.title])
		questCharacter.nextCharacter();
	hintBar.newHintState();
	inputBar.focus();
	inputBar.select();
	//respondWindow.respondWelcome(tabler.currentId);
}

window.addEventListener("hashchange",init);

init();

