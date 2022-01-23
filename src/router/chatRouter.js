const express = require('express');




const router = express.Router();


router.get('/chat', (req, res) => {
    res.json("hiii")
});





module.exports = router;