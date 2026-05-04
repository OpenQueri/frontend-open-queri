import { useSearchParams } from 'react-router-dom';
import { LiquidSearch, SearchSite } from '../../components/SearchBar/SearchBar';
import { Picture, FileText, Magnifier } from "@gravity-ui/icons";
import { Tag, TagGroup } from "@heroui/react";
import { ResultCard } from './components/ResultCard';
import { GlassLogoProvider } from '../../components/Logo/GlassLogoScene';
import { StaticLogo } from '../../components/Logo/Logo';
import { useState, useEffect, useCallback, useRef } from 'react';

export function SearchPage() {
    const [searchParams, setSearchParams] = useSearchParams();
    
    // Extract query from URL. Fallback to empty string if not present.
    const urlQuery = searchParams.get('query') || "";
    
    /** * Ref used as a guard to prevent redundant API calls. 
     * React's StrictMode or rapid URL updates can trigger multiple effects; 
     * this ensures we only process unique, new queries.
     */
    const lastProcessedQuery = useRef("");
    
    const [results, setResults] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    /**
     * core search logic.
     * Wrapped in useCallback to maintain reference stability for the useEffect dependency array.
     */
    const performSearch = useCallback(async (searchText: string) => {
        const trimmedQuery = searchText.trim();
        
        // Bail early if the query is empty or identical to the last successful request.
        if (!trimmedQuery || trimmedQuery === lastProcessedQuery.current) {
            return;
        }

        setIsLoading(true);
        lastProcessedQuery.current = trimmedQuery; // Lock in the current query before the async call.

        try {
            const data = await SearchSite(trimmedQuery);
            
            // Handle variations in API response structure (direct array vs. nested object).
            const searchResults = Array.isArray(data) ? data : (data.results || []);
            setResults(searchResults);
        } catch (error) {
            console.error("Search execution failed:", error);
            setResults([]);
        } finally {
            setIsLoading(false);
        }
    }, []);

    /**
     * Primary Effect: Reactive to URL changes.
     * This makes the URL the "Single Source of Truth." If a user shares a link 
     * or hits the 'Back' button, the UI stays in sync.
     */
    useEffect(() => {
        if (urlQuery) {
            performSearch(urlQuery);
        } else {
            // Reset state if the search query is cleared from the URL.
            setResults([]);
            lastProcessedQuery.current = "";
        }
    }, [urlQuery, performSearch]);

    /**
     * Event handler for the search input component.
     * Instead of triggering the search directly, we update the URL parameters.
     * The useEffect above handles the actual data fetching.
     */
    const handleSearch = (searchText: string) => {
        setSearchParams({ query: searchText.trim() });
    };

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 transition-colors duration-300">
            
            {/* Header section: Branding and Search input */}
            <div className="flex flex-row gap-1 items-center p-5">
                <div className="text-xl font-bold uppercase tracking-tighter dark:text-white">
                    <GlassLogoProvider is3D={false} width={55} height={55}> 
                        <StaticLogo size={50}/>
                    </GlassLogoProvider>
                </div>
                <div className="w-full max-w-2xl">
                    <LiquidSearch initialText={urlQuery} onSearch={handleSearch} />
                </div>
            </div>

            {/* Navigation tags for different search categories */}
            <div className="flex flex-row gap-4 items-center md:ml-24">
                <TagGroup 
                    aria-label="Search categories" 
                    selectionMode="single" 
                    defaultSelectedKeys={["default-search"]} 
                    size="lg"
                >
                    <TagGroup.List>
                        <Tag id="default-search">
                            <Magnifier width={16} height={16} />
                            Search
                        </Tag>
                        <Tag id="default-image">
                            <Picture width={16} height={16} />
                            Images
                        </Tag>
                        <Tag id="default-News">
                            <FileText width={16} height={16} />
                            News
                        </Tag>
                    </TagGroup.List>
                </TagGroup>
            </div>

            {/* Results display area */}
            <main className="flex flex-col ml-5 md:ml-24 pb-10 max-w-5xl">
                {isLoading ? (
                    /* Loading state with bounce animation for UX */
                    <div className="flex items-center gap-2 p-10 text-zinc-500 animate-pulse">
                        <div className="w-4 h-4 bg-zinc-400 rounded-full animate-bounce" />
                        <span>Searching for results...</span>
                    </div>
                ) : results.length > 0 ? (
                    /* Render result list if data exists */
                    <div className="flex flex-col gap-6">
                        {results.map((item, index) => (
                            <ResultCard 
                                key={index}
                                title={item.title} 
                                link={item.link} 
                                index={index}
                            />
                        ))}
                    </div>
                ) : (
                    /* Empty or initial state message */
                    <div className="text-zinc-500 italic p-10">
                        {urlQuery ? "No results found for this query." : "Enter a keyword to start searching..."}
                    </div>
                )}
            </main>
        </div>
    );
}