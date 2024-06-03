function validation(values) {
    let error = {};
    const username_pattern = /^[a-zA-Z0-9_]+$/;
    const password_pattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*?&^()\-_+=<>{}[\]|\:;"',.\\/`~])[A-Za-z\d@$!%*?&^()\-_+=<>{}[\]|\:;"',.\\/`~]{8,}$/

    if (values.username === "") {
        error.username = "Username should not be empty";
        alert("Username should not be empty");
    } else if (!username_pattern.test(values.username)) {
        error.username = "Username format is incorrect";
        alert("Username format is incorrect");
    } else {
        error.username = "";
    }

    if (values.password === "") {
        error.password = "Password must not be empty";
        alert("Password must not be empty");
    } else if (!password_pattern.test(values.password)) {
        error.password = "Password format is incorrect";
        alert("Password format is incorrect");
    } else {
        error.password = "";
    }

    return error;
}

export default validation;
