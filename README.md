<!-- Repository Information & Links-->
<br />

![GitHub repo size](https://img.shields.io/github/repo-size/WolfOWI/coriander?color=88a764)
![GitHub watchers](https://img.shields.io/github/watchers/WolfOWI/coriander?color=88a764)
![GitHub language count](https://img.shields.io/github/languages/count/WolfOWI/coriander?color=88a764)
![GitHub code size in bytes](https://img.shields.io/github/languages/code-size/WolfOWI/coriander?color=88a764)
[![LinkedIn][linkedin-shield]][linkedin-url]
[![Instagram][instagram-shield]][instagram-url]
[![Behance][behance-shield]][behance-url]

<!-- HEADER SECTION -->
<h5 align="center" style="padding:0;margin:0;">Iné Smith - 221076</h5>
<h5 align="center" style="padding:0;margin:0;">Kayla Posthumus - 231096</h5>
<h5 align="center" style="padding:0;margin:0;">Ruan Klopper - 231280</h5>
<h5 align="center" style="padding:0;margin:0;">Wolf Botha - 21100255</h5>
<h6 align="center">Interactive Development 300 • 2025</h6>
</br>
<p align="center">

  <div align="center" href="https://github.com/WolfOWI/coriander">
    <img src="cori-app/src/assets/logos/cori_logo_green.png" alt="Coriander HR Logo" height="70">
  </div>
  
  <h3 align="center">Coriander HR</h3>

  <p align="center">
    A comprehensive Human Resources Management System built with Electron, React, and TypeScript <br>
      <a href="https://github.com/WolfOWI/coriander"><strong>Explore the docs »</strong></a>
   <br />
   <br />
   <a href="https://youtu.be/EvPt8mvmRxk">View Demo</a>
    ·
    <a href="https://github.com/WolfOWI/coriander/issues">Report Bug</a>
    ·
    <a href="https://github.com/WolfOWI/coriander/issues">Request Feature</a>
</p>

<a href="https://github.com/WolfOWI/coriander-backend"><p>Click here to view the backend</p></a>

<!-- TABLE OF CONTENTS -->

## Table of Contents

- [Table of Contents](#table-of-contents)
- [About the Project](#about-the-project)
  - [Project Description](#project-description)
  - [Built With](#built-with)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Features and Functionality](#features-and-functionality)
  - [Authentication System](#authentication-system)
  - [Employee Management](#employee-management)
  - [Leave Management](#leave-management)
  - [Meeting Management](#meeting-management)
  - [Equipment Management](#equipment-management)
  - [Dashboard \& Analytics](#dashboard--analytics)
- [Coriander Pages](#coriander-pages)
  - [Authentication Pages](#authentication-pages)
  - [Employee Pages](#employee-pages)
  - [Admin Pages](#admin-pages)
- [Architecture \& Components](#architecture--components)
  - [Component Structure](#component-structure)
  - [State Management](#state-management)
  - [API Integration](#api-integration)
- [Concept Process](#concept-process)
  - [Ideation](#ideation)
  - [Wireframes](#wireframes)
  - [ER-Diagram](#er-diagram)
- [Development Process](#development-process)
  - [Implementation Process](#implementation-process)
  - [Highlights](#highlights)
  - [Challenges](#challenges)
  - [Reviews \& Testing](#reviews--testing)
    - [Test Coverage Overview](#test-coverage-overview)
    - [Testing Tools \& Framework](#testing-tools--framework)
  - [Future Implementation](#future-implementation)
- [Final Outcome](#final-outcome)
  - [Mockups](#mockups)
  - [Video Demonstration](#video-demonstration)
- [Roadmap](#roadmap)
- [Contributing](#contributing)
- [Authors](#authors)
- [License](#license)
- [Contact](#contact)
- [Acknowledgements](#acknowledgements)

<!--PROJECT DESCRIPTION-->

## About the Project

![Coriander HR Dashboard][image1]

### Project Description

Coriander HR is a comprehensive HR Management System designed to streamline HR operations for internal use by our client, Coriander - an HR company. Built as a desktop application using Electron, it provides a seamless experience for both employees and administrators to manage various HR functions including leave requests, meeting scheduling, equipment management, and performance reviews.

The application features a dual-role system with distinct interfaces for employees and administrators. With its modern UI built using React and primarily Ant Design, Coriander HR offers an intuitive and efficient platform for managing human resources.

### Built With

- **Frontend Framework**: [React 19](https://react.dev/) - Modern UI library for building user interfaces
- **Desktop Framework**: [Electron](https://www.electronjs.org/) - Cross-platform desktop app development
- **Language**: [TypeScript](https://www.typescriptlang.org/) - Type-safe JavaScript development
- **Build Tool**: [Vite](https://vitejs.dev/) - Fast build tool and development server
- **UI Library**: [Ant Design](https://ant.design/) - Enterprise-class UI design language
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- **Icons**: [Material-UI Icons](https://mui.com/material-ui/material-icons/) - Comprehensive icon library
- **Charts**: [MUI X Charts](https://mui.com/x/react-charts/) - Data visualisation components
- **Authentication**: [Google OAuth](https://developers.google.com/identity/protocols/oauth2) - Secure authentication system
- **HTTP Client**: [Axios](https://axios-http.com/) - Promise-based HTTP client
- **Date Handling**: [Day.js](https://day.js.org/) - Lightweight date library
- **Testing**: [Jest](https://jestjs.io/) + [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/) - Comprehensive testing suite
- **PDF Generation**: [PDFMake](http://pdfmake.org/) - Client-side PDF generation
- **Animations**: [Lottie React](https://github.com/Gamote/lottie-react) - High-quality animations

<!-- GETTING STARTED -->

## Getting Started

The following instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

Ensure that you have the latest version of [Node.js](https://nodejs.org/) (v16 or higher) installed on your machine. You'll also need [npm](https://www.npmjs.com/) which comes bundled with Node.js.

### Installation

Here are the steps to clone and run this project:

1. **Clone Repository**  
   Run the following in the command-line to clone the project:

   ```sh
   git clone https://github.com/WolfOWI/coriander.git
   ```

2. **Navigate to Project Directory**

   ```sh
   cd coriander/cori-app
   ```

3. **Install Dependencies**  
   Run the following to install all required dependencies:

   ```sh
   npm install
   ```

4. **Environment Setup**  
   Create a `.env` file in the `cori-app` directory and configure the following environment variables:

   ```env
   # API Configuration
   VITE_API_URL=http://localhost:5121/api        # Production API URL
   VITE_API_DEV_URL=http://localhost:5121/api    # Development API URL

   # Google OAuth Configuration
   VITE_GOOGLE_CLIENT_ID=your_google_client_id   # Google OAuth Client ID

   # Cloudinary Configuration
   VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name    # Cloudinary Cloud Name
   VITE_CLOUDINARY_PROFPICS_PRESET=preset_name   # Cloudinary Profile Pictures Preset
   VITE_CLOUDINARY_API_KEY=your_api_key          # Cloudinary API Key
   VITE_CLOUDINARY_FILEUPLOAD_PRESET=preset_name # Cloudinary File Upload Preset
   ```

5. **Development Mode**  
   Start the application in development mode:

   ```sh
   npm run dev
   ```

6. **Build for Production**  
   To build the application for production:
   ```sh
   npm run make
   ```

<!-- FEATURES AND FUNCTIONALITY-->

## Features and Functionality

### Authentication System

**Secure Multi-Role Authentication**

- **Google OAuth Integration**

  - Secure single sign-on with Google accounts
  - Token-based authentication with JWT
  - Automatic session management and refresh
  - Secure token storage and handling

- **Role-Based Access Control**
  - Distinct employee and administrator roles
  - Role-specific permissions and access levels
  - Protected routes and API endpoints
  - Session management with token validation

### Employee Management

**Comprehensive Employee Management**

- **Profile Management**

  - Detailed employee info
  - Profile picture upload via Cloudinary
  - Employement info

- **Employment Status**

  - Suspend / Unsuspend Employees
  - Employment type classification
  - Termination

- **Payroll**

  - Salary & pay cycle management
  - Multiple pay cycles (Monthly, Bi-weekly)
  - Automated pay date calculations (with late / up-to-date tracking)

- **Performance Tracking**
  - Calculate average performance rating on past performance reviews
  - Historical performance data

### Leave Management

**Advanced Leave Request System**

- **Leave Types**

  - Annual Leave
  - Sick Leave
  - Family Responsibility Leave
  - Parental Leave
  - Study Leave
  - Compassionate Leave

- **Leave Administration**
  - Automated balance calculations
  - Duration calculation
  - Alerts for approving over-balance leave
  - Approve, Reject and Undo Leave Requests

### Meeting Management

**Meetings & Reviews Coordination**

- **Meetings**

  - Filter meetings by type and completion
  - Quick meeting request submission (as employee)
  - Approve & schedule meeting requests (as admin)

- **Performance Reviews**

  - Easy creation of performance reviews
  - Add rating, comment or supporting PDF upload
  - Edit meeting and quickly set as completed / upcoming
  - Colour-coded design allows for quick recognition of different meeting types & locations

- **Meeting Lifecycle**
  - Request → Schedule → Complete

### Equipment Management

**Equipment Tracking**

- **Equipment Registry**
  - Clean list of equipment, with info
  - Condition monitoring (New → Used)
  - Assign / Unlink from Employee
  - Create Assigned / Unassigned Equipment
  - Edit Equipment Details
  - Deletion of Equipment
  - Change Assignment Date

### Dashboard & Analytics

**Admin Dashboard**

- **HR Metrics**

  - Top 5 Employee rating comparison (average vs recent)
  - Employment Status Overview
  - Top 3 Employees with status info

- **At A Glance View**

  - Calendar of upcoming/completed meetings/reviews per day
  - Pending Leave Requests

- **Quick Actions**
  - Create New Performance Review
  - View All Leave Requests
  - View All Meetings

## Coriander Pages

### Authentication Pages

![Login Page][image2]

**Login Page** (`/`)
The Login Page provides a streamlined authentication experience using Google OAuth integration. Users are presented with a clean interface featuring the Coriander HR logo and a prominent "Log in with Google" button. They may also login with their email if they do not wish to use Google. Upon successful authentication, users are automatically directed to their role-specific dashboard. The page includes subtle animations and clear error handling to guide users through the login process.

**Employee Signup** (`/employee/signup`)
The Employee Registration page allows new employees to create their user account, by filling in their Full Name, email and password, all of which have real-time validation. Employees may also sign up with Google and link their account to a Google Account. Upon successful sign up, the employee will have to enter a 6-digit verification code sent to their email. Finally, unless an admin has linked the employee's user account to an employee, they will be presented with the Unlinked Screen, which informs the user that the admin must take action before they'll be able to use Coriander.

**Admin Signup** (`/admin/signup`)
The Admin Signup Page, is almost identical to the Employee Signup Page, but requires no additional verification, allowing quick setup of administrative accounts. Admins can signup with both the email-password-method or with Google.

### Employee Pages

**Employee Home** (`/employee/home`)

![Employee Home][image5]

The Employee Home serves as a central hub for all employee activities. It displays personalised widgets including their current employee performance rating, their remaining leave balances, upcoming meetings, and their payroll information. Employees can export their payroll information as a PDF by clicking the export payroll button. Furthermore, an inspirational quote, as motivation for employees, are automatically changed daily.

**Leave Overview** (`/employee/leave-overview`)

![Employee Leave Overview][image7]

The Employee Leave Overview Page provides a comprehensive view of an employee's leave status. It includes visual representations of each leave balance type, as well as a total summary of all leave remaining in days. Alongside this, employees are able to view all their leave requests, their status, and filter them by approved, pending or rejected. Additionally, the employee can create a new application for leave on this page. The page features icon-based leave types, automated duration calculations, and clear colour-coded status indicators for the request statuses.

**Employee Meetings** (`/employee/meetings`)

![Meetings Overview][image8]

A centralised meetings management page where employees can view, request, and track their meetings and performance reviews. The interface includes meeting type and completion filters and a quick request submission functionality. Each meeting list items displays essential information with colour-coding for different meeting types and statuses.

**Employee Profile** (`/employee/profile`)

![Employee Profile][image6]

On the Employee Profile Page, employees can view and update their personal information. The page includes sections for personal info, employment & payroll info and assigned equipment. If the user did not sign up with Google, they are able to update their profile picture.

### Admin Pages

**Admin Dashboard** (`/admin/dashboard`)

![Admin Dashboard][image9]

The Administrative Control Center or Dashboard provides a comprehensive overview of the organisation's HR metrics. It features interactive charts showing the top 5 employee's performance (with average and most recent ratings), employment status distribution, and top performers. The dashboard includes quick action buttons for common tasks and an at-a-glance calendar view of upcoming events.

**Employee Management** (`/admin/employees`)

![Employee Management][image10]

A powerful interface for managing the entire employee database. The Employee Management Page lists the critical information of each employee, such as whether salary payments are on time. The page features quick actions like quick-suspend and search-by-name filtering.

**Individual Employee** (`/admin/individual-employee/:id`)

![Individual Employee][image11]

One of the more detailed screens on the Coriander platform, the Individual Employee Page shows a detailed view of an individual employee record, combining all aspects of employee data in one interface. The page includes sections for personal information, payroll info, equipment assignments, leave balances, rating and meeting history. Admins can edit some details, change payroll info and last pay date, assigned, unlink or delete equipment, edit employee meetings / reviews and suspend or terminate the employee.

**Create Employee** (`/admin/employees`)

![Create Employee][image12]

On the Create Employee Page, admins assign unlinked user accounts (those with an email & password / Google sign up), to an Employee, entering the employment and payroll details, as well as assignment of equipment. After successful creation of an employee, the employee user account will now have access to the Coriander system.

**Equipment Management** (`/admin/equipment`)

![Equipment Management][image13]

The equipment tracking interface provides a complete overview of all company assets. It features a clean list view of equipment with detailed information about condition, assignment status, and assignment date. The page includes quick actions for creating, assigning, and managing equipment with an intuitive dropdown and modal interface.

**Leave Requests** (`/admin/leave-requests`)

![Leave Requests][image14]

A comprehensive leave management interface for administrators to handle all employee leave requests. The page features a list of pending, approved and rejected leave requests, which can be filtered at the top of the page. Each request automated checks the employee balance, and if an admin attemps to approve a requests that has most leave than the employee has for that leave type, a warning modal will appear. An admin can decide to approve the request regardless. Approved and rejected requests can also be "undo-ed", setting them back to pending.

**Admin Meetings** (`/admin/meetings`)

![Admin Meetings][image15]

The Admin Meetings page provides tools for managing all organisational meetings and reviews with the logged in admin. The list of cards can be filtered by "All Upcoming", by each type or by completed status. Each meeting can be edited, marked as completed/pending and removed. Meeting requests are also accessed on this page, by clicking on either the notification dot next to the page heading, or the Request button at the top right corner of the page. When there are requests pending, the button will be marked as red with the request count visible, and if nothing was requested, the button will returns to its default green state. Furthermore, administrators can also create a new performance review on this page.

## Architecture & Components

### Component Structure

The application follows a modular component architecture:

**Navigational & Loading Components**

- `Navigation.tsx` - Main navigation sidebar
- `StartupLoadingScreen.tsx` - Application initialization
- `ServerStatusModal.tsx` - Server connectivity monitoring

**UI Components**

- **Buttons**: `CoriBtn`, `CoriCircleBtn` - Custom button components
- **Badges**: Status indicators for various entities
- **Cards**: Reusable card components for different data types
- **Modals**: Comprehensive modal system for forms and confirmations
- **Charts**: Data visualisation components
- **Avatars**: Profile and entity representation

**Feature-Specific Components**

- **Authentication**: Login forms, verification components
- **Leave Management**: Leave request cards, balance displays
- **Equipment**: Equipment list items, assignment components
- **Meetings**: Meeting cards, scheduling components

### State Management

- **Context API**: Global state management for authentication and server status
- **Local State**: Component-level state with React hooks
- **Form Management**: Ant Design Form integration
- **API State**: Axios-based API state management

### API Integration

Linked to the Coriander CoriCore Backend API, including:

- **Admin API**: Administrative functions
- **Auth API**: Login, registration, token management
- **Email API**: Emails for 2-factor authentication
- **EmpLeaveRequest API**: CRUD operations for employee-leave-request combined data
- **Employee API**: CRUD operations for employee data
- **EmpUser API**: CRUD operations for employee-user data
- **Equipment API**: Equipment tracking and assignment & CRUD functionality
- **EquipmentCategory API**: Functionality relating to equipment categories
- **Gathering API**: GET requests for Meetings & Performance Reviews combined as "Gatherings"
- **Health API**: Check server connection and status operations
- **Image API**: Upload & management of profile pictures functionality
- **LeaveBalance API**: Leave balance of employees CRUD functionality
- **LeaveRequest API**: CRUD functionality for leave requests made by employees
- **LeaveType API**: LeaveType GET requests
- **Meeting API**: Meeting scheduling and management
- **Page API**: GET requests for full pages (instead of separate calls)
- **PerformanceReview API**: Creation, editing, getting and deletion of performance reviews
- **User API**: CRUD operations for user entities (often accompanied by auth functionality)

<!-- CONCEPT PROCESS -->

## Concept Process

The `Conceptual Process` encompasses the research, planning, and design phases that shaped Coriander.

### Ideation

The project began with extensive research into existing HR management systems, identifying key pain points:

- Fragmented HR processes across multiple platforms / tools
- Poor user experience in traditional HR software with clunky and outdated designs
- Lack of real-time analytics and reporting
- Complex approval workflows

Our solution focuses on:

- Unified platform for all HR functions
- Modern, intuitive user interface
- Real-time data and analytics
- Streamlined approval processes
- Cross-platform desktop application

### Wireframes

Detailed high-fidelity designs were created for all major user flows
![Wireframes][wireframes]

### ER-Diagram

![Database ER Diagram][er-diagram]

<!-- DEVELOPMENT PROCESS -->

## Development Process

The `Development Process` details the technical implementation and methodologies used in building Coriander HR.

### Implementation Process

**Architecture Decisions**

- **Electron + React**: Chosen for cross-platform desktop compatibility and modern UI capabilities
- **TypeScript**: Implemented for type safety and better developer experience
- **Modular Design**: Component-based architecture for maintainability and reusability
- **API-First Approach**: RESTful API integration for scalable backend communication

**Key Technical Implementations**

- **Role-Based Access Control**: Implemented comprehensive permission system
- **Real-time Updates**: WebSocket integration for live data updates
- **Offline Capability**: Local storage and sync mechanisms
- **Security**: JWT token authentication and secure API communication
- **Testing Strategy**: Unit tests with Jest and React Testing Library
- **CI/CD Pipeline**: Automated testing and deployment workflows

### Highlights

**Calendar System**

- Interactive calendar interface for admins
- Month view with daily meeting breakdowns
- Click-to-view meeting details
- Color-coded events (meetings, reviews)

**Google OAuth Integration**

- Seamless login with Google accounts
- Automatic profile creation
- Profile picture integration
- Email verification bypass for Google users

**Employee Management**

- Comprehensive employee profiles with attached equipment tracking, performance review rating calculation and intuitive management of leave.

### Challenges

**Google OAuth Complexity**

- Managing different OAuth flows for registration vs login
- Handling token refresh and expiration
- Maintaining session state with OAuth

**Database Evolution**

- Frequent schema changes due to client requirements
- Managing data migrations without loss
- Restructuring relationships between entities
- Maintaining data integrity during updates

### Reviews & Testing

#### Test Coverage Overview

The project maintains a comprehensive testing suite with 218 passing tests across 24 test suites. Key coverage metrics include:

- Overall Coverage: 19.84%
- Statement Coverage: 19.84%
- Branch Coverage: 23.34%
- Function Coverage: 13.79%

**Component Test Coverage Highlights**

- **Core Components**

  - Navigation Component: 100% coverage
  - Calendar Component: 100% coverage
  - UI Components (Badges, Avatars): 90%+ coverage

- **Feature Components**

  - Gathering Components: 91.39% coverage
  - Leave Management: 93.1% coverage
  - Equipment Management: 56.6% coverage

- **Utility Functions**
  - Date Utilities: 95.16% coverage
  - Format Utilities: 41.66% coverage
  - Common Types: 100% coverage

**Test Categories**

1. **Component Tests**

   - UI Component Rendering
   - User Interaction Handling
   - State Management
   - Props Validation

2. **Integration Tests**

   - Component Interactions
   - API Integration
   - State Management
   - Navigation Flows

3. **Utility Function Tests**
   - Date Formatting and Calculations
   - Data Formatting
   - Type Validations
   - Helper Functions

#### Testing Tools & Framework

- Jest: Primary testing framework
- React Testing Library: Component testing
- TypeScript: Type checking and validation
- Coverage Reporting: Jest built-in coverage

### Future Implementation

**Multi-Company Support**

- Separate database schemas per company
- Company-specific configurations
- Isolated data storage
- Custom branding per company

**Enhanced Authentication**

- Invite-based registration system
- Admin-generated employee invitations
- Password reset functionality
- Two-factor authentication options

**Future Features**

- Document management system
- Payroll integration
- Mobile application
- Advanced reporting tools

<!-- MOCKUPS -->

## Final Outcome

### Mockups

![Mockup A][image16]
<br>

![Mockup B][image17]

The final application delivers a comprehensive HR management solution with:

- Clean, modern interface design
- Intuitive user experience across all user roles
- Comprehensive feature set covering all major HR functions
- Robust performance and reliability
- Extensive testing and quality assurance

### Video Demonstration

To see a complete walkthrough of the Coriander HR application, click below:

[View Demonstration](https://youtu.be/EvPt8mvmRxk)

<!-- ROADMAP -->

## Roadmap

See the [open issues](https://github.com/WolfOWI/coriander/issues) for a list of proposed features and known issues.

<!-- CONTRIBUTING -->

## Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

<!-- AUTHORS -->

## Authors

- **Iné Smith** - _Lead Designer_ - [inesmith](https://github.com/inesmith)
- **Kayla Posthumus** - _Frontend Developer_ - [KaylaPosthumusOW](https://github.com/KaylaPosthumusOW)
- **Ruan Klopper** - _Backend Developer_ - [Ruan-Klopper](https://github.com/Ruan-Klopper)
- **Wolf Botha** - _Project Coordinator_ - [WolfOWI](https://github.com/WolfOWI)

<!-- LICENSE -->

## License

Distributed under the MIT License. See `LICENSE` for more information.

<!-- CONTACT -->

## Contact

- **WolfOWI** - [97434628+WolfOWI@users.noreply.github.com](mailto:97434628+WolfOWI@users.noreply.github.com) - [@instagram_handle](https://www.instagram.com/instagram_handle/)
- **Project Link** - https://github.com/WolfOWI/coriander

<!-- ACKNOWLEDGEMENTS -->

## Acknowledgements

**Technologies and Libraries**

- [React](https://react.dev/) - UI library foundation
- [Electron](https://www.electronjs.org/) - Desktop application framework
- [Ant Design](https://ant.design/) - UI component library
- [Tailwind CSS](https://tailwindcss.com/) - Styling framework
- [TypeScript](https://www.typescriptlang.org/) - Type safety and development experience
- [Vite](https://vitejs.dev/) - Build tool and development server
- [Jest](https://jestjs.io/) - Testing framework
- [Axios](https://axios-http.com/) - HTTP client library

**Design and Assets**

- [Material-UI Icons](https://mui.com/material-ui/material-icons/) - Icon library
- [Lottie Files](https://lottiefiles.com/) - Animation assets
- [Google Fonts](https://fonts.google.com/) - Typography (Inter font family)
- [Cloudinary](https://cloudinary.com/) - Image management and optimisation

**Development Tools**

- [ESLint](https://eslint.org/) - Code linting and quality
- [Prettier](https://prettier.io/) - Code formatting
- [GitHub Actions](https://github.com/features/actions) - CI/CD pipeline

<!-- MARKDOWN LINKS & IMAGES -->

[image1]: /docs/Mockup-cori.png
[image2]: /docs/logIn_SignUp_mockUp.png
[image5]: /docs/employeeHomePage.png
[image6]: /docs/employeeProfilePage.png
[image7]: /docs/employeeLeaveOverviewPage.png
[image8]: /docs/employeeMeetingsPage.png
[image9]: /docs/adminDashboardPage.png
[image10]: /docs/adminEmployeeManagementPage.png
[image11]: /docs/adminIndividaulEmployeeDetailsPage.png
[image12]: /docs/adminCreateEmployeePage.png
[image13]: /docs/adminEquipmentPage.png
[image14]: /docs/adminLeaveRequestPage.png
[image15]: /docs/adminMeetingsPage.png
[image16]: /docs/adminDashboard_mockUp.png
[image17]: /docs/adminPerformanceReviewSteps.png

<!-- Design & Documentation Images -->

[wireframes]: /docs/Wireframes.png
[er-diagram]: /docs/er-diagram.png

<!-- Refer to https://shields.io/ for more information and options about the shield links at the top of the ReadMe file -->

[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=flat-square&logo=linkedin&colorB=555
[linkedin-url]: https://www.linkedin.com/in/nameonlinkedin/
[instagram-shield]: https://img.shields.io/badge/-Instagram-black.svg?style=flat-square&logo=instagram&colorB=555
[instagram-url]: https://www.instagram.com/instagram_handle/
[behance-shield]: https://img.shields.io/badge/-Behance-black.svg?style=flat-square&logo=behance&colorB=555
[behance-url]: https://www.behance.net/name-on-behance/
