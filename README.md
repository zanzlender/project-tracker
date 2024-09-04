# Project tracker app

> This project is a Project tracker and planner application developed for the practical task part for my Masters thesis, "Developing web applications in TypeScript"

## Project definition

|     | Step                                       | Definition      |
| --- | ------------------------------------------ | --------------- |
| 1   | Define idea                                |                 |
| 2   | Choose versioning system                   | Github          |
| 3   | Define high level architecture             |                 |
| 4   | Choose database                            | PostgreSQL      |
| 5   | Choose platform for serving database       | Supabase        |
| 6   | Choose frontend technologies               | NextJS          |
| 7   | Choose backend technologies                | NextJS          |
| 8   | Choose platform for serving the app        | Vercel          |
| 9   | Choose necessary services                  | -               |
| 10  | Choose monitoring and logging technologies | Posthog, Sentry |
| 11  | Implement CI/CD                            | Vercel          |

### 1. Idea

The **Project Planner and Tracker app** is designed to simplify the way teams and individuals manage their projects. By providing an intuitive, user-friendly interface combined with powerful planning and tracking features, this app will enable users to efficiently organize, track, and monitor their projects from the starting idea to completion.

#### Functional requirements

| Id  | Feature name              | Description                                                                                                                                   | Importance |
| --- | ------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- | ---------- |
| F01 | Login                     | The user has to be able to login.                                                                                                             | 5          |
| F02 | Project creation          | The user is able to create a new project. A project is defined by following the guidelines                                                    |            |
| F03 | Project people management | The owner of a project is able to add other users to it.                                                                                      |            |
| F04 | Project management        | A user with proper rights can update the project information.                                                                                 |            |
| F05 | Task management           | A user with proper rights to a project can CRUD tasks for that projects. Other users can assign themselves to a task and start working on it. |            |

#### Nonfunction requirements
