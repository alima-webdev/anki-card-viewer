// import { log } from "../devtools";
/**
 * Execute a function using a WebWorker
 * 
 * @example
 * 
    const searchQuery = { value: 123 }
    const paginationSignal = { value: { current: 321 } }
    const performQuery = async (worker, { query, page }) => {
        console.log("Worker: Function Executed")
        worker.postMessage({ success: true })
    }
    useWorker(performQuery, { query: searchQuery.value, page: paginationSignal.value.current }, (data) => {
        console.log(data)
    })
 * @param {func} Function - Any function to be executed by the worker
 * @param {data} Object - Object containing the function parameters
 * @param {callbackFn} Function - Callback function
 */
export function useWorker(func: any, data: any, callbackFn: any) {
    // Create the worker with the desired function
    const webWorker = new Worker(URL.createObjectURL(new Blob([`
        self.onmessage = async function(e) {
            const result = await (${func.toString()})(self, e.data);
            self.postMessage(result);
        }
    `], { type: 'application/javascript' })));
    // When finished executing, call the callback function
    webWorker.onmessage = (e) => {
        callbackFn(e.data)
    };
    // Run the worker with the provided data
    webWorker.postMessage(data);
}

/**
 * Async implementation of the useWorker function with no callback function needed
 * @param {func} Function - Any function to be executed by the worker
 * @param {data} Object - Object containing the function parameters
 */
export function useWorkerAsync(func, data) {
    return new Promise((resolve, reject) => {
        // Wait for the worker to finish and call the callback function
        useWorker(func, data, (data) => {
            resolve(data)
        })
    })
}

function test() {
    const searchQuery = { value: 123 }
    const paginationSignal = { value: { current: 321 } }
    const performQuery = async (worker, { query, page }) => {
        console.log("Worker: Function Executed")
        worker.postMessage({ success: true })
    }
    useWorker(performQuery, { query: searchQuery.value, page: paginationSignal.value.current }, (data) => {
        console.log(data)
    })
}
test()
console.log("END")


// Create instance
// const workerInstance = new WebWorkerInstance()
// workerInstance.setFunction(func)


// return workerInstance

// class WebWorkerInstance {
//     webWorker: Worker;
//     func: string;
//     constructor() {

//     }
//     setFunction(func: any) {
//         this.func = func
//         this.webWorker = new Worker(URL.createObjectURL(new Blob([`
//             self.onmessage = function(e) {
//                 const result = (${func.toString()})(e.data);
//                 self.postMessage(result);
//             }
//         `], { type: 'application/javascript' })));

//         this.webWorker.onmessage = (e) => {

//         };
//     }
// }




// // import { useEffect, useRef, useState } from 'react';

// // const useWorker = (workerFunction) => {
// //   const [worker, setWorker] = useState(null);
// //   const [result, setResult] = useState(null);
// //   const workerRef = useRef(worker);

// //   useEffect(() => {
// //     const createWorker = () => {
// //       const workerInstance = new Worker(URL.createObjectURL(new Blob([`
// //         self.onmessage = function(e) {
// //           const result = (${workerFunction.toString()})(e.data);
// //           self.postMessage(result);
// //         }
// //       `], { type: 'application/javascript' })));

// //       workerInstance.onmessage = (e) => {
// //         setResult(e.data);
// //       };

// //       return workerInstance;
// //     };

// //     setWorker(createWorker());
// //   }, [workerFunction]);

// //   const runWorker = (data) => {
// //     if (workerRef.current) {
// //       workerRef.current.postMessage(data);
// //     }
// //   };

// //   useEffect(() => {
// //     if (worker) {
// //       workerRef.current = worker;
// //       return () => {
// //         worker.terminate();
// //       };
// //     }
// //   }, [worker]);

// //   return [runWorker, result];
// // };

// // export default useWorker;
