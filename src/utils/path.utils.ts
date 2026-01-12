import path from 'node:path';
import { fileURLToPath } from 'node:url';


const __filename = fileURLToPath(import.meta.url);
const __rootdir = path.join(path.dirname(__filename), '..', '..', '..'); // navigate root directory

export { __rootdir }