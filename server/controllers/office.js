import db from '../config/db';
import Validator from '../helpers/validator';

class Office {
    static getResult(req, res) {
        if (!Validator.isNumberOnly(req.params, 'id')) {
            res.status(400).json({
                status: 400,
                error: 'Id must be a number',
            });
            return;
        }
        const candidatesQuery = `SELECT DISTINCT candidate FROM votes WHERE office =  ${req.params.id}`;
        const voteCountQuery = `SELECT COUNT(*) FROM votes
            WHERE office = ${req.params.id} and candidate = $1
        `;
        db.pool.query(candidatesQuery)
            .then(async (candidates) => {
                if (candidates.rowCount > 0) {
                    const pResults = candidates.rows.map(async (candidate) => {
                        const votes = await db.pool.query(voteCountQuery, [candidate.candidate]);
                        const candidateUser = await db.pool.query(`SELECT * FROM users WHERE id = ${candidate.candidate}`);
                        const officeInfo = await db.pool.query(`SELECT * FROM offices WHERE id = ${req.params.id}`);
                        return {
                            candidate: {
                                id: candidateUser.rows[0].id,
                                firstname: candidateUser.rows[0].firstname,
                                lastname: candidateUser.rows[0].lastname,
                            },
                            office: {
                                id: officeInfo.rows[0].id,
                                type: officeInfo.rows[0].type,
                                name: officeInfo.rows[0].name,
                            },
                            result: Number(votes.rows[0].count),
                        };
                    });

                    const results = await Promise.all(pResults);
                    res.status(200)
                        .json({
                            status: 200,
                            data: results,
                        });
                    return;
                }
                res.status(404)
                    .json({
                        status: 404,
                        error: 'no vote found for that office',
                    });
            })
            .catch(err => res.status(400)
                .json({
                    status: 400,
                    error: err.message,
                }));
    }
}

export default Office;
