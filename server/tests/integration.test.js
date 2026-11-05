const assert = require("assert");
const express = require("express");
const cors = require("cors");
const { initializeDatabase, db } = require("../database/db");
const authRoutes = require("../routes/authRoutes");
const complaintRoutes = require("../routes/complaintRoutes");

async function runIntegrationTests() {
  console.log("==================================================================");
  console.log("🚀 Starting CampusFix Comprehensive Integration Tests");
  console.log("==================================================================");

  // Initialize SQLite database
  await initializeDatabase();
  console.log("✓ Database initialized and ready.");

  // Spin up test server on a dedicated test port
  const app = express();
  app.use(cors());
  app.use(express.json());
  app.use("/api/auth", authRoutes);
  app.use("/api/complaints", complaintRoutes);

  const TEST_PORT = 5098;
  const BASE_URL = `http://localhost:${TEST_PORT}`;

  const server = await new Promise((resolve) => {
    const s = app.listen(TEST_PORT, () => resolve(s));
  });
  console.log(`✓ Test server running on port ${TEST_PORT}.\n`);

  try {
    const timestamp = Date.now();
    const student1Email = `student1_${timestamp}@campusfix.edu`;
    const student2Email = `student2_${timestamp}@campusfix.edu`;
    const adminEmail = `admin_${timestamp}@campusfix.edu`;
    const password = "TestPassword123";

    // ----------------------------------------------------
    // Test 1: User Registration (Signup)
    // ----------------------------------------------------
    console.log("▶ [Test 1] User Registration & Database Insertion");
    const s1Res = await fetch(`${BASE_URL}/api/auth/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "Alice Student", email: student1Email, password, role: "student" })
    });
    assert.strictEqual(s1Res.status, 201);
    const s1Data = await s1Res.json();
    assert.ok(s1Data.token);
    const s1Token = s1Data.token;
    const s1Id = s1Data.user.user_id;

    const s2Res = await fetch(`${BASE_URL}/api/auth/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "Bob Student", email: student2Email, password, role: "student" })
    });
    assert.strictEqual(s2Res.status, 201);
    const s2Data = await s2Res.json();
    const s2Token = s2Data.token;

    const adminRes = await fetch(`${BASE_URL}/api/auth/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "Campus Admin", email: adminEmail, password, role: "admin" })
    });
    assert.strictEqual(adminRes.status, 201);
    const adminData = await adminRes.json();
    const adminToken = adminData.token;
    console.log("  ✓ Created Student 1, Student 2, and Admin in SQLite.\n");

    // ----------------------------------------------------
    // Test 2: JWT Login & Session Verification
    // ----------------------------------------------------
    console.log("▶ [Test 2] JWT Login Authentication");
    const loginRes = await fetch(`${BASE_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: student1Email, password })
    });
    assert.strictEqual(loginRes.status, 200);
    const loginData = await loginRes.json();
    assert.ok(loginData.token);
    console.log("  ✓ Authenticated user and issued valid JWT token.\n");

    // ----------------------------------------------------
    // Test 3: Submit Complaints (associated with user_id)
    // ----------------------------------------------------
    console.log("▶ [Test 3] Complaint Submission & User ID Binding");
    const c1Res = await fetch(`${BASE_URL}/api/complaints`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${s1Token}` },
      body: JSON.stringify({
        title: "Broken Fan in Seminar Room 101",
        category: "Electrical",
        location: "Seminar Hall 1",
        description: "Ceiling fan making loud grinding noise.",
        priority: "Medium"
      })
    });
    assert.strictEqual(c1Res.status, 201);
    const c1Data = await c1Res.json();
    const c1Id = c1Data.complaint.id;
    assert.strictEqual(c1Data.complaint.user_id, s1Id);
    assert.strictEqual(c1Data.complaint.status, "Pending");
    console.log(`  ✓ Student 1 submitted complaint ${c1Id} (Status: Pending).\n`);

    // ----------------------------------------------------
    // Test 4: Student-Specific Complaints & Isolation Filter
    // ----------------------------------------------------
    console.log("▶ [Test 4] Student-Specific Complaint Isolation");
    // Default scope for student is 'mine'
    const s1ListRes = await fetch(`${BASE_URL}/api/complaints`, {
      headers: { Authorization: `Bearer ${s1Token}` }
    });
    assert.strictEqual(s1ListRes.status, 200);
    const s1List = await s1ListRes.json();
    assert.ok(s1List.every((c) => c.user_id === s1Id), "Student must only see their own complaints by default");
    assert.ok(s1List.some((c) => c.id === c1Id), "Student must see complaint c1");

    // Student 2 should NOT see Student 1's complaint when querying their own
    const s2ListRes = await fetch(`${BASE_URL}/api/complaints`, {
      headers: { Authorization: `Bearer ${s2Token}` }
    });
    const s2List = await s2ListRes.json();
    assert.ok(!s2List.some((c) => c.id === c1Id), "Student 2 must NOT see Student 1's complaint in personal view");

    // Campus-wide scope (?scope=all) returns campus complaints
    const campusRes = await fetch(`${BASE_URL}/api/complaints?scope=all`, {
      headers: { Authorization: `Bearer ${s1Token}` }
    });
    const campusList = await campusRes.json();
    assert.ok(campusList.length >= s1List.length, "Campus view returns all complaints");
    console.log("  ✓ Student isolation verified (Default: 'My Complaints' isolates student records; ?scope=all works).\n");

    // ----------------------------------------------------
    // Test 5: Student Update/Delete of PENDING Complaint
    // ----------------------------------------------------
    console.log("▶ [Test 5] Student Updates & Deletes Own Pending Complaint");
    // Student 1 updates their own pending complaint
    const s1UpdateRes = await fetch(`${BASE_URL}/api/complaints/${c1Id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${s1Token}` },
      body: JSON.stringify({ title: "Updated Fan Issue - Urgent Fix Required" })
    });
    assert.strictEqual(s1UpdateRes.status, 200);
    const s1Updated = await s1UpdateRes.json();
    assert.strictEqual(s1Updated.complaint.title, "Updated Fan Issue - Urgent Fix Required");
    console.log("  ✓ Student allowed to update details of own PENDING complaint.");

    // Student 2 CANNOT update Student 1's complaint (403)
    const s2HackRes = await fetch(`${BASE_URL}/api/complaints/${c1Id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${s2Token}` },
      body: JSON.stringify({ title: "Unauthorized title change" })
    });
    assert.strictEqual(s2HackRes.status, 403, "Student cannot update other student's complaint");
    console.log("  ✓ Unauthorized update blocked with 403 Forbidden.\n");

    // ----------------------------------------------------
    // Test 6: Admin Status Update & Safeguards on Non-Pending Complaints
    // ----------------------------------------------------
    console.log("▶ [Test 6] Admin Status Transitions & Non-Pending Safeguards");
    // Admin updates status to "In Progress"
    const adminStatusRes = await fetch(`${BASE_URL}/api/complaints/${c1Id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${adminToken}` },
      body: JSON.stringify({ status: "In Progress" })
    });
    assert.strictEqual(adminStatusRes.status, 200);
    const adminStatusData = await adminStatusRes.json();
    assert.strictEqual(adminStatusData.complaint.status, "In Progress");
    console.log("  ✓ Admin updated status to 'In Progress'.");

    // Now that complaint is "In Progress", student CANNOT delete or edit it
    const s1BlockedDelete = await fetch(`${BASE_URL}/api/complaints/${c1Id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${s1Token}` }
    });
    assert.strictEqual(s1BlockedDelete.status, 403, "Student CANNOT delete complaint that is In Progress");
    console.log("  ✓ Student safely blocked from deleting non-pending complaint (403 Forbidden).");

    const s1BlockedUpdate = await fetch(`${BASE_URL}/api/complaints/${c1Id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${s1Token}` },
      body: JSON.stringify({ title: "Trying to edit in progress complaint" })
    });
    assert.strictEqual(s1BlockedUpdate.status, 403, "Student CANNOT edit complaint that is In Progress");
    console.log("  ✓ Student safely blocked from editing non-pending complaint (403 Forbidden).");

    // Admin resolves complaint
    const adminResolveRes = await fetch(`${BASE_URL}/api/complaints/${c1Id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${adminToken}` },
      body: JSON.stringify({ status: "Resolved" })
    });
    assert.strictEqual(adminResolveRes.status, 200);
    console.log("  ✓ Admin resolved complaint successfully.\n");

    // ----------------------------------------------------
    // Test 7: Student Cancelling a New Pending Complaint
    // ----------------------------------------------------
    console.log("▶ [Test 7] Student Successfully Cancelling a Pending Complaint");
    const c2Res = await fetch(`${BASE_URL}/api/complaints`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${s1Token}` },
      body: JSON.stringify({
        title: "Mistaken Complaint To Cancel",
        category: "Other",
        location: "Library",
        description: "Accidentally filed duplicate issue."
      })
    });
    const c2Data = await c2Res.json();
    const c2Id = c2Data.complaint.id;

    // Student cancels their pending complaint
    const cancelRes = await fetch(`${BASE_URL}/api/complaints/${c2Id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${s1Token}` }
    });
    assert.strictEqual(cancelRes.status, 200, "Student must be able to cancel pending complaint");
    console.log(`  ✓ Student cancelled pending complaint ${c2Id}.`);

    console.log("\n==================================================================");
    console.log("🎉 ALL INTEGRATION TESTS PASSED (7/7 TEST SUITES)");
    console.log("==================================================================");
  } catch (err) {
    console.error("❌ Test failed:", err);
    process.exitCode = 1;
  } finally {
    server.close();
    db.close();
  }
}

runIntegrationTests();
