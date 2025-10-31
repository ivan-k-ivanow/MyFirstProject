document.querySelector('form').addEventListener('submit', onCreate);

async function onCreate(event) {
    event.preventDefault();

    const form = event.target;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    
    const { name, img, ingredients, steps } = data;

    if (!name || !img || !ingredients || !steps) {
        alert('All fields are required');

        return;
    }

    const recipe = {
        name,
        img,
        ingredients: ingredients.split('\n'),
        steps: steps.split('\n'),
    };

    const accessToken = sessionStorage.getItem('accessToken');

    if(!accessToken) {
        window.location = 'login.html';
    }

    const res = await fetch('http://localhost:3030/data/recipes', {
        method: 'post',
        headers: {
            'Content-Type' : 'application/json',
            'X-Authorization' : accessToken
        },
        body: JSON.stringify(recipe)
    });

    if (!res.ok) {
        const err = await res.json();
        alert(err.message);

        return;
    }

    window.location = 'index.html';
}