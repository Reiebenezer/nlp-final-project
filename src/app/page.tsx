"use client";

import { FormEvent, KeyboardEventHandler, useState } from "react";
import { CheckIcon, PaperPlaneRightIcon } from "@phosphor-icons/react";
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

    spam && localStorage.setItem('use-spam', 'true');
    toxicity && localStorage.setItem('use-toxicity', 'true');
    sentiment && localStorage.setItem('use-sentiment', 'true');

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
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">
      <a href="#about">
        <h1 className="text-6xl font-title hover:text-accent transition-colors">
          SimpleAnalyst
        </h1>
      </a>
      <p>
        Text analysis made simple. Try adding a 'suspicious' message below!
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
  );
}
