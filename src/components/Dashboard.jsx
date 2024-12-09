import React, { useState, useEffect } from "react";
import {
  addDoc,
  collection,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { firestore, auth } from "../firebase";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { FaTrashAlt, FaEdit } from "react-icons/fa"; // Importing FontAwesome icons

const Dashboard = () => {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [notes, setNotes] = useState([]);
  const [firstName, setFirstName] = useState("");
  const [editNoteId, setEditNoteId] = useState(null); // Track the note being edited
  const navigate = useNavigate();

  useEffect(() => {
    if (auth.currentUser) {
      // Extract the first name from the email
      const email = auth.currentUser.email;
      const extractedFirstName = email.split("@")[0];
      setFirstName(
        extractedFirstName.charAt(0).toUpperCase() + extractedFirstName.slice(1)
      );
    }
  }, []);

  // Fetch notes for the currently authenticated user
  const fetchNotes = async () => {
    if (auth.currentUser) {
      const notesCollection = collection(firestore, "notes");
      const notesSnapshot = await getDocs(notesCollection);
      const notesList = notesSnapshot.docs
        .filter((doc) => doc.data().userId === auth.currentUser.uid) // Filter notes by userId
        .map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
      setNotes(notesList);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, [auth.currentUser]);

  // Handle adding or updating a note
  const handleSaveNote = async (e) => {
    e.preventDefault();
    if (title && body) {
      try {
        if (editNoteId) {
          // Update the existing note
          const noteRef = doc(firestore, "notes", editNoteId);
          await updateDoc(noteRef, { title, body });
          setEditNoteId(null); // Reset the edit note ID after updating
        } else {
          // Add a new note
          await addDoc(collection(firestore, "notes"), {
            title,
            body,
            userId: auth.currentUser.uid, // Associate note with the logged-in user
          });
        }
        setTitle("");
        setBody("");
        fetchNotes();
      } catch (error) {
        console.error("Error saving note:", error);
      }
    }
  };

  // Handle deleting a note
  const handleDeleteNote = async (noteId) => {
    try {
      const noteRef = doc(firestore, "notes", noteId);
      await deleteDoc(noteRef);
      fetchNotes();
    } catch (error) {
      console.error("Error deleting note:", error);
    }
  };

  // Handle user sign-out
  const handleSignOut = async () => {
    await signOut(auth);
    navigate("/login");
  };

  // Handle editing a note
  const handleEditNote = (note) => {
    setTitle(note.title);
    setBody(note.body);
    setEditNoteId(note.id); // Set the note ID being edited
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-indigo-500 to-purple-500 p-4">
      <div className="max-w-3xl mx-auto bg-white p-8 shadow-lg rounded-lg">
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-6">
          Welcome {firstName}
        </h1>
        <form onSubmit={handleSaveNote} className="flex flex-col gap-4 mb-8">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Note Title"
            className="p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Note Body"
            className="p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            type="submit"
            className="p-4 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition duration-300"
          >
            {editNoteId ? "Update Note" : "Add Note"}
          </button>
        </form>
        <div className="space-y-4">
          {notes.map((note) => (
            <div
              key={note.id}
              className="p-6 bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500 text-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
            >
              <h2 className="text-2xl font-bold mb-2">{note.title}</h2>
              <p className="mb-4">{note.body}</p>
              <div className="flex justify-end space-x-4">
                <FaEdit
                  onClick={() => handleEditNote(note)}
                  className="cursor-pointer text-2xl text-blue-300 hover:text-blue-500 transition duration-300"
                />
                <FaTrashAlt
                  onClick={() => handleDeleteNote(note.id)}
                  className="cursor-pointer text-2xl text-red-300 hover:text-red-500 transition duration-300"
                />
              </div>
            </div>
          ))}
        </div>
        <button
          onClick={handleSignOut}
          className="mt-8 w-full py-3 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition duration-300 transform hover:-translate-y-1"
        >
          Sign Out
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
