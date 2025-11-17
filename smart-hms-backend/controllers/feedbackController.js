// controllers/feedbackController.js
const Feedback = require('../models/Feedback');
const transporter = require('../utils/mailer');

// Keyword lists
const ISSUE_KEYWORDS = ['pain','rude','delay','emergency','problem','bad','angry','help','urgent','bleeding','chest','breath'];
const AVERAGE_KEYWORDS = ['ok','average','fine','normal','so-so','not bad','okay'];
const GOOD_KEYWORDS = ['good','great','excellent','nice','thank','thanks','helpful','satisfied','awesome'];

function findKeywords(msg, list) {
  const found = [];
  const lower = (msg || '').toLowerCase();
  for (const k of list) {
    if (lower.includes(k)) found.push(k);
  }
  return found;
}

exports.submitFeedback = async (req, res) => {
  try {
    const { name, message } = req.body || {};
    if (!message || message.trim().length < 3) {
      return res.status(400).json({ ok:false, message: 'Feedback message is required' });
    }

    // detect keywords
    const issueFound = findKeywords(message, ISSUE_KEYWORDS);
    const avgFound = findKeywords(message, AVERAGE_KEYWORDS);
    const goodFound = findKeywords(message, GOOD_KEYWORDS);

    // determine category
    let category = 'Good';
    let keywords = [];

    if (issueFound.length) {
      category = 'Issue/Complaint';
      keywords = issueFound;
    } else if (avgFound.length) {
      category = 'Average';
      keywords = avgFound;
    } else if (goodFound.length) {
      category = 'Good';
      keywords = goodFound;
    } else {
      category = 'Average';
      keywords = [];
    }

    const fb = new Feedback({
      name: name && name.trim() ? name.trim() : 'Anonymous',
      message: message.trim(),
      category,
      keywords
    });

    const saved = await fb.save();

    // 🔥 SEND EMAIL ALWAYS — EVEN IF NO KEYWORDS
    (async () => {
      try {
        const recipientsEnv = process.env.HOSPITAL_EMAILS || process.env.EMAIL_USER;
        const recipients = recipientsEnv.split(',').map(s => s.trim()).filter(Boolean);

        if (recipients.length) {
          const subject = `New Feedback (${category}) — ${saved.name}`;

          const html = `
            <h3>New Patient Feedback</h3>
            <p><strong>Sender:</strong> ${saved.name}</p>
            <p><strong>Category:</strong> ${saved.category}</p>
            <p><strong>Keywords found:</strong> ${saved.keywords.join(', ') || 'None'}</p>
            <p><strong>Message:</strong><br/>${saved.message.replace(/\n/g,'<br/>')}</p>
            <p>Check admin panel to view all feedback.</p>
          `;

          await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: recipients.join(','),
            subject,
            html,
            text: `${saved.name} (${saved.category}) — ${saved.message}`
          });

          console.log('📩 Feedback email sent to:', recipients.join(', '));
        }
      } catch (err) {
        console.error('Error sending feedback email:', err);
      }
    })();

    res.status(201).json({ ok:true, feedback: saved });

  } catch (err) {
    console.error('submitFeedback error:', err);
    res.status(500).json({ ok:false, message: 'Server error' });
  }
};

exports.getAllFeedback = async (req, res) => {
  try {
    const all = await Feedback.find().sort({ createdAt: -1 });
    res.json({ ok:true, feedbacks: all });
  } catch (err) {
    console.error('getAllFeedback error:', err);
    res.status(500).json({ ok:false, message: 'Server error' });
  }
};
