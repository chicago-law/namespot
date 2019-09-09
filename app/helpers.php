<?php

/**
 * Uncomment to allow CORS.
 * For use when developing locally off-campus with cVPN.
 */
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, PUT, POST, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: x-csrf-token, x-requested-with, content-type');

/**
 * Does just what the name says. Nifty. Credit: user Anne on Stack Overflow
 */
function UniqueRandomNumbersWithinRange($min, $max, $quantity) {
  $numbers = range($min, $max);
  shuffle($numbers);
  return array_slice($numbers, 0, $quantity);
}

/**
 * Pass in the first half of an academic year
 * returns an array of term codes
 * to get specific quarter: [0] is autumn, [1] winter, [2] spring
 */
function getTermCodesFromYear($year) {
  $year1 = $year;
  $year2 = (int) $year + 1;
  $termCodes[] = '2' . substr($year1, -2) . '8'; // Autumn
  $termCodes[] = '2' . substr($year2, -2) . '2'; // Winter
  $termCodes[] = '2' . substr($year2, -2) . '4'; // Spring
  return $termCodes;
}

/**
 * Turn AIS term code into Canvas quarter number
 *          AIS     Canvas
 * winter   2       1
 * spring   4       2
 * summer   ?       3
 * autumn   8       4
*/
function quarterFromTermCode($term_code) {
  switch (substr($term_code, 3, 4)) {
      case '2':
          return '01';
      case '4':
          return '02';
      case '8':
          return '04';
      default:
          return 'Error getting quarter from term code';
  }
}

/**
 * Safely ask for something you expect to be a string from an object.
 * Get back null if it's not a string or doesn't exist.
 */
function safeString($haystack, $needle) {
  if (property_exists($haystack, $needle)) {
    $item = $haystack->{$needle};
    if (is_string($item)) return $item;
  }
  return null;
}

?>