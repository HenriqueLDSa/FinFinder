# WaveLink

WaveLink is a contact management web application where users can easily create, update, search, and delete contacts. Each user has a dashboard where they can manage their contact list, ensuring ease of access and organization.

## Features

- **User Authentication**: Secure registration and login system to protect user data.
- **Forgot Password**: Reset forgotten passwords via a recovery email link.
- **Dashboard**: View, search, add, edit, and delete contacts in a personalized space.
- **Responsive Design**: Accessible on mobile, tablet, and desktop devices.
- **Secure Data Handling**: Data is securely stored and retrieved using MySQL, ensuring users' contact information is safe.

## Tech Stack

- **Frontend**: HTML, CSS, JavaScript.
- **Backend**: PHP.
- **Database**: MySQL.
- **Hosting**: DigitalOcean.

## Installation

1. Clone the repository:
    ```bash
    git clone https://github.com/your-username/WaveLink.git
    ```
2. Navigate to the project directory:
    ```bash
    cd WaveLink
    ```
3. Ensure you have a LAMP stack (Linux, Apache, MySQL, PHP) running.
4. Import the database schema into your MySQL server.
5. Update the database connection details in `php/config.php`.
6. Run the website locally by navigating to `http://localhost/WaveLink`.

## Usage

Once the project is running, users can:
- Register for an account and log in to their dashboard.
- Add new contacts, edit existing ones, or delete contacts they no longer need.
- Use the search feature to quickly find specific contacts.
- Reset their password using the "Forgot Password" functionality.

## Project Structure

```
/WaveLink
|-- /css           # Stylesheets for various pages and components.
|-- /images        # Image assets used in the website.
|-- /js            # JavaScript files for dynamic behavior.
|-- /php           # PHP scripts for database interactions and back-end logic.
|-- index.html     # Main entry point of the website.
|-- README.md      # Documentation.
```

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
