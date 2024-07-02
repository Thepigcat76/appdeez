export function getFromServer(action: (data: string) => void) {
    fetch("http://127.0.0.1:7878", {
        method: "GET",
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            return response.text();
        })
        .then(action)
        .catch((error) => {
            console.error(
                "There has been a problem with your fetch operation:",
                error
            );
        });
}

export function sendToServer(data: any) {
    const url = "http://127.0.0.1:7878";

    fetch(url, {
        method: "POST", // or 'PUT'
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data), // body data type must match "Content-Type" header
    })
        .then((response) => response.json()) // parses JSON response into native JavaScript objects
        .then((data) => {
            console.log("Success:", data);
        })
        .catch((error) => {
            console.error("Error:", error);
        });
}