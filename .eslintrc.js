module.exports = {
    "env": {
        "browser": true,
        "es6": true,
        "amd": true
    },
    "parser": "babel-eslint",
    "extends": [
        "eslint:recommended",
        "plugin:react/recommended"
    ],
    "parserOptions": {
        "ecmaVersion": 6,
        "ecmaFeatures": {
            "experimentalObjectRestSpread": true,
            "jsx": true,
            "modules": true
        },
        "sourceType": "module"
    },
    "plugins": [
        "react",
        "babel",
    ],
    "rules": {
        "no-unused-vars": 1,
        "no-console": 0,
        "indent": 0,
        "react/no-unescaped-entities": 0,
        "react/prop-types": 0,
        "linebreak-style": [
            "error",
            "unix"
        ],
        "quotes": [
            "error",
            "single"
        ],
        "semi": [
            "error",
            "never"
        ],
    },
    "globals": {
        "axios": true,
        "_": true,
        "canvg": true,
        "jsPDF": true,
        "html2canvas": true
    }
};