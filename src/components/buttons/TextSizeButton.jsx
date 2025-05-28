import React from "react";
import useTheme from "../../hooks/useTheme";

const TextSizeButton = () => {
    const { textSize, setTextSize } = useTheme();
    
    const isLarge = textSize === "large";
    
    const handleToggle = () => {
        setTextSize(isLarge ? "normal" : "large");
    };
    
    return (
        <label className="inline-flex items-center cursor-pointer">
            <input
                type="checkbox"
                className="sr-only peer"
                checked={isLarge}
                onChange={handleToggle}
            />
            <div className="relative flex justify-around items-center w-14 h-7 bg-gray-200 peer-focus:outline-none dark:peer-focus:ring-sky-800 rounded-full peer dark:bg-gray-800 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all dark:border-gray-600 peer-checked:bg-pink-700">
                {/* Small text icon */}
                <svg 
                    className={isLarge ? "visible" : "invisible"}
                    width="22" 
                    height="22" 
                    viewBox="0 0 22 22" 
                    fill="none" 
                    xmlns="http://www.w3.org/2000/svg">
                    <text x="3" y="16" fontSize="16" fontWeight="bold" fill="white">A</text>
                </svg>
                
                {/* Large text icon */}
                <svg 
                    className={isLarge ? "invisible" : "visible"}
                    width="22" 
                    height="22" 
                    viewBox="0 0 22 22" 
                    fill="none" 
                    xmlns="http://www.w3.org/2000/svg">
                    <text x="2" y="18" fontSize="20" fontWeight="bold" fill="white">A</text>
                </svg>
            </div>
        </label>
    );
};

export default TextSizeButton;