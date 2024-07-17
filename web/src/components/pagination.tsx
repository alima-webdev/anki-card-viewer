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

/**
 * Render the pagination component
 *
 * @param {paginationSignal} signal - Pagination signal used to determine the current page and total number of pages
 * @returns {Component}
 */
export function PaginationComponent({ paginationSignal }) {
    // Get the current page and total number of pages from the signal
    const { current, total } = paginationSignal.value

    /**
     * Change the page to the desired number
     *
     * @param {page} number - Page number to go to
     */
    const goToPage = (page: number) => {
        paginationSignal.value = { current: page, total: paginationSignal.value.total }
    }
    
    return (
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
                    <PaginationLink href="#" isActive>{current + 1}</PaginationLink>
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
    )
}