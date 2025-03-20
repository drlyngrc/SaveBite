class User {
    constructor(userId, name, email, password) {
        this.userId = userId;
        this.name = name;
        this.email = email;
        this.password = password;
    }
}

class Customer extends User { }

class Admin extends User { }