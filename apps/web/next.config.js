import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const nextConfig = {
    // Removed deprecated 'turbopack' experimental key for Next.js 16+ compatibility
};

export default nextConfig;
