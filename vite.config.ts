import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Load all environment variables from .env files and inject them into process.env
  // so that the local API mock can read them just like Vercel would.
  const env = loadEnv(mode, process.cwd(), '')
  Object.assign(process.env, env)

  return {
    plugins: [
    react(),
    {
      name: 'local-api-mock',
      configureServer(server) {
        server.middlewares.use('/api/ocr', (req, res, next) => {
          if (req.method === 'POST') {
            let body = '';
            req.on('data', chunk => {
              body += chunk.toString();
            });
            req.on('end', async () => {
              try {
                const parsedBody = body ? JSON.parse(body) : {};
                
                // Polyfill Vercel's req/res helpers
                const reqPoly = req as any;
                reqPoly.body = parsedBody;
                
                const resPoly = res as any;
                resPoly.status = (code: number) => { 
                  res.statusCode = code; 
                  return resPoly; 
                };
                resPoly.json = (data: any) => { 
                  res.setHeader('Content-Type', 'application/json'); 
                  res.end(JSON.stringify(data)); 
                };

                // Dynamically import the handler so Vite compiles the TS automatically
                const { default: handler } = await server.ssrLoadModule('./api/ocr.ts');
                await handler(reqPoly, resPoly);
              } catch (err) {
                console.error('Local API Error:', err);
                res.statusCode = 500;
                res.end(JSON.stringify({ error: 'Internal Server Error' }));
              }
            });
          } else {
            next();
          }
        });
      }
    }
  ]
  }
})
