module.exports = {
    "**/*.{js,.jsx,.ts,.tsx}": [
        "eslint --fix"
    ],
    "*.css": [
        "stylelint --fix"
    ],
    "*.json": [
        "prettier --write"
    ]
};
