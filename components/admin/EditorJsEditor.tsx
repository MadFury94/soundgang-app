'use client';
import { useEffect, useRef, useCallback } from 'react';

// Editor.js is loaded dynamically to avoid SSR issues
interface EditorJsEditorProps {
    value?: string; // JSON string of Editor.js output
    onChange?: (data: string) => void;
    placeholder?: string;
}

export default function EditorJsEditor({ value, onChange, placeholder = 'Start writing your post...' }: EditorJsEditorProps) {
    const editorRef = useRef<unknown>(null);
    const holderRef = useRef<HTMLDivElement>(null);
    const initializedRef = useRef(false);

    const handleChange = useCallback(async () => {
        if (!editorRef.current) return;
        try {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const data = await (editorRef.current as any).save();
            onChange?.(JSON.stringify(data));
        } catch { /* ignore */ }
    }, [onChange]);

    useEffect(() => {
        if (initializedRef.current || !holderRef.current) return;
        initializedRef.current = true;

        let parsedData: unknown = undefined;
        if (value) {
            try { parsedData = JSON.parse(value); } catch { /* ignore */ }
        }

        async function initEditor() {
            const EditorJS = (await import('@editorjs/editorjs')).default;
            const Header = (await import('@editorjs/header')).default;
            const List = (await import('@editorjs/list')).default;
            const Quote = (await import('@editorjs/quote')).default;
            const Code = (await import('@editorjs/code')).default;
            const Delimiter = (await import('@editorjs/delimiter')).default;
            const Embed = (await import('@editorjs/embed')).default;

            if (!holderRef.current) return;

            editorRef.current = new EditorJS({
                holder: holderRef.current,
                placeholder,
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                data: parsedData as any,
                tools: {
                    header: {
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        class: Header as any,
                        config: { levels: [2, 3, 4], defaultLevel: 2 },
                    },
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    list: { class: List as any, inlineToolbar: true },
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    quote: { class: Quote as any, inlineToolbar: true },
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    code: { class: Code as any },
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    delimiter: { class: Delimiter as any },
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    embed: { class: Embed as any },
                },
                onChange: handleChange,
            });
        }

        initEditor().catch(console.error);

        return () => {
            if (editorRef.current) {
                try {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    (editorRef.current as any).destroy?.();
                } catch { /* ignore */ }
                editorRef.current = null;
                initializedRef.current = false;
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div
            ref={holderRef}
            className="min-h-[400px] prose prose-invert max-w-none
                [&_.ce-block]:text-white
                [&_.ce-toolbar__plus]:text-gray-400
                [&_.ce-toolbar__settings-btn]:text-gray-400
                [&_.cdx-block]:text-white
                [&_.ce-paragraph]:text-gray-200
                [&_h2]:text-white [&_h3]:text-white [&_h4]:text-white
                [&_.cdx-quote__text]:text-gray-200
                [&_.cdx-quote__caption]:text-gray-400"
        />
    );
}
