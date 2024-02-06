"use client";
import { useEffect, useRef, useState } from "react";

// type PoemLines = {
//   text: string;
//   startingLine: number;
//   columnLine: number;
// };

function hexToRgb(hex: string) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

function rgbToLuminance(r: number, g: number, b: number) {
  const Y = 0.299 * r + 0.587 * g + 0.114 * b;
  return Y;
}

export default function Home() {
  const [lines, setLines] = useState<any[]>([]);
  const [poem, setPoem] = useState<string>("");
  const [errors, setErrors] = useState<string>("");
  const [color, setColor] = useState<string>("#ffffff");
  const [darkText, setDarkText] = useState<boolean>(true);

  const linesInputContainerRef = useRef<HTMLInputElement>(null);

  function handleClick() {
    let newStartingLine: number;
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
    const { name, value }: { name: string; value: string } = e.target;
    const list = [...lines];
    const line = list[idx];
    line[name] = value;
    setLines(list);
  }

  useEffect(() => {
    const RGBColor = hexToRgb(color);
    const Y = rgbToLuminance(
      RGBColor!.r / 255,
      RGBColor!.g / 255,
      RGBColor!.b / 255
    );
    console.log(Y <= 0.5);
    setDarkText(Y <= 0.5);
    console.log("hi");
  }, [color]);

  useEffect(() => {
    function generatePoem() {
      let poem = "";
      const newLines = [...lines].sort(
        (a, b) => a.startingLine - b.startingLine || a.columnLine - b.columnLine
      );
      console.log(newLines);
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

  return (
    <main className="py-8 px-16">
      <div className="flex justify-end items-center py-4">
        <button className="px-3 py-2 bg-purple-200">Copy poem</button>
        <input
          type="color"
          onChange={(e) => setColor(e.target.value)}
          value={color}
        />
      </div>
      <div className="flex gap-16">
        <div className="flex-[2]">
          <div className="flex gap-4 font-bold">
            <h2 className="flex-grow">Text</h2>
            <h2 className="w-16"> Row</h2>
            <h2 className="w-16">Column</h2>
          </div>
          <div ref={linesInputContainerRef}>
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
                    className="w-16 border-black border-2 px-2"
                    onChange={(e) => handleInputChange(e, idx)}
                  />
                  <input
                    type="number"
                    defaultValue={currLine.columnLine}
                    name="columnLine"
                    min="0"
                    className="w-16 border-black border-2 px-2"
                    onChange={(e) => handleInputChange(e, idx)}
                  />
                </div>
              );
            })}
          </div>
          <button
            onClick={() => handleClick()}
            className="text-white bg-slate-800 hover:bg-slate-700 mt-4 px-4 py-2"
          >
            Add a line
          </button>
        </div>
        <p
          className="p-4 flex-[3] border-2 border-black font-serif min-h-[80vh] whitespace-pre"
          style={{
            backgroundColor: color,
            color: darkText ? "#f6f6f6" : "#191919",
          }}
        >
          {errors ? errors : poem}
        </p>
      </div>
    </main>
  );
}
