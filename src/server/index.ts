import { createApp } from './app.js';

const PORT = process.env.PORT || 3000;
const { app } = createApp();

app.listen(PORT, () => {
  console.log(`🚀 [ApoioLocal MVP] Servidor rodando com sucesso!`);
  console.log(`📍 Interface Web: http://localhost:${PORT}`);
  console.log(`📡 API Endpoints: http://localhost:${PORT}/api/demands`);
});
