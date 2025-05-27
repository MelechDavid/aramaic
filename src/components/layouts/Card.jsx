import { useState, useEffect } from "react";
import useFetchData from "../../hooks/useFetchData";
import { useAuth } from "../../context/AuthContext";

import Header from "./Header";
import NotFound from "./NotFound";
import SearchForm from "./SearchForm";
import ShowContent from "./ShowContent";
import Loader from "../ui/Loader";
import FavoritesList from "../favorites/FavoritesList";

const Card = () => {
    const [currentView, setCurrentView] = useState('search'); // 'search' or 'favorites'
    const { isAuthenticated } = useAuth();
    
    const { 
        data, 
        loading: fetchLoading, 
        error, 
        searchTerm, 
        setSearchTerm,
        hasMore,
        loadMore,
        totalResults,
        expandedEntries,
        toggleEntry
    } = useFetchData();

    // Add this effect to prevent scrollbar layout shifts
    useEffect(() => {
        // Force a scrollbar to always be present
        document.documentElement.style.overflowY = 'scroll';
        
        // Clean up when component unmounts
        return () => {
            document.documentElement.style.overflowY = '';
        };
    }, []);    return (
        <section className="h-fit w-full md:w-11/12 lg:w-8/12 xl:w-7/12 my-8 lg:my-10 lg:px-5">
            <div className="block">
                <Header />
                
                {/* Navigation tabs */}
                <div className="flex border-b border-gray-200 dark:border-gray-700 mb-4">
                    <button
                        onClick={() => setCurrentView('search')}
                        className={`px-4 py-2 font-medium text-sm ${
                            currentView === 'search'
                                ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400'
                                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                        }`}
                    >
                        Dictionary Search
                    </button>
                    {isAuthenticated && (
                        <button
                            onClick={() => setCurrentView('favorites')}
                            className={`px-4 py-2 font-medium text-sm ${
                                currentView === 'favorites'
                                    ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400'
                                    : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                            }`}
                        >
                            My Favorites
                        </button>
                    )}
                </div>
                
                {currentView === 'search' ? (
                    <>
                        <SearchForm
                            searchTerm={searchTerm}
                            setSearchTerm={setSearchTerm}
                            placeholder="Enter Aramaic or English word..."
                        />
                        
                        {!searchTerm ? (
                            <div className="my-16 text-center text-black dark:text-gray-400">
                                <p>Type Aramaic or English words to search the Jastrow Talmud Dictionary</p>
                            </div>
                        ) : fetchLoading && !data.length ? (
                            <Loader />
                        ) : data && data.length > 0 ? (
                            <ShowContent 
                                data={data} 
                                hasMore={hasMore}
                                loading={fetchLoading}
                                onLoadMore={loadMore}
                                totalResults={totalResults}
                                expandedEntries={expandedEntries}
                                toggleEntry={toggleEntry}
                            />
                        ) : searchTerm && !fetchLoading ? (
                            <NotFound />
                        ) : null}
                        
                        {error && (
                            <div className="text-center text-red-500 my-4 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                                {error}
                            </div>
                        )}
                    </>
                ) : (
                    <FavoritesList />
                )}
            </div>
        </section>
    );
};

export default Card;
