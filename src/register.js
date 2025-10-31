document.querySelector('form').addEventListener('submit', onRegister);

async function onRegister(event) {
    event.preventDefault();

    const form = event.target;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    const { email, password, rePass } = data;

    if (!email || !password) {
        alert('All fields are required!');
        return;
    }

    if (password != rePass) {
        alert('Passwords don\'t match');
        return;
    }

    const user = { email, password };

    try {
        const res = await fetch('http://localhost:3030/users/register', {
            method: 'post',
            headers: { 'Content-Type': 'applications/json' },
            body: JSON.stringify(user)
        });

        if (!res.ok) {
            const err = await res.json();
            throw new Error(err.message);
        }

        const data = await res.json();

        const {accessToken} = data;

        sessionStorage.setItem('accessToken' , accessToken)

        window.location = 'index.html';
    } catch (err) {
        alert(err.message);
    }

}