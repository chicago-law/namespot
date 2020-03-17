<?php

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
