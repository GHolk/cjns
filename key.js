
Element.prototype.doClass = function(command){
	var operator = command.charAt(0), 
		newClass = command.substr(1),
		oldClass = this.className;
	
	if (operator == '+'){
		if (oldClass) this.className += ' ' + newClass;
		else this.className = newClass;
	} else if (operator == '-') {
		var deClass = new RegExp(' '+newClass+' ','g');

		do oldClass = (' ' + oldClass + ' ').replace(deClass, ' ');
		while (deClass.test(oldClass))

		this.className = oldClass.slice(1,-1);
	} else
		this.className = command;

	return true;
};


var keyboard = (function (keyboard){

	var key = {};

	var mapper = {};

	for(var i=0; i<3; i++){

		var row = keyboard.children[i].children;

		for(var j=0, l=row.length; j<l; j++){
			var alphabet = row[j].title;
			key[alphabet]  =  row[j];
			mapper[alphabet] = row[j].textContent;
		}
	}

	function press (keyName){

		setTimeout( 
			function(){ key[key.press].doClass("-press"); },
			50
		);

		key[keyName].doClass("+press");
		key.press = keyName;
	}

	function hint(keyName){
		key.hint && key[key.hint].doClass("-hint");
		key[keyName].doClass("+hint");
		key.hint = keyName;
	}

	return {
		'press': press,
		'hint': hint,
		'mapper': mapper
	};

})( document.getElementById('keyboardMap') );




questCheck = (function(characterTable){

	var characterArray = characterTable.textContent.split('\n');

	var questBar = document.getElementById('questAlphabet').children,
		nowCharacter;

	/*
	var questBar = [
		document.getElementById('questAlphabet').children[0].children,
		document.getElementById('questAlphabet').children[1].children
	];
	*/

	function compare(string){
		for(var i=0, l=nowCharacter.length; i<l; i++)
			if(string.charAt(i) !== nowCharacter.charAt(i)) return i;

		return i;
	}

	function indicate(index, right){
		var l = nowCharacter.length;

		for(var i=0; i<index; i++)
			questBar[i+1].doClass("right");
		for( ; i<l; i++)
			questBar[i+1].doClass("");

		if(right)
			questBar[index+1].doClass("wrong");
	}

	function setNewCharacter (characterString){
		nowCharacter = characterString.slice(1);

		questBar[0].textContent = characterString.charAt(0);

		for(var i=1, l=questBar.length; i<l; i++){
			questBar[i].textContent = 
				keyboard.mapper[ characterString.charAt(i) ];

			questBar[i].doClass("");
		}
	}

	setNewCharacter( characterArray[ 
		Math.floor( Math.random() * (characterArray.length-2) ) + 1
	] );

	function check(string){
		var index = compare(string);

		if(index < nowCharacter.length){
			indicate(index, string.charAt(index));
		} else {
			setNewCharacter( characterArray[ 
				Math.floor( Math.random() * (characterArray.length-2) ) + 1
			] );

			return true;
		}
	}

	return check;

})( document.getElementById("character") );

//alphabetMaper = (function(){

document.getElementById('inputBar').oninput = function(){

	var string = this.value;
	if(/[^a-y]/.test(string)){
		this.value = '';
		string = '';
	}

	string && keyboard.press(string.slice(-1));

	if( questCheck(string) ) this.value = '';
};

inputBar.focus();
inputBar.select();