<?php
/**
 * Application base path (works from any subfolder)
 */

define('PROJECT_ROOT', dirname(__DIR__));

function appBasePath(): string
{
    static $base = null;
    if ($base !== null) {
        return $base;
    }

    $docRoot = realpath($_SERVER['DOCUMENT_ROOT'] ?? '') ?: '';
    $project = realpath(PROJECT_ROOT) ?: '';

    if ($docRoot !== '' && $project !== '' && str_starts_with($project, $docRoot)) {
        $base = str_replace('\\', '/', substr($project, strlen($docRoot)));
        return $base === '' ? '' : $base;
    }

    // Fallback when document root detection fails (e.g. php -S)
    $script = str_replace('\\', '/', $_SERVER['SCRIPT_NAME'] ?? '');
    if (preg_match('#^(/.+?)/(auth|api)/#', $script, $m)) {
        $base = $m[1];
        return $base;
    }
    $dir = dirname($script);
    return ($dir === '/' || $dir === '.') ? '' : $dir;
}

function url(string $path = ''): string
{
    $base = appBasePath();
    $path = ltrim($path, '/');
    if ($path === '') {
        return $base ?: '/';
    }
    return ($base ?: '') . '/' . $path;
}

function asset(string $path): string
{
    return url('assets/' . ltrim($path, '/'));
}

function assetVersion(string $path): string
{
    $file = PROJECT_ROOT . '/assets/' . ltrim($path, '/');
    $version = is_file($file) ? (string) filemtime($file) : (string) time();

    return asset($path) . '?v=' . $version;
}
