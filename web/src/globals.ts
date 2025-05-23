// Global Constants
export const ANKI = {
    /**
     * API host path
     */
    HOST: "./api/",
    /**
     * Number of cards per page
     */
    CARDS_PER_PAGE: 40,
    /**
     * Number of cards per page
     */
    CARDS_PER_PAGE_OPTIONS: [40, 80, 120],
    /**
     * Default search query (initial query)
     */
    DEFAULT_SEARCH_QUERY: "deck:current",
    /**
     * Base category tag to find tags or interest, which are subtags of the BASE_CATEGORY_TAG
     */
    BASE_CATEGORY_TAG: "#AK_Step2_v12::#OME",
    CATEGORIZE_MISC: false,
    CATEGORIZE_MISC_DEPTH: 4,
    CATEGORIZE_MISC_SIMILARITY: 60,
    // BASE_CATEGORY_TAG: "#AK_Step2_v12"
}
 
// Export
export default {
    ANKI
}