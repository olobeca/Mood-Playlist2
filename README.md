# Spotify Mood Playlist

This project is a web application that captures an image using a webcam, analyzes the user's mood using facial recognition, and suggests Spotify playlists based on the detected emotion.

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Setup](#setup)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [License](#license)

## Features

- Capture images using a webcam.
- Analyze emotions, age, race, and gender using Python and DeepFace.
- Suggest Spotify playlists based on the detected mood.
- Backend integration with Spotify Web API for playlist retrieval.

## Technologies Used

- **Frontend**: React, React Router
- **Backend**: Node.js, Express
- **Python**: DeepFace, OpenCV, NumPy
- **Spotify API**: `spotify-web-api-node`
- **Other**: HTTPS, CORS

## Setup

### Prerequisites

- Node.js and npm installed
- Python 3.x installed
- Virtual environment for Python
- Spotify Developer account with API credentials

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/spotify-mood-playlist.git
   cd spotify-mood-playlist
