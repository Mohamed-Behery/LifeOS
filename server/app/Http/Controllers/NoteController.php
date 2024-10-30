<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Note;

class NoteController extends Controller
{

    public function index()
    {
        return Note::all();
    }

    public function store(Request $request)
    {
        $note = Note::create($request->all());
        return response()->json("Note created successfully", 201);
    }

    public function update(Request $request, Note $note)
    {
        $note->update($request->all());
        return response()->json("Note updated successfully", 200);
    }

    public function destroy(Note $note)
    {
        $note->delete();
        return response()->json("Note deleted successfully", 204);
    }
}
