describe("Edit Profile", () => {

    const user = cy;

    beforeEach(() => {
        // @ts-ignore
        user.login("client-nuber@gmail.com", "121212");
    })

    it("can go to /edit-profile using header", () => {
        user.get('[href="/edit-profile/"] > .svg-inline--fa').click();
        user.title().should("eq", "Edit Profile | Nuber Eats");
    });

    it("should see email validation errors", () => {
        user.visit("/edit-profile");
        user.findByPlaceholderText(/email/i).clear().type("bad@email")  // .get('[name="email"]').type("bad@email") 
            .get('.text-red-500').should("have.text", "Please enter a valid email");
        user.get(".text-lg").should("have.class", "pointer-events-none");
    });

    it("cannot change to existing email", () => {
        user.visit("/edit-profile");
        user.findByPlaceholderText(/email/i).clear().type("test-nuber@gmail.com");
        user.findByRole("button").click();
        user.get('.text-red-500').should("have.text", "There is a user with that email already");
    });

    it("can change email ( mock )", () => {
        user.intercept("POST", "http://localhost:4000/graphql", (req) => {
            if(req.body?.operationName === "editProfile") {
                // @ts-ignore
                // req.body?.variables?.input?.email = "client-nuber@gmail.com";
                req.reply((res) => {
                    res.send({
                        fixture: "user/edit-profile.json"
                    })
                });
            }
        });
        user.visit("/edit-profile");
        user.findByPlaceholderText(/email/i).clear().type("test-nuber@gmail.com");
        user.findByRole("button").click();
        user.get(".text-lg").should("have.class", "pointer-events-none");
    });


})