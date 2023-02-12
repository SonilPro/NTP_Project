module.exports = function (express, pool, jwt, secret, bcrypt) {
    let authRouter = express.Router();

    authRouter.post('/login', async function (req, res) {
        try {
            let conn = await pool.getConnection();
            let rows = await conn.query('SELECT * FROM users WHERE username=?', req.body.username);
            rows = rows[0];
            conn.release();

            let compare = await bcrypt.compare(req.body.password, rows[0].password);
            if (rows.length > 0 && compare) {
                const token = jwt.sign({
                    username: rows[0].username,
                    password: rows[0].password,
                    email: rows[0].email,
                    level: rows[0].level
                }, secret, {
                    expiresIn: 1440
                });
                res.json({status: 'OK', token: token, user: rows[0]});
            } else if (rows.length > 0) {
                res.json({status: 'NOT OK', description: 'Wrong password'});
            } else {
                res.json({status: 'NOT OK', description: 'Username doesnt exist'});
            }
        } catch (e) {
            return res.json({"code": 100, "status": "Error with query"});
        }
    }).post("/register", async (req, res) => {
        const user = {
            username: req.body.username,
            password: await bcrypt.hash(req.body.password, 10),
            name: req.body.name,
            email: req.body.email,
        };
        try {
            let conn = await pool.getConnection();
            let q = await conn.query("INSERT INTO users SET ?", user);
            conn.release();
            res.json({status: "OK", insertId: q[0].insertId});
        } catch (e) {
            console.log(e);
            return res.json({code: 100, status: "Error with query"});
        }
    });
    return authRouter;
}