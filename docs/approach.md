The project is approached following these several steps:

1. Set up the project:

- [x] Initialize a new TypeScript project
- [x] Install necessary dependencies (Express, cors, multer, pdf-lib, winston, etc.)
- [x] Configure TypeScript and project structure

1. Implement the API:

- [x] Create a basic Express server
- [x] Implement the GET route at "/"
- [x] Implement the POST route at "/upload" with file type checking

3. Create custom middleware:

- [x] Implement file size limiting middleware (10MB limit)
- [x] Implement rate limiting middleware (10 calls per minute per IP)

- [x] Implement pdfValidation middleware which will validate the pdf has at least one page

1. Write tests:

- [x] Set up a testing framework (e.g., Jest)
- [x] Write unit tests the upload route, middlewares and the server
- [ ] Write integration tests to check the overall functionality

5. Documentation and code cleanup:

- [x] Add comments and documentation
- [x] Refactor and optimize code
- [x] Ensure code readability and follow best practices
