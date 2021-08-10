// It's just hacks all the way down

// Seriously, though, TS doesn't recognise Global Fetch
// Global Fetch is needed for 'node-fetch'
// 'node-fetch' is needed for the apollo createHttpLink

/// <reference lib="dom" />
declare interface GlobalFetch {
    fetch(input: RequestInfo, init?: RequestInit): Promise<Response>
}

declare module 'node-fetch' {
    const fetch: GlobalFetch['fetch'];
    export default fetch;
}
