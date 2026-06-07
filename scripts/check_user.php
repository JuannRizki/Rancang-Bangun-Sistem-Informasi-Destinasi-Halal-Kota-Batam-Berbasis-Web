<?php
$autoload = __DIR__ . '/../vendor/autoload.php';
if (!file_exists($autoload)) {
    echo "Missing vendor/autoload.php\n";
    exit(1);
}
require $autoload;
$app = require __DIR__ . '/../bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();
$u = App\Models\User::where('email','debug-user@example.com')->first();
if ($u) {
    echo json_encode(['id'=>$u->id,'name'=>$u->name,'email'=>$u->email]) . PHP_EOL;
} else {
    echo "NOT_FOUND" . PHP_EOL;
}
