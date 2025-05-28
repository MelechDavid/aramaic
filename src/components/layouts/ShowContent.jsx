import { useState, useEffect, useRef } from "react";
import AudioButton from "../buttons/AudioButton";
import InfiniteScroll from "../ui/InfiniteScroll";
import EntryDetails from "./EntryDetails";

const ShowContent = ({ data, hasMore, loading, onLoadMore, totalResults, expandedEntries, toggleEntry }) => {
    const [selectedEntry, setSelectedEntry] = useState(null);
    const [slideAnimation, setSlideAnimation] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const pendingEntryRef = useRef(null);
    const detailsRef = useRef(null);

    // Handle empty data state
    if (!data || data.length === 0) {
        return null;
    }

    const handleEntryClick = (entryId, entry) => {
        // If already loading an entry, don't process additional clicks
        if (isLoading) return;
        
        // Mark that we're loading an entry
        setIsLoading(true);
        
        // Store the clicked entry info with a clear ID reference
        pendingEntryRef.current = {
            id: entryId,
            ...entry
        };
        
        // Set up the details view with initial data
        // This happens synchronously to ensure the component is mounted before animation
        setSelectedEntry({
            id: entryId,
            ...entry,
            definition: expandedEntries[entryId]?.definition || "Loading..."
        });
        
        // Add a short delay before starting the animation
        // This ensures the component is rendered first
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                setSlideAnimation(true);
            });
        });
        
        // Trigger data loading if not already loaded
        if (!expandedEntries[entryId]) {
            toggleEntry(entryId);
        } else {
            // If data is already loaded, just update the loading state
            setTimeout(() => {
                setIsLoading(false);
            }, 300); // Short delay to allow animation to complete
        }
    };

    // Update selected entry when expanded data is loaded
    useEffect(() => {
        if (isLoading && pendingEntryRef.current && selectedEntry) {
            const pendingId = pendingEntryRef.current.id;
            
            // Check if the data for this specific entry has been loaded
            if (expandedEntries[pendingId]) {
                // Update the entry with the full data
                setSelectedEntry(prev => ({
                    ...prev,
                    ...expandedEntries[pendingId]
                }));
                
                // Clear loading state
                setIsLoading(false);
            }
        }
    }, [expandedEntries, isLoading, selectedEntry]);

    const handleBack = () => {
        // Trigger slide-out animation
        setSlideAnimation(false);
        
        // Clear selected entry after animation completes
        setTimeout(() => {
            setSelectedEntry(null);
            // Also clear any pending entry
            pendingEntryRef.current = null;
            setIsLoading(false);
        }, 300); // Matches animation duration
    };

    return (
        <>
            <InfiniteScroll 
                hasMore={hasMore} 
                loading={loading} 
                onLoadMore={onLoadMore}
            >
                <article className="my-5">
                    {data.map((entry, index) => {
                        const entryId = entry.id || `entry-${index}`;
                        const isPending = isLoading && pendingEntryRef.current?.id === entryId;
                        
                        return (
                            <div 
                                key={entryId} 
                                className={`mb-6 rounded-lg shadow-md transition-all duration-200 p-6 bg-gray-50 dark:bg-gray-900 hover:bg-white dark:hover:bg-gray-800 cursor-pointer ${
                                    isPending ? 'pointer-events-none opacity-70' : ''
                                }`}
                                onClick={() => handleEntryClick(entryId, entry)}
                                data-entry-id={entryId}
                            >
                                {/* Compact View */}
                                <div className="flex flex-col">
                                    <div className="flex justify-between items-start">
                                        <h2 className="text-2xl lg:text-3xl font-semibold dark:text-white">
                                            {entry.headwords.join(", ")}
                                        </h2>
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
                                
                                {/* Visual indicator for expandable entries */}
                                <div className="flex justify-center mt-2">
                                    {isPending ? (
                                        <div className="w-5 h-5 border-2 border-pink-600 border-t-transparent rounded-full animate-spin"></div>
                                    ) : (
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    )}
                                </div>
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

            {/* Entry details with slide animation - only render when we have an entry */}
            {selectedEntry && (
                <EntryDetails 
                    ref={detailsRef}
                    entry={selectedEntry} 
                    onBack={handleBack} 
                    isSlideIn={slideAnimation}
                />
            )}
        </>
    );
};

export default ShowContent;
