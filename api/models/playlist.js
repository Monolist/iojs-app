'use strict';

var slug = require('slug');

module.exports = function(sequelize, DataTypes) {

  var Playlist = sequelize.define('Playlist', {
    title:    { type: DataTypes.STRING, allowNull: false },
    slug:     { type: DataTypes.STRING, allowNull: false, unique: true },
    imageUrl: { type: DataTypes.STRING },
    privacy:  { type: DataTypes.ENUM('public', 'private'), defaultValue: 'public' }
  },
  {
    setterMethods: {
      title: function(value) {
        this.setDataValue('title', value);
        this.setDataValue('slug', slug(value).toLowerCase());
      }
    },
    classMethods: {
      associate: function(models) {
        Playlist.belongsTo(models.User);
        Playlist.hasMany(models.Collaboration, { onDelete: 'cascade' });
        Playlist.hasMany(models.Track, { onDelete: 'cascade' });
        Playlist.hasMany(models.PlaylistLike, { as: 'Likes', onDelete: 'cascade' });
        Playlist.hasMany(models.PlaylistPlay, { as: 'Plays', onDelete: 'cascade' });
        Playlist.hasMany(models.PlaylistTag, { as: 'Tags' });
      }
    }
  });

  return Playlist;

};