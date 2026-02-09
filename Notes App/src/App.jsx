import React, { useState, useEffect } from 'react';
import './App.css';

function NotesApp() {
    // ==========================================
    // STATE MANAGEMENT
    // ==========================================
    const [notes, setNotes] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editingNote, setEditingNote] = useState(null);
    const [currentView, setCurrentView] = useState('all'); // all, pinned, archived, trash
    const [searchQuery, setSearchQuery] = useState('');
    const [filterTag, setFilterTag] = useState('all');

    // Form State
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        tags: []
    });

    const [tagInput, setTagInput] = useState('');

    // ==========================================
    // LOAD NOTES FROM LOCALSTORAGE
    // ==========================================
    useEffect(() => {
        const savedNotes = localStorage.getItem('reactNotesApp');
        if (savedNotes) {
            setNotes(JSON.parse(savedNotes));
        }
    }, []);

    // ==========================================
    // SAVE NOTES TO LOCALSTORAGE
    // ==========================================
    useEffect(() => {
        if (notes.length > 0 || localStorage.getItem('reactNotesApp')) {
            localStorage.setItem('reactNotesApp', JSON.stringify(notes));
        }
    }, [notes]);

    // ==========================================
    // UTILITY FUNCTIONS
    // ==========================================
    const generateId = () => Date.now().toString();

    const getAllTags = () => {
        const tags = new Set();
        notes.forEach(note => {
            if (note.tags) {
                note.tags.forEach(tag => tags.add(tag));
            }
        });
        return Array.from(tags);
    };

    // ==========================================
    // NOTE OPERATIONS
    // ==========================================
    const addNote = () => {
        if (formData.title.trim() === '') {
            alert('Please enter a note title');
            return;
        }

        const newNote = {
            id: generateId(),
            ...formData,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            isPinned: false,
            isArchived: false,
            isDeleted: false
        };

        setNotes([newNote, ...notes]);
        resetForm();
        setShowModal(false);
    };

    const updateNote = () => {
        if (formData.title.trim() === '') {
            alert('Please enter a note title');
            return;
        }

        setNotes(notes.map(note => 
            note.id === editingNote.id 
                ? { ...note, ...formData, updatedAt: new Date().toISOString() }
                : note
        ));

        resetForm();
        setShowModal(false);
        setEditingNote(null);
    };

    const deleteNote = (id) => {
        if (window.confirm('Are you sure you want to delete this note?')) {
            setNotes(notes.filter(note => note.id !== id));
        }
    };

    const togglePin = (id) => {
        setNotes(notes.map(note =>
            note.id === id ? { ...note, isPinned: !note.isPinned } : note
        ));
    };

    const toggleArchive = (id) => {
        setNotes(notes.map(note =>
            note.id === id ? { ...note, isArchived: !note.isArchived } : note
        ));
    };

    const moveToTrash = (id) => {
        setNotes(notes.map(note =>
            note.id === id ? { ...note, isDeleted: true } : note
        ));
    };

    const restoreFromTrash = (id) => {
        setNotes(notes.map(note =>
            note.id === id ? { ...note, isDeleted: false } : note
        ));
    };

    const permanentlyDelete = (id) => {
        if (window.confirm('Permanently delete this note? This cannot be undone.')) {
            setNotes(notes.filter(note => note.id !== id));
        }
    };

    const emptyTrash = () => {
        if (window.confirm('Empty trash? All deleted notes will be permanently removed.')) {
            setNotes(notes.filter(note => !note.isDeleted));
        }
    };

    // ==========================================
    // FORM HANDLERS
    // ==========================================
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleAddTag = () => {
        if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
            setFormData({ ...formData, tags: [...formData.tags, tagInput.trim()] });
            setTagInput('');
        }
    };

    const handleRemoveTag = (tagToRemove) => {
        setFormData({ ...formData, tags: formData.tags.filter(tag => tag !== tagToRemove) });
    };

    const resetForm = () => {
        setFormData({ title: '', description: '', tags: [] });
        setTagInput('');
    };

    const openEditModal = (note) => {
        setEditingNote(note);
        setFormData({
            title: note.title,
            description: note.description,
            tags: note.tags || []
        });
        setShowModal(true);
    };

    const openAddModal = () => {
        resetForm();
        setEditingNote(null);
        setShowModal(true);
    };

    // ==========================================
    // FILTER NOTES
    // ==========================================
    const getFilteredNotes = () => {
        let filtered = notes;

        // Filter by view
        switch(currentView) {
            case 'pinned':
                filtered = filtered.filter(note => note.isPinned && !note.isDeleted);
                break;
            case 'archived':
                filtered = filtered.filter(note => note.isArchived && !note.isDeleted);
                break;
            case 'trash':
                filtered = filtered.filter(note => note.isDeleted);
                break;
            default:
                filtered = filtered.filter(note => !note.isDeleted && !note.isArchived);
        }

        // Filter by search
        if (searchQuery) {
            filtered = filtered.filter(note =>
                note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                note.description.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        // Filter by tag
        if (filterTag !== 'all') {
            filtered = filtered.filter(note => note.tags && note.tags.includes(filterTag));
        }

        return filtered;
    };

    const filteredNotes = getFilteredNotes();
    const allTags = getAllTags();

    // ==========================================
    // RENDER COMPONENT
    // ==========================================
    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100">
            {/* Header */}
            <header className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <i className="fas fa-sticky-note text-3xl"></i>
                            <h1 className="text-3xl font-bold">Notes App</h1>
                        </div>
                        <button
                            onClick={openAddModal}
                            className="px-6 py-3 bg-white text-indigo-600 rounded-lg font-semibold hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                        >
                            <i className="fas fa-plus mr-2"></i>
                            New Note
                        </button>
                    </div>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Search and Filter Bar */}
                <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 animate-fade-in">
                    <div className="flex flex-col md:flex-row gap-4">
                        {/* Search */}
                        <div className="flex-1">
                            <div className="relative">
                                <i className="fas fa-search absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                                <input
                                    type="text"
                                    placeholder="Search notes..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
                                />
                            </div>
                        </div>

                        {/* Tag Filter */}
                        <div className="md:w-64">
                            <select
                                value={filterTag}
                                onChange={(e) => setFilterTag(e.target.value)}
                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
                            >
                                <option value="all">All Tags</option>
                                {allTags.map(tag => (
                                    <option key={tag} value={tag}>{tag}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* View Tabs */}
                <div className="flex flex-wrap gap-3 mb-8">
                    {[
                        { view: 'all', icon: 'fa-home', label: 'All Notes', count: notes.filter(n => !n.isDeleted && !n.isArchived).length },
                        { view: 'pinned', icon: 'fa-thumbtack', label: 'Pinned', count: notes.filter(n => n.isPinned && !n.isDeleted).length },
                        { view: 'archived', icon: 'fa-archive', label: 'Archived', count: notes.filter(n => n.isArchived && !n.isDeleted).length },
                        { view: 'trash', icon: 'fa-trash', label: 'Trash', count: notes.filter(n => n.isDeleted).length }
                    ].map(tab => (
                        <button
                            key={tab.view}
                            onClick={() => setCurrentView(tab.view)}
                            className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
                                currentView === tab.view
                                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg'
                                    : 'bg-white text-gray-700 hover:shadow-md'
                            }`}
                        >
                            <i className={`fas ${tab.icon} mr-2`}></i>
                            {tab.label}
                            <span className={`ml-2 px-2 py-1 rounded-full text-sm ${
                                currentView === tab.view ? 'bg-white text-indigo-600' : 'bg-gray-100'
                            }`}>
                                {tab.count}
                            </span>
                        </button>
                    ))}
                </div>

                {/* Trash Actions */}
                {currentView === 'trash' && filteredNotes.length > 0 && (
                    <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-lg flex items-center justify-between">
                        <div className="flex items-center">
                            <i className="fas fa-exclamation-triangle text-red-500 mr-3"></i>
                            <span className="text-red-700 font-semibold">Items in trash will be permanently deleted after 30 days</span>
                        </div>
                        <button
                            onClick={emptyTrash}
                            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                        >
                            <i className="fas fa-trash-alt mr-2"></i>
                            Empty Trash
                        </button>
                    </div>
                )}

                {/* Notes Grid */}
                {filteredNotes.length === 0 ? (
                    <div className="bg-white rounded-2xl shadow-lg p-12 text-center animate-fade-in">
                        <i className="fas fa-sticky-note text-6xl text-gray-300 mb-4"></i>
                        <h3 className="text-2xl font-semibold text-gray-600 mb-2">No notes found</h3>
                        <p className="text-gray-400 mb-6">
                            {searchQuery ? 'Try a different search term' : 'Create your first note to get started!'}
                        </p>
                        {!searchQuery && currentView === 'all' && (
                            <button
                                onClick={openAddModal}
                                className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200"
                            >
                                <i className="fas fa-plus mr-2"></i>
                                Create Note
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredNotes.map(note => (
                            <NoteCard
                                key={note.id}
                                note={note}
                                onEdit={openEditModal}
                                onDelete={currentView === 'trash' ? permanentlyDelete : deleteNote}
                                onTogglePin={togglePin}
                                onToggleArchive={toggleArchive}
                                onMoveToTrash={moveToTrash}
                                onRestore={restoreFromTrash}
                                currentView={currentView}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Modal */}
            {showModal && (
                <NoteModal
                    isEditing={!!editingNote}
                    formData={formData}
                    tagInput={tagInput}
                    onInputChange={handleInputChange}
                    onTagInputChange={setTagInput}
                    onAddTag={handleAddTag}
                    onRemoveTag={handleRemoveTag}
                    onSave={editingNote ? updateNote : addNote}
                    onClose={() => {
                        setShowModal(false);
                        setEditingNote(null);
                        resetForm();
                    }}
                />
            )}
        </div>
    );
}

// ==========================================
// NOTE CARD COMPONENT
// ==========================================
function NoteCard({ note, onEdit, onDelete, onTogglePin, onToggleArchive, onMoveToTrash, onRestore, currentView }) {
    return (
        <div className="note-card bg-white rounded-2xl shadow-lg p-6 animate-fade-in">
            {/* Card Header */}
            <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold text-gray-800 flex-1 pr-2">{note.title}</h3>

                {currentView === 'trash' ? (
                    <div className="flex space-x-2">
                        <button
                            onClick={() => onRestore(note.id)}
                            className="text-green-500 hover:text-green-700 transition-colors"
                            title="Restore"
                        >
                            <i className="fas fa-undo"></i>
                        </button>
                        <button
                            onClick={() => onDelete(note.id)}
                            className="text-red-500 hover:text-red-700 transition-colors"
                            title="Delete Permanently"
                        >
                            <i className="fas fa-trash-alt"></i>
                        </button>
                    </div>
                ) : (
                    <div className="flex space-x-2">
                        <button
                            onClick={() => onTogglePin(note.id)}
                            className={`${note.isPinned ? 'text-indigo-600' : 'text-gray-400'} hover:text-indigo-600 transition-colors`}
                            title={note.isPinned ? 'Unpin' : 'Pin'}
                        >
                            <i className="fas fa-thumbtack"></i>
                        </button>
                        <button
                            onClick={() => onEdit(note)}
                            className="text-blue-500 hover:text-blue-700 transition-colors"
                            title="Edit"
                        >
                            <i className="fas fa-edit"></i>
                        </button>
                        <button
                            onClick={() => onToggleArchive(note.id)}
                            className="text-yellow-500 hover:text-yellow-700 transition-colors"
                            title={note.isArchived ? 'Unarchive' : 'Archive'}
                        >
                            <i className="fas fa-archive"></i>
                        </button>
                        <button
                            onClick={() => onMoveToTrash(note.id)}
                            className="text-red-500 hover:text-red-700 transition-colors"
                            title="Move to Trash"
                        >
                            <i className="fas fa-trash"></i>
                        </button>
                    </div>
                )}
            </div>

            {/* Card Body */}
            <p className="text-gray-600 mb-4 line-clamp-3">{note.description}</p>

            {/* Tags */}
            {note.tags && note.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                    {note.tags.map((tag, index) => (
                        <span
                            key={index}
                            className="tag-badge px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium"
                        >
                            #{tag}
                        </span>
                    ))}
                </div>
            )}

            {/* Card Footer */}
            <div className="text-xs text-gray-400 flex justify-between items-center pt-4 border-t border-gray-100">
                <span>
                    <i className="fas fa-clock mr-1"></i>
                    {new Date(note.updatedAt).toLocaleDateString()}
                </span>
                {note.isPinned && (
                    <span className="text-indigo-600 font-semibold">
                        <i className="fas fa-thumbtack mr-1"></i>
                        Pinned
                    </span>
                )}
            </div>
        </div>
    );
}

// ==========================================
// NOTE MODAL COMPONENT
// ==========================================
function NoteModal({ isEditing, formData, tagInput, onInputChange, onTagInputChange, onAddTag, onRemoveTag, onSave, onClose }) {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-fade-in">
                {/* Modal Header */}
                <div className="sticky top-0 bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6 rounded-t-2xl">
                    <div className="flex justify-between items-center">
                        <h2 className="text-2xl font-bold">
                            <i className={`fas ${isEditing ? 'fa-edit' : 'fa-plus'} mr-2`}></i>
                            {isEditing ? 'Edit Note' : 'Create New Note'}
                        </h2>
                        <button
                            onClick={onClose}
                            className="text-white hover:text-gray-200 text-2xl"
                        >
                            <i className="fas fa-times"></i>
                        </button>
                    </div>
                </div>

                {/* Modal Body */}
                <div className="p-6 space-y-6">
                    {/* Title Input */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Title *
                        </label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={onInputChange}
                            placeholder="Enter note title..."
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
                            autoFocus
                        />
                    </div>

                    {/* Description Textarea */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Description
                        </label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={onInputChange}
                            placeholder="Enter note description..."
                            rows="6"
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all resize-none"
                        ></textarea>
                    </div>

                    {/* Tags Input */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Tags
                        </label>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={tagInput}
                                onChange={(e) => onTagInputChange(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), onAddTag())}
                                placeholder="Add a tag..."
                                className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
                            />
                            <button
                                onClick={onAddTag}
                                className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                            >
                                <i className="fas fa-plus"></i>
                            </button>
                        </div>

                        {/* Display Tags */}
                        {formData.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-4">
                                {formData.tags.map((tag, index) => (
                                    <span
                                        key={index}
                                        className="inline-flex items-center px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium"
                                    >
                                        #{tag}
                                        <button
                                            onClick={() => onRemoveTag(tag)}
                                            className="ml-2 text-indigo-500 hover:text-indigo-700"
                                        >
                                            <i className="fas fa-times"></i>
                                        </button>
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Modal Footer */}
                <div className="sticky bottom-0 bg-gray-50 p-6 rounded-b-2xl flex justify-end space-x-3 border-t">
                    <button
                        onClick={onClose}
                        className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-100 transition-all duration-200"
                    >
                        <i className="fas fa-times mr-2"></i>
                        Cancel
                    </button>
                    <button
                        onClick={onSave}
                        className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200"
                    >
                        <i className={`fas ${isEditing ? 'fa-save' : 'fa-plus'} mr-2`}></i>
                        {isEditing ? 'Save Changes' : 'Create Note'}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default NotesApp;
