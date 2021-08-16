import { requests } from "cypress/types/sinon";

describe("Create Account", () => {

    const user = cy;

    it("should see create account page", () => {
        user.visit("/");
        user.findByText(/create an account/i).click();
        user.title().should("eq", "Create Account | Nuber Eats");
        user.visit("/create-account");
        user.title().should("eq", "Create Account | Nuber Eats");
    });

    it("should see email / password validation errors", () => {
        user.visit("/create-account");
        user.findByPlaceholderText(/email/i).type("bad@email")  // .get('[name="email"]').type("bad@email") 
            .get('.text-red-500').should("have.text", "Please enter a valid email");
        user.findByPlaceholderText(/email/i).clear()
            .get('.text-red-500').should("have.text", "Email is required");
        user.findByPlaceholderText(/email/i).type("good@email.com");
        user.findByPlaceholderText(/password/i).type("123").clear()
            .get('.text-red-500').should("have.text", "Password is required");
        user.get(".text-lg").should("have.class", "pointer-events-none");
    });

    it("duplicate email, cannot create", () => {
        user.visit("/create-account")
            .get('[name="email"]').type("client-nuber@gmail.com")
            .get('[name="password"]').type("121212")
            .get(".text-lg").click()
            .get('.text-red-500').should("have.text", "There is a user with that email already");
    });

    // it("should be able to create ( real ) account and login", () => {
        // user.visit("/create-account");
        // user.findByPlaceholderText(/email/i).type("test-nuber@gmail.com");
        // user.findByPlaceholderText(/password/i).type("121212");
        // user.findByRole("button").click();
        // user.wait(1000);
        // user.title().should("eq", "Login | Nuber Eats");
        // user.findByPlaceholderText(/email/i).type("test-nuber@gmail.com");
        // user.findByPlaceholderText(/password/i).type("121212");
        // user.findByRole("button").click();
        // user.window().its("localStorage.nuber-token").should("be.a", "string");
        // user.title().should("eq", "Home | Nuber Eats");
        // user.visit("/").title().should("eq", "Home | Nuber Eats");
    // });

    it("should be able to create ( mock ) account and login", () => {
        
        user.intercept("http://localhost:4000/graphql", (req) => {
            // only mock for create account request
            // console.log(req);
            const { operationName } = req.body;
            if(operationName && operationName === "createAccountMutation"){
                req.reply((res) => {
                    res.send({
                        fixture: "auth/create-account.json"
                    })
                });
            };
        });
        user.visit("/create-account");
        user.findByPlaceholderText(/email/i).type("test-nuber@gmail.com");
        user.findByPlaceholderText(/password/i).type("121212");
        user.findByRole("button").click();
        user.wait(1000);
        user.title().should("eq", "Login | Nuber Eats");

        // @ts-ignore
        user.login("test-nuber@gmail.com", "121212");
    });

});