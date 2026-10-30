// ===== Element references =====
const noteTitleInput = document.getElementById("noteTitle");
const noteContentInput = document.getElementById("noteContent");
const addNoteButton = document.getElementById("addNoteButton");
const clearNotesButton = document.getElementById("clearNotesButton");
const statusMsg = document.getElementById("statusMsg");
const notesList = document.getElementById("notesList");

const loadUsersButton = document.getElementById("loadUsersButton");
const apiStatus = document.getElementById("apiStatus");
const userList = document.getElementById("userList");

const STORAGE_KEY = "myNotes";
const API_URL = "https://jsonplaceholder.typicode.com/users";

// ===== Storage helpers =====
function getNotes() {
    const savedData = localStorage.getItem(STORAGE_KEY);
    return savedData ? JSON.parse(savedData) : [];
}

function saveNotes(notes) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
}

// ===== Render saved notes on the page =====
function renderNotes() {
    const notes = getNotes();
    notesList.innerHTML = "";

    if (notes.length === 0) {
        notesList.innerHTML = "<ion-item>No notes saved yet.</ion-item>";
        return;
    }

    notes.forEach(function (note, index) {
        const item = document.createElement("ion-item");

        const label = document.createElement("ion-label");
        label.setAttribute("text-wrap", "true");
        label.innerHTML =
            "<h2>" + note.title + "</h2>" +
            "<p><strong>Content:</strong> " + note.content + "</p>";

        const deleteButton = document.createElement("ion-button");
        deleteButton.setAttribute("slot", "end");
        deleteButton.setAttribute("color", "danger");
        deleteButton.setAttribute("fill", "clear");
        deleteButton.textContent = "Delete";
        deleteButton.addEventListener("click", function () {
            removeNote(index);
        });

        item.appendChild(label);
        item.appendChild(deleteButton);
        notesList.appendChild(item);
    });
}

// ===== Add a note =====
function addNote() {
    const title = noteTitleInput.value.trim();
    const content = noteContentInput.value.trim();

    if (title === "" || content === "") {
        statusMsg.innerHTML = "<strong>Status:</strong> Please fill in both the title and the note content.";
        return;
    }

    const newNote = { title: title, content: content };
    const notes = getNotes();
    notes.push(newNote);
    saveNotes(notes);

    statusMsg.innerHTML = "<strong>Status:</strong> Note saved successfully.";
    noteTitleInput.value = "";
    noteContentInput.value = "";

    renderNotes();
}

// ===== Remove a single note =====
function removeNote(index) {
    const notes = getNotes();
    notes.splice(index, 1);
    saveNotes(notes);
    statusMsg.innerHTML = "<strong>Status:</strong> Note removed.";
    renderNotes();
}

// ===== Clear all notes =====
function clearAllNotes() {
    localStorage.removeItem(STORAGE_KEY);
    statusMsg.innerHTML = "<strong>Status:</strong> All notes cleared.";
    renderNotes();
}

// ===== Load users from the REST API =====
async function loadUsers() {
    userList.innerHTML = "";
    apiStatus.textContent = "Loading users from the server...";

    try {
        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error("HTTP error: " + response.status);
        }

        const data = await response.json();
        apiStatus.textContent = "Successfully fetched " + data.length + " users from the API.";

        data.forEach(function (user) {
            const item = document.createElement("ion-item");

            const label = document.createElement("ion-label");
            label.setAttribute("text-wrap", "true");
            label.innerHTML =
                "<h2>" + user.name + "</h2>" +
                "<p><strong>Username:</strong> " + user.username + "</p>" +
                "<p><strong>Email:</strong> " + user.email + "</p>" +
                "<p><strong>City:</strong> " + user.address.city + "</p>";

            item.appendChild(label);
            userList.appendChild(item);
        });
    } catch (error) {
        apiStatus.innerHTML = "<strong>Status:</strong> Failed to load users - " + error.message;
        console.error("Fetch failed:", error);
    }
}

// ===== Event listeners =====
addNoteButton.addEventListener("click", addNote);
clearNotesButton.addEventListener("click", clearAllNotes);
loadUsersButton.addEventListener("click", loadUsers);

// ===== Initial render on page load =====
renderNotes();