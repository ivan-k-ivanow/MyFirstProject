document.getElementById('logoutBtn').addEventListener('click', onLogout);

start();

async function start() {
    const accessToken = sessionStorage.getItem('accessToken');

    updateLinks(accessToken);

    let options = {
        method: 'get',
        headers: {}
    };

    if (accessToken) {
        options.headers['X-Authorization'] = accessToken;
    }
    
    const res = await fetch('http://localhost:3030/data/recipes?select=_id%2Cname%2Cimg', options);

    if (!res.ok && res.status == 403) {
        sessionStorage.removeItem('accessToken');
        window.location = 'index.html';
    }

    const data = await res.json();
    
    // Why updateLinks is not working in the beginng of the function?? - DEFER

    showRecipies(data);
}

function showRecipies(data) {
    const main = document.querySelector('main');

    const recipes = Object.values(data);

    main.replaceChildren(...recipes.map(createPreview));
}

function createPreview(recipe) {
    const result = document.createElement('article');
    result.className = 'preview';

    result.innerHTML = `
    <div class="title">
        <h2>${recipe.name}</h2>
    </div>
    <div class="small">
        <img src="${recipe.img}">
    </div>`;

    result.addEventListener('click', async () => {
        const accessToken = sessionStorage.getItem('accessToken');

        let options = {
            method: 'get',
            headers: {}
        };

        if (accessToken) {
            options.headers['X-Authorization'] = accessToken;
        }

        const url = `http://localhost:3030/data/recipes/${recipe._id}`;
        let data;

        try {
        const res = await fetch(url, options);
        data = await res.json();
        } catch (err) {
            alert('Error encountered', err.message);
            return;
        }

        result.innerHTML = ` <h2>${recipe.name}</h2>
            <div class="band">
                <div class="thumb">
                    <img src="${recipe.img}">
                </div>
                <div class="ingredients">
                    <h3>Ingredients:</h3>
                    <ul>
                        ${data.ingredients.map(i => `<li>${i}</li>`).join(`\n`)}
                    </ul>
                </div>
            </div>
            <div class="description">
                <h3>Preparation:</h3>
                ${data.steps.map(i => `<p>${i}</p>`).join(`\n`)}
            </div>`;
    });

    return result;
}

function updateLinks(hasUser) {
    if (hasUser) {
        document.getElementById('user').style.display = 'inline-block';
    } else {
        document.getElementById('guest').style.display = 'inline-block';
    }
}


function onLogout() {
    fetch('http://localhost:3030/users/logout', {
        method: 'get',
        headers: {'X-Authorization': sessionStorage.getItem('accessToken')}
    });

    sessionStorage.removeItem('accessToken');

    window.location = 'index.html' ;
}