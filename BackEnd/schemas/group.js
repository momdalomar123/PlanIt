const mongoose = require("mongoose");

const groupSchema = new mongoose.Schema({
  username: {
    type: String,
    
  },
  categories: [
    {
      categoryType: {
        type: String,
      },
      category: [
        {
          title: {
            type: String,
            required: true,
          },
          description: {
            type: String,
          },
          style: {
            background: String,
            image: String,
          },
          groupTodo: [
            {
              title: {
                type: String,
              },

              importancy: {
                type: String,
              },
              dueTime: {
                type: String,
              },
              finished:{
                type:Boolean,
                default:false
              }
            },
          ],
        },
      ],
    },
  ],
});
module.exports = mongoose.model("categories", groupSchema);
