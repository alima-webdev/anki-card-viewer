// Imports

// @ts-ignore: Temporary and for development only. The module does work regardless of the typescript warning
import { terminal } from 'virtual:terminal'

/**
 * Log function that outputs to the terminal
 * @param args 
 */
export function log(args) {
    terminal.log(args.replace("#", "!").replace("&", "n"))
}

export function isDevelopment() {
    return import.meta.env.MODE == "development"
}