declare const _default: ({
    input: string;
    output: ({
        file: string;
        format: string;
        sourcemap: boolean;
        plugins?: undefined;
    } | {
        file: string;
        format: string;
        plugins: import("rollup").Plugin[];
        sourcemap: boolean;
    })[];
    plugins?: undefined;
} | {
    input: string;
    output: {
        file: string;
        format: string;
        name: string;
        sourcemap: boolean;
    };
    plugins: import("rollup").Plugin[];
})[];
export default _default;
