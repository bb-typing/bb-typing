import { readdirSync, statSync, writeFileSync } from "fs";
import { join } from "path";
import { fileURLToPath } from "url";

export function generateIndex(path: string) {
  const fileList = readdirSync(path);
  let text = "";
  fileList.forEach((dir) => {
    const nameList = dir.split(".");
    const fuleName = nameList.slice(0, -1).join();
    if (
      statSync(join(path, dir)).isFile() &&
      ["ts", "tsx"].includes(nameList.at(-1)?.toLowerCase() || "") &&
      fuleName !== "index"
    ) {
      text += `export * from './${fuleName}'\n`;
    }
  });
  
  writeFileSync(join(path, "index.ts"), text, { encoding: "utf-8" });
}

export function fullPath(path: string) {
  return fileURLToPath(new URL(join("../packages/", path), import.meta.url));
}
