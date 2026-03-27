module.exports = (sequelize, DataTypes) => {
  const Comment = sequelize.define(
    "Comment",
    {
      content: DataTypes.STRING,
    },
    {
      tableName: "comments",
    }
  );
  Comment.associate = function (models) {
    Comment.belongsTo(models.Post, {
      foreignKey: "postId",
      as: "post",
    });
    Comment.belongsTo(models.User, {
      foreignKey: "userId",
      as: "author",
    });
  };
  return Comment;
};
