const path = require('path');

module.exports = {
  jest: {
    configure: (jestConfig) => {
      jestConfig.transformIgnorePatterns = [
        '/node_modules/(?!react-leaflet|leaflet|@react-leaflet/core)'
      ];
      jestConfig.transform = {
        '^.+\\.[jt]sx?$': 'babel-jest',
      };
      jestConfig.moduleNameMapper = {
        ...jestConfig.moduleNameMapper,
        '\\.(css|less|scss|sass)$': '<rootDir>/src/__mocks__/styleMock.js',
      };
      return jestConfig;
    },
  },
};
