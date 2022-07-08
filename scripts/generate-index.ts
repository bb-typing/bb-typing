import { fullPath, generateIndex } from "./utils";

// 生成components目录下的index
generateIndex(fullPath('components/src'), true)
generateIndex(fullPath('core/src'), true)