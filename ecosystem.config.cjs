module.exports = {
  apps: [
    {
      name: "meetup-tunnel",
      script: "/usr/local/bin/cloudflared",
      args: "tunnel run meetup",
      autorestart: true,
    },
  ],
};
