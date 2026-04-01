module.exports = {
  apps: [
    {
      name: "meetup",
      script: "pnpm",
      args: "start -- -p 1459",
      interpreter: "none",
      cwd: "/home/automation/meetup",
      env: {
        NODE_ENV: "production",
        PORT: 1459,
      },
    },
    {
      name: "meetup-tunnel",
      script: "/usr/local/bin/cloudflared",
      args: "tunnel run meetup",
      autorestart: true,
    },
  ],
};
