import express from 'express';

const router = express.Router();

interface FocusMode{
    name: string;
    desc: string;
    api: string;
}

let focus_modes = new Map<string, FocusMode>();

router.get('/', async (req, res) => {
  let list = Array.from(focus_modes.values());
  return res.json(list);
});

router.post('/', async (req, res) => {
  let obj = req.body
  focus_modes.set(obj.name, obj)
  let list = Array.from(focus_modes.values());
  return res.json(list);
});

router.put('/:name', async (req, res) => {
  let obj = req.body
  focus_modes.set(obj.name, obj)
  let list = Array.from(focus_modes.values());
  return res.json(list);
});

router.delete('/:name', async (req, res) => {
  const { name } = req.params;
  focus_modes.delete(name)
  let list = Array.from(focus_modes.values());
  return res.json(list);
});



export default router;
