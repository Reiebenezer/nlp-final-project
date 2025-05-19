'use client'
import CheckButton from "@/lib/CheckButton";
import { ArrowLeftIcon, CheckIcon } from "@phosphor-icons/react/dist/ssr";
import { marked } from "marked";
import Link from "next/link";
import { Suspense, useEffect, useState } from "react";
import QueryResults from "./QueryResults";

export default function Results() {
    
    const [text, setText] = useState('');
    const [useSpam, setUseSpam] = useState(false);
    const [useToxicity, setUseToxicity] = useState(false);
    const [useSentiment, setUseSentiment] = useState(false);
    
    useEffect(() => {
        setText(localStorage.getItem('text') ?? '');
        setUseSpam(localStorage.getItem('use-spam') === 'true');
        setUseToxicity(localStorage.getItem('use-toxicity') === 'true');
        setUseSentiment(localStorage.getItem('use-sentiment') === 'true');
    })
    
    // Use the api here

    return (
        <div className="grow p-12 grid grid-rows-[auto_1fr] gap-8 overflow-hidden">
            <Link href="/" className="flex gap-2 items-center hover:text-primary transition-colors">
                <ArrowLeftIcon />
                <small>Back to Homepage</small>
            </Link>

            <div className="grid grid-cols-[1fr_2fr] gap-6 overflow-hidden">
                <div className="flex flex-col gap-2">
                    <div className="grow border border-accent rounded-md p-2">
                        <span className="opacity-40">{text}</span>
                    </div>
                    <Link href="/" className="p-2 rounded-md text-sm text-center bg-foreground text-background">Check using a different text</Link>
                    <Link href="/#about" className="p-2 rounded-md text-sm text-center border-2 border-foreground">Learn more about this project</Link>
                </div>
                <div className="flex flex-col gap-2 overflow-auto">
                    <div>
                        <small>You asked for the following: </small>
                        <div className="flex gap-2 items-end">
                            <CheckButton active={useSpam}>
                                Spam Detection
                            </CheckButton>
                            <CheckButton active={useToxicity}>
                                Toxicity Detection
                            </CheckButton>
                            <CheckButton active={useSentiment}>
                                Sentiment Analysis
                            </CheckButton>

                            <button className="ml-auto bg-foreground text-background">
                                Rate this analysis
                            </button>
                        </div>
                    </div>

                    <div className="grow border border-accent rounded-md p-2 overflow-auto">
                        <QueryResults text={text} useSpam={useSpam} useToxicity={useToxicity} useSentiment={useSentiment} />
                    </div>
                </div>
            </div>
        </div>
    );
}