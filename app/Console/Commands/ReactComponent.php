<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Contracts\Console\PromptsForMissingInput;
use Illuminate\Support\Facades\File;

class ReactComponent extends Command implements PromptsForMissingInput
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:react-component {directory} {component}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Command description';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $directory = $this->argument('directory');
        $component = $this->argument('component');

        $currentWorkingDirectory = getcwd();
        $this->line('project path: '.$currentWorkingDirectory);

        $relativeDirectory = implode(
            '/',
            array_map(fn (string $name) => ucfirst($name), explode('\\', $directory))
        );

        $directoryPath = $currentWorkingDirectory.'/resources/js/Components/'
            .$relativeDirectory.'/';

        $this->line('Creating file on: '.$directoryPath);

        if (! File::exists($directoryPath)) {
            File::makeDirectory($directoryPath, 0755, true);
        }

        if (! File::exists($relativeDirectory.ucfirst($component).'.tsx')) {
            $formRequestContent = File::get($currentWorkingDirectory.'/app/Console/TemplateGenerator/stubs/react-component.txt');

            $formRequestContent = str_replace('#[Component]', ucfirst($component), $formRequestContent);
            File::put($directoryPath.ucfirst($component).'.tsx', $formRequestContent);
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
            'directory' => 'directory to place react component in? (eg: DataLoader\Query)',
            'action' => 'React component name?',
        ];
    }
}
