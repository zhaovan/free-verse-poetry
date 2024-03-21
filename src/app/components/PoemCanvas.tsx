import React from "react";
import { useState, useEffect, useRef } from "react";
import { hexToRgb, rgbToLuminance } from "../colors";
import html2canvas from "html2canvas";
import { FileArrowDown } from "@phosphor-icons/react";
import IconButton from "./IconButton";

type PoemCanvasProps = {
  poem: string;
  errors: string;
};

export default function PoemCanvas({ poem, errors }: PoemCanvasProps) {
  const [color, setColor] = useState<string>("#ffffff");
  const [darkText, setDarkText] = useState<boolean>(true);
  const poemRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const RGBColor = hexToRgb(color);
    const Y = rgbToLuminance(
      RGBColor!.r / 255,
      RGBColor!.g / 255,
      RGBColor!.b / 255
    );

    setDarkText(Y <= 0.5);
  }, [color]);

  async function screenshotPoem() {
    if (poemRef.current) {
      const canvas = await html2canvas(poemRef.current);
      const img = canvas.toDataURL("image/png");

      const link = document.createElement("a");
      link.href = img;
      link.download = "poem.png";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }

  return (
    <div className="flex-[3] sticky self-start top-8">
      <p
        className="p-4  border-2 border-black font-serif min-h-[80vh] whitespace-pre"
        style={{
          backgroundColor: color,
          color: darkText ? "#f6f6f6" : "#191919",
        }}
        ref={poemRef}
      >
        {errors ? errors : poem}
      </p>
      <div className="flex justify-end items-center py-4 gap-4">
        <input
          type="color"
          onChange={(e) => setColor(e.target.value)}
          value={color}
        />
        <IconButton onClick={screenshotPoem}>
          <FileArrowDown color={"white"} size={24} />
        </IconButton>
      </div>
    </div>
  );
}
