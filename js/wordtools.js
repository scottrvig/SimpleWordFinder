var words = [];
var alphabet = 'abcdefghijklmnopqrstuvwxyz'.split('');

function loadWords() {
    // Load the words from resources, if it is not already cached.
    if (words.length > 0) { return words; }

    $.get("resources/words.txt", function(data) {
		words = data.split('\n');
		words.pop(); // Last element is empty string
	}, 'text');
}


function getHooks(word) {
    // Return all elgible words that are +1 letter to the candidate word.
    var hooks = [];
	var candidates = [];
    var allWords = loadWords();

    for (var i in alphabet) {
		candidates.push(alphabet[i].concat(word));
		candidates.push(word.concat(alphabet[i]));
	}
	
	for (var i in candidates) {
		if (jQuery.inArray(candidates[i], allWords) > -1)
			hooks.push(candidates[i]);
	}

    return hooks;
}


function getWords(input) {
    // Return all words that can be created from the letters
	// of the provided string. '?' is a wildcard character.
    var words = [];
    var allWords = loadWords();

	// Only need words that are size of the input or less.
    candidateWords = allWords.filter(function (element) {
        return (element.length <= input.length);
    });

    for (var i in candidateWords) {
        var candidateWord = candidateWords[i];
        var candidateLetters = candidateWord.split('');
        var inputLetters = input.split('');
        if (isComposeable(candidateLetters, inputLetters)){
            words.push(candidateWord);
        }
    }
    
    return words;
}


function isComposeable(candidateLetters, inputLetters) {
    // Return true if all of the candidate word letters are
	// contained in the input letters (plus wildcards).
    for (var i = 0; i < candidateLetters.length; i++) {
		letter = candidateLetters[i];

        index = inputLetters.indexOf(candidateLetters[i]);
        if (index > -1) {
			// Exact letter match, remove from input list
            inputLetters.splice(index, 1);
        } else {
			// No exact letter match, check for wildcards
            wildCardIndex = inputLetters.indexOf('?');
            if (wildCardIndex > -1) {
				// Wildcard match, remove from input list
				inputLetters.splice(wildCardIndex, 1);
			} else {
				// No wildcards present, word cannot be solved
				return false;
			}
		}
	}

    return true; 
}


function getQWithoutU() {
    // Return a list of Q without U words
    var allWords = loadWords();

    return allWords.filter(function (element) {
		var qIndex = element.indexOf('q');
		if (qIndex == -1)
			return false;

		if (qIndex == (element.length - 1)) {
			// q is the last letter
			return true;
		} else {
			var nextChar = element.charAt(qIndex + 1);
			return (nextChar != 'u');
		}
    });
}


function get2LetterWords() {
    // Return a list of 2 letter words
	var allWords = loadWords();
	return allWords.filter(function (element) {
		   return (element.length == 2);
	});
}


function checkInput(input, allowWildcards) {
	// Validate that the input string is valid for generating results.
	var inputCharacters = input.split('');
	var validCharacters = alphabet.slice();

	if (allowWildcards) {
		validCharacters.push('?');
		if (tooManyQuestionMarks(inputCharacters)) {
			showError('Only a max of 3 wildcards (?) are allowed.')
			return false;
		}
	}
	
	for (var i in inputCharacters) {
		if (jQuery.inArray(inputCharacters[i], validCharacters) == -1) {
			if (allowWildcards)
				showError('Only letters and wildcards (?) are allowed for word search.') 
			else
				showError('Only letters are allowed for hooks.')

			return false;
		}
	}
	
	return true;
}


function tooManyQuestionMarks(inputCharacters) {
	// Return true if there are more than 3 question marks in the input
	var count = 0;
	
	for (var i = 0; i < inputCharacters.length; i++) {
		if (inputCharacters[i] == '?')
			count++;
	}
	
	return (count > 3);
}


function fillTable(result, inputSize) {
	// Fill the table columns with the result word array
	// If the candidate word is the same size as inputSize, emphasize the word
	var NUM_COLUMNS = 5;

	result.sort(function(a, b) {
		return b.length - a.length ||
			   a.localeCompare(b);
	});

	$("#result-table tr").remove();
	if (result.length == 0) {
		row = '<tr><td><i><b>No results were found</b></i></td></tr>'
		$("#result-table").append(row);
		return;
	}
	
	var rows = [];
	while (result.length)
		rows.push(result.splice(0, NUM_COLUMNS));

	for (var i = 0; i < rows.length; i++) {
		var row = '<tr>';
		for (var j =0; j < NUM_COLUMNS; j++) {
			row += '<td width="20%">';
			var elem = rows[i][j];
			if (!elem) 
				elem = '';
			
			if (elem.length == inputSize)
				elem = '<b><i>' + elem + '</i></b>';
			row += elem;
			row += '</td>';
		}
		row += '</tr>';
		$("#result-table").append(row);
	}
}


function showError(err) {
	// Show the error dialog for invalid input
	$.alert({
		title: '<b>Bad Input</b>',
		type: 'blue',
		theme: 'material',
		typeAnimated: true,
		useBootstrap: false,
		boxWidth: '30%',
		content: err,
		buttons: {
			okay: {
				text: 'Okay',
				btnClass: 'go-button',
			}
		},
	});
}
