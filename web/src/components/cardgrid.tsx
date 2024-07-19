// Imports
// Preact
import { signal } from '@preact/signals';

// UI
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from '@/components/ui/button';
import { TagsIcon } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';

// Internal
import { suspend, unsuspend, editCard } from '../api/api';

// Devtools
import { log } from '../devtools';
import { ANKI } from '../globals';
import { parseCardContent, parseTag } from '../api/utils';
import { Suspense } from 'preact/compat';
import { Skeleton } from '@/components/ui/skeleton';
import { currentCards, refreshCardGrid, willRefreshCardGrid } from '../signals';

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
        if((event.target as HTMLElement).closest('.action')) return;
        let cardId = parseInt((event.currentTarget as HTMLElement).getAttribute('data-id'))
        editCard(cardId)
    }

    // Copy the clicked tag to the clipboard
    const copyTagToClipboard = (tag) => {
        console.log("copyTagToClipboard")
        console.log(tag)
        navigator.clipboard.writeText(tag);
    }

    // Start the current category variable
    let currentCategory = ""

    return (
        <Suspense fallback={
            <div className="grid grid-cols-3 gap-4">
                <Skeleton className="h-[125px] rounded-xl" />
                <Skeleton className="h-[125px] rounded-xl" />
                <Skeleton className="h-[125px] rounded-xl" />
                <Skeleton className="h-[125px] rounded-xl" />
                <Skeleton className="h-[125px] rounded-xl" />
                <Skeleton className="h-[125px] rounded-xl" />
            </div>
        }>
            <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-4">
                {(cards.length > 0 ? cards.map(({ cardId, answer, isSuspended, tags, tagsOfInterest = [] }) => {

                    // Card category
                    let category = ""
                    let tagsOfInterestParsed = []
                    if (tagsOfInterest.length == 0) {
                        category = "Miscellaneous"
                    } else {
                        tagsOfInterestParsed = tagsOfInterest.map(tag => {
                            return parseTag(tag)
                        })
                        category = tagsOfInterest[0].replace(ANKI.BASE_CATEGORY_TAG, "").split("::").filter(Boolean)[0].replace("_", " ")
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
                                <div className="md:col-span-3 lg:col-span-4">
                                    <h1 className="mt-3 text-2xl font-semibold tracking-tight">
                                        {currentCategory}
                                    </h1>
                                </div>
                                : "")}

                            {/* Card */}
                            <Card className={(isSuspended ? "suspended" : "") + " flex flex-col cursor-pointer"} data-id={cardId} data-suspended={isSuspended} onClick={cardClickEvent}>
                                <CardHeader>
                                    <div class="flex items-center">
                                        {/* Tag and Popover */}
                                        <div className="flex-1 text-xs text-left text-muted-foreground card-tag">
                                            {tagsOfInterestParsed[0]}
                                        </div>
                                        {/* {(tagsOfInterest.length > 1 ? */}
                                        <Popover className="action">
                                            <PopoverTrigger>
                                                <Button size="icon" variant="ghost" className="action">
                                                    <TagsIcon className="h-4 w-4 text-muted-foreground"></TagsIcon>
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-100">
                                                {/* Tags of Interest */}
                                                {(tagsOfInterest.length > 0 ? (
                                                    <>
                                                        <div>
                                                            {tagsOfInterest.map(tag => {
                                                                return (
                                                                    <a className="mb-1 text-xs cursor-pointer" onClick={() => { copyTagToClipboard(tag) }}>
                                                                        {parseTag(tag)}
                                                                    </a>
                                                                )
                                                            })}
                                                        </div>
                                                        <Separator orientation="horizontal" className="my-2" />
                                                    </>
                                                ) : "")}
                                                {/* Other Tags */}
                                                <div>
                                                    {tags.map(tag => (
                                                        <div className="mb-1 text-xs text-muted-foreground cursor-pointer"  onClick={() => { copyTagToClipboard(tag) }}>
                                                            {parseTag(tag, false)}
                                                        </div>))}
                                                </div>
                                            </PopoverContent>
                                        </Popover>
                                        {/* : "")} */}
                                    </div>

                                </CardHeader>
                                {/* Content */}
                                <CardContent>
                                    <div dangerouslySetInnerHTML={{ __html: parseCardContent(answer) }}></div>
                                </CardContent>
                                {/* Footer (suspension status switch) */}
                                <CardFooter className="flex flex-1 flex-col items-start justify-end action">
                                    <div className="flex items-center space-x-2">
                                        <Switch id={`suspended-${cardId}`} checked={isSuspended} onCheckedChange={() => { suspendedCheckChanged(`suspended-${cardId}`) }} data-id={cardId} data-suspended={isSuspended} />
                                        <Label htmlFor={`suspended-${cardId}`} className="text-muted-foreground">Suspended</Label>
                                    </div>
                                </CardFooter>
                            </Card>
                        </>
                    )
                }) : "")}
            </div>
        </Suspense>
    )
}