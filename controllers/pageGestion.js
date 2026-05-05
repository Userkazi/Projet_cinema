async function liste(req, res) {
    const [rows] = await pool.query("SELECT id, email FROM users");
    res.json(rows);
}

async function supprimer(req, res) {
    await pool.query("DELETE FROM users WHERE id = ?", [req.body.id]);
    res.status(204).end();
}

async function reset(req, res) {
    await pool.query(
        "UPDATE users SET password = '1234' WHERE id = ?",
        [req.body.id]
    );
    res.json({ message: "Reset OK" });
}