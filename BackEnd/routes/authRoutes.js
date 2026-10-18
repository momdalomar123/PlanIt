const bcrypt = require("bcrypt");
const User = require("../schemas/user.js");
const express = require("express");
const router = express.Router();

async function findUserByEmail(email) {
  const user = await User.findOne({ email });
  if (user) return true;
  return false;
}
router.post("/Signup", async (req, res) => {
  const { username, email, password, profilePicture } = req.body;
  const userFound = await findUserByEmail(email);
  if (userFound) return res.json({ userLoggedBefore: true });
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({
    username,
    email,
    password: hashedPassword,
    style: { profilePicture },
  });
  res.json({ signedIn: true });
});

router.post("/Login", async (req, res) => {
  const { userOrEmail, password } = req.body;
  const user = await User.findOne({
    $or: [{ username: userOrEmail }, { email: userOrEmail }],
  });
  if (!user) {
    return res.status(401).json({ userOrEmailMatch: false });
  }
  const matchPassword = await bcrypt.compare(password, user.password);
  if (!matchPassword) {
    return res.status(401).json({ passwordMatch: false });
  }
  req.session.userId = user._id;
  req.session.username = user.username;
  req.session.email = user.email;
  req.session.profilePicture = user.profilePicture;
  res.status(200).json({ loggedIn: true });
});

router.get("/me", (req, res) => {
  if (req.session.userId) {
    return res
      .status(200)
      .json({ loggedIn: true, username: req.session.username });
  }
  return res.status(401).json({ loggedIn: false });
});

async function findUser(req) {
  const user = await User.findOne({
    username: req.session.username,
    email: req.session.email,
  });
  return user;
}
// async function updateUserPhoto(req, profilePicture) {
//   const updatePhoto = await User.updateOne(
//     { username: req.session.username, email: req.session.email },
//     { $set: { "style.profilePicture": profilePicture } },
//   );
//   if (!updatePhoto) {

//     return false;
//   }
//   return await findUser(req);
// }
router.get("/GetProfile", async (req, res) => {
  const user = await findUser(req);
  return res.json({ user });
});

router.post("/ProfilePhotoUpdate", async (req, res) => {
  const  {formData} = req.body;
  console.log("formData:",formData);
  // if (!profilePicture) return res.status(400).json("Picture is null");
  // console.log(profilePicture);
  // const user = await findUser(req);
  // if (!user) return res.status(401).json("cant find user");
  // const updatePhoto = await updateUserPhoto(req, profilePicture);
  // if (!updatePhoto) return res.status(401).json("can't change profile");

  // return res.status(200).json({ updatePhoto });
});

module.exports = router;
