# scribe

Run backend:

```sh
cd backend
python -m venv .venv # Use python 3.11
source .venv/bin/activate
pip install -r requirements.txt
```

You'll also need to create a `.env` file in the `backend` directory with the following contents:

```sh
OPENAI_API_KEY="<your openai api key>"
```

Then run the backend:

```sh
python -m app.main
```

Run frontend:

```sh
cd client
pnpm i
pnpm run dev
```

Preview
![image](https://github.com/freeman-jiang/scribe/assets/56516912/7114edcf-ae20-44cf-848e-b6085a9b08b4)
![image](https://github.com/freeman-jiang/scribe/assets/56516912/9fb5928a-0480-4063-8b01-edcdf7731a0c)


