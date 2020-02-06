<?php
require('./vendor/autoload.php');

$options = new ZipStream\Option\Archive();
$options->setSendHttpHeaders(true);
$options->setZeroHeader(true);

// Test: $indexes = ['1', '2'];

$indexes = [];
$byIndex = [];
$database = json_decode(file_get_contents('./releases_id.json'));
foreach($database as $item) {
    $indexes[] = $item->id;
    $byIndex[$item->id] = $item->url;
}

if (!is_array($_GET['i'] ?? false)) {
    http_response_code(400);
    echo '400';
    return;
}

foreach ($_GET['i'] as $index) {
    if (!in_array($index, $indexes)) {
        http_response_code(404);
        echo '404';
        return;
    }
}

header('Content-Disposition: attachment; filename="mareebass.zip"');
$zip = new ZipStream\ZipStream('mareebass.zip', $options);

foreach ($_GET['i'] as $index) {
    $zipPath = __DIR__.'/../'.$byIndex[$index];

    if (!file_exists($zipPath)) {
        http_response_code(500);
        echo 'File not found' . $zipPath;
        return;
    }

    $zip->addFileFromPath(basename($zipPath), $zipPath);
}

$zip->finish();
