
function changeClass(node, command) {
	var operator = command.charAt(0),
		newClass = command.slice(1),
		oldClass = (node.className || '').split(' ');

	if (operator == '+') {
		oldClass.push(newClass);
		node.className = oldClass.join(' ');
	}
	else if (operator == '-') {
		do oldClass.splice( oldClass.indexOf(newClass), 1 );
		while (oldClass.indexOf(newClass) != -1)
		node.className = oldClass.join(' ');
	}
	else node.className = command;
}

var keyboard = (function (){
	var keyboard = document.getElementById('keyboardMap');

	var key = {};

	var mapper = { ' ': ' ' };

	for (var i=0; i<3; i++) {
		var row = keyboard.children[i].children;

		for (var j=0, l=row.length; j<l; j++) {
			var alphabet = row[j].title;
			key[alphabet]  =  row[j];
			mapper[alphabet] = row[j].textContent;
		}
	}

	function press(keyName) {
		setTimeout(
			function(){ changeClass(key[keyName], "-press"); },
			150
		);

		changeClass(key[keyName], "+press");
	}

	function hint(keyName) {
		key.hint && changeClass(key[key.hint], "-hint");
		changeClass(key[keyName], "+hint");
		key.hint = keyName;
	}

	return {
		'press': press,
		'hint': hint,
		'mapper': mapper,
		'key': key
	};
})();

var questCheck = (function() {
	var characterTable =  document.getElementById("character");
	var characterArray = characterTable.textContent.split('\n');
	var questBar = document.getElementById('questAlphabet').children,
		nowCharacter;

	function compare(string) {
		for (var i=0, l=nowCharacter.length; i<l; i++) {
			if (string.charAt(i) !== nowCharacter.charAt(i)) break;
		}
		return i;
	}

	function indicate(index, wrong) {
		var l = nowCharacter.length;
		for (var i=0; i<index; i++) {
			changeClass(questBar[i+1], "right");
		}

		var hintCharIndex = i;
		for (; i<wrong; i++) changeClass(questBar[i+1], "wrong");
		changeClass(questBar[++i], "cursor");

		for (; i<l; i++) changeClass(questBar[i+1], "");
		return hintCharIndex;
	}

	function setNewCharacter(characterString) {
		nowCharacter = characterString.slice(1);
		questBar[0].textContent = characterString.charAt(0);
		for (var i=1, l=questBar.length; i<l; i++) {
			questBar[i].textContent = keyboard.mapper[
				characterString.charAt(i) || ' '
			];

			changeClass(questBar[i], "");
		}
	}

	setNewCharacter( characterArray[
		Math.floor( Math.random() * (characterArray.length-2) ) + 1
	]);

	function check(string) {
		var index = compare(string);

		if (index >= nowCharacter.length){
			setNewCharacter( characterArray[Math.floor(
				Math.random() * (characterArray.length-2)
			) + 1]);
			index = -1;
			string = '';
		}

		keyboard.hint( nowCharacter.charAt(
			indicate(index, string.length)
		));

		return index == -1;
	}

	return check;
})();

document.getElementById('inputBar').oninput = function(){

	var string = this.value;
	if (/[^a-y]/.test(string)) {
		this.value = '';
		string = '';
	}

	string && keyboard.press(string.slice(-1));

	if (questCheck(string)) this.value = '';
};

document.getElementById('fontPx').children[1].onchange = function(){
	document.body.style.fontSize = this.value + 'px';
};

document.getElementById('inputBar').focus();
document.getElementById('inputBar').select();
