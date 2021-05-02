import express from "express";

const checkForErrors = async (body, res: express.Response, errors) => {
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array(), body: body() });
    }
    return null;
}


export{
    checkForErrors
}