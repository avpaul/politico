import db from '../config/db';
import Validator from '../helpers/validator';

class Office {
    static getResult(req, res) {
        if (Validator.isNumberOnly(req.params, 'id')) {
            res.status(400).json({
                status: 400,
                error: 'Id must be a number',
            });
            return;
        }

        // shoul return [{candidate,office,result}]
        // first get candidate id and get all votes for that id
        const query = `SELECT * FROM votes
            WHERE office = ${req.params.id}
        `;
        db.pool.query(query)
            .then(votes => res.status(200)
                .json({
                    status: 200,
                    data: votes.rows,
                }))
            .catch(err => res.status(400)
                .json({
                    status: 400,
                    error: err.message,
                }));
    }
}

export default Office;
