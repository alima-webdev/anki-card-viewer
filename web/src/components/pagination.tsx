// Imports
// UI
import {
    Pagination as PaginationElement,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination"
import { EllipsisIcon } from "lucide-react"
import { changePage, loading, paginationInfo, willRefreshPagination } from "../signals"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"

/**
 * Render the pagination component
 *
 * @returns {Component}
 */
export function PaginationComponent() {
    // Get the current page and total number of pages from the signal
    const refresh = willRefreshPagination.value

    const { current, total } = paginationInfo

    /**
     * Change the page to the desired number
     *
     * @param {page} number - Page number to go to
     */

    const goToCustomPage = (event: SubmitEvent) => {
        const data = new FormData(event.currentTarget as HTMLFormElement);
        const page = parseInt(data.get("page") as string) - 1
        goToPage(page)
        event.preventDefault()
    }
    const goToPage = (page: number) => {
        changePage(page)
    }

    return (
        <>
            {(loading.value == true ? (
                <>
                    <Skeleton className="w-[200px] h-[50px] rounded-xl mx-auto" />
                </>
            ) : (
                <PaginationElement>
                    <PaginationContent>
                        {(current > 0 ?
                            <PaginationItem>
                                <PaginationPrevious href="#" onClick={() => { goToPage(current - 1) }} />
                            </PaginationItem>
                            : "")}

                        {/* First */}
                        {(current > 1 ?
                            <>
                                <PaginationItem>
                                    <PaginationLink href="#" onClick={() => { goToPage(0) }}>{1}</PaginationLink>
                                </PaginationItem>
                                {(current > 2 ?
                                    <PaginationItem>
                                        <PaginationEllipsis />
                                    </PaginationItem>
                                    : "")}
                            </>
                            : "")}

                        {/* Previous */}
                        {(current > 0 ?
                            <PaginationItem>
                                <PaginationLink href="#" onClick={() => { goToPage(current - 1) }}>{current}</PaginationLink>
                            </PaginationItem>
                            : "")}

                        {/* Current */}
                        <PaginationItem>
                            <PaginationLink className="w-20">
                                {/* {current + 1} */}
                                <form onSubmit={goToCustomPage} className="w-full">
                                    <Input name="page" placeholder={current + 1} className="text-center w-full" value={current + 1} />
                                </form>

                            </PaginationLink>
                        </PaginationItem>

                        {/* Next */}
                        {(current < total - 1 ?
                            <PaginationItem>
                                <PaginationLink href="#" onClick={() => { goToPage(current + 1) }}>{current + 2}</PaginationLink>
                            </PaginationItem>
                            : "")}

                        {/* Last */}
                        {(current < total - 2 ?
                            <>
                                {(current < total - 3 ?
                                    <PaginationItem>
                                        <PaginationEllipsis />
                                    </PaginationItem>
                                    : "")}
                                <PaginationItem>
                                    <PaginationLink href="#" onClick={() => { goToPage(total - 1) }}>{total}</PaginationLink>
                                </PaginationItem>
                            </>
                            : "")}
                        {(current < total - 1 ?
                            <PaginationItem>
                                <PaginationNext href="#" onClick={() => { goToPage(current + 1) }} />
                            </PaginationItem>
                            : "")}
                    </PaginationContent>
                </PaginationElement>
            ))}
        </>
    )
}