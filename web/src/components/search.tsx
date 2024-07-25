// Imports
// UI
import { Input } from "@/components/ui/input";
import { CogIcon, Search } from "lucide-react";

// Internal
import { ANKI } from "../globals";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useRef } from "preact/hooks";
import { currentBaseTag, paginationInfo, performSearch } from "../signals";

// Devtools
import { isDevelopment } from "../devtools";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent } from "@/components/ui/popover";
import { PopoverClose, PopoverTrigger } from "@radix-ui/react-popover";
import { Button } from "@/components/ui/button";

/**
 * Render the search / query component
 *
 * @param {onSubmit} Function - Form submission function
 * @returns {Component}
 */
export function SearchComponent() {

    const formRef = useRef(null)
    const baseTagInputRef = useRef(null)

    // Event: Search Form Submission
    const onSubmit = (event: SubmitEvent) => {

        // Get the form data
        const data = new FormData(event.currentTarget as HTMLFormElement);

        const query = data.get("query") as string
        const cardsPerPage = parseInt(data.get("cardsPerPage") as string)
        const baseTag = (baseTagInputRef.current ? baseTagInputRef.current.value as string : currentBaseTag)

        if (isDevelopment()) {
            console.info("Fn: Perform Search")
            console.info("Query: ", query, "  |  Cards Per Page: ", cardsPerPage)
        }

        // Save the query string to the searchQuery signal, which will trigger the query process
        performSearch(query, cardsPerPage, baseTag)

        event.preventDefault()
    }

    const searchSettingsChange = () => {
        const form = (formRef.current as HTMLFormElement)
        form.requestSubmit()
    }

    const applySettings = (event: SubmitEvent) => {
        searchSettingsChange()
        event.preventDefault()
    }
    return (
        <nav id="navbar" className="sticky top-0 w-full p-4 bg-white dark:bg-black border-b z-9999">
            <form ref={formRef} onSubmit={onSubmit}>
                <div className="flex items-center space-x-4">
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
                    <div className="flex flex-row items-center gap-2">
                        <Label htmlFor="cardPerPage" className="flex-1 flex-grow">
                            Cards per Page:
                        </Label>
                        <div class="flex-shrink">
                            <Select id="cardsPerPage" name="cardsPerPage" defaultValue={String(paginationInfo.cardsPerPage)} onValueChange={searchSettingsChange}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Cards per Page" />
                                </SelectTrigger>
                                <SelectContent className="z-9999">
                                    <SelectGroup>
                                        <SelectLabel>Cards per Page</SelectLabel>
                                        {ANKI.CARDS_PER_PAGE_OPTIONS.map(cardsPerPageOption => (
                                            <SelectItem value={String(cardsPerPageOption)}>{String(cardsPerPageOption)}</SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex-shrink">
                            <Popover onOpenChange={() => { baseTagInputRef.current.value = currentBaseTag }}>
                                <PopoverTrigger>
                                    <Button type="button" size="icon" variant="outline" className="action">
                                        <CogIcon className="h-4 w-4 text-muted-foreground"></CogIcon>
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-96 mx-4 z-9999">
                                    <form onSubmit={applySettings} className="flex flex-col gap-4">
                                        <Label htmlFor="baseTag">Base Category Tag</Label>
                                        <Input ref={baseTagInputRef} placeholder="e.g. #AK_Step2_v12..." value={currentBaseTag} />
                                        <PopoverClose asChild>
                                            <Button type="submit" className="w-20">Apply</Button>
                                        </PopoverClose>
                                    </form>
                                </PopoverContent>
                            </Popover>
                        </div>
                    </div>
                </div>
            </form>
        </nav>
    )
}