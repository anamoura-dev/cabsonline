<?php
/*
    Student Name: Ana Carolina Alves de Moura
    Student ID: 23201111
    File: bootstrap.php
    Description: Shared bootstrap file that loads database credentials from the
    .env file and provides the cabsonline_pdo() function used by booking.php
    and admin.php to connect to the MySQL database.
*/
declare(strict_types=1);

// Reads key=value pairs from the .env file and loads them into the environment
function cabsonline_load_env(string $rootDir): void
{
    $path = $rootDir . DIRECTORY_SEPARATOR . '.env';
    if (!is_readable($path)) {
        return;
    }

    $lines = file($path, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    if ($lines === false) {
        return;
    }

    foreach ($lines as $line) {
        $line = trim($line);
        if ($line === '' || strpos($line, '#') === 0) {
            continue;
        }

        $eq = strpos($line, '=');
        if ($eq === false) {
            continue;
        }

        $name = trim(substr($line, 0, $eq));
        $value = trim(substr($line, $eq + 1));
        if ($name === '') {
            continue;
        }

        if (
            strlen($value) >= 2
            && (($value[0] === '"' && substr($value, -1) === '"')
                || ($value[0] === "'" && substr($value, -1) === "'"))
        ) {
            $value = substr($value, 1, -1);
        }

        if (getenv($name) === false) {
            putenv("{$name}={$value}");
            $_ENV[$name] = $value;
        }
    }
}

/**
 * @throws PDOException se a config estiver incompleta ou a ligação falhar
 */
function cabsonline_pdo(): PDO
{
    $root = dirname(__DIR__);
    cabsonline_load_env($root);

    $host = getenv('DB_HOST') ?: '';
    $dbname = getenv('DB_NAME') ?: '';
    $username = getenv('DB_USER') ?: '';
    $password = getenv('DB_PASSWORD');
    if ($password === false) {
        $password = '';
    }
    $charset = getenv('DB_CHARSET') ?: 'utf8';

    if ($host === '' || $dbname === '' || $username === '') {
        throw new PDOException('Database configuration incomplete.');
    }

    $dsn = "mysql:host={$host};dbname={$dbname};charset={$charset}";
    $pdo = new PDO($dsn, $username, $password); 
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    return $pdo;
}
