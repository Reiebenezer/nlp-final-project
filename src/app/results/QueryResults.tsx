"use client";

import config from "@/lib/config";
import Image from "next/image";
import loadingSVG from "@/lib/loading.svg";
import { useEffect, useState } from "react";

/**
 * We are going to need the ff:
 *  - Number of entries (per category selected)
 *  - Number of detected words per entry
 *  - Total number of words
 *
 * We have to split up the entire text into sentences or clauses, separated by punctuation marks (period or comma).
 * If any two consecutive clauses have 5 words or less, merge them.
 */

/**
 * @example
 *
 * We have found {r.spam + r.toxicity} * phrase{r.spam + r.toxicity > 1 ? "s" : ""} with {"spam" if useSpam} {"or" if useSpam && useToxicty} {"toxic" if useToxicity} words,
 * which constitutes {r.detectedPhrases / text.numPhrases * 100.0}% of the entire text.
 *
 * {If useSentiment, add this paragraph.}
 * We also found that the text leans more on the {r.sentiment} side with a confidence value of {r.sentimentConfidence}.
 */

interface ResultSchema {
  sentences: string[];
  sentiment: {
    confidence: number;
    remark: 'positive' | 'neutral' | 'negative'
  };
  spam: {
    count: number;
    results: {
      is_spam: boolean;
      prediction: string;
      spam_probability: number;
      text: string;
    }[],
  },
  toxicity: {
    count: number;
    results: (Record<string, { is_toxic: boolean; probability: number; }> & { is_toxic: boolean; text: string })[]
  }
}

export default function QueryResults({
  text = "",
  useSpam = false,
  useToxicity = false,
  useSentiment = false,
}) {
  const [results, setResults] = useState<ResultSchema>();

  useEffect(() => {
    fetch(config.SERVER, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text, useSpam, useToxicity, useSentiment }),
    })
      .then((res) => res.json())
      .then((json) => setResults(json));
  }, [text, useSpam, useToxicity, useSentiment]);

  if (!results || results.sentences.length === 0) return <Loading />;

  // console.log(results);

  const spam = useSpam
    ? {
        count: results.spam?.count ?? 0,
        results: results.spam?.results ?? [],
      }
    : null;

  const toxicity = useToxicity
    ? {
        count: results.toxicity?.count ?? 0,
        results: results.toxicity?.results ?? [],
      }
    : null;

  const sentiment = useSentiment
    ? {
        remark: results.sentiment?.remark,
        confidence: (results.sentiment?.remark === "negative"
          ? 1 - (results.sentiment?.confidence ?? 0)
          : results.sentiment?.confidence ?? 0
        ).toFixed(2),
      }
    : null;

  return (
    <div className="flex flex-col gap-2 text-sm overflow-auto">
      {(spam || toxicity) &&
      <p>
        {"We have found "}
        {spam && (
          <>
            <code>{spam.count}</code> sentence(s) with spam words
          </>
        )}{" "}
        {spam && toxicity && "and "}
        {toxicity && (
          <>
            <code>{toxicity.count}</code> sentence(s) with toxic words
          </>
        )}
        .
      </p>}

      {sentiment && (
        <p>
          We also found that the text leans more on the{" "}
          <strong>{sentiment.remark}</strong> side with a confidence value of{" "}
          <code>{sentiment.confidence}</code>.
        </p>
      )}

      <p>Below is the detailed list of what we found:</p>

      {spam && (
        <>
          <h3 className="font-bold mt-4">Spam Entries (Total {spam.count})</h3>
          <ul className="grid grid-cols-[1fr_auto] gap-1">
            {spam.results
              .filter((r) => r.is_spam)
              .map((r) => (
                <li key={Math.random()} className="contents">
                  <span className="line-clamp-1">{r.text}</span>

                  <span className="flex gap-1">
                    <code title="Prediction">{r.prediction}</code>
                    <code title="Confidence value">{r.spam_probability}</code>
                  </span>
                </li>
              ))}
          </ul>
        </>
      )}

      {toxicity && (
        <>
          <h3 className="font-bold mt-4">
            Toxic Entries (Total {toxicity.count})
          </h3>
          <ul className="grid grid-cols-[1fr_auto] gap-1">
            {toxicity.results
              .filter((r) => r.is_toxic)
              .map((r) => (
                <li key={Math.random()} className="contents">
                  <span className="line-clamp-1">{r.text}</span>
                  {Object.entries<{ is_toxic: boolean }>(r)
                    .filter((entries) => entries[1].is_toxic)
                    .map(([key]) => (
                      <code title="Toxic Categories" key={Math.random()}>{key}</code>
                    ))}
                </li>
              ))}
          </ul>
        </>
      )}
    </div>
  );
}

const Loading = () => (
  <div className="grid place-items-center h-full">
    <Image src={loadingSVG} alt="loading-icon" />
  </div>
);
