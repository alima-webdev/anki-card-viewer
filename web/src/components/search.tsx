// Imports
// UI
import { Input } from "@/components/ui/input";
import { Cog, CogIcon, Save, SaveAll, Search } from "lucide-react";

// Internal
import { ANKI } from "../globals";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useRef } from "preact/hooks";
import { currentBaseTag, currentCategorizeMisc, currentCategorizeMiscDepth, currentQuery, paginationInfo, performSearch } from "../signals";

// Devtools
import { isDevelopment } from "../devtools";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent } from "@/components/ui/popover";
import { PopoverClose, PopoverTrigger } from "@radix-ui/react-popover";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { applyGeneratedTags } from "../api/api";
import { Separator } from "@/components/ui/separator";
import { FormControl, FormField, FormItem } from "@/components/ui/form";
import { useForm } from "react-hook-form";

/**
 * Render the search / query component
 *
 * @param {onSubmit} Function - Form submission function
 * @returns {Component}
 */
export function SearchComponent() {

    const form = useForm({
        defaultValues: {
            query: currentQuery,
            cardsPerPage: String(paginationInfo.cardsPerPage),
            baseTag: currentBaseTag,
            categorizeMisc: currentCategorizeMisc,
            categorizeMiscDepth: currentCategorizeMiscDepth,
        },
    })

    const formRef = useRef(null)
    const baseTagInputRef = useRef(null)
    const categorizeMiscInputRef = useRef(null)

    // Event: Search Form Submission
    const onSubmit = (data) => {

        // Perform the query
        performSearch(data.query, parseInt(data.cardsPerPage), data.baseTag, data.categorizeMisc, parseInt(data.categorizeMiscDepth))

        // Prevents reload
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

    const applyTags = (event: MouseEvent) => {
        applyGeneratedTags()
        event.preventDefault()
    }
    return (
        <nav id="navbar" className="sticky top-0 w-full p-4 bg-white dark:bg-black border-b z-9999">
            <form ref={formRef} onSubmit={form.handleSubmit(onSubmit)}>
                <div className="flex items-center space-x-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />

                        <FormField
                            control={form.control}
                            name="query"
                            render={({ field }) => (
                                <Input
                                    className="w-full rounded-lg bg-background pl-8"
                                    placeholder="Search..."
                                    id={field.name}
                                    name={field.name}
                                    value={field.value}
                                    onChange={field.onChange}
                                />
                            )}
                        />
                    </div>
                    <div className="flex flex-row items-center gap-2">
                        <Label htmlFor="cardPerPage" className="flex-1 flex-grow">
                            Cards per Page:
                        </Label>
                        <div class="flex-shrink">

                            <FormField
                                control={form.control}
                                name="cardsPerPage"
                                render={({ field }) => {
                                    const onChangeFunction = (value) => {
                                        field.onChange(value)
                                        form.handleSubmit(onSubmit)()
                                    }
                                    return (
                                        <Select
                                            onValueChange={onChangeFunction}
                                            {...field}
                                        >
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
                                    )
                                }
                                } />
                        </div>
                        <div className="flex-shrink">
                            {/* <Popover onOpenChange={() => { baseTagInputRef.current.value = currentBaseTag }}> */}
                            <Popover>
                                <PopoverTrigger className="action">
                                    <a className="flex p-2 ms-1">
                                        <Cog className="h-4 w-4 text-muted-foreground"></Cog>
                                    </a>
                                </PopoverTrigger>
                                <PopoverContent className="w-96 mx-4 z-9999">
                                    <form onSubmit={applySettings} className="flex flex-col gap-4">
                                        <Label htmlFor="baseTag">Root Category Tag</Label>
                                        <FormField
                                            control={form.control}
                                            name="baseTag"
                                            render={({ field }) => (
                                                <Input ref={baseTagInputRef} placeholder="e.g. #AK_Step2_v12..." {...field} />
                                            )}
                                        />
                                        {/* <Input ref={baseTagInputRef} placeholder="e.g. #AK_Step2_v12..." value={currentBaseTag} /> */}

                                        {/* <Separator /> */}

                                        <div className="bg-slate-50 p-4">
                                            <div class="flex flex-row gap-2 items-center mb-4">
                                                <FormField
                                                    control={form.control}
                                                    name="categorizeMisc"
                                                    render={({ field }) => (
                                                        <>
                                                            <Switch ref={categorizeMiscInputRef} id={field.name} name={field.name} checked={field.value} onCheckedChange={field.onChange} {...field} />
                                                            <Label htmlFor={field.name} className="flex-1">
                                                                Categorize Miscellaneous Notes
                                                            </Label>
                                                        </>
                                                    )}
                                                />
                                            </div>
                                            <div class="flex flex-row gap-2 items-center mb-4">
                                                <FormField
                                                    control={form.control}
                                                    name="categorizeMiscDepth"
                                                    render={({ field }) => (
                                                        <>
                                                            <Label htmlFor={field.name} className="flex-1">
                                                                Analysis Depth
                                                            </Label>
                                                            <Input
                                                                className="w-12 rounded-lg bg-background text-center"
                                                                type="text"
                                                                id={field.name}
                                                                name={field.name}
                                                                value={field.value}
                                                                onChange={field.onChange}
                                                            />
                                                        </>
                                                    )}
                                                />
                                            </div>
                                            <div className="text-xs text-muted-foreground mb-4">
                                                Notes will be categorized based on how well they match the subtags within the root tag.
                                            </div>
                                            <div className="mb-2">
                                                <Button variant="outline" size="sm" type="button" onClick={applyTags}>
                                                    Save Generated Tags
                                                </Button>
                                            </div>
                                            <div className="text-xs text-muted-foreground">
                                                Back up your deck before making these changes permanent.
                                            </div>
                                        </div>
                                        {/* <Separator /> */}
                                        <PopoverClose asChild>
                                            <Button type="submit" className="w-32">Apply Settings</Button>
                                        </PopoverClose>
                                    </form>
                                </PopoverContent>
                            </Popover>
                        </div>
                    </div>
                </div>
            </form>
        </nav >
    )
}