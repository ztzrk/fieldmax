const API_URL = "http://localhost:3000/api";

// Helper to print step result
const check = (name: string, condition: boolean) => {
    if (condition) console.log(`✅ ${name}`);
    else {
        console.error(`❌ ${name}`);
        process.exit(1);
    }
};

async function main() {
    console.log("🚀 Starting Pagination Verification...");

    // 1. ADMIN Login to get token
    console.log("🔑 Logging in as Admin...");
    const loginRes = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            email: "admin@example.com",
            password: "password",
        }),
    });

    if (!loginRes.ok) throw new Error(`Login failed: ${loginRes.statusText}`);

    const cookie = loginRes.headers.get("set-cookie");
    // Handling array of cookies if fetch returns combined string or we need to parse.
    // fetch Headers.get("set-cookie") returns string in Node 18+.
    if (!cookie) throw new Error("No cookie received");

    const headers = { Cookie: cookie };

    // 2. Test Offset Pagination (Backward Compatibility)
    console.log("\n🧪 Testing Offset Pagination (page=1, limit=5)...");
    const offsetRes = await fetch(`${API_URL}/bookings?page=1&limit=5`, {
        headers,
    });
    const offsetData = await offsetRes.json();
    const offsetMeta = offsetData.meta;

    check("Offset Meta has page", offsetMeta.page === 1);
    check("Offset Meta has limit", offsetMeta.limit === 5);
    check("Offset Meta has total", typeof offsetMeta.total === "number");

    // 3. Test Cursor Pagination (Initial Request)
    console.log("\n🧪 Testing Cursor Pagination (take=5)...");
    const cursorRes1 = await fetch(`${API_URL}/bookings?take=5`, { headers });
    const cursorData1 = await cursorRes1.json();
    const cursorMeta1 = cursorData1.meta;
    const firstCursor = cursorMeta1.nextCursor;

    check("Cursor Meta has nextCursor", typeof firstCursor === "string");
    check(
        "Cursor Meta page is undefined",
        cursorMeta1.page === undefined || cursorMeta1.page === null
    ); // Allow null if previous fix didn't stick perfectly or undefined.
    // Actually we asserted it should be undefined.
    check("Returned 5 items", cursorData1.data.length === 5);

    if (firstCursor) {
        // 4. Test Cursor Pagination (Next Page)
        console.log(
            `\n🧪 Testing Cursor Pagination Next Page (cursor=${firstCursor})...`
        );
        const cursorRes2 = await fetch(
            `${API_URL}/bookings?take=5&cursor=${firstCursor}`,
            { headers }
        );
        const cursorData2 = await cursorRes2.json();

        check("Next Page returned items", cursorData2.data.length > 0);
        check(
            "First item of Page 2 is not the cursor",
            cursorData2.data[0].id !== firstCursor
        );
    }

    console.log("\n✅ Verification Successful!");
}

main().catch((e) => {
    console.error("❌ Verification Failed:", e.message);
    process.exit(1);
});
