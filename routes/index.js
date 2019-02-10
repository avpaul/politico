const express = require('express');

const router = express.Router();

router.get('/', (req, res) => {
    res.render('home');
});
router.get('/signup', (req, res) => {
    res.render('signup');
});

router.get('/login', (req, res) => {
    res.render('login');
});

router.get('/reset', (req, res) => {
    res.render('/reset');
});

router.get('/profile', (req, res) => {
    res.render('user-profile');
});

router.get('/addoffice', (req, res) => {
    res.render('add-office');
});

router.get('/addparty', (req, res) => {
    res.render('add-party');
});

router.get('/admin', (req, res) => {
    res.render('admin-panel');
});

router.get('/availableoffices', (req, res) => {
    res.render('available-offices');
});

router.get('/candidates/:id', (req, res) => {
    res.render('candidate');
});

router.get('/offices/:id', (req, res) => {
    res.render('edit-office');
});

router.get('/parties/:id', (req, res) => {
    res.render('edit-party');
});

router.get('/parties', (req, res) => {
    res.render('parties');
});

router.get('/politicians', (req, res) => {
    res.render('politicians');
});

router.get('/results', (req, res) => {
    res.render('results');
});
router.get('/politicians/:id', (req, res) => {
    res.render('candidate');
});

module.exports = router;
