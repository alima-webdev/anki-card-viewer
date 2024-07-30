// Imports
// Preact
import { render } from 'preact';
import { useEffect } from 'preact/hooks';

// Styles
import './styles/styles.css';

// UI
import { Toaster } from "@/components/ui/toaster"

// Components
import { PaginationComponent } from "./components/pagination"
import { CardGridComponent } from "./components/grid"
import { SearchComponent } from "./components/search"

// Internal
import { ANKI } from './globals';
import Connector from './api/api';

// Devtools
import { isDevelopment, log } from './devtools';

/**
 * Main app component
 *
 * @returns {Component}
 */
export function App() {

    // Init the signals and start the API
    useEffect(() => {
        const performEffect = async () => {
            await Connector.init()
            Connector.query(ANKI.DEFAULT_SEARCH_QUERY, 0, ANKI.CARDS_PER_PAGE, ANKI.BASE_CATEGORY_TAG, ANKI.CATEGORIZE_MISC, ANKI.CATEGORIZE_MISC_DEPTH, true)
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
