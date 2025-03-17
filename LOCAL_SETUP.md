
# Setting Up eLUNSAD For Local Development

This guide will help you set up the Business Permit Licensing Office Progressive Web App (eLUNSAD) for local development in VS Code.

## Prerequisites

1. [Node.js](https://nodejs.org/) (v16 or higher) and npm installed
2. [Git](https://git-scm.com/) installed
3. [Visual Studio Code](https://code.visualstudio.com/) installed
4. A GitHub account (if you plan to push your changes)

## Steps to Run Locally

### 1. Clone the Repository

```bash
git clone <YOUR_GITHUB_REPOSITORY_URL>
cd <PROJECT_FOLDER_NAME>
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Start the Development Server

```bash
npm run dev
```

This will start the development server, and you can access the application at [http://localhost:8080](http://localhost:8080) (or the port specified in your terminal).

## Database Connection (Supabase)

This project uses Supabase for backend functionality. The connection credentials are already set up in the codebase with the following configuration:

- Supabase URL: `https://msszikayvszysbdmvvkx.supabase.co`
- Public Anon Key: Already configured in the project

No additional configuration is needed as these are already set up in `src/integrations/supabase/client.ts`.

## Accessing the Application

- **Landing Page**: [http://localhost:8080/](http://localhost:8080/)
- **Login Page**: [http://localhost:8080/signin](http://localhost:8080/signin)
- **Registration Page**: [http://localhost:8080/register](http://localhost:8080/register)
- **Dashboard**: [http://localhost:8080/dashboard](http://localhost:8080/dashboard)

## Demo Account

For demonstration purposes, you can create a test account using the Register page or use an existing account:

```
Username: demo_user
Password: Password123!
```

## Presentation Tips

1. **Prepare a Walkthrough Sequence**:
   - Start by showing the landing page and explaining the project's purpose
   - Demonstrate account creation/login functionality
   - Show the dashboard and main features
   - Explain the business permit application workflow

2. **Highlight Technical Aspects**:
   - React Component Structure (well-organized component hierarchy)
   - Responsive Design (demonstrate on different screen sizes)
   - Database Integration (Supabase)
   - Form Validation and User Experience

3. **Code Review**:
   - Show key components and explain their functionality
   - Demonstrate the separation of concerns (components, pages, utils)
   - Explain the authentication implementation

4. **Have Backup Plans**:
   - Save screenshots of the application in case of technical issues
   - Consider recording a demo video as a backup

## Troubleshooting

If you encounter any issues:

1. **Server doesn't start**:
   - Check if the port is already in use (try changing it in `vite.config.ts`)
   - Ensure all dependencies are installed correctly

2. **Database connection issues**:
   - Verify that the Supabase project is still active
   - Check the browser console for error messages

3. **Build errors**:
   - Run `npm run build` to see if there are any compilation errors
   - Fix any TypeScript errors that appear during build

## Additional Resources

- [React Documentation](https://react.dev/)
- [Supabase Documentation](https://supabase.com/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [shadcn/ui Documentation](https://ui.shadcn.com/)
