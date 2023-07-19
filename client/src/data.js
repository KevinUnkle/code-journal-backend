let data = {
  entries: [],
  nextEntryId: 1,
};

// window.addEventListener('beforeunload', function (event) {
//   const dataJSON = JSON.stringify(data);
//   localStorage.setItem('code-journal-data', dataJSON);
// });

// const localData = JSON.parse(localStorage.getItem('code-journal-data'));
// if (localData) {
//   data = localData;
// }

export async function readEntries() {
  try {
    const res = await fetch('/api/entries');
    if (!res.ok) {
      throw new Error(`Error reading entries: status ${res.status}`);
    }
    const entries = res.json(res);
    return entries;
  } catch (error) {
    console.log(error.message);
  }
  // return data.entries;
}

export async function addEntry(entry) {
  try {
    console.log(entry);
    const reqConfig = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(entry),
    };
    const res = await fetch('/api/entries', reqConfig);
    if (!res.ok) {
      throw new Error(`Error adding entry: status ${res.status}`);
    }
    const allTodos = await fetch('/api/entries');
    if (!allTodos.ok) {
      throw new Error(`Error reading entries: status ${res.status}`);
    }
    data.entries = res.json(allTodos);
  } catch (error) {
    console.log(error.message);
  }
}

export async function updateEntry(entry) {
  try {
    const reqConfig = {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(entry),
    };
    const res = await fetch(`/api/entries`, reqConfig);
    if (!res.ok) {
      throw new Error(`Error status ${res.status}`);
    }
    const allTodos = await fetch('/api/entries');
    if (!allTodos.ok) {
      throw new Error(`Error reading entries: status ${res.status}`);
    }
    data.entries = res.json(allTodos);
  } catch (error) {
    console.log(error.message);
  }
}

export async function removeEntry(entryId) {
  try {
    const reqConfig = {
      method: 'DELETE',
    };
    const res = await fetch(`/api/entries/${entryId}`, reqConfig);
    if (!res.ok) {
      throw new Error(`Error status ${res.status}`);
    }
    const allTodos = await fetch('/api/entries');
    if (!allTodos.ok) {
      throw new Error(`Error reading entries: status ${res.status}`);
    }
    data.entries = res.json(allTodos);
  } catch (error) {
    console.log(error.message);
  }
}
