import { readFileSync, writeFileSync } from "fs";
let code = readFileSync("sync-izlealan.mjs", "utf8");

// Use a simple replace for the function definition
code = code.replace(/function transformProviderSource\([\s\S]*?return transformed;\n\}/m, `function transformProviderSource(code, number) {
  const targetName = \`han's \${number}\`;
  const charName = KNOWN_CHARACTER_NAMES_MAP[number];
  let transformed = code;
  
  if (charName) {
    transformed = transformed.replaceAll(\`"\\$\\{charName\\}"\`, \`"\\$\\{targetName\\}"\`);
    transformed = transformed.replaceAll(\`\\\`\\$\\{charName\\}\\\`\`, \`\\\`\\$\\{targetName\\}\\\`\`);
    transformed = transformed.replaceAll(\`\\\`\\$\\{charName\\} \`, \`\\\`\\$\\{targetName\\} \`);
    transformed = transformed.replaceAll(\`\\$\\{charName\\} [\`, \`\\$\\{targetName\\} [\`);
  }

  transformed = transformed.replace(/name:[a-z]\\.name,title:/g, \`name:"\\$\\{targetName\\}",provider:"\\$\\{targetName\\}",title:\`);
  transformed = transformed.replace(/name:[a-z]\\.source_name\\|\\|"[^"]+",/g, \`name:"\\$\\{targetName\\}",provider:"\\$\\{targetName\\}",\`);
  transformed = transformed.replace(/name:[a-z]\\.source_name,/g, \`name:"\\$\\{targetName\\}",provider:"\\$\\{targetName\\}",\`);
  transformed = transformed.replace(
    /if \\(typeof module !== "undefined" && module\\.exports\\) \\{ if \\(_gs\\) module\\.exports\\.getStreams = _gs; if \\(_sub\\) module\\.exports\\.getSubtitles = _sub; \\}/g,
    \`if (typeof module !== "undefined" && module.exports) { try { if (_gs) module.exports.getStreams = _gs; } catch {} try { if (_sub) module.exports.getSubtitles = _sub; } catch {} }\`
  );
  return transformed;
}`);

// Wait, I messed up the template literal escaping AGAIN!
