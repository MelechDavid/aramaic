import { useState, useEffect, useCallback, useRef } from "react";
import dictionaryIndex from "../utils/DictionaryIndex";

const useFetchData = () => {
    const [data, setData] = useState([]);
    const [expandedEntries, setExpandedEntries] = useState({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [hasMore, setHasMore] = useState(false);
    const [page, setPage] = useState(1);
    const [totalResults, setTotalResults] = useState(0);
    const [indexInitialized, setIndexInitialized] = useState(false);
    const searchTimeoutRef = useRef(null);
    const RESULTS_PER_PAGE = 50;
    const DEBOUNCE_TIME = 500; // Increasing debounce time for better performance
    
    // Initialize the dictionary index
    useEffect(() => {
        const initIndex = async () => {
            try {
                await dictionaryIndex.loadDictionary();
                setIndexInitialized(true);
            } catch (error) {
                console.error("Failed to initialize dictionary index:", error);
                setError("Failed to load dictionary. Please refresh the page.");
            }
        };
        
        initIndex();
    }, []);
    
    // Function to fetch full details for an entry
    const fetchEntryDetails = async (entryId) => {
        try {
            if (!expandedEntries[entryId]) {
                console.log(`Fetching details for entry ${entryId}`);
                const details = await dictionaryIndex.getEntryDetails(entryId);
                console.log("Fetched details:", details);
                setExpandedEntries(prev => ({
                    ...prev,
                    [entryId]: details
                }));
            }
        } catch (error) {
            console.error(`Error fetching details for entry ${entryId}:`, error);
        }
    };
    
    // Toggle expanded state for an entry
    const toggleEntry = async (entryId) => {
        console.log(`Toggling entry ${entryId}, current state:`, expandedEntries[entryId]);
        
        // If entry is not already expanded or being loaded, fetch its details
        if (!expandedEntries[entryId]) {
            await fetchEntryDetails(entryId);
        } else {
            // If entry is expanded, collapse it
            setExpandedEntries(prev => {
                const newState = { ...prev };
                delete newState[entryId]; // Completely remove entry instead of setting to null
                return newState;
            });
        }
    };

    const fetchData = async (term) => {
        try {
            setLoading(true);
            setError(null);
            setPage(1);
            
            // Clear all expanded entries when starting a new search
            setExpandedEntries({});
            
            // Skip empty searches
            if (!term || term.trim() === "") {
                setData([]);
                setTotalResults(0);
                setHasMore(false);
                return;
            }
            
            // Use the dictionary index to search - now with relevance sorting
            const searchResults = await dictionaryIndex.search(term, RESULTS_PER_PAGE);
            
            setData(searchResults.results);
            setTotalResults(searchResults.totalCount);
            setHasMore(searchResults.totalCount > searchResults.results.length);
            
            console.log(`Found ${searchResults.totalCount} matching entries for "${term}"`);
            
        } catch (error) {
            console.error("Error searching dictionary:", error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    // Load more results when user scrolls to bottom with added delay
    const loadMore = useCallback(async () => {
        if (!hasMore || loading || !searchTerm) return;
        
        try {
            setLoading(true);
            
            // Add a deliberate delay before loading more results
            await new Promise(resolve => setTimeout(resolve, 4000)); // 750ms delay
            
            // Calculate next page
            const nextPage = page + 1;
            const skip = (nextPage - 1) * RESULTS_PER_PAGE;
            
            // Search with pagination params
            const searchResults = await dictionaryIndex.search(
                searchTerm, 
                RESULTS_PER_PAGE, 
                skip
            );
            
            // Update state
            setData(prevData => [...prevData, ...searchResults.results]);
            setPage(nextPage);
            setHasMore(data.length + searchResults.results.length < totalResults);
            
        } catch (error) {
            console.error("Error loading more results:", error);
        } finally {
            setLoading(false);
        }
    }, [hasMore, loading, page, searchTerm, data.length, totalResults]);

    // Handle search term changes with improved debouncing
    useEffect(() => {
        // Clear any existing timeout
        if (searchTimeoutRef.current) {
            clearTimeout(searchTimeoutRef.current);
        }
        
        // Skip if the index isn't ready yet
        if (!indexInitialized) return;
        
        // Set a new timeout for the search
        searchTimeoutRef.current = setTimeout(() => {
            if (searchTerm) {
                fetchData(searchTerm);
            } else {
                setData([]);
                setTotalResults(0);
                setHasMore(false);
            }
        }, DEBOUNCE_TIME);
        
        // Cleanup
        return () => {
            if (searchTimeoutRef.current) {
                clearTimeout(searchTimeoutRef.current);
            }
        };
    }, [searchTerm, indexInitialized]);

    return { 
        data, 
        loading, 
        error, 
        searchTerm,
        setSearchTerm,
        hasMore,
        loadMore,
        totalResults,
        expandedEntries,
        toggleEntry
    };
};

export default useFetchData;
