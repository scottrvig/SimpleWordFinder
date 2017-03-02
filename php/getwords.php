<?php
    // The words returned by this php script are valid English
    // words that can be composed by the letters input by the user.
    // Wildcard characters (?) are wild and can take the place of a
    // missing input letter of a candidate word.

    function is_composeable($candidates, $inputs) {
        // Return true if the candidate letters are contained in the
        // input letters, accounting for wildcards (?).
        for ($i = 0; $i < count($candidates); $i++) {
            $key = array_search($candidates[$i], $inputs);

            if ($key !== false) {
                // Exact character match, remove from inputs
                unset($inputs[$key]);
            } else {
                // No exact character match, check for wildcards
                $wildcard_key = array_search('?', $inputs);

                if ($wildcard_key !== false) {
                    // Wildcard is present, remove it from inputs
                    unset($inputs[$wildcard_key]);
                } else {
                    // No wildcards and no match, candidate is not composeable
                    return false;
                }
            }
        }
        // All candidate letters are "covered", must be valid
        return true;
    }

    $words = [];
    $input = str_split($_GET['q']);

    if ($file = fopen('../resources/words.txt', 'r')) {
        while (!feof($file)) {
            // Trim newline char
            $line = trim(fgets($file));

            // Only need to check words that are the same size or less
            if (strlen($line) <= count($input)) {
                if (is_composeable(str_split($line), $input)) {
                    $words[] = $line;
                }
            }
        }
        fclose($file);
    }

    header('Content-Type: application/json');
    echo json_encode($words);
?>
