# Live Polling System

A real-time polling system built using **ReactJS (Vite)**, **Node.js**, **Express**, and **Socket.io** with an event-driven architecture, **dockerised** and hosted on **AWS EC2**.  

Frontend implements teacher and student dashboards with real-time updates using Socket.io. served via **Nginx on port 80** while Server runs on **port 3001**

Backend logic is organized in layers:  
- **Sockets:** Handles events and connections  
- **Services:** Business logic for polls and votes  
- **Store/Utils:** State management, timers, helpers  


The application is containerized using Docker, orchestrated with Docker Compose, and deployed on AWS EC2. 

### Deployment
- Live Application: [http://54.91.83.214/](http://54.91.83.214/)  
- EC2 Public DNS: [http://ec2-54-91-83-214.compute-1.amazonaws.com/](http://ec2-54-91-83-214.compute-1.amazonaws.com/)  

### For future enhancements, current system can be scaled to support higher concurrency using following approaches:
- Horizontal scaling with multiple backend instances
- Redis adapter for Socket.io to enable cross-instance event propagation (acting as messaging queue)
- Load balancing using AWS ALB


Designed for maintainability, real-time performance, and easy future expansion.
