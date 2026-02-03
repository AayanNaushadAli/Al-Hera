import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const nextConfig = {
    experimental: {
        // Fix for "detected multiple lockfiles" warning in monorepo
        turbopack: {
            root: path.resolve(__dirname, "../../"),
        }
    }
};

export default nextConfig;
