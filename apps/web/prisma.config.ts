import { defineConfig } from 'prisma/config'; // Note: 'prisma/config', not '@prisma/config'
import dotenv from 'dotenv';
import path from 'path';

// 1. Force load the .env file from the current directory
dotenv.config({ path: path.join(process.cwd(), '.env') });

// 2. Debug: Print to terminal so we KNOW it loaded (Check your terminal after running!)
console.log("--------------------------------------");
console.log("DEBUG: Loading .env from:", path.join(process.cwd(), '.env'));
console.log("DEBUG: DATABASE_URL is:", process.env.DATABASE_URL ? "FOUND ✅" : "MISSING ❌");
console.log("--------------------------------------");

export default defineConfig({
    datasource: {
        // 3. Use the process.env directly to be 100% sure
        url: process.env.DATABASE_URL,
    },
});