let data = [
    { firstname: 'Julia', lastname: 'Evans', providerId: 'julia.evans@yahoo.com' },
    { firstname: 'Amanda', lastname: 'Wilson', providerId: 'amanda.wilson@hotmail.com' },
    { firstname: 'Benjamin', lastname: 'Gonzalez', providerId: 'benjamin.gonzalez@aol.com' },
    { firstname: 'Brian', lastname: 'King', providerId: 'brian.king@gmail.com' },
    { firstname: 'Megan', lastname: 'Mitchell', providerId: 'megan.mitchell@icloud.com' },
    { firstname: 'Sharon', lastname: 'Scott', providerId: 'sharon.scott@outlook.com' },
    { firstname: 'David', lastname: 'Jones', providerId: 'david.jones@yahoo.com' },
    { firstname: 'Mary', lastname: 'Harris', providerId: 'mary.harris@outlook.com' },
    { firstname: 'Steven', lastname: 'Lee', providerId: 'steven.lee@gmail.com' },
    { firstname: 'Jennifer', lastname: 'Baker', providerId: 'jennifer.baker@yahoo.com' },
    { firstname: 'Joseph', lastname: 'Ramirez', providerId: 'joseph.ramirez@hotmail.com' },
    { firstname: 'Linda', lastname: 'Parker', providerId: 'linda.parker@gmail.com' },
    { firstname: 'Richard', lastname: 'Martinez', providerId: 'richard.martinez@outlook.com' },
    { firstname: 'Ashley', lastname: 'Brown', providerId: 'ashley.brown@icloud.com' },
    { firstname: 'Christopher', lastname: 'Taylor', providerId: 'christopher.taylor@yahoo.com' }
];

data.forEach((item, index) => {
    item.password = "qwerty12345";
    fetch("http://localhost:4000/api/user/register", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(item)
    }).then((response) => {
        return response.json();
    }).then((res) => {
        console.log(`User ${index+1} added`);
        console.log(res);
    }).catch((error) => {
        console.log(`User ${index+1} failed to add`);
    });
})