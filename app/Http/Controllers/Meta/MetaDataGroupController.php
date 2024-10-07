<?php

namespace App\Http\Controllers\Meta;

use App\Http\Controllers\Controller;
use App\Http\Requests\Meta\MetaDataGroupFormRequest;
use App\Libs\ExceptionMessage;
use App\Models\Meta\MetaGroup;
use App\Models\Meta\MetaGroupItem;
use Exception;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Database\Eloquent\Builder;
use Inertia\Inertia;
use Inertia\Response;

class MetaDataGroupController extends Controller
{
    /**
     * @return string[]
     */
    public static function middleware(): array
    {
        return ['auth'];
    }

    public function index(Request $request): Response
    {
        $groups = MetaGroup::when($request->filled(key: 'search'), function (Builder $query) use ($request) {
            $query->where('name', operator: 'like', value: '%' . $request->input(key: 'search') . '%')
                ->orWhereHas('items.metaData', function (Builder $query) use ($request) {
                    return $query->where('name', 'like', "%$request->search%");
                });
        })
            ->withCount('items')
            ->paginate(20)
            ->withQueryString();

        return Inertia::render('MetaGroup/MetaGroupIndex', [
            'groups' => $groups,
            'type' => $request->type,
            'subtype' => $request->subtype,
            'oldValues' => $request->all()
        ]);
    }

    public function create(Request $request): Response
    {

        return Inertia::render(
            'MetaGroup/MetaGroupCreate',
            ['type' => $request->type, 'subtype' => $request->subtype]
        );
    }

    public function edit(MetaGroup $metaDataGroup): Response
    {
        return Inertia::render('MetaGroup/MetaGroupEdit', [
            'group' => $metaDataGroup,
        ]);
    }

    public function store(MetaDataGroupFormRequest $request): RedirectResponse
    {
        try {
            $record = MetaGroup::create($request->all());
        } catch (Exception $exception) {
            return back()->with([
                'error' => ExceptionMessage::getMessage($exception),
            ]);
        }

        return redirect()
            ->route('meta-data-group.index')
            ->with([
                'message' => "Meta data group: $record->name created successfully",
            ]);
    }

    public function update(MetaGroup $metaDataGroup, MetaDataGroupFormRequest $request): RedirectResponse
    {
        try {
            $metaDataGroup->update($request->all());
        } catch (Exception $exception) {
            return back()->with([
                'error' => ExceptionMessage::getMessage($exception),
            ]);
        }

        return redirect()
            ->route('meta-data-group.index')
            ->with([
                'message' => "Meta data group: $metaDataGroup->name updated successfully",
            ]);
    }

    public function show(MetaGroup $metaDataGroup, Request $request): Response
    {

        $items = MetaGroupItem::where('meta_group_id', $metaDataGroup->id)
            ->with('metaData:id,name')
            ->with('metaData.metaStructure:id,structure_name')
            ->paginate(20)
            ->withQueryString();

        return Inertia::render('MetaGroup/MetaGroupShow', [
            'metaDataGroup' => $metaDataGroup,
            'groupItems' => $items,
            'type' => $request->type,
            'subtype' => $request->subtype
        ]);
    }
}
