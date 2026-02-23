import React from "react";
import Svg, {
  Defs,
  LinearGradient,
  Stop,
  Path,
  Line,
} from "react-native-svg";
import { MountainTheme, getTheme } from "../app/storage";

interface MountainProps {
  progress: number;
  themeId?: string;
}

export function Mountain({ progress, themeId = "classic" }: MountainProps) {
  const theme = getTheme(themeId);
  const c = theme.colors;
  const heightFactor = progress; 
  const baseY = 320;
  const peakY = baseY - 260 * heightFactor;
  const midY1 = baseY - 180 * heightFactor;
  const midY2 = baseY - 200 * heightFactor;
  const midY3 = baseY - 150 * heightFactor;

  const snowLineY = peakY + (baseY - peakY) * 0.25;
  const snowMidY1 = peakY + (midY1 - peakY) * 0.35;
  const snowMidY2 = peakY + (midY2 - peakY) * 0.3;

  if (heightFactor <= 0.02) {
    return (
      <Svg
        viewBox="0 0 500 340"
        style={{ width: "100%", maxWidth: 500, height: 340 }}
      >
        <Line
          x1={20}
          y1={baseY}
          x2={480}
          y2={baseY}
          stroke="rgba(255,255,255,0.1)"
          strokeWidth={1}
        />
      </Svg>
    );
  }

  return (
    <Svg
      viewBox="0 0 500 340"
      style={{ width: "100%", maxWidth: 500, height: 340 }}
    >
      <Defs>
        <LinearGradient id="mtGrad" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0%" stopColor={c.peak} />
          <Stop offset="40%" stopColor={c.mid} />
          <Stop offset="100%" stopColor={c.base} />
        </LinearGradient>
        <LinearGradient id="snGrad" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0%" stopColor={c.snow} />
          <Stop offset="100%" stopColor={c.snowShadow} />
        </LinearGradient>
      </Defs>
      <Path
        d={`M50,${baseY}L120,${midY3}L180,${midY1}L250,${peakY}L310,${midY2}L380,${midY3}L450,${baseY}Z`}
        fill="url(#mtGrad)"
      />
      <Path
        d={`M250,${peakY}L310,${midY2}L380,${midY3}L450,${baseY}L250,${baseY}Z`}
        fill="rgba(0,0,0,0.12)"
      />
      <Path
        d={`M250,${peakY}L200,${baseY}`}
        stroke="rgba(0,0,0,0.08)"
        strokeWidth={1.5}
        fill="none"
      />
      <Path
        d={`M250,${peakY}L320,${baseY}`}
        stroke="rgba(0,0,0,0.06)"
        strokeWidth={1}
        fill="none"
      />
      {heightFactor > 0.3 && (
        <Path
          d={`M180,${snowMidY1}L215,${snowLineY}L250,${peakY}L285,${snowMidY2}L320,${snowLineY}Z`}
          fill="url(#snGrad)"
          opacity={Math.min(1, (heightFactor - 0.3) * 2)}
        />
      )}
      {heightFactor > 0.4 && (
        <>
          <Path
            d={`M140,${baseY - 40}Q200,${baseY - 60}260,${baseY - 45}`}
            stroke="rgba(100,120,140,0.3)"
            strokeWidth={1}
            fill="none"
          />
          <Path
            d={`M200,${baseY - 90}Q260,${baseY - 110}340,${baseY - 85}`}
            stroke="rgba(100,120,140,0.2)"
            strokeWidth={1}
            fill="none"
          />
        </>
      )}
      <Line
        x1={20}
        y1={baseY}
        x2={480}
        y2={baseY}
        stroke="rgba(255,255,255,0.1)"
        strokeWidth={1}
      />
    </Svg>
  );
}
