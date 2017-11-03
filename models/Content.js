'use strict'

module.exports = (db, Sequelize) => {
  var Content = db.define('Content', {
    message: Sequelize.STRING,
    fileformat: Sequelize.STRING,
    filename: Sequelize.STRING,
    isPublished: {
      field: 'is_published',
      type: Sequelize.BOOLEAN,
      defaultValue: false
    },
    publishAt: {
      field: 'publish_at',
      type: Sequelize.DATE
    }
  }, {
    tableName: 'contents',
    underscored: true
  })

  Content.associate = (models, cb) => {
    Content.belongsToMany(models.Social, {through: models.Schedule})
  }
  return Content
}
