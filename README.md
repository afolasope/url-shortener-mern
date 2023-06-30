# Scissors

Scissors is a simple tool which makes URLs as short as possible. In today’s world, it’s important to keep things as short as possible, and this applies to more concepts than you may realize.

## Features

The Scissors App offers the following features:

- Scissors: Converts long URLs into short, condensed links.
- Customization: Allows users to customize the shortened URL with a preferred keyword or slug.
- Analytics: Provides basic analytics and statistics for each shortened URL, such as the number of clicks and referral sources.
- User Management: Supports user registration and authentication, enabling users to manage their shortened URLs and view analytics.

## Requirements

- NodeJS >= 16.16.0
- Yarn
- MongoDB
- Redis
  
## Development

1. Clone the repository to your local machine.
2. Create a MongoDB database.
3. Rename backend/.env.example to backend/.env
4. Update environment variables
5. Run `yarn prep`
6. Run `cd backend` and `yarn dev`
7. Run `cd frontend` and `yarn dev`
