const express = require('express');
const app = express();
app.get('/createMessage',(req,res)=>{
    res.json({"abc":"def"});
});

app.use(require('cors')());
app.listen(`7777`,()=>{
    console.log("Server initialize");
})

