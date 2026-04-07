import {useState, useEffect} from 'react'
import { IoMdArrowDropdown } from "react-icons/io";


const Categories = ({categories,activeCategory , setActiveCategory}) => {
    return (
        <div className="relative border w-full max-w-xs">
            <select
                value={activeCategory}
                onChange={(e) => { setActiveCategory(e.target.value) }}
                className="w-full px-2 md:px-5 text-gray-400 py-1 md:py-4 text-[14px] md:text-lg border border-gray-300 rounded-md md:rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white shadow-sm cursor-pointer appearance-none"
            >
              {
                categories.map((category) => {
                    return (

                        <option key={category} value={category}>{category === "All"? "All Category": category.charAt(0).toUpperCase() + category.slice(1)}</option>
                    )
                })
              }
            </select>

            {/* Custom dropdown arrow */}
            <div className="pointer-events-none absolute right-2 md:right-5 top-1/2 -translate-y-1/2 text-gray-400">
                <IoMdArrowDropdown className='size-8' />
            </div>
        </div>
    );
}

export default Categories
