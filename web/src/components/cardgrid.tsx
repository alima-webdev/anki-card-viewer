// Imports
// UI
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from '@/components/ui/button';
import { Check, Sparkles, TagsIcon } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';

// Internal
import { suspend, unsuspend, editCard } from '../api/api';
import { parseCardContent, parseTag } from '../api/utils';
import { currentBaseTag, currentCards, loading, refreshCardGrid, willRefreshCardGrid } from '../signals';

// Devtools
import { isDevelopment, log } from '../devtools';
import { useToast } from '@/components/ui/use-toast';
import { ToastAction, ToastClose } from '@/components/ui/toast';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { CardComponent } from './card';

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

    // Card information from signal
    let cards = [...currentCards]

    /**
     * Toggle the suspend state of the card when the user hits the switch button
     *
     * @param {switchElementId} string - Id of the element being pressed
     */
    const suspendedCheckChanged = async (switchElementId) => {
        // Get the element
        const switchElement = document.getElementById(switchElementId) as HTMLElement

        // Get the card information
        let cardId = parseInt(switchElement.getAttribute('data-id'))
        let isSuspended = (switchElement.getAttribute('data-suspended') == "true" ? true : false)

        // Call the function according to the card's current state
        if (isSuspended == true) {
            await unsuspend(cardId)
        } else {
            await suspend(cardId)
        }

        // Update the currentCards signal to trigger a rerender
        const arrayIndex = currentCards.findIndex(card => { return card.cardId == cardId })

        // Set the signal variables
        currentCards[arrayIndex].isSuspended = !isSuspended

        // Refresh the card grid
        refreshCardGrid()
    }

    // Card click event
    let cardClickEvent = (event: MouseEvent) => {
        // Do nothing if clicked on elements that already have onclick setup
        if ((event.target as HTMLElement).closest('.action')) return;
        // let cardId = parseInt((event.currentTarget as HTMLElement).getAttribute('data-id'))
        let noteId = parseInt((event.currentTarget as HTMLElement).getAttribute('data-note-id'))
        editCard(noteId)
    }

    // Toast
    const { toast } = useToast()
    const showToast = () => {
        console.log("showToast")
        toast({
            title: (
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
            {(loading.value == true ? (
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
            ) : (
                <div className="grid md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4">
                    {(cards.length > 0 ? cards.map(({ cardId, noteId, cardOrder, answer, isSuspended, tags, tagsOfInterestEstimated, tagsOfInterest = [] }) => {

                        // Card category
                        let category = ""
                        let tagsOfInterestParsed = []
                        if (tagsOfInterest.length == 0 || tagsOfInterest[0] == currentBaseTag) {
                            category = "Miscellaneous"
                        } else {
                            tagsOfInterestParsed = tagsOfInterest.map(tag => {
                                return parseTag(tag)
                            })
                            console.log(tagsOfInterest, currentBaseTag)
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
                                    <div className="md:col-span-3 lg:col-span-4 xl:col-span-4">
                                        <h1 className="mt-3 text-2xl font-semibold tracking-tight">
                                            {currentCategory}
                                        </h1>
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