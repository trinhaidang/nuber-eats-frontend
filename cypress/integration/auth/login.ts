describe("Log In", () => {

    const user = cy;

    it("should see login page", () => {
        user.visit("/")
            .title()
            .should("eq", "Login | Nuber Eats")
    });

    it("can see email / password validation errors", () => {
        user.visit("/");
        user.findByPlaceholderText(/email/i).type("bad@email")  // .get('[name="email"]').type("bad@email") 
            .get('.text-red-500').should("have.text", "Please enter a valid email");
        user.findByPlaceholderText(/email/i).clear()
            .get('.text-red-500').should("have.text", "Email is required");
        user.findByPlaceholderText(/email/i).type("good@email.com");
        user.findByPlaceholderText(/password/i).type("123").clear()
            .get('.text-red-500').should("have.text", "Password is required");
        user.get(".text-lg").should("have.class", "pointer-events-none");
    });

    it("wrong user info, cannot log in", () => {
        user.visit("/")
            .get('[name="email"]').type("clien-nuber@gmail.com")
            .get('[name="password"]').type("121212")
            .get(".text-lg").click()
            .get('.text-red-500').should("have.text", "User not found");
        user.get('[name="email"]').clear().type("client-nuber@gmail.com")
            .get('[name="password"]').clear().type("12345")
            .get(".text-lg").click()
            .get('.text-red-500').should("have.text", "Wrong password");
    });

    it("after fill out the form, enable Login button, and can log in", () => {
        // @ts-ignore
        user.login("client-nuber@gmail.com", "121212");
        user.visit("/").title().should("eq", "Home | Nuber Eats");
    });
});