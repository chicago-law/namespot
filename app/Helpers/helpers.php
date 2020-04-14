<?php

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
 * Safely ask for something you expect to be a string from an object,
 * always get back a string.
 */
function safeString($haystack, $needle): string {
  if (property_exists($haystack, $needle)) {
    $item = $haystack->{$needle};
    if (is_string($item)) return $item;
  }
  return '';
}

/**
 * Safely get a string if it exists and is a string, or get null.
 */
function safeStringOrNull($haystack, $needle) {
  $value = safeString($haystack, $needle);
  return $value ? $value : null;
}

/**
 * Coerce to a string except for preserving nulls.
 */
function stringOrNull($value) {
  if (is_null($value)) return null;
  return (string) $value;
}

/**
 * Coerce to an integer except for preserving nulls.
 */
function intOrNull($value) {
  if (is_null($value)) return null;
  return (int) $value;
}

/**
 * Safely ask for something you expect to be an array from an object,
 * always get back an array.
 */
function safeArray($haystack, $needle): array {
  if (property_exists($haystack, $needle)) {
    $item = $haystack->{$needle};
    return is_array($item) ? $item : [$item];
  } else if (method_exists($haystack, $needle)) {
    $item = $haystack->$needle();
    return is_array($item) ? $item : [$item];
  }
  return [];
}

/**
 * If a name string is all caps or all lowercase, return back a version
 * with the first letter of each word capitalized.
 */
function nameCasing($name): string {
  if (strtoupper($name) === $name || strtolower($name) === $name) {
    return ucwords(strtolower($name));
  } else {
    return $name;
  }
}
