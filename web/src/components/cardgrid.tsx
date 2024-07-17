// Imports
// UI
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from '@/components/ui/button';
import { TagsIcon } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

// Internal
import { suspend, unsuspend } from '../api/api';

// Devtools
import { log } from '../devtools';

/**
 * Render the card grid component
 *
 * @param {currentCards} signal - Signal that contains the cards to be display in the current page
 * @param {paginationSignal} signal - Signal that contains pagination information
 * @returns {Component}
 */
export function CardGridComponent({ currentCards, paginationSignal }) {

    // Card information from signal
    let cards = [...currentCards.value]

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
        let isSuspended = switchElement.getAttribute('data-suspended')

        // Call the function according to the card's current state
        if (isSuspended == "true") {
            await unsuspend(cardId)
        } else {
            await suspend(cardId)
        }

        // Update the pagination signal to reload the cards
        paginationSignal.value = { ...paginationSignal.value }
    }

    // Start the current category variable
    let currentCategory = ""

    return (
        <div className="grid grid-cols-3 gap-4">
            {cards.map(({ cardId, answer, isSuspended, tagsOfInterest }) => {

                // Card category
                let category = tagsOfInterest[0][0] ?? ""

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
                            <div className="col-span-3">
                                <h1 className="scroll-m-20 text-2xl font-semibold tracking-tight">
                                    {currentCategory}
                                </h1>
                            </div>
                            : "")}

                        {/* Card */}
                        <Card className={(isSuspended ? "bg-gray-100 text-muted-foreground" : "") + " flex flex-col cursor-pointer"} data-id={cardId} data-suspended={isSuspended}>
                            <CardHeader>
                                <div class="flex items-center">
                                    {/* Tag and Popover */}
                                    <div className="flex-1 text-xs text-left text-muted-foreground">
                                        {tagsOfInterest[0].join(" → ")}
                                    </div>
                                    {(tagsOfInterest.length > 1 ?
                                        <Popover>
                                            <PopoverTrigger>
                                                <Button size="icon" variant="ghost">
                                                    <TagsIcon className="h-4 w-4"></TagsIcon>
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-100">
                                                <div>{tagsOfInterest.map(tag => {
                                                    return (<div className="mb-1 text-xs text-muted-foreground">{tag.join(" → ")}</div>)
                                                })}</div>
                                            </PopoverContent>
                                        </Popover>
                                        : "")}
                                </div>

                            </CardHeader>
                            {/* Content */}
                            <CardContent className="">
                                <div dangerouslySetInnerHTML={{__html: answer}}></div>
                            </CardContent>
                            {/* Footer (suspension status switch) */}
                            <CardFooter className="flex flex-1 flex-col items-start justify-end">
                                <div className="flex items-center space-x-2">
                                    <Switch id={`suspended-${cardId}`} checked={isSuspended} onCheckedChange={() => { suspendedCheckChanged(`suspended-${cardId}`) }} data-id={cardId} data-suspended={isSuspended} />
                                    <Label htmlFor={`suspended-${cardId}`} className="text-muted-foreground">Suspended</Label>
                                </div>
                            </CardFooter>
                        </Card>
                    </>
                )
            })}
        </div>
    )
}