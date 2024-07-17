// Imports
// UI
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

// Internal
import { ANKI } from "../globals";

/**
 * Render the search / query component
 *
 * @param {onSubmit} Function - Form submission function
 * @returns {Component}
 */
export function SearchComponent({ onSubmit }) {
    return (
        <div className="relative">
            <form onSubmit={onSubmit}>
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                    name="query"
                    type="search"
                    placeholder="Search..."
                    className="w-full rounded-lg bg-background pl-8"
                    value={ANKI.DEFAULT_SEARCH_QUERY}
                />
            </form>
        </div>
    )
}