import { readFileSync, writeFileSync, readdirSync } from "fs";

const KNOWN_CHARACTER_NAMES = {
  1: "Imu", 2: "JoyBoy", 3: "Enel", 4: "Crocodile", 5: "Xebec", 6: "Kidd", 7: "Shiki", 8: "Emeth",
  9: "Saul", 10: "Garp", 11: "Ryuma", 12: "Rouge", 13: "Kalgara", 14: "Sakazuki", 15: "Shanks", 16: "Kizaru",
  17: "Smoker", 18: "Zunesha", 19: "Oden", 20: "Fujitora", 21: "Lili", 22: "Sabo", 23: "Vegapunk", 24: "Mihawk",
  25: "Noland", 26: "Doflamingo", 27: "Dragon", 28: "Teach", 29: "Roger", 30: "Kuzan", 31: "Rayleigh",
  32: "Gorosei", 33: "Ace", 34: "Hiriluk", 35: "Urouge", 36: "Gaban"
};

function transformProviderSource(code, number) {
  const targetName = `han's ${number}`;
  const charName = KNOWN_CHARACTER_NAMES[number];
  let transformed = code;
  
  if (charName) {
    // Replace "CharName" string literals
    transformed = transformed.replaceAll(`"${charName}"`, `"${targetName}"`);
    transformed = transformed.replaceAll(`\`${charName}\``, `\`${targetName}\``);
    transformed = transformed.replaceAll(`\`${charName} `, `\`${targetName} `);
    // Specifically handle Sabo [${V}] and Dragon [${F+1}]
    transformed = transformed.replaceAll(`${charName} [`, `${targetName} [`);
    
    // Some providers have "CharName: ..." logs, wait, that was in the backtick.
  }

  // General fixes for source_name usage (mostly for metadata, just in case)
  transformed = transformed.replace(/name:[a-z]\.name,title:/g, `name:"${targetName}",provider:"${targetName}",title:`);
  transformed = transformed.replace(/name:[a-z]\.source_name\|\|"[^"]+",/g, `name:"${targetName}",provider:"${targetName}",`);
  transformed = transformed.replace(/name:[a-z]\.source_name,/g, `name:"${targetName}",provider:"${targetName}",`);

  // Fix module exports override for cloudstream
  transformed = transformed.replace(
    /if \(typeof module !== "undefined" && module\.exports\) \{ if \(_gs\) module\.exports\.getStreams = _gs; if \(_sub\) module\.exports\.getSubtitles = _sub; \}/g,
    `if (typeof module !== "undefined" && module.exports) { try { if (_gs) module.exports.getStreams = _gs; } catch {} try { if (_sub) module.exports.getSubtitles = _sub; } catch {} }`
  );

  return transformed;
}

// Modify sync-izlealan.mjs itself so future syncs work
const syncCode = readFileSync("sync-izlealan.mjs", "utf8");
let newSyncCode = syncCode.replace(
  /const output = `\$\{providerSource\.replace\(\/\\s\+\$\/, ""\)\}\\n\$\{streamWrapper\(number\)\}`;/,
  'const output = `${transformProviderSource(providerSource, number).replace(/\\s+$/, "")}\\n${streamWrapper(number)}`;'
);

// We should also replace the KNOWN_CHARACTER_NAMES and transformProviderSource in sync-izlealan.mjs
const regex = /const KNOWN_CHARACTER_NAMES = \[\s*[\s\S]*?\];\s*function transformProviderSource[\s\S]*?return transformed;\n}/m;

const newTransform = `const KNOWN_CHARACTER_NAMES_MAP = {
  1: "Imu", 2: "JoyBoy", 3: "Enel", 4: "Crocodile", 5: "Xebec", 6: "Kidd", 7: "Shiki", 8: "Emeth",
  9: "Saul", 10: "Garp", 11: "Ryuma", 12: "Rouge", 13: "Kalgara", 14: "Sakazuki", 15: "Shanks", 16: "Kizaru",
  17: "Smoker", 18: "Zunesha", 19: "Oden", 20: "Fujitora", 21: "Lili", 22: "Sabo", 23: "Vegapunk", 24: "Mihawk",
  25: "Noland", 26: "Doflamingo", 27: "Dragon", 28: "Teach", 29: "Roger", 30: "Kuzan", 31: "Rayleigh",
  32: "Gorosei", 33: "Ace", 34: "Hiriluk", 35: "Urouge", 36: "Gaban"
};

function transformProviderSource(code, number) {
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
}`;

newSyncCode = newSyncCode.replace(regex, newTransform);
writeFileSync("sync-izlealan.mjs", newSyncCode);
console.log("Updated sync-izlealan.mjs");
