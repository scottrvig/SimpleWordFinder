<?php
    // Hooks are valid English words that extend the input string by 1 letter.
    // For example, "ajar", "jars", and "jarl" are all valid hooks of "jar".

    $alphabet = explode(",", "a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,x,y,z");

    $input = trim($_GET['q']);
    $words = [];
    $hooks = [];

    for ($i = 0; $i < count($alphabet); $i++) {
        // Build array of all possible hooks
        $hooks[] = $input . $alphabet[$i];
        $hooks[] = $alphabet[$i] . $input;
    }

    if ($file = fopen('../resources/words.txt', 'r')) {
        while (!feof($file)) {
            // Trim newline char
            $line = trim(fgets($file));

            // Only need to check words that are the size of the input + 1
            if (strlen($line) === (strlen($input) + 1)) {
                if (in_array($line, $hooks)) {
                    $words[] = $line;
                }
            }
        }
        fclose($file);
    }

    header('Content-Type: application/json');
    echo json_encode($words);
?>
