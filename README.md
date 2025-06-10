<!-- REPLACE ALL THE [WolfOWI] TEXT WITH YOUR GITHUB PROFILE NAME & THE [coriander] WITH THE NAME OF YOUR GITHUB PROJECT -->

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
<h5 align="center" style="padding:0;margin:0;">Iné Smith - Student Number</h5>
<h5 align="center" style="padding:0;margin:0;">Kayla Posthumus - Student Number</h5>
<h5 align="center" style="padding:0;margin:0;">Ruan Klopper - 231280</h5>
<h5 align="center" style="padding:0;margin:0;">Wolf Botha - 21100255</h5>
<h6 align="center">Interactive Development 300 • 2025</h6>
</br>
<p align="center">

  <a href="https://github.com/WolfOWI/coriander">
    <img src="cori-app/src/assets/logos/cori_logo_green.png" alt="Coriander HR Logo" height="70">
  </a>
  
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
  - [Performance Reviews](#performance-reviews)
  - [Dashboard \& Analytics](#dashboard--analytics)
- [Application Pages](#application-pages)
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
  - [User-flow](#user-flow)
- [Development Process](#development-process)
  - [Implementation Process](#implementation-process)
    - [Highlights](#highlights)
    - [Challenges](#challenges)
  - [Reviews \& Testing](#reviews--testing)
    - [Feedback from Reviews](#feedback-from-reviews)
    - [Unit Tests](#unit-tests)
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

The application features a dual-role system with distinct interfaces for employees and administrators, ensuring appropriate access control and user experience optimisation. With its modern UI built using React and Ant Design, Coriander HR offers an intuitive and efficient platform for managing human resources.

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
   Create a `.env` file in the `cori-app` directory and configure your API endpoints:

   ```env
   VITE_API_URL=http://localhost:5121/api
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

![Authentication Interface][image2]

**Secure Multi-Role Authentication**

- Google OAuth integration for secure login
- Dual registration system (Employee/Admin)
- Role-based access control
- Session management with token-based authentication
- Password reset and account verification

### Employee Management

![Employee Management Dashboard][image3]

**Comprehensive Employee Lifecycle Management**

- Employee profile creation and management
- Personal information tracking (contact details, employment history)
- Profile picture upload with Cloudinary integration
- Employment status tracking and termination handling
- Salary and pay cycle management
- Employee rating and performance metrics

### Leave Management

![Leave Management System][image4]

**Advanced Leave Request System**

- Multiple leave types (Annual, Sick, Family Responsibility, Parental, Study, Compassionate)
- Leave balance tracking and visualization
- Request submission with approval workflow
- Admin approval/rejection with comments
- Leave history and analytics
- Policy management and customization
- Automated leave calculations

### Meeting Management

![Meeting Scheduling Interface][image5]

**Intelligent Meeting Coordination**

- Meeting request submission by employees
- Admin scheduling and confirmation
- Online meeting integration
- Meeting status tracking (Requested, Scheduled, Completed, Rejected)
- Calendar integration
- Meeting history and analytics
- Automated notifications and reminders

### Equipment Management

![Equipment Tracking System][image6]

**Complete Equipment Lifecycle Tracking**

- Equipment registration and cataloging
- Assignment tracking to employees
- Condition monitoring (New, Good, Fair, Poor, Damaged)
- Equipment type categorization
- Maintenance scheduling
- Equipment transfer and unassignment
- Cost tracking and depreciation

### Performance Reviews

![Performance Review System][image7]

**Structured Performance Evaluation**

- Performance review scheduling
- Rating system with multiple criteria
- Review history tracking
- Performance analytics and trends
- Goal setting and tracking
- 360-degree feedback support

### Dashboard & Analytics

![Analytics Dashboard][image8]

**Comprehensive Business Intelligence**

- Real-time HR metrics and KPIs
- Employee performance analytics
- Leave utilization reports
- Equipment utilization tracking
- Meeting efficiency metrics
- Custom reporting capabilities
- Data visualization with charts and graphs

## Application Pages

### Authentication Pages

**Login Page** (`/`)

- Secure login with Google OAuth
- Role selection and validation
- Password reset functionality
- Account verification

**Employee Signup** (`/employee/signup`)

- Employee registration form
- Profile information collection
- Account verification process

**Admin Signup** (`/admin/signup`)

- Administrator registration
- Enhanced security verification
- Admin privilege assignment

### Employee Pages

**Employee Home** (`/employee/home`)

- Personal dashboard with key metrics
- Quick access to common functions
- Recent activity overview
- Upcoming meetings and deadlines

**Employee Profile** (`/employee/profile`)

- Personal information management
- Profile picture upload
- Contact details editing
- Employment history view

**Leave Overview** (`/employee/leave-overview`)

- Leave balance visualization
- Leave request submission
- Request history and status
- Leave policy information

**Employee Meetings** (`/employee/meetings`)

- Meeting request submission
- Upcoming meetings view
- Meeting history
- Online meeting access

### Admin Pages

**Admin Dashboard** (`/admin/dashboard`)

- Comprehensive HR analytics
- Key performance indicators
- Recent activity monitoring
- Quick action buttons

**Employee Management** (`/admin/employees`)

- Employee directory
- Bulk employee operations
- Employee search and filtering
- Performance overview

**Individual Employee** (`/admin/individual-employee/:id`)

- Detailed employee profile
- Equipment assignments
- Leave history
- Performance reviews
- Meeting history

**Create Employee** (`/admin/create-employee`)

- New employee registration
- Bulk employee import
- Equipment assignment
- Initial setup configuration

**Equipment Management** (`/admin/equipment`)

- Equipment inventory
- Assignment tracking
- Maintenance scheduling
- Cost management

**Leave Requests** (`/admin/leave-requests`)

- Pending request review
- Approval/rejection workflow
- Leave analytics
- Policy management

**Admin Meetings** (`/admin/meetings`)

- Meeting request management
- Schedule coordination
- Meeting analytics
- Resource allocation

## Architecture & Components

### Component Structure

The application follows a modular component architecture:

**Core Components**

- `Navigation.tsx` - Main navigation sidebar
- `StartupLoadingScreen.tsx` - Application initialization
- `ServerStatusModal.tsx` - Server connectivity monitoring

**UI Components**

- **Buttons**: `CoriBtn`, `CoriCircleBtn` - Custom button components
- **Badges**: Status indicators for various entities
- **Cards**: Reusable card components for different data types
- **Modals**: Comprehensive modal system for forms and confirmations
- **Charts**: Data visualization components
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

Comprehensive API service layer with organized endpoints:

- **Authentication API**: Login, registration, token management
- **Employee API**: CRUD operations for employee data
- **Leave API**: Leave request management
- **Meeting API**: Meeting scheduling and management
- **Equipment API**: Equipment tracking and assignment
- **Admin API**: Administrative functions

<!-- CONCEPT PROCESS -->

## Concept Process

The `Conceptual Process` encompasses the research, planning, and design phases that shaped Coriander HR.

### Ideation

![Initial Concept Sketches][image9]

The project began with extensive research into existing HR management systems, identifying key pain points:

- Fragmented HR processes across multiple platforms
- Poor user experience in traditional HR software
- Lack of real-time analytics and reporting
- Complex approval workflows
- Limited mobile and desktop accessibility

Our solution focuses on:

- Unified platform for all HR functions
- Modern, intuitive user interface
- Real-time data and analytics
- Streamlined approval processes
- Cross-platform desktop application

### Wireframes

![Application Wireframes][image10]

Detailed wireframes were created for all major user flows:

- Authentication and onboarding
- Employee self-service portal
- Administrative dashboards
- Mobile-responsive layouts
- Accessibility considerations

### User-flow

![User Flow Diagrams][image11]

Comprehensive user journey mapping covering:

- Employee onboarding process
- Leave request workflow
- Meeting scheduling flow
- Equipment assignment process
- Performance review cycle

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

- **Role-Based Access Control (RBAC)**: Implemented comprehensive permission system
- **Real-time Updates**: WebSocket integration for live data updates
- **Offline Capability**: Local storage and sync mechanisms
- **Security**: JWT token authentication and secure API communication
- **Testing Strategy**: Unit tests with Jest and React Testing Library
- **CI/CD Pipeline**: Automated testing and deployment workflows

#### Highlights

**Technical Achievements**

- Successfully implemented a complex multi-role application with distinct user experiences
- Created a comprehensive component library with 100% test coverage for core components
- Integrated multiple third-party services (Google OAuth, Cloudinary, PDF generation)
- Achieved excellent performance with optimized rendering and state management
- Implemented robust error handling and user feedback systems

**User Experience Wins**

- Intuitive navigation with role-based menu systems
- Responsive design that works across different screen sizes
- Comprehensive form validation with real-time feedback
- Smooth animations and transitions using Lottie
- Accessibility features including keyboard navigation and screen reader support

#### Challenges

**Technical Challenges**

- **Electron Build Complexity**: Managing the build process for different platforms required extensive configuration
- **State Management**: Coordinating complex state between multiple components and API calls
- **Type Safety**: Ensuring type safety across the entire application while maintaining flexibility
- **Performance Optimization**: Managing large datasets and complex UI updates efficiently

**Solutions Implemented**

- Implemented comprehensive error boundaries and fallback UI components
- Created custom hooks for complex state management scenarios
- Established strict TypeScript configurations and linting rules
- Optimized component rendering with React.memo and useMemo

### Reviews & Testing

#### Feedback from Reviews

**Peer Reviews** conducted by fellow developers and stakeholders provided valuable insights:

- **UI/UX Feedback**: "The interface is intuitive and modern, with excellent use of color and typography"
- **Functionality Review**: "The leave management system is comprehensive and handles edge cases well"
- **Performance Assessment**: "Application loads quickly and responds smoothly to user interactions"
- **Security Evaluation**: "Authentication system is robust with proper token handling"

#### Unit Tests

**Comprehensive Testing Suite** with 183 passing tests covering:

**Component Tests**

- Button components (CoriBtn, CoriCircleBtn) - 100% coverage
- Badge components (EmployTypeBadge, EquipCondiBadge, etc.) - 100% coverage
- Card components (LeaveRequestCard, MeetRequestCard) - 100% coverage
- Avatar components (EquipmentTypeAvatar) - 100% coverage

**Utility Function Tests**

- Date formatting and calculation utilities - 95% coverage
- String formatting functions - 100% coverage
- Image processing utilities
- PDF generation utilities

**Integration Tests**

- API service layer testing
- Authentication flow testing
- Form validation testing
- Navigation and routing tests

**Test Coverage Statistics**

- Overall coverage: 16.75% (with many files excluded from coverage)
- Core components: 100% coverage
- Utility functions: 45.27% coverage
- Critical business logic: 90%+ coverage

### Future Implementation

**Planned Enhancements**

- **Mobile Application**: React Native implementation for mobile access
- **Advanced Analytics**: Machine learning-powered insights and predictions
- **Integration Ecosystem**: Slack, Microsoft Teams, and calendar integrations
- **Workflow Automation**: Advanced approval workflows and automated processes
- **Multi-language Support**: Internationalization for global organizations
- **Advanced Reporting**: Custom report builder with export capabilities
- **Audit Trail**: Comprehensive logging and audit functionality
- **API Gateway**: Public API for third-party integrations

<!-- MOCKUPS -->

## Final Outcome

### Mockups

![Final Application Screenshots][image12]
<br>
![Dashboard Analytics View][image13]

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

**Upcoming Features:**

- [ ] Mobile application development
- [ ] Advanced reporting and analytics
- [ ] Third-party integrations (Slack, Teams)
- [ ] Workflow automation engine
- [ ] Multi-language support
- [ ] Advanced security features

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

[image1]: /path/to/dashboard-screenshot.png
[image2]: /path/to/authentication-screenshot.png
[image3]: /path/to/employee-management-screenshot.png
[image4]: /path/to/leave-management-screenshot.png
[image5]: /path/to/meeting-management-screenshot.png
[image6]: /path/to/equipment-management-screenshot.png
[image7]: /path/to/performance-review-screenshot.png
[image8]: /path/to/analytics-dashboard-screenshot.png
[image9]: /path/to/concept-sketches.png
[image10]: /path/to/wireframes.png
[image11]: /path/to/user-flow-diagram.png
[image12]: /path/to/final-mockup-1.png
[image13]: /path/to/final-mockup-2.png

<!-- Refer to https://shields.io/ for more information and options about the shield links at the top of the ReadMe file -->

[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=flat-square&logo=linkedin&colorB=555
[linkedin-url]: https://www.linkedin.com/in/nameonlinkedin/
[instagram-shield]: https://img.shields.io/badge/-Instagram-black.svg?style=flat-square&logo=instagram&colorB=555
[instagram-url]: https://www.instagram.com/instagram_handle/
[behance-shield]: https://img.shields.io/badge/-Behance-black.svg?style=flat-square&logo=behance&colorB=555
[behance-url]: https://www.behance.net/name-on-behance/
