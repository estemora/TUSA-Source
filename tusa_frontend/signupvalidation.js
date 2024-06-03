function validation(values) {
    let error = {}
    const email_pattern = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/
    const password_pattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*?&^()\-_+=<>{}[\]|\:;"',.\\/`~])[A-Za-z\d@$!%*?&^()\-_+=<>{}[\]|\:;"',.\\/`~]{8,}$/
    const username_pattern = /^[a-zA-Z0-9_]+$/;

    if (values.username === "") {
        error.username = "Username should not be empty";
        alert("Username should not be empty");
    } else if (!username_pattern.test(values.username)) {
        error.username = "Username format is incorrect";
        alert("Username format is incorrect");
    } else {
        error.username = "";
    }

    if (values.email === "") {
        error.email = "Email must not be empty";
        alert("Email must not be empty");
    } else if (!email_pattern.test(values.email)) {
        error.email = "Invalid email address";
        alert("Invalid email address");
    } else {
        error.email = "";
    }

    if (values.password === "") {
        error.password = "Password must not be empty";
        alert("Password must not be empty");
    } else if (!password_pattern.test(values.password)) {
        error.password = "Password must contain at least 8 characters, including one uppercase letter, one lowercase letter, one digit, and one special character";
        alert("Password must contain at least 8 characters, including one uppercase letter, one lowercase letter, one digit, and one special character");
    } else {
        error.password = "";
    }

    if (values.confirm_password !== values.password) {
        error.confirm_password = "Passwords do not match";
        alert("Passwords do not match");
    } else {
        error.confirm_password = "";
    }

    return error;
}

export default validation;
