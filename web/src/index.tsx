// Imports
// Preact
import { render } from 'preact';
import { useEffect, useState } from 'preact/hooks';
import { Suspense } from 'preact/compat';

// Styles
import './styles/styles.css';

// UI
import { Toaster } from "@/components/ui/toaster"

// Components
import { PaginationComponent } from "./components/pagination"
import { CardGridComponent } from "./components/cardgrid"
import { SearchComponent } from "./components/search"

// Internal
import { ANKI } from './globals';
import { performSearch } from './signals';
import { initAPI } from './api/api';

// Devtools
import { isDevelopment, log } from './devtools';

/**
 * Main app component
 *
 * @returns {Component}
 */
export function App() {

    // const [loading, setLoading] = useState(true)

    // Init the signals and start the API
    useEffect(() => {
        const performEffect = async () => {
            await initAPI()
            performSearch(ANKI.DEFAULT_SEARCH_QUERY, ANKI.CARDS_PER_PAGE, ANKI.BASE_CATEGORY_TAG)
        }
        performEffect()
    }, [])

    return (
        <main className="dark:dark">
            <SearchComponent />
            <div className="p-4 grid grid-rows gap-4">
                <CardGridComponent />
                <PaginationComponent />
            </div>
            <Toaster />
        </main>
    );
}

// Render the preact app
render(<App />, document.getElementById('app'));
