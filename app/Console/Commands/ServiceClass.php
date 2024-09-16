<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Contracts\Console\PromptsForMissingInput;
use Illuminate\Support\Facades\File;

class ServiceClass extends Command implements PromptsForMissingInput
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:service-class {namespace} {action}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Command description';

    /**
     * Execute the console command.
     */
    public function handle(): void
    {

        $namespace = $this->argument('namespace');
        $action = $this->argument('action');

        $currentWorkingDirectory = getcwd();
        $this->line('project path: '.$currentWorkingDirectory);

        $relativeDirectory = implode(
            '/',
            array_map(fn (string $name) => ucfirst($name), explode('\\', $namespace))
        );

        $directoryPath = $currentWorkingDirectory.'/app/Services/'
            .$relativeDirectory.'/';

        $this->line('Creating file on: '.$directoryPath);

        if (! File::exists($directoryPath)) {
            File::makeDirectory($directoryPath, 0755, true);
        }

        if (! File::exists($relativeDirectory.ucfirst($action).'.php')) {
            $formRequestContent = File::get($currentWorkingDirectory.'/app/Console/TemplateGenerator/stubs/service-class.txt');

            $relativeNamespace =
                implode(
                    '\\',
                    array_map(fn (string $name) => ucfirst($name), explode('\\', $namespace))
                );

            $formRequestContent = str_replace('#[Action]', ucfirst($action), $formRequestContent);
            $formRequestContent = str_replace('#[Namespace]', ucfirst($relativeNamespace), $formRequestContent);
            File::put($directoryPath.ucfirst($action).'.php', $formRequestContent);

        } else {
            $this->line('file already exists');
        }

    }

    /**
     * Prompt for missing input arguments using the returned questions.
     *
     * @return array<string, string>
     */
    protected function promptForMissingArgumentsUsing(): array
    {
        return [
            'namespace' => 'namespace used in files? (eg: DataLoader\Query)',
            'action' => 'classname used in php files?',
        ];
    }
}
