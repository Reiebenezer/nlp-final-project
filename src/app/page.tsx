"use client";

import { FormEvent, KeyboardEventHandler, useState } from "react";
import { PaperPlaneRightIcon } from "@phosphor-icons/react";
import TextareaAutoSize from "react-textarea-autosize";
import { useRouter } from "next/navigation";
import CheckButton from "@/lib/CheckButton";

export default function Home() {
  const router = useRouter();

  const [text, setText] = useState("");
  const [spam, setSpam] = useState(false);
  const [toxicity, setToxicity] = useState(false);
  const [sentiment, setSentiment] = useState(false);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    localStorage.clear();
    localStorage.setItem('text', text);

    if (spam) localStorage.setItem('use-spam', 'true');
    if (toxicity) localStorage.setItem('use-toxicity', 'true');
    if (sentiment) localStorage.setItem('use-sentiment', 'true');

    router.push('/results');
  }

  const handleEnter: KeyboardEventHandler<HTMLTextAreaElement> = (e) => {
    if (e.code === 'Enter') {
      if (e.shiftKey || e.ctrlKey)
        return;
      
      e.preventDefault();
      e.currentTarget.form?.requestSubmit();
    }
  }

  return (
    <div className="flex flex-col items-center">
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <a href="#about">
          <h1 className="text-6xl font-title hover:text-accent transition-colors">
            SimpleAnalyst
          </h1>
        </a>
        <p>
          Text analysis made simple. Try adding a &apos;suspicious&apos; message below!
        </p>

        <form className="w-[min(720px,80vw)] my-4 flex justify-between items-end p-2 border-2 border-accent rounded-lg" onSubmit={handleSubmit}>
          <TextareaAutoSize
            name="message"
            placeholder="Type something here..."
            className="outline-none grow resize-none self-center"
            onChange={(e) => setText(e.target.value)}
            value={text}
            onKeyDown={handleEnter}
          ></TextareaAutoSize>
          <button className="aspect-1 p-2 border-none hover:text-accent">
            <PaperPlaneRightIcon className="size-5" />
          </button>
        </form>

        <div className="grid justify-items-center gap-2 mt-4">
          <small className="opacity-100">
            Select the tasks that you want me to do:
          </small>

          <div className="flex gap-2">
            <CheckButton type="button" active={spam} setActive={setSpam}>Spam Detection</CheckButton>
            <CheckButton type="button" active={toxicity} setActive={setToxicity}>Toxicity Detection</CheckButton>
            <CheckButton type="button" active={sentiment} setActive={setSentiment}>Sentiment Analysis</CheckButton>
          </div>
        </div>
      </div>
      <div id="about" className=" w-[min(720px,80vw)] min-h-screen grid place-content-center">
        <h2 className="text-4xl font-black">About this project</h2>
        <p className='my-4'>SimpleAnalyst is an intuitive text analysis tool designed to help users quickly identify key characteristics in written content.</p>
        <p className='my-4'>With just a few clicks, users can analyze messages for <code>spam</code>, <code>toxicity</code>, and <code>sentiment</code>, making it ideal for moderating online platforms, enhancing user safety, or gaining insight into public feedback. </p>
        <p className='my-4'>This project is developed by Bachelor of Science in Computer Science 3B students Joven Carl Rex Biaca, John Paul Sapasap, Kyle Eron Hallares, Rei Ebenezer Duhina, and Lord Patrick Raizen Togonon.</p>
      </div>
    </div>
  );
}
