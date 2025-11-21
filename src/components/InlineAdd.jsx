import React, { useState } from 'react';
import { FaPlus, FaTimes } from 'react-icons/fa';

const InlineAdd = ({ onAdd, placeholder = "Add new item..." }) => {
    const [isAdding, setIsAdding] = useState(false);
    const [text, setText] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (text.trim()) {
            onAdd(text);
            setText('');
            setIsAdding(false);
        }
    };

    if (!isAdding) {
        return (
            <button
                onClick={() => setIsAdding(true)}
                className="flex items-center gap-2 text-sm text-accent-color hover:text-accent-hover mt-2"
            >
                <FaPlus size={10} /> {placeholder}
            </button>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="mt-2 flex gap-2 items-center">
            <input
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder={placeholder}
                autoFocus
                className="text-sm py-1 px-2"
            />
            <button type="submit" className="btn btn-primary py-1 px-2 text-xs">Add</button>
            <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="text-muted hover:text-text-primary"
            >
                <FaTimes />
            </button>
        </form>
    );
};

export default InlineAdd;
