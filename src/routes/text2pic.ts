import express from 'express';
import { createCanvas } from 'canvas';

const router = express.Router();


function wrapText(context, text, x, y, maxWidth, lineHeight) {
  const words = text.split(' ');
  let line = '';
  for (let n = 0; n < words.length; n++) {
      let testLine = line + words[n] + ' ';
      let metrics = context
      .measureText(testLine);
      let testWidth = metrics.width;
      if (testWidth > maxWidth && n > 0) {
          context.fillText(line, x, y);
          line = words[n] + ' ';
          y += lineHeight;
      } else {
          line = testLine;
      }
  }
  context.fillText(line, x, y);
}

router.post('/', async (req, res) => {
  try {
    const width = req.body.width;
    const height = req.body.height;
    const answer = req.body.answer;

    if (!answer) {
      return res.status(400).json({ message: 'Missing answer' });
    }
    if (width <= 0 || height <= 0) {
      return res.status(400).json({ message: 'Missing width or height' });
    }
    const canvas = createCanvas(width, height);
    const context = canvas.getContext('2d');
    context.fillStyle = '#ffffff';
    context.fillRect(0, 0, width, height);
    context.fillStyle = '#000000';
    context.font = '30px Arial';
    wrapText(context, answer, 20, 50, width-40, 50)
    const buffer = canvas.toBuffer('image/png');
    const base64Image = buffer.toString('base64');
    res.json({ base64Image });
  } catch (err: any) {
    res.status(500).json({ message: 'Error in converting text to picture.' });
  }
});

export default router;
