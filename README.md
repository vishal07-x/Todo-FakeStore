# JavaScript Assignment – Todo App & Custom Store API

This project contains the Todo assignment and a Product Catalog assignment.
The original public Fake Store API is no longer required at runtime: this project now includes its own Express API with local product data.

## Features

### Task 1A – Todo App
- Add todos
- Edit todos
- Delete todos
- Update counter
- Persistent localStorage

### Task 1B – Multiple Todo Creation
Enter a task followed by a number, for example `Make Food 3`, to create three separate tasks.

### Task 2 – Product API
- Product grid
- Product search
- Product details
- Individual product API request
- Loading and error states

## Technologies

- HTML5
- CSS3
- Vanilla JavaScript ES6+
- Fetch API
- LocalStorage
- Node.js
- Express.js

## API Endpoints

When the server is running:

- `GET /api/health` – check whether the API is running
- `GET /api/products` – get all products
- `GET /api/products/:id` – get one product
- `GET /api/products?search=shirt` – search products by title/category

Example:

```js
fetch("/api/products")
  .then(response => response.json())
  .then(data => console.log(data));
```

## Run the Project

You already have Node.js installed. Open this project folder in VS Code and run:

```bash
npm install
npm start
```

Then open:

`http://localhost:5000`

Do **not** use Live Server for this version. The Express server serves both the frontend and the API.

## API Testing

Open these in your browser:

- `http://localhost:5000/api/health`
- `http://localhost:5000/api/products`
- `http://localhost:5000/api/products/1`

## GitHub

```bash
git init
git add .
git commit -m "Add custom product API"
git branch -M main
git remote add origin YOUR_GITHUB_REPOSITORY_URL
git push -u origin main
```

## Deployment

Because this is now a Node/Express application, deploy the whole project as a Node web service (for example on Render).

Start command:

```bash
npm start
```

The server automatically uses the deployment platform's `PORT` environment variable.


## Product images
The product catalog uses real photography hosted by Unsplash. The custom API returns these image URLs with each product.
