import { config } from "dotenv";
import { resolve } from "path";
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { users } from "../database/schema";
import { eq } from "drizzle-orm";

// Load .env.local first
config({ path: resolve(process.cwd(), ".env.local") });

const email = "ay37001@gmail.com";

async function setAdmin() {
    try {
        const databaseUrl = process.env.DATABASE_URL;
        
        if (!databaseUrl) {
            console.error("❌ DATABASE_URL bulunamadı!");
            process.exit(1);
        }

        const sql = neon(databaseUrl);
        const db = drizzle({ client: sql, casing: "snake_case" });

        const result = await db
            .update(users)
            .set({ role: "ADMIN" })
            .where(eq(users.email, email))
            .returning();

        if (result.length > 0) {
            console.log(`✅ Başarılı! ${email} artık admin.`);
            console.log("Kullanıcı bilgileri:", {
                id: result[0].id,
                fullName: result[0].fullName,
                email: result[0].email,
                role: result[0].role,
            });
        } else {
            console.log(`❌ Hata: ${email} email adresiyle kayıtlı kullanıcı bulunamadı.`);
        }
    } catch (error) {
        console.error("Hata oluştu:", error);
    }
    process.exit(0);
}

setAdmin();
