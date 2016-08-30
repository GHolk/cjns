Element.prototype.doClass = function(command){
	var operator = command.charAt(0), 
		newClass = command.substr(1),
		oldClass = this.className;
	
	if (operator == '+'){
		if (oldClass) this.className += ' ' + newClass;
		else this.className = newClass;
	} else if (operator == '-') {
		var deClass = new RegExp(' ?' + newClass,'g');
		this.className = oldClass.replace(deClass, '');
	} else
		this.className = command;

	return true;
};


var keyboard = (function (keyboard){

	var key = {};

	for(var i=0; i<3; i++){

		var row = keyboard.children[i].children;

		for(var j=0, l=row.length; j<l; j++){
			key[ row[j].title ]  =  row[j] ;
		}
	}

	function press (keyName){
		key.press && key[key.press].doClass("-press");
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
		'hint': hint
	};

})( document.getElementById('keyboardMap') );


questCheck = (function(characterTable){

	var characterArray = characterTable.textContent.split('\n');

	var questBar = document.getElementById('questAlphabet').children;

	var nowCharacter = "yfiku";

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

		for(var i=0, l=questBar.length; i<l; i++){
			questBar[i].textContent = characterString.charAt(i);
			questBar[i].doClass("");
		}
	}

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


document.getElementById('inputBar').oninput = function(){

	var string = this.value;
	if(/[^a-y]/.test(string)){
		this.value = '';
		string = '';
	}
	string && keyboard.press(string.slice(-1));

	if( questCheck(string) ) this.value = '';
};

inputBar.focus() && inputBar.select();
