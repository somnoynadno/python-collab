export const wsAddress = (process.env.NODE_ENV === "production" ? process.env.REACT_APP_WS_ADDRESS : "ws://localhost:8000");
export const appAddress = (process.env.NODE_ENV === "production" ? process.env.REACT_APP_ADDRESS : "http://localhost:3000");
