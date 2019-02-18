import db from '../config/db';
import Validator from '../helpers/validator';

class Office {
    static getResult() {
        if (Validator.isNumberOnly(req.params, 'id')) {
            res.status(400).json({
                status: 400,
                error: 'Id must be a number',
            });
            return;
        }
    }
}

export default Office;
