import React, { useContext } from 'react';
import { ModalContext } from '../../Service/ModelContext';

const categories = [
  'All', 'Music', 'Gaming', 'News', 'Live', 'Sports', 'Education', 'Podcasts', 'Fashion', 'Movies'
];

const CategoryBar = ({ selectedCategory, onCategoryClick}) => {
  const {showSidebar} = useContext(ModalContext);
  return (
    // Category bar
    <div className={`dark:text-white bg-white dark:bg-black flex gap-3 px-5 py-2 overflow-x-auto whitespace-nowrap fixed w-full right-0  xs:top-24 top-20 z-40 ${showSidebar ? 'xl:left-80' : 'md:left-24'}`}>
      {categories.map((category, index) => (
        <button
          key={index}
          className={`px-4 py-1 rounded-full text-xl transition-colors duration-200 ${
            selectedCategory === category
              ? 'bg-black text-white'
              : 'bg-gray-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 hover:bg-gray-300'
          }`}
          onClick={() => onCategoryClick(category)}
        >
          {category}
        </button>
      ))}
    </div>
  );
};

export default CategoryBar;
