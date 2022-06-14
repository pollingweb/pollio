export default (sequelize, DataTypes) => {
  const Poll = sequelize.define("poll", {
    id: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM(['Created', 'Running', 'Canceled', 'Ended']),
      defaultValue: 'Created',
    },
    startDate: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    endDate: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    pollType: {
      type: DataTypes.ENUM(['Public', 'Private']),
      defaultValue: 'Public',
    }
  });
  
  return Poll;
}