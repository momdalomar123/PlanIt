const bcrypt = require("bcrypt");
const Group = require("../schemas/group.js");
const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

const userEmail = "";
// router.get("/me", (req, res) => {
//   if (req.session.userId) {
//     userEmail= req.session.email
//   }
// });

async function checkGroupForUser(req) {
  const count = await Group.countDocuments({});
  const Empty = count === 0;
  if (Empty) return false;
  const group = !!(await Group.exists({
    username: req.session.username,
    categories: { $exists: true },
  }));
  return group;
}
async function getCategoriesUser(req) {
  const categories = await Group.findOne({ username: req.session?.username });
  return categories;
}
async function checkCategoryTypeExists(categoryType, req) {
  const categoriesTypeExists = !!(await Group.exists({
    username: req.session?.username,
    "categories.categoryType": categoryType,
  }));
  return categoriesTypeExists;
}
router.post("/CreateGroup", async (req, res) => {
  const { groupType, groupTitle, groupDescription, groupColor, groupImage } =
    req.body;
  const userHasGroup = await checkGroupForUser(req);
  const categoryTypeExists = await checkCategoryTypeExists(groupType, req);

  try {
    if (!userHasGroup) {
      const group = await Group.create({
        username: req.session.username,
        categories: [
          {
            categoryType: groupType,
            category: [
              {
                title: groupTitle,
                description: groupDescription,
                style: {
                  background: groupColor,
                  image: groupImage,
                },
                groupTodo: [],
              },
            ],
          },
        ],
      });
      return res.status(201).json(group);
    } else if (!categoryTypeExists) {
      const group = await Group.updateOne(
        { username: req.session.username },
        {
          $push: {
            categories: {
              categoryType: groupType,
              category: [
                {
                  title: groupTitle,
                  description: groupDescription,
                  style: {
                    background: groupColor,
                    image: groupImage,
                  },
                  groupTodo: [],
                },
              ],
            },
          },
        },
      );
      return res.status(200).json(group);
    } else {
      const group = await Group.updateOne(
        {
          username: req.session.username,
          "categories.categoryType": groupType,
        },
        {
          $push: {
            "categories.$.category": {
              title: groupTitle,
              description: groupDescription,
              style: {
                background: groupColor,
                image: groupImage,
              },
              groupTodo: [],
            },
          },
        },
      );
      return res.status(200).json(group);
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Failed to create group" });
  }
});

router.post("/GetGroups", async (req, res) => {
  const categories = await getCategoriesUser(req);

  if (categories) return res.status(200).json({ categories });
  else return res.status(404).end();
});

async function checkLastCategory(req) {
  await Group.updateOne(
    { username: req.session.username },
    { $pull: { categories: { category: { $size: 0 } } } },
  );
}
router.post("/DeleteGroups", async (req, res) => {
  const { groupId } = req.body;

  console.log(groupId);
  const categoriesDeleted = await Group.updateOne(
    { username: req.session.username },
    { $pull: { "categories.$[].category": { _id: groupId } } },
  );
  if (!categoriesDeleted)
    return res.status(400).json("Could'nt delete the group");
  checkLastCategory(req);
  return res.status(200).json("Group Deleted");
});


module.exports = router;
