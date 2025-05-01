document.addEventListener("DOMContentLoaded", () => {
    const signoutLink = document.getElementById("signout-link");
    signoutLink.addEventListener("click", () => {
        sessionStorage.clear();
    });
});
