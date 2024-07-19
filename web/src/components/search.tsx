// Imports
// UI
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

// Internal
import { ANKI } from "../globals";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useRef } from "preact/hooks";

/**
 * Render the search / query component
 *
 * @param {onSubmit} Function - Form submission function
 * @returns {Component}
 */
export function SearchComponent({ onSubmit }) {

    const formRef = useRef(null)

    const cardsPerPageChange = () => {
        const form = (formRef.current as HTMLFormElement)
        form.requestSubmit()
    }
    return (
        <form ref={formRef} onSubmit={onSubmit}>
            <div className="flex items-center space-x-2">
                <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        name="query"
                        type="search"
                        placeholder="Search..."
                        className="w-full rounded-lg bg-background pl-8"
                        value={ANKI.DEFAULT_SEARCH_QUERY}
                    />
                </div>
                <Select name="cardsPerPage" defaultValue="30" onValueChange={cardsPerPageChange}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Cards per Page" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectLabel>Cards per Page</SelectLabel>
                            <SelectItem value="30">30</SelectItem>
                            <SelectItem value="60">60</SelectItem>
                            <SelectItem value="90">90</SelectItem>
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </div>
        </form>
    )
}