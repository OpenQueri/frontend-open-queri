import { useSearchParams } from 'react-router-dom';
import { LiquidSearch, SearchSite } from '../../components/SearchBar/SearchBar';
import { Picture, Magnifier } from "@gravity-ui/icons";
import { Tag, TagGroup } from "@heroui/react";
import { ResultCard } from './components/ResultCard';

import { ImageGallery, type ImageItem } from './components/ResultImageCard';
import { GlassLogoProvider } from '../../components/Logo/GlassLogoScene';
import { StaticLogo } from '../../components/Logo/Logo';
import { useState, useEffect, useCallback, useRef } from 'react';

export function SearchPage() {
    const [searchParams, setSearchParams] = useSearchParams();
    
    const urlQuery = searchParams.get('query') || "";
    const urlType = searchParams.get('type') || "default-search";

    const lastProcessedSearch = useRef({ query: "", type: "" });
    
    const [results, setResults] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const performSearch = useCallback(async (searchText: string) => {
        const trimmedQuery = searchText.trim();
        
        if (!trimmedQuery) return;

        

        if (
            trimmedQuery === lastProcessedSearch.current.query && 
            urlType === lastProcessedSearch.current.type
        ) {
            return;
        }

        setIsLoading(true);
        lastProcessedSearch.current = { query: trimmedQuery, type: urlType };

        try {
            const data = await SearchSite(trimmedQuery, urlType);
            const searchResults = Array.isArray(data) ? data : (data.results || []);
            setResults(searchResults);
        } catch (error) {
            console.error("Search execution failed:", error);
            setResults([]);
        } finally {
            setIsLoading(false);
        }
    }, [urlType]); 

    useEffect(() => {
        if (urlQuery) {
            performSearch(urlQuery);
        } else {
            setResults([]);
            lastProcessedSearch.current = { query: "", type: "" };
        }
    }, [urlQuery, performSearch]);

    const handleSearch = (searchText: string) => {
        setSearchParams({ query: searchText.trim(), type: urlType });
    };

    const handleTabChange = (keys: any) => {
        const selected = Array.from(keys)[0] as string;
        if (selected) {
            setSearchParams({ query: urlQuery, type: selected });
        }
    };

    const imageResults: ImageItem[] = results.flatMap((site, siteIndex) => {
        if (!site.image || site.image.length === 0) return [];
        return site.image.map((singleImgUrl: string, imgIndex: number) => ({
            id: `${siteIndex}-${imgIndex}`,
            title: site.title,
            imageUrl: singleImgUrl,
            sourceLink: site.url,
        }));
    });

    return (
        <div className="min-h-screen bg-white dark:bg-zinc-950 transition-colors duration-300 text-foreground">
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-start sm:items-center sm:p-5 bg-background text-foreground">
                <div className="text-xl font-bold uppercase tracking-tighter dark:text-white flex-shrink-0 self-center sm:self-auto hidden md:block bg-background text-foreground">
                    <GlassLogoProvider is3D={false} width={45} height={45}> 
                        <StaticLogo size={40}/>
                    </GlassLogoProvider>
                </div>
                <div className="w-full max-w-2xl">
                    <LiquidSearch initialText={urlQuery} onSearch={handleSearch} />
                </div>
            </div>

            <div className="flex flex-row gap-4 items-center px-4 md:pl-24  bg-background text-foreground">
                <TagGroup 
                    aria-label="Search categories" 
                    selectionMode="single" 
                    selectedKeys={[urlType]}
                    onSelectionChange={handleTabChange} 
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
                    </TagGroup.List>
                </TagGroup>
            </div>

            <main className="flex flex-col px-4 md:pl-24 md:pr-4 pb-10  bg-background text-foreground">
                {isLoading ? (
                    <div className="flex items-center gap-2 py-10 text-zinc-500 animate-pulse bg-background text-foreground">
                        <div className="w-4 h-4 bg-zinc-400 rounded-full animate-bounce" />
                        <span>Searching for results...</span>
                    </div>
                ) : results.length > 0 ? (
                    urlType === "default-image" ? (
                        <div className="pt-2">
                            <ImageGallery images={imageResults} />
                        </div>
                    ) : (
                        <div className="flex flex-col gap-4 sm:gap-6 max-w-5xl w-full  bg-background text-foreground">
                            {results.map((item, index) => (
                                <ResultCard 
                                    key={index}
                                    title={item.title} 
                                    link={item.url} 
                                    index={index}
                                />
                            ))}
                        </div>
                    )
                ) : (
                    <div className="text-zinc-500 italic py-10">
                        {urlQuery ? "No results found for this query." : "Enter a keyword to start searching..."}
                    </div>
                )}
            </main>
        </div>
    );
}