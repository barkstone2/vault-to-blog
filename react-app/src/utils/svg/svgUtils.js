import fs from "fs";
import {fromParse5} from "hast-util-from-parse5";
import * as parse5 from "parse5";
import {h} from "hastscript";

export const calloutSvgPath = (iconName) => `public/images/callouts/${iconName}.svg`
export function loadCalloutSVGSync(filePath) {
  try {
    const svgContent = fs.readFileSync(filePath, 'utf-8');
    return fromParse5(parse5.parseFragment(svgContent));
  } catch {
    try {
      const svgContent = fs.readFileSync(calloutSvgPath('info'), 'utf-8');
      return fromParse5(parse5.parseFragment(svgContent));
    } catch {
      return h('div');
    }
  }
}