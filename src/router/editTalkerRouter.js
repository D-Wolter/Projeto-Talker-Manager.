const { Router } = require('express');
const fs = require('fs').promises;
const { join } = require('path');
const { verifyToken } = require('../middlewares/verifyToken');
const { verifyAge } = require('../middlewares/verifyAge');
const { verifyName } = require('../middlewares/verifyName');
const { verifyTalk } = require('../middlewares/verifyTalk');
const { verifyRate } = require('../middlewares/verifyRate');
const { editTalker } = require('../middlewares/editTalker');
// const { readFile } = require('../utils/readFile');

const editTalkerRouter = Router();
const JSON_PATH = join(__dirname, '../talker.json');
const NOT_FOUND = { message: 'Pessoa palestrante não encontrada' };

editTalkerRouter.put('/:id', 
verifyToken, verifyAge, verifyName, verifyTalk, 
verifyRate,
async (req, res) => {
  const reqID = req.params.id;
  const talker = await fs.readFile(JSON_PATH);
  const findTalkerId = talker.find(({ id }) => id === Number(reqID));
  if (!findTalkerId) {
    return res.status(404).json(NOT_FOUND);
  }
  const { name, age, talk } = req.body;
  const talkerEdited = await editTalker(name, age, talk, findTalkerId);
  res.status(200).json(talkerEdited);
});

module.exports = {
  editTalkerRouter,
};
