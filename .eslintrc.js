module.exports = {
    "env": {
        "browser": true,
        "es6": true,
        "amd": true
    },
    "parser": "babel-eslint",
    "extends": [
        "eslint:recommended",
        "plugin:react/recommended",
        "airbnb"
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
        "camelcase": 0,
        "indent": 0,
        "linebreak-style": [
            "error",
            "unix"
        ],
        "max-len": 0,
        "no-confusing-arrow": ["error", {"allowParens": true}],
        "no-console": "warn",
        "no-plusplus": 0,
        "no-unused-vars": 1,
        "prefer-destructuring": 0,
        "quotes": [
            "error",
            "single"
        ],
        "radix": 0,
        "react/jsx-filename-extension": [1, { "extensions": [".js", ".jsx"] }],
        "react/jsx-one-expression-per-line": 0,
        "react/no-unescaped-entities": 0,
        "react/no-did-update-set-state": 0,
        "react/prop-types": 0,
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