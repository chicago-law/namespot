<?php

/**
 * Does just what the name says. Nifty. Credit: user Anne on Stack Overflow
 */
function UniqueRandomNumbersWithinRange($min, $max, $quantity) {
    $numbers = range($min, $max);
    shuffle($numbers);
    return array_slice($numbers, 0, $quantity);
}

?>