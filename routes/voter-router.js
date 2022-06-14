import db from "../models/index.js";
import { Router } from "express";
import { body, validationResult } from 'express-validator';
import bcrypt from 'bcrypt';
import { createToken, verifyTokenVoter } from "../auth/jwt.js";

const router = new Router();

/**
 * Create a new voter.
 */
router.post("/",
  body('id').isString(),
  body('name').isString(),
  body('photoUrl').isString().isURL(),
  body('email').isEmail(),
  (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const voter = req.body;

    bcrypt.hash(voter.password, 10, (err, hash) => {

      if (err) {
        res.status(500).json({
          success: false,
          messages: err
        })
      }

      db.voter.create({
        ...voter,
        password: hash
      })
        .then((voter) => {
          db.poll.findAll({
            where: { pollType: 'Public' }
          }).then(polls => {
            if (polls.length > 0) {
              Promise.all(polls.map(poll => {
                db.poll_voter.create({
                  voterId: voter.id,
                  pollId: poll.id
                })
              })).then(() => res.json(voter))
                .catch(err => res.json({
                  success: true,
                  messages: "error in registring to polls"
                }))
            }

            return res.json(voter);
          })
        })
        .catch(err => res.status(500).json({
          success: false,
          messages: err || "voter not created, insufficient data."
        }));
    })

  });


/**
 * Get the list of all voters.
 */
router.get("/",
  (req, res) => {
    db.voter.findAll()
      .then(voters => res.json(voters))
      .catch(err => res.status(500).json({
        messages: err.errors
      }));
  });


/**
 * Find voter by id.
 */
router.get("/:id", (req, res) => {
  db.voter.findOne({
    include: [db.poll],
    where: {
      id: req.params.id
    }
  })
    .then(voter => res.json(voter))
    .catch(err => res.status(500).json({
      messages: err.errors
    }));
});


/**
 * Update any field of voter.
 */
router.put("/:id",
  (req, res) => {
    db.voter.update({ ...req.body }, {
      where: { id: req.params.id }
    })
      .then(() => res.json({
        message: "voter updated successfully!",
      }))
      .catch(err => res.status(500).json({
        messages: err.errors
      }));
  });

/**
 * Voter login.
 */
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const voter = await db.voter.findOne({ where: { email: email } });

  if (!voter) return res.status(400).json({ error: "Voter Doesn't Exist" });

  const dbPassword = voter.password;
  bcrypt.compare(password, dbPassword).then((match) => {
    if (!match) {
      return res
        .status(400)
        .json({ error: "Wrong Username and Password Combination!" });
    } else {
      const accessToken = createToken(voter);

      // cookie will expire in a month.
      res.cookie("access-token", accessToken, {
        maxAge: 60 * 60 * 24 * 30 * 1000,
        httpOnly: true,
      });

      return res.json("LOGGED IN");
    }
  });
});

/**
 * Add poll.
 */
router.post("/:id", (req, res) => {
  db.poll_voter.create({
    voterId: req.params.id,
    pollId: req.body.pollId
  })
    .then(() => res.json({
      message: "poll added successfully!",
    }))
    .catch(err => res.status(500).json({
      success: false,
      messages: err
    }));
});

/**
 * Mark voted.
 */
router.put("/:id/poll/:pollId", (req, res) => {
  db.poll_voter.update(
    {
      isVoted: true
    },
    {
      where: {
        pollId: req.params.id,
        voterId: req.params.pollId
      }
    })
    .then(() => res.json({ success: true, message: "You have voted successfully!" }))
    .catch(err => res.status(500).json({
      success: false,
      messages: err
    }));
});

/**
 * Accesstoken verify.
 */
router.post("/verify", verifyTokenVoter, (req, res) => {
  return res.json({
    verified: true
  })
})

export default router;
