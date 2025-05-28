import SearchButton from "../buttons/SearchButton";

const SearchForm = ({ searchTerm, setSearchTerm, placeholder }) => {
    return (
        <div className="my-8 lg:my-10">
            <label
                htmlFor="searchInput"
                className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">
                Search
            </label>
            <div className="relative">
                <input
                    id="searchInput"
                    type="search"
                    // type="text" is what Scott Soifer recommended
                    value={searchTerm}
                    className="block w-full p-3 px-4 md:p-4 md:px-5 text-lg text-gray-900 outline-none focus:outline-offset-0 focus:outline focus:outline-pink-700 focus:outline-3 rounded-lg bg-gray-100 sm:text-md dark:bg-gray-900 dark:placeholder-gray-400 placeholder-black dark:text-white ease-in-out duration-200 [&::-webkit-search-cancel-button]:appearance-none [&::-ms-clear]:hidden"
                    placeholder={placeholder || "Enter Aramaic or English word..."}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    autoCorrect="off"
                    autoCapitalize="off"
                    autoComplete="off"
                    spellCheck={false}
                />
                {/* Search button */}
                <SearchButton />
            </div>
        </div>
    );
};

export default SearchForm;
