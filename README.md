# ToDo List Application

The ToDo List Application is a dynamic and feature-rich task management tool designed for mobile platforms. It allows users to create tasks, attach images, and view live updates on device information like battery level and network status. This application is built using React Native, showcasing the use of AsyncStorage for data persistence, expo-image-picker for image uploading, and react-native-maps for live location tagging.

## Features

- **Task Management:** Users can create, view, edit, and delete tasks.
- **Image Uploading:** Supports adding images to tasks from the camera or gallery.
- **Live Location Tagging:** Tasks can be tagged with the user's current location, viewable on a map.
- **Device Information Display:** Shows current battery level and network status.
- **Persistent Storage:** Tasks and associated data are saved locally, ensuring data persistence across sessions.

## Getting Started

To get started with the ToDo List Application, follow these steps:

1. **Clone the Repository:**

```bash
git clone https://github.com/jingxiangaaaa/list
```

2. **Install Dependencies:**

Navigate to the project directory and install the required dependencies.

```bash
cd list
npm install
```

3. **Start the Application:**

To start the application, run the following command:

```bash
npx expo start
```

For running the application in a local network other than the current one, set the `REACT_NATIVE_PACKAGER_HOSTNAME` environment variable to your machine's IP address, and start the application with `--lan` option:

```bash
$env:REACT_NATIVE_PACKAGER_HOSTNAME='YOUR_MACHINE_IP'
npx expo start --lan
```

## Usage

After starting the application, you can:

- Create new tasks by entering text and optionally attaching images.
- Edit existing tasks to update text or images.
- Delete tasks you no longer need.
- View your tasks' associated locations on a map by clicking on the location tag.
- The app automatically updates and displays the current battery level and network status.
