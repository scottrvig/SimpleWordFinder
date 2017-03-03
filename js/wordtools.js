var alphabet = 'abcdefghijklmnopqrstuvwxyz'.split('');
var timeoutId = null;


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

    // Clear any existing timers, ensure only one thread is running
    if (timeoutId !== null) {
        clearTimeout(timeoutId);
        timeoutId = null;
    }

    $("#result-table tr").remove();
    if (result.length == 0) {
        row = '<tr><td><i><b>No results were found</b></i></td></tr>'
        $("#result-table").append(row);
        return;
    }

    // Sort by descending size, then alphabetical as tie-break
    result.sort(function(a, b) {
        return b.length - a.length || a.localeCompare(b);
    });

    var rows = [];
    while (result.length)
        rows.push(result.splice(0, NUM_COLUMNS));

    var fillRows = function() {
        var row = rows.shift();
        var rowString = '<tr>';
        for (var i = 0; i < NUM_COLUMNS; i++) {
            rowString += '<td width="20%">';
            var elem = row[i];
            if (!elem)
                elem = '';

            if (elem.length == inputSize)
                elem = '<b><i>' + elem + '</i></b>';
            rowString += elem;
            rowString += '</td>';
        }
        rowString += '</tr>';
        $("#result-table").append(rowString);

        if (rows.length > 0) {
            timeoutId = setTimeout(fillRows, 0);
        }
    }

    fillRows();
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
