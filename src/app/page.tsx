"use client";
import { useEffect, useState } from "react";

export default function Home() {
  const [lines, setLines] = useState<any[]>([]);
  const [poem, setPoem] = useState<string>("");
  const [errors, setErrors] = useState<string>("");

  function handleClick() {
    let newStartingLine;
    if (lines.length > 0) {
      newStartingLine = Math.max(...lines.map((line) => line.startingLine)) + 1;
    } else {
      newStartingLine = 0;
    }

    setLines([
      ...lines,
      { text: "", startingLine: newStartingLine, columnLine: 0 },
    ]);
  }

  function handleInputChange(e: any, idx: number) {
    const { name, value } = e.target;
    const list = [...lines];
    list[idx][name] = value;
    setLines(list);
  }

  useEffect(() => {
    function generatePoem() {
      let poem = "";
      const newLines = [...lines].sort(
        (a, b) => a.startingLine - b.startingLine
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
            "cannot have overlapping text, fix this line here: " + line.text
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

  return (
    <main className="m-16 flex">
      <div className="w-1/2 mr-4">
        <div className="flex gap-4">
          <h2 className="flex-grow font-bold">Text</h2>
          <h2 className="w-24 font-bold"> Row</h2>
          <h2 className="w-24 font-bold">Column</h2>
        </div>
        {lines.map((currLine, idx) => {
          return (
            <div key={idx} className="flex gap-4 mt-4">
              <input
                type="text"
                name="text"
                className="border-2 border-black rounded-sm px-2 py-1 flex-grow"
                placeholder="text here..."
                onChange={(e) => handleInputChange(e, idx)}
              />
              <input
                type="number"
                defaultValue={currLine.startingLine}
                name="startingLine"
                min="0"
                className="w-24 border-black border-2 px-2"
                onChange={(e) => handleInputChange(e, idx)}
              />
              <input
                type="number"
                defaultValue={currLine.columnLine}
                name="columnLine"
                min="0"
                className="w-24 border-black border-2 px-2"
                onChange={(e) => handleInputChange(e, idx)}
              />
            </div>
          );
        })}
        <button
          onClick={() => handleClick()}
          className="text-white bg-black mt-4 px-4 py-2"
        >
          Add a line
        </button>
      </div>
      <p className="p-4 min-w-[50vw] border-2 border-black min-h-[80vh] whitespace-pre">
        {errors ? errors : poem}
      </p>
    </main>
  );
}
