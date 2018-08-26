const axios = require('axios');
const SteamTotp = require('steam-totp');
const SteamUser = require('steam-user');

const client = new SteamUser();

const logOnOptions = {
  accountName: process.env.STEAM_USERNAME,
  password: process.env.STEAM_PASSWORD,
  twoFactorCode: SteamTotp.generateAuthCode(process.env.STEAM_SHARED_SECRET)
};

client.logOn(logOnOptions);

client.on('loggedOn', () => {
  console.log('Logged into Steam!');
  const steamID64 = client.steamID.getSteamID64();
  client.setPersona(SteamUser.Steam.EPersonaState.LookingToTrade);
  // client.enablePicsCache = true;
  // console.log(client.getOwnedApps());
  axios
    .get(
      `http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=${
        process.env.STEAM_API_KEY
      }&steamid=${steamID64}&format=json`
    )
    .then(res => {
      const gameList = res.data.response.games.map(game => game.appid);
      client.gamesPlayed(gameList);
    });
});
