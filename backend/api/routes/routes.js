const jwt_decode = require("jwt-decode");

module.exports = function (express, pool, jwt, secret) {
    const apiRouter = express.Router();

    apiRouter.use(function (req, res, next) {
        const token = req.body.token || req.params.token || req.headers['x-access-token'] || req.headers.authorization;

        if (token) {
            jwt.verify(token, secret, function (err, decoded) {
                if (err) {
                    return res.status(403).send({
                        success: false,
                        message: 'Wrong token'
                    });
                } else {
                    req.user = jwt_decode(token);
                    req.decoded = decoded;
                    next();
                }
            });
        } else {
            return res.status(403).send({
                success: false,
                message: 'No token'
            });
        }
    });

    apiRouter.get("/", function (req, res) {
        res.json({message: "Hello"});
    });

    apiRouter
        .route("/posts")
        .get(async (req, res) => {
            try {
                let conn = await pool.getConnection();
                let [rows] = await conn.query("SELECT * FROM posts");
                conn.release();
                res.json({status: "OK", posts: rows});
            } catch (e) {
                console.log(e);
                return res.json({code: 100, status: "Error with query"});
            }
        })
        .post(async (req, res) => {
            const post = {
                user_id: req.body.user_id,
                datetime_published: new Date(),
                content: req.body.content,
            };
            try {
                let conn = await pool.getConnection();
                let q = await conn.query("INSERT INTO posts SET ?", post);
                conn.release();
                res.json({status: "OK", insertId: q[0].insertId});
            } catch (e) {
                console.log(e);
                return res.json({code: 100, status: "Error with query"});
            }
        });

    apiRouter.route("/posts/:id")
        .put(async (req, res) => {
            const post = {
                content: req.body.content
            }
            try {
                let conn = await pool.getConnection();

                let testQ = await conn.query("SELECT distinct user_id FROM posts WHERE id = ?", req.params.id);
                if (testQ[0][0].user_id !== req.user.id && !isAdmin(req)) {
                    throw new Error("no permission");
                }

                let q = await conn.query("UPDATE posts SET ? WHERE id=?", [post, req.params.id]);
                conn.release();
                res.json({status: "OK", insertId: q[0].insertId});
            } catch (e) {
                console.log(e);
                return res.json({code: 100, status: e.message});
            }
        })
        .delete(async function (req, res) {
            try {
                let conn = await pool.getConnection();
                let testQ = await conn.query("SELECT distinct user_id FROM posts WHERE id = ?", req.params.id);

                if (testQ[0][0].user_id !== req.user.id && !isAdmin(req)) {
                    throw new Error("no permission");
                }

                let q1 = await conn.query("DELETE FROM likes WHERE post_id = ?", req.params.id);
                let q2 = await conn.query("DELETE FROM comments WHERE post_id = ?", req.params.id);
                let q3 = await conn.query("DELETE FROM posts WHERE id = ?", req.params.id);
                conn.release();
                res.json({status: "OK", affectedRows: q3[0].affectedRows});
            } catch (e) {
                console.log(e);
                res.json({status: "NOT OK"});
            }
        });

    apiRouter
        .route("/users")
        .get(async (req, res) => {
            try {
                let conn = await pool.getConnection();
                let [rows] = await conn.query("SELECT * FROM users");
                conn.release();
                res.json({status: "OK", users: rows});
            } catch (e) {
                console.log(e);
                return res.json({code: 100, status: "Error with query"});
            }
        });

    apiRouter
        .route("/messages")
        .get(async (req, res) => {
            try {
                let conn = await pool.getConnection();
                let [rows] = await conn.query("SELECT * FROM messages");
                conn.release();
                res.json({status: "OK", messages: rows});
            } catch (e) {
                console.log(e);
                return res.json({code: 100, status: "Error with query"});
            }
        })
        .post(async (req, res) => {
            const message = {
                sender_id: req.body.sender_id,
                receiver_id: req.body.receiver_id,
                message: req.body.message,
            };
            try {
                let conn = await pool.getConnection();
                let q = await conn.query("INSERT INTO messages SET ?", message);
                conn.release();
                res.json({status: "OK", insertId: q.insertId});
            } catch (e) {
                console.log(e);
                return res.json({code: 100, status: "Error with query"});
            }
        });

    apiRouter
        .route("/messages/:id")
        .delete(async function (req, res) {
            try {
                let conn = await pool.getConnection();

                let testQ = await conn.query("SELECT distinct sender_id FROM messages WHERE id = ?", req.params.id);
                if (testQ[0][0].sender_id !== req.user.id && !isAdmin(req)) {
                    throw new Error("no permission");
                }

                let q = await conn.query("DELETE FROM messages WHERE id = ?", req.params.id);
                conn.release();
                res.json({status: "OK", affectedRows: q.affectedRows});
            } catch (e) {
                console.log(e);
                res.json({status: "NOT OK", message: e.message});
            }
        });

    apiRouter
        .route("/likes")
        .get(async (req, res) => {
            try {
                let conn = await pool.getConnection();
                let [rows] = await conn.query("SELECT * FROM likes");
                conn.release();
                res.json({status: "OK", likes: rows});
            } catch (e) {
                console.log(e);
                return res.json({code: 100, status: "Error with query"});
            }
        })
        .post(async (req, res) => {
            const like = {
                user_id: req.body.user_id,
                post_id: req.body.post_id,
            };
            try {
                let conn = await pool.getConnection();
                let q = await conn.query("INSERT INTO likes SET ?", like);
                conn.release();
                res.json({status: "OK", insertId: q.insertId});
            } catch (e) {
                console.log(e);
                return res.json({code: 100, status: "Error with query"});
            }
        })
        .delete(async function (req, res) {
            try {
                let conn = await pool.getConnection();

                if (req.user_id !== req.user.id && !isAdmin(req)) {
                    throw new Error("no permission");
                }

                let q = await conn.query("DELETE FROM likes WHERE user_id = ? AND post_id = ?", [req.body.user_id, req.body.post_id]);
                conn.release();
                res.json({status: "OK", affectedRows: q.affectedRows});
            } catch (e) {
                console.log(e);
                res.json({status: "NOT OK", message: e.message});
            }
        });

    apiRouter
        .route("/comments")
        .get(async (req, res) => {
            try {
                let conn = await pool.getConnection();
                let [rows] = await conn.query("SELECT * FROM comments");
                conn.release();
                res.json({status: "OK", likes: rows});
            } catch (e) {
                console.log(e);
                return res.json({code: 100, status: "Error with query"});
            }
        })
        .post(async (req, res) => {
            const comment = {
                user_id: req.body.user_id,
                post_id: req.body.post_id,
                comment: req.body.comment
            };
            try {
                let conn = await pool.getConnection();
                let q = await conn.query("INSERT INTO comments SET ?", comment);
                conn.release();
                res.json({status: "OK", insertId: q[0].insertId});
            } catch (e) {
                console.log(e);
                return res.json({code: 100, status: "Error with query"});
            }
        })

    apiRouter
        .route("/comments/:id")
        .delete(async function (req, res) {
            try {
                let conn = await pool.getConnection();

                let testQ = await conn.query("SELECT distinct user_id FROM comments WHERE id = ?", req.params.id);
                if (testQ[0][0].user_id !== req.user.id && !isAdmin(req)) {
                    throw new Error("no permission");
                }

                let q = await conn.query("DELETE FROM comments WHERE id = ?", req.params.id);
                conn.release();
                res.json({status: "OK", affectedRows: q.affectedRows});
            } catch (e) {
                console.log(e);
                res.json({status: "NOT OK", message: e.message});
            }
        });

    return apiRouter;
};

const isAdmin = (req) => {
    return req.user.role === 'admin'
}
