"use client";
import { useEffect, useRef, useState } from "react";
import PoemCanvas from "./components/PoemCanvas";
import { newLineOptions } from "./constants";

type PoemLines = {
  text: string;
  startingLine: number;
  columnLine: number;
};

export default function Home() {
  const [lines, setLines] = useState<PoemLines[]>([]);
  const [poem, setPoem] = useState<string>("");
  const [errors, setErrors] = useState<string>("");

  const linesInputContainerRef = useRef<HTMLInputElement>(null);

  function handleClick(numLines: number) {
    const newLines = [];
    for (let idx = 0; idx < numLines; idx++) {
      let newStartingLine: number;
      if (lines.length > 0) {
        newStartingLine =
          Math.max(...lines.map((line) => line.startingLine)) + idx + 1;
      } else {
        newStartingLine = 0;
      }
      const currLine = {
        text: "",
        startingLine: newStartingLine,
        columnLine: 0,
      };
      newLines.push(currLine);
    }

    setLines([...lines, ...newLines]);
  }

  function handleInputChange(e: any, idx: number) {
    const { name, value }: { name: string; value: string } = e.target;
    const newLines = [...lines];
    const line = newLines[idx];
    if (name !== "text") {
      line[name] = parseInt(value);
    } else {
      line[name] = value;
    }

    setLines(newLines);
  }

  useEffect(() => {
    function generatePoem() {
      let poem = "";

      const newLines = [...lines].sort(
        (a, b) => a.startingLine - b.startingLine || a.columnLine - b.columnLine
      );

      let lastLine = 0;
      let lastLength = 0;

      let errorsFlag: boolean = false;

      newLines.forEach((line) => {
        let whiteSpace;
        const numNewLines = line.startingLine - lastLine;
        const numNewLinesString = "\n".repeat(line.startingLine - lastLine);

        if (numNewLines === 0 && lastLength > line.columnLine) {
          setErrors(
            `cannot have overlapping text, fix the line here ${line.text} at line ${line.startingLine} `
          );
          errorsFlag = true;
          return;
        }

        if (numNewLines === 0) {
          whiteSpace = " ".repeat(line.columnLine - lastLength);
        } else {
          whiteSpace = " ".repeat(line.columnLine);
        }

        lastLength = line.columnLine + line.text.length;
        lastLine = line.startingLine;

        poem += numNewLinesString + whiteSpace + line.text;
      });

      if (!errorsFlag) {
        setErrors("");
      }

      return poem;
    }
    const poem = generatePoem();
    setPoem(poem);
  }, [lines]);

  function sortLines() {
    const newLines = [...lines];
    newLines.sort(
      (a, b) => a.startingLine - b.startingLine || a.columnLine - b.columnLine
    );
    setLines(newLines);
  }

  return (
    <main className="py-8 px-16">
      <div className="flex gap-16">
        <div className="flex-[2] flex flex-col gap-4">
          <div className="flex gap-4 font-bold">
            <h2 className="flex-grow">Text</h2>
            <h2 className="w-16"> Row</h2>
            <h2 className="w-16">Column</h2>
          </div>
          {lines.length > 0 && (
            <div ref={linesInputContainerRef} className="gap-4 flex flex-col">
              {lines.map((currLine, idx) => {
                const randomIdx = idx % newLineOptions.length;
                return (
                  <div key={idx} className="flex gap-4">
                    <input
                      type="text"
                      name="text"
                      className="border-2 border-black rounded-sm px-2 py-1 flex-grow"
                      placeholder={newLineOptions[randomIdx]}
                      value={currLine.text}
                      onChange={(e) => handleInputChange(e, idx)}
                    />
                    <input
                      type="number"
                      value={currLine.startingLine}
                      name="startingLine"
                      min="0"
                      className="w-16 border-black border-2 px-2"
                      onChange={(e) => handleInputChange(e, idx)}
                    />
                    <input
                      type="number"
                      value={currLine.columnLine}
                      name="columnLine"
                      min="0"
                      className="w-16 border-black border-2 px-2"
                      onChange={(e) => handleInputChange(e, idx)}
                    />
                  </div>
                );
              })}
            </div>
          )}
          <div className="flex gap-4 justify-end">
            <button
              onClick={() => handleClick(1)}
              className="text-white bg-slate-800 hover:bg-slate-700 mt-4 px-4 py-2"
            >
              Add a line
            </button>
            <button
              onClick={() => handleClick(10)}
              className="text-white bg-slate-800 hover:bg-slate-700 mt-4 px-4 py-2"
            >
              Add 10 lines
            </button>
            <button
              className="text-white bg-slate-800 hover:bg-slate-700 mt-4 px-4 py-2"
              onClick={sortLines}
            >
              Sort lines
            </button>
          </div>
        </div>
        <PoemCanvas poem={poem} errors={errors} />
      </div>
    </main>
  );
}
