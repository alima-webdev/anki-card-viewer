// Imports
// UI
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Switch } from "@/components/ui/switch"
import { Check, Sparkles, TagsIcon } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

// Internal Imports
import { currentBaseTag, currentCards, refreshCardGrid } from "../signals"
import { parseTag, parseCardContent } from "../api/utils"
import { editCard, suspend, unsuspend } from "../api/api"

// Devtools
import { isDevelopment } from "../devtools"

export function CardComponent({ cardId, noteId, cardOrder, answer, isSuspended, tags, tagsOfInterestEstimated, tagsOfInterest = [] }) {

    // Card category
    let tagsOfInterestParsed = tagsOfInterest.map(tag => {
        return parseTag(tag)
    }).filter(Boolean)
    console.log(tagsOfInterestParsed)

    // Functions
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

    return (
        <Card className={(isSuspended ? "suspended" : "") + " flex flex-col cursor-pointer"} data-id={cardId} data-note-id={noteId} data-suspended={isSuspended} onClick={cardClickEvent} >
            <CardHeader>
                {/* {(isDevelopment() ?
                    <small className="text-muted-foreground">
                        Note: {noteId}<br />
                        Card: {cardId}<br />
                        Order: {cardOrder}<br />
                        {(tagsOfInterestEstimated ?
                            <>
                                Estimated Tags:<br />
                                {tagsOfInterest.join(", ")}
                            </>
                            : "")}

                    </small>
                    : "")} */}
                <div class="flex items-center">
                    {/* Tag and Popover */}
                    <div className="flex-1 text-xs text-left text-muted-foreground card-tag action">
                        <a onClick={() => { copyTagToClipboard((tagsOfInterest.length > 0 ? tagsOfInterest[0] : "")) }}>
                            {(tagsOfInterestParsed.length > 0 ? tagsOfInterestParsed[0] : "Miscellaneous")}
                            {(tagsOfInterestEstimated ?
                                <span className="inline-block mx-2">
                                    <Sparkles className="text-yellow-500" size={12} />
                                </span>
                                : "")}
                        </a>
                    </div>

                    <Popover>
                        <PopoverTrigger>
                            <a className="inline-block p-2 action">
                                <TagsIcon className="h-4 w-4 text-muted-foreground"></TagsIcon>
                            </a>
                        </PopoverTrigger>
                        <PopoverContent className="w-4/5">
                            {/* Tags of Interest */}
                            {(tagsOfInterest.length > 0 ? (
                                <>
                                    <div>
                                        {tagsOfInterest.map(tag => {
                                            return (
                                                <a className="block mb-1 text-xs cursor-pointer" onClick={() => { copyTagToClipboard(tag) }}>
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
                                    <div className="mb-1 text-xs text-muted-foreground cursor-pointer" onClick={() => { copyTagToClipboard(tag) }}>
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
            <CardFooter className="flex flex-1 flex-col items-start justify-end">
                <div className="flex items-center space-x-2">
                    <Switch id={`suspended-${cardId}`} checked={isSuspended} onCheckedChange={() => { suspendedCheckChanged(`suspended-${cardId}`) }} data-id={cardId} data-suspended={isSuspended} />
                    <Label htmlFor={`suspended-${cardId}`} className="text-muted-foreground">Suspended</Label>
                </div>
            </CardFooter>
        </Card >
    )
}