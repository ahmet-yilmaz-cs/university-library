import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { pgTable, uuid, varchar, text, integer, timestamp, date, pgEnum } from "drizzle-orm/pg-core";
import { eq } from "drizzle-orm";

const DATABASE_URL = "postgresql://neondb_owner:npg_ea8ICWbT5kXh@ep-dark-glitter-a236cz7i-pooler.eu-central-1.aws.neon.tech/neondb?sslmode=require";

const sql = neon(DATABASE_URL);
const db = drizzle({ client: sql, casing: "snake_case" });

const ROLE_ENUM = pgEnum("role", ["USER", "ADMIN"]);

const users = pgTable("users", {
    id: uuid("id").notNull().primaryKey().defaultRandom().unique(),
    fullName: varchar("full_name", { length: 255 }).notNull(),
    email: text("email").notNull().unique(),
    role: ROLE_ENUM("role").default("USER"),
});

async function makeAdmin() {
    // Get all users to find the test account
    const allUsers = await db.select().from(users);
    console.log("All users:", allUsers.map(u => ({ id: u.id, email: u.email, role: u.role })));

    if (allUsers.length > 0) {
        // Update the first user to be admin
        const testUser = allUsers[0];
        console.log("Making user admin:", testUser.email);

        await db
            .update(users)
            .set({ role: "ADMIN" })
            .where(eq(users.id, testUser.id));

        console.log("User role updated to ADMIN");

        // Verify the update
        const updatedUsers = await db.select().from(users);
        console.log("Updated users:", updatedUsers.map(u => ({ id: u.id, email: u.email, role: u.role })));
    } else {
        console.log("No users found");
    }

    process.exit(0);
}

makeAdmin().catch(console.error);
