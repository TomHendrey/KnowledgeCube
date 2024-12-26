# KnowledgeCube

KnowledgeCube is a MERN stack application designed for course creators and learners. It provides tools to create, manage, and explore online courses with a responsive and user-friendly interface.

## Features

### User Authentication

-   **Registration:** New users can register with roles such as learner or creator.
-   **Login:** Registered users can log in with JWT-based authentication.

### Learner Features

-   **Dashboard:** View enrolled courses and track progress.
-   **Course Discovery:** Explore and enroll in available courses.

### Creator Features

-   **Dashboard:** Manage created courses and track enrollment.
-   **Course Creation:** Add new courses with modules and lessons.

## Getting Started

Follow these steps to set up the project locally for development or evaluation.

### Prerequisites

-   Node.js (v16 or higher)
-   MongoDB (local or Atlas)
-   npm or yarn

### Installation

1. **Clone the repository:**

    ```bash
    git clone https://github.com/TomHendrey/KnowledgeCube
    cd knowledgecube
    ```

2. **Install dependencies:**

    ```bash
    cd client
    npm install
    cd ../server
    npm install
    ```

3. **Set up environment variables (Backend Only):**

    - Create a `.env` file in the `server` directory.
    - Backend `.env` example:
        ```env
        MONGO_URI=your_mongodb_connection_string
        JWT_SECRET=your_jwt_secret
        PORT=5001
        ```

4. **Configure Axios for Local Development (Optional):**

    If running the backend locally, update `axiosConfig.js` in the `client/src/utils` folder:

    ```javascript
    const axiosInstance = axios.create({
        baseURL: 'http://localhost:5001/api',
    });

    export default axiosInstance;
    ```

5. **Start the development servers:**

    ```bash
    # From the server directory
    npm run dev

    # From the client directory
    npm start
    ```

**Note:** For project assessment, the `.env` variables will be shared via email. Replace `your_mongodb_connection_string` and `your_jwt_secret` with the values provided in the submission email.

### Deployment

1. **Build the React app:**

    ```bash
    cd client
    npm run build
    ```

2. **Deploy to a cloud provider** (e.g., Render, Heroku).

3. **Verify Deployment:**
    - Ensure the application is accessible via the deployed URL.

## API Endpoints

### Authentication

-   **POST** `/auth/register`: Register a new user.
    ```json
    {
        "name": "John Doe",
        "email": "john@example.com",
        "password": "securepassword",
        "role": "learner"
    }
    ```
-   **POST** `/auth/login`: Log in a user.
    ```json
    {
        "email": "john@example.com",
        "password": "securepassword"
    }
    ```

### Courses

-   **GET** `/courses`: Fetch all courses.
-   **POST** `/courses/create`: Create a new course.
    ```json
    {
        "title": "New Course",
        "description": "Course description",
        "image": "image_url",
        "modules": []
    }
    ```
-   **PUT** `/courses/:id`: Update an existing course.

### Learners

-   **GET** `/learner/courses`: Fetch enrolled courses.

### Creators

-   **GET** `/creator/courses`: Fetch created courses.

## Folder Structure

```
knowledgecube/
├── client/           # React frontend
│   ├── public/
│   ├── src/
│   └── package.json
├── server/            # Express backend
│   ├── routes/
│   ├── models/
│   └── package.json
└── README.md           # Project documentation
```

## Demo

[Live Demo](https://gleaming-yeot-1d8a22.netlify.app)

## Future Enhancements

-   **Course Editing:** Ability to edit courses, including adding/removing modules and lessons.
-   **Quizzes and Assessments:** Adding interactive learning assessments.
-   **Additional Resources:** Support for uploading supplementary materials.
-   **User Achievements and Rewards:** Gameified achievements to enhance user experience and encourage engagement.

## Contact

For any queries, contact the project owner via email: tomhendrey@gmail.com
