"use client";

const Comments = () => {
  return (
    <div className="mt-6">
      <h3 className="font-semibold mb-3">Comments</h3>
      <div className="space-y-4">
        <div className="border p-3 rounded">
          <p className="font-semibold">Bash Had</p>
          <p className="text-sm text-gray-700">Hi Kyle, do we need to use both useState and useReducer…?</p>
          <button className="text-xs text-blue-600 mt-1">Reply</button>
        </div>
        <div className="border p-3 rounded bg-gray-50 ml-6">
          <p className="font-semibold">Kyle Cook (Tutor)</p>
          <p className="text-sm text-gray-700">You could do it all in useReducer if you wanted…</p>
        </div>
      </div>

      {/* Input */}
      <div className="mt-4 flex gap-2">
        <input
          type="text"
          placeholder="Add a comment"
          className="flex-1 border rounded px-3 py-2 text-sm"
        />
        <button className="px-4 py-2 bg-black text-white rounded">Post</button>
      </div>
    </div>
  );
}

export default Comments;
