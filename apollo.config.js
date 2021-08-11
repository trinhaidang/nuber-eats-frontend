module.exports = {
    client: {
        includes: ["./src/**/*.{tsx,ts}"],
        tagName: "gql",
        service: {
            name: "nuber-eats-backend",
            url: 'http://localhost:4000/graphql',
        },
    },
    globals: {
        'ts-apollo': {
            isolatedModules: false,
        },
    },
};

// includes: look for queries in these files