import { useState } from "react";
import AudioButton from "../buttons/AudioButton";
import InfiniteScroll from "../ui/InfiniteScroll";

const ShowContent = ({ data, hasMore, loading, onLoadMore, totalResults, expandedEntries, toggleEntry }) => {
    // Handle empty data state
    if (!data || data.length === 0) {
        return null;
    }

    return (
        <InfiniteScroll 
            hasMore={hasMore} 
            loading={loading} 
            onLoadMore={onLoadMore}
        >
            <article className="my-5">
                {data.map((entry, index) => {
                    const entryId = entry.id || `entry-${index}`;
                    const isExpanded = !!expandedEntries[entryId];
                    const expandedData = expandedEntries[entryId];
                    
                    return (
                        <div 
                            key={entryId} 
                            className={`mb-6 rounded-lg shadow-md transition-all duration-200 p-6 ${
                                isExpanded 
                                    ? "bg-white dark:bg-gray-800" 
                                    : "bg-gray-50 dark:bg-gray-900 hover:bg-white dark:hover:bg-gray-800 cursor-pointer"
                            }`}
                            onClick={() => !isExpanded && toggleEntry(entryId)}
                        >
                            {/* Compact View (Always Shown) */}
                            <div className={`flex flex-col ${isExpanded ? "mb-4" : ""}`}>
                                <div className="flex justify-between items-start">
                                    <h2 className="text-2xl lg:text-3xl font-semibold dark:text-white">
                                        {entry.headwords.join(", ")}
                                    </h2>
                                    
                                    {isExpanded && (
                                        <button 
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                toggleEntry(entryId);
                                            }}
                                            className="ml-2 p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                                            aria-label="Collapse"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                                            </svg>
                                        </button>
                                    )}
                                </div>
                                
                                {/* English Terms */}
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {entry.englishTerms.map((term, i) => (
                                        <span 
                                            key={i} 
                                            className="px-3 py-1 bg-pink-100 dark:bg-pink-900 text-pink-800 dark:text-pink-200 rounded-full text-sm"
                                        >
                                            {term}
                                        </span>
                                    ))}
                                </div>
                            </div>
                            
                            {/* Expanded Details - Only render if we've loaded the details */}
                            {isExpanded && (
                                <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-2">
                                    {!expandedData ? (
                                        <div className="flex justify-center py-4">
                                            <div className="w-8 h-8 border-4 border-pink-600 border-t-transparent rounded-full animate-spin"></div>
                                        </div>
                                    ) : (
                                        <>
                                            {/* <div className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                                                Entry ID: {expandedData.id}
                                            </div> */}
                                            
                                            <section className="mb-5">
                                                {/* <h3 className="text-xl font-medium mb-3 text-gray-700 dark:text-gray-300">
                                                    Complete Entry:
                                                </h3> */}
                                                <div 
                                                    className="dictionary-entry text-gray-700 dark:text-gray-200 leading-relaxed" 
                                                    dangerouslySetInnerHTML={{ __html: expandedData.definition }}
                                                />
                                            </section>
                                            
                                            {/* {expandedData.notes && expandedData.notes.trim() !== "" && (
                                                <section className="mb-5">
                                                    <h3 className="text-xl font-medium mb-3 text-gray-700 dark:text-gray-300">
                                                        Additional Notes:
                                                    </h3>
                                                    <div 
                                                        className="text-gray-600 dark:text-gray-400 leading-relaxed"
                                                        dangerouslySetInnerHTML={{ __html: expandedData.notes }}
                                                    />
                                                </section>
                                            )} */}
                                        </>
                                    )}
                                </div>
                            )}
                            
                            {/* Visual indicator for expandable entries when collapsed */}
                            {!isExpanded && (
                                <div className="flex justify-center mt-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </div>
                            )}
                        </div>
                    );
                })}
                
                {hasMore && loading && (
                    <div className="flex justify-center my-6">
                        <div className="w-8 h-8 border-4 border-pink-600 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                )}
                
                <section className="mt-8 mb-5 text-center">
                    <p className="text-gray-500 dark:text-gray-400 text-sm">
                        Source: Jastrow Dictionary | Results: {data.length} of {totalResults} {totalResults === 1 ? 'entry' : 'entries'}
                    </p>
                </section>
            </article>
        </InfiniteScroll>
    );
};

export default ShowContent;
