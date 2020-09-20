const express = require('express');
const config = require('express');

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
    const message = config.get('message');

    res.send({
        status: 'success',
        data: [
            {
                message: message
            }
        ],
        message: null
    });
});

const port = process.env.PORT || 3000;
app.listen(port, () => { console.log(`Server listening on port ${port}...`) });