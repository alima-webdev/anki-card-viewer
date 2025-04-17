// Dependencies
// Shadcn UI
import { Check } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/components/ui/use-toast';

// Internal
// -- Functions
import { parseTag } from '../api/utils';
import { currentBaseTag, currentCards, loading, paginationInfo, willRefreshCardGrid } from '../signals';

// -- Components
import { CardComponent } from './card';
import { PaginationComponent } from './pagination';

// Devtools
import { isDevelopment, log } from '../devtools';

/**
 * Render the card grid component
 *
 * @param {currentCards} signal - Signal that contains the cards to be display in the current page
 * @param {paginationSignal} signal - Signal that contains pagination information
 * @returns {Component}
 */
export function CardGridComponent() {

    // DO NOT REMOVE
    // Use the signal to refresh the component
    const refresh = willRefreshCardGrid.value

    const isLoading = loading.value

    // Card information from signal
    let cards = [...currentCards]

    // Toast
    const { toast } = useToast()
    const showToast = () => {
        console.log("showToast")
        toast({
            title: "Tag Copied to Clipboard",
            description: (
                <div className="flex flex-row gap-4">
                    <Check />
                    Tag Copied to Clipboard
                </div>
            )
        })
    }

    // Copy the clicked tag to the clipboard
    const copyTagToClipboard = (tag) => {
        navigator.clipboard.writeText(tag);
        showToast()
    }

    const acceptEstimatedTag = (event: MouseEvent) => {
        console.log("acceptEstimatedTag")
        let el = event.currentTarget as HTMLElement
        let noteId = parseInt(el.getAttribute("data-note-id"))
        let estimatedTag = el.getAttribute("data-tag")

        console.log(noteId, estimatedTag)
        event.preventDefault()
    }

    // Start the current category variable
    let currentCategory = ""

    return (
        <>
            {(isLoading == true ? (
                <>
                    <Skeleton className="w-[100px] h-[20px] rounded-xl" />
                    <div className="flex flex-row">
                        <div className="flex-1">
                            <Skeleton className="w-[200px] h-[40px] rounded-xl" />
                        </div>
                        <Skeleton className="w-[400px] h-[40px] rounded-xl items-end justify-self-end" />
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                        <Skeleton className="h-[200px] rounded-xl" />
                        <Skeleton className="h-[200px] rounded-xl" />
                        <Skeleton className="h-[200px] rounded-xl" />

                        <Skeleton className="h-[200px] rounded-xl" />
                        <Skeleton className="h-[200px] rounded-xl" />
                        <Skeleton className="h-[200px] rounded-xl" />

                        <Skeleton className="h-[200px] rounded-xl" />
                        <Skeleton className="h-[200px] rounded-xl" />
                        <Skeleton className="h-[200px] rounded-xl" />

                        <Skeleton className="h-[125px] rounded-xl" />
                        <Skeleton className="h-[125px] rounded-xl" />
                        <Skeleton className="h-[125px] rounded-xl" />
                    </div>
                </>
            ) : (
                <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4">
                    <div className="sm:col-span-2 md:col-span-3 lg:col-span-4 xl:col-span-4 text-sm text-muted-foreground">
                        Total {paginationInfo.totalCards} results
                    </div>
                    {(cards.length > 0 ? cards.map(({ cardId, noteId, cardOrder, answer, isSuspended, tags, tagsOfInterestEstimated, tagsOfInterest = [] }, index) => {

                        // Card category
                        let category = ""
                        let tagsOfInterestParsed = []
                        if (tagsOfInterest.length == 0 || tagsOfInterest[0] == currentBaseTag) {
                            category = "Miscellaneous"
                        } else {
                            tagsOfInterestParsed = tagsOfInterest.map(tag => {
                                return parseTag(tag)
                            })
                            category = tagsOfInterest[0].replace(currentBaseTag, "").split("::").filter(Boolean)[0].replace("_", " ")
                        }

                        // Decide if a category header should be inserted and sets the current category if needed
                        let insertCategoryHeader = false
                        if (currentCategory != category) {
                            insertCategoryHeader = true
                            currentCategory = category
                        }

                        return (
                            <>
                                {/* Category Header */}
                                {(insertCategoryHeader ?
                                    <div className="sm:col-span-2 md:col-span-3 lg:col-span-4 xl:col-span-4 flex flex-row">
                                        <h1 className={`my-1 text-3xl font-semibold tracking-tight flex-1 
                                        ${(index > 0 ? "mt-8" : "")}`}>
                                            {currentCategory}
                                        </h1>
                                        {(index == 0 ?
                                            <div className="flex-shrink">
                                                <PaginationComponent />
                                            </div>
                                            : "")}
                                    </div>
                                    : "")}

                                <CardComponent
                                    cardId={cardId}
                                    noteId={noteId}
                                    cardOrder={cardOrder}
                                    answer={answer}
                                    isSuspended={isSuspended}
                                    tags={tags}
                                    tagsOfInterestEstimated={tagsOfInterestEstimated}
                                    tagsOfInterest={tagsOfInterest}
                                ></CardComponent>
                            </>
                        )
                    }) : "")}
                </div>
            ))}
        </>
    )
}