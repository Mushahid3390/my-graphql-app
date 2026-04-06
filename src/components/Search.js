import { useState, useEffect } from 'react'
import { SlMagnifier } from "react-icons/sl";
import { RxCross1 } from "react-icons/rx";

const Search = ({onSearch}) => {
    const [query, setQuery] = useState('');
    const [debouncedQuery, setDebouncedQuery] = useState('');

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedQuery(query);
        }, 300);

        return () => clearTimeout(timer);
    }, [query]);

    useEffect(() => {
        if (debouncedQuery.trim() !== '') {
            onSearch(debouncedQuery.trim());
        } else {
            onSearch(''); 
        }
    }, [debouncedQuery, onSearch]);

    return (
        <div className="relative w-full max-w-xl mx-auto mb-10">
            <div className="relative">
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search products... "
                    className="w-full px-6 py-4 text-gray-700 text-lg border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm pl-14"
                />
                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400">
                    <SlMagnifier className='size-5.5' />
                </div>
            </div>
            {query && (
                <button
                    onClick={() => setQuery('')}
                    className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                    <RxCross1 className='size-5.5'/>
                </button>
            )}
        </div>
    );
}

export default Search
