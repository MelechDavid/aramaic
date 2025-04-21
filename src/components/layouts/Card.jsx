import { useState, useEffect } from "react";
import useFetchData from "../../hooks/useFetchData";

import Header from "./Header";
import NotFound from "./NotFound";
import SearchForm from "./SearchForm";
import ShowContent from "./ShowContent";
import Loader from "../ui/Loader";

const Card = () => {
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
    }, []);

    return (
        <section className="h-fit w-full md:w-11/12 lg:w-8/12 xl:w-7/12 my-8 lg:my-10 lg:px-5">
            <div className="block">
                <Header />
                
                <SearchForm
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    placeholder="Enter Aramaic or English word..."
                />
                
                {!searchTerm ? (
                    <div className="my-16 text-center text-gray-500 dark:text-gray-400">
                        <p>Type Aramaic or English words to search the Jastrow Dictionary</p>
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
            </div>
        </section>
    );
};

export default Card;
