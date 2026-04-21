// Type declarations for Editor.js plugins that don't resolve via package exports
declare module '@editorjs/embed' {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const Embed: any;
    export default Embed;
}

declare module '@editorjs/delimiter' {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const Delimiter: any;
    export default Delimiter;
}
